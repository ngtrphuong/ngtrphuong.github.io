import { decodeAudioBlob, splitIntoChunks } from './audio-decode.ts';
import { CHUNK_SECONDS, WHISPER_SAMPLE_RATE } from './constants.ts';
import { mergeSegments } from './format.ts';
import { parseTransformersProgress } from '../shared/transformers-progress.ts';
import type { FileAsrCallbacks, TranscriptSegment } from './types.ts';

const VALID_WORKER_TYPES = new Set(['progress', 'ready', 'segment', 'chunk-done', 'done', 'error']);

type WorkerMessage =
  | { type: 'progress'; payload: { progress?: number; status?: string; file?: string; name?: string } }
  | { type: 'ready'; payload: { modelId: string } }
  | { type: 'segment'; payload: { text: string; startMs: number; endMs: number; confidence?: number } }
  | { type: 'chunk-done'; payload: { chunkIndex: number } }
  | { type: 'done' }
  | { type: 'error'; payload: { message: string } };

let whisperSegCounter = 0;

function nextWhisperId(): string {
  whisperSegCounter += 1;
  return `wh-${whisperSegCounter}-${Date.now()}`;
}

export class WhisperWorkerBridge {
  #worker: Worker | null = null;
  #ready = false;
  #loadResolve: (() => void) | null = null;
  #loadReject: ((err: Error) => void) | null = null;
  #transcribeResolve: ((segs: TranscriptSegment[]) => void) | null = null;
  #transcribeReject: ((err: Error) => void) | null = null;
  #pendingChunks = 0;
  #collected: TranscriptSegment[] = [];
  #callbacks: FileAsrCallbacks | null = null;

  constructor() {
    this.#worker = new Worker(new URL('../../../components/tools/meeting-notes/worker.ts', import.meta.url), {
      type: 'module',
    });
    this.#worker.onmessage = (e: MessageEvent) => this.#onMessage(e.data);
    this.#worker.onerror = (e) => {
      this.#loadReject?.(new Error(e.message ?? 'Worker error'));
      this.#transcribeReject?.(new Error(e.message ?? 'Worker error'));
      this.#callbacks?.onError(e.message ?? 'Worker error');
    };
  }

  get isReady(): boolean {
    return this.#ready;
  }

  #loadProgressCb: ((pct: number, status: string) => void) | null = null;

  loadModel(
    opts: { dirHandle?: FileSystemDirectoryHandle; modelId: string },
    onProgress?: (pct: number, status: string) => void,
  ): Promise<void> {
    if (!this.#worker) return Promise.reject(new Error('Worker not available'));
    this.#ready = false;
    this.#loadProgressCb = onProgress ?? null;
    return new Promise((resolve, reject) => {
      this.#loadResolve = resolve;
      this.#loadReject = reject;
      this.#worker!.postMessage({ type: 'load', payload: opts });
    });
  }

  async transcribeBlob(
    blob: Blob,
    language: string,
    callbacks: FileAsrCallbacks,
    fileName?: string,
  ): Promise<TranscriptSegment[]> {
    if (!this.#worker || !this.#ready) {
      throw new Error('Transcription model is not loaded.');
    }

    this.#callbacks = callbacks;
    this.#collected = [];
    whisperSegCounter = 0;

    const decoded = await decodeAudioBlob(blob, fileName);
    const chunks = splitIntoChunks(decoded.samples, decoded.sampleRate, CHUNK_SECONDS);
    this.#pendingChunks = chunks.length;

    return new Promise((resolve, reject) => {
      this.#transcribeResolve = resolve;
      this.#transcribeReject = reject;

      chunks.forEach((audio, chunkIndex) => {
        this.#worker!.postMessage(
          {
            type: 'transcribe',
            payload: {
              audio,
              sampleRate: decoded.sampleRate,
              language,
              chunkIndex,
            },
          },
          [audio.buffer],
        );
      });

      if (chunks.length === 0) {
        resolve([]);
      }
    });
  }

  /**
   * Transcribe already-decoded 16kHz mono PCM (e.g. a VAD-detected utterance from live-vad-asr.ts) —
   * skips decodeAudioBlob since the caller already has raw samples at WHISPER_SAMPLE_RATE.
   */
  async transcribeSamples(
    samples: Float32Array,
    language: string,
    callbacks: FileAsrCallbacks,
  ): Promise<TranscriptSegment[]> {
    if (!this.#worker || !this.#ready) {
      throw new Error('Transcription model is not loaded.');
    }

    this.#callbacks = callbacks;
    this.#collected = [];
    whisperSegCounter = 0;

    const chunks = splitIntoChunks(samples, WHISPER_SAMPLE_RATE, CHUNK_SECONDS);
    this.#pendingChunks = chunks.length;

    return new Promise((resolve, reject) => {
      this.#transcribeResolve = resolve;
      this.#transcribeReject = reject;

      chunks.forEach((audio, chunkIndex) => {
        this.#worker!.postMessage(
          {
            type: 'transcribe',
            payload: {
              audio,
              sampleRate: WHISPER_SAMPLE_RATE,
              language,
              chunkIndex,
            },
          },
          [audio.buffer],
        );
      });

      if (chunks.length === 0) {
        resolve([]);
      }
    });
  }

  abort(): void {
    this.#worker?.postMessage({ type: 'abort' });
    this.#pendingChunks = 0;
    this.#transcribeReject?.(new Error('Transcription aborted'));
    this.#transcribeResolve = null;
    this.#transcribeReject = null;
  }

  terminate(): void {
    this.#worker?.terminate();
    this.#worker = null;
    this.#ready = false;
  }

  #onMessage(data: WorkerMessage) {
    if (!data?.type || !VALID_WORKER_TYPES.has(data.type)) return;

    if (data.type === 'progress') {
      const { pct, status } = parseTransformersProgress(data.payload);
      if (this.#loadProgressCb) {
        this.#loadProgressCb(pct, status);
      } else {
        this.#callbacks?.onProgress(pct, status);
      }
      return;
    }

    if (data.type === 'ready') {
      this.#ready = true;
      this.#loadProgressCb = null;
      this.#loadResolve?.();
      this.#loadResolve = null;
      this.#loadReject = null;
      return;
    }

    if (data.type === 'segment') {
      const p = data.payload;
      const seg: TranscriptSegment = {
        id: nextWhisperId(),
        startMs: p.startMs,
        endMs: p.endMs,
        text: p.text,
        confidence: p.confidence,
        isFinal: true,
        source: 'whisper',
      };
      this.#collected.push(seg);
      this.#callbacks?.onSegment(seg);
      return;
    }

    if (data.type === 'chunk-done') {
      this.#pendingChunks -= 1;
      const total = this.#collected.length || 1;
      const done = this.#collected.length - (this.#pendingChunks > 0 ? 0 : 0);
      this.#callbacks?.onProgress(
        Math.round((done / total) * 100),
        this.#pendingChunks > 0 ? 'Transcribing…' : 'Finishing…',
      );
      if (this.#pendingChunks <= 0) {
        const merged = mergeSegments(this.#collected);
        this.#transcribeResolve?.(merged);
        this.#transcribeResolve = null;
        this.#transcribeReject = null;
      }
      return;
    }

    if (data.type === 'error') {
      const msg = data.payload?.message ?? 'Transcription failed.';
      this.#loadReject?.(new Error(msg));
      this.#transcribeReject?.(new Error(msg));
      this.#callbacks?.onError(msg);
      this.#loadResolve = null;
      this.#loadReject = null;
      this.#transcribeResolve = null;
      this.#transcribeReject = null;
    }
  }
}
