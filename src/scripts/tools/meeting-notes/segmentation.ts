import { parseTransformersProgress } from '../shared/transformers-progress.ts';
import type { RawDiarizationSegment } from './types.ts';

const VALID_WORKER_TYPES = new Set(['progress', 'ready', 'segment-progress', 'segments', 'error']);

type WorkerMessage =
  | { type: 'progress'; payload: { progress?: number; status?: string; file?: string; name?: string } }
  | { type: 'ready' }
  | { type: 'segment-progress'; payload: { requestId: string; done: number; total: number } }
  | { type: 'segments'; payload: { requestId: string; segments: RawDiarizationSegment[] } }
  | { type: 'error'; payload: { message: string; requestId?: string } };

type PendingRequest = {
  resolve: (segments: RawDiarizationSegment[]) => void;
  reject: (err: Error) => void;
  onProgress?: (done: number, total: number) => void;
};

/**
 * Typed bridge to segment-worker.ts (pyannote segmentation 3.0) — mirrors DiarizeBridge:
 * validates worker events, matches request ids, normalizes download progress, and terminates
 * the worker on cleanup.
 */
export class SegmentationBridge {
  #worker: Worker | null = null;
  #ready = false;
  #loadResolve: (() => void) | null = null;
  #loadReject: ((err: Error) => void) | null = null;
  #loadProgressCb: ((pct: number, status: string) => void) | null = null;
  #pending = new Map<string, PendingRequest>();
  #nextId = 0;

  #ensureWorker(): Worker {
    if (!this.#worker) {
      this.#worker = new Worker(new URL('../../../components/tools/meeting-notes/segment-worker.ts', import.meta.url), {
        type: 'module',
      });
      this.#worker.onmessage = (e: MessageEvent) => this.#onMessage(e.data);
      this.#worker.onerror = (e) => {
        const err = new Error(e.message ?? 'Segmentation worker error');
        this.#loadReject?.(err);
        for (const p of this.#pending.values()) p.reject(err);
        this.#pending.clear();
      };
    }
    return this.#worker;
  }

  get isReady(): boolean {
    return this.#ready;
  }

  loadModel(
    opts: { dirHandle?: FileSystemDirectoryHandle } = {},
    onProgress?: (pct: number, status: string) => void,
  ): Promise<void> {
    const worker = this.#ensureWorker();
    this.#ready = false;
    this.#loadProgressCb = onProgress ?? null;
    return new Promise((resolve, reject) => {
      this.#loadResolve = resolve;
      this.#loadReject = reject;
      worker.postMessage({ type: 'load', payload: opts });
    });
  }

  /** Segments already-decoded 16 kHz mono PCM. Progress reports processed/total 10 s windows. */
  segment(
    audio: Float32Array,
    onProgress?: (done: number, total: number) => void,
  ): Promise<RawDiarizationSegment[]> {
    if (!this.#worker || !this.#ready) {
      return Promise.reject(new Error('Segmentation model is not loaded.'));
    }
    const requestId = String(this.#nextId++);
    const buffer = audio.slice().buffer;
    return new Promise((resolve, reject) => {
      this.#pending.set(requestId, { resolve, reject, onProgress });
      this.#worker!.postMessage(
        { type: 'segment', payload: { requestId, audio: new Float32Array(buffer) } },
        [buffer],
      );
    });
  }

  terminate(): void {
    this.#worker?.terminate();
    this.#worker = null;
    this.#ready = false;
    for (const p of this.#pending.values()) p.reject(new Error('Segmentation terminated'));
    this.#pending.clear();
  }

  #onMessage(data: WorkerMessage) {
    if (!data?.type || !VALID_WORKER_TYPES.has(data.type)) return;

    if (data.type === 'progress') {
      const { pct, status } = parseTransformersProgress(data.payload);
      this.#loadProgressCb?.(pct, status);
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

    if (data.type === 'segment-progress') {
      this.#pending.get(data.payload.requestId)?.onProgress?.(data.payload.done, data.payload.total);
      return;
    }

    if (data.type === 'segments') {
      const pending = this.#pending.get(data.payload.requestId);
      if (!pending) return;
      const segments = Array.isArray(data.payload.segments) ? data.payload.segments : [];
      pending.resolve(
        segments.map((s) => ({
          startMs: Number(s.startMs),
          endMs: Number(s.endMs),
          windowLocalSpeaker: Number(s.windowLocalSpeaker),
          confidence: Number(s.confidence),
        })),
      );
      this.#pending.delete(data.payload.requestId);
      return;
    }

    if (data.type === 'error') {
      const err = new Error(data.payload?.message ?? 'Segmentation failed.');
      const requestId = data.payload?.requestId;
      if (requestId && this.#pending.has(requestId)) {
        this.#pending.get(requestId)?.reject(err);
        this.#pending.delete(requestId);
      } else {
        this.#loadReject?.(err);
        this.#loadResolve = null;
        this.#loadReject = null;
      }
    }
  }
}
