/**
 * Web Worker for Whisper ASR via Transformers.js.
 */
import { pipeline, env } from '@huggingface/transformers';
import { DirHandleCache } from '../../../scripts/tools/shared/dir-handle-cache.ts';
import { CHUNK_SECONDS, WHISPER_MODEL_DEFAULT } from '../../../scripts/tools/meeting-notes/constants.ts';

const VALID_TYPES = new Set(['load', 'transcribe', 'abort']);

let transcriber: Awaited<ReturnType<typeof pipeline>> | null = null;
let abortRequested = false;
let loadedModelId = WHISPER_MODEL_DEFAULT;

function postError(message: string) {
  self.postMessage({ type: 'error', payload: { message } });
}

async function loadPipeline(payload: { dirHandle?: FileSystemDirectoryHandle; modelId?: string }) {
  const modelId = payload?.modelId ?? WHISPER_MODEL_DEFAULT;
  loadedModelId = modelId;

  if (payload?.dirHandle) {
    env.useCustomCache = true;
    env.useBrowserCache = false;
    (env as unknown as { customCache?: DirHandleCache }).customCache = new DirHandleCache(payload.dirHandle);
  } else {
    env.useBrowserCache = true;
    env.useCustomCache = false;
  }

  const progress_callback = (p: unknown) => {
    self.postMessage({ type: 'progress', payload: p });
  };

  try {
    transcriber = await pipeline('automatic-speech-recognition', modelId, {
      device: 'webgpu',
      dtype: 'fp32',
      progress_callback,
    });
  } catch {
    transcriber = await pipeline('automatic-speech-recognition', modelId, {
      device: 'wasm',
      dtype: 'fp32',
      progress_callback,
    });
  }

  self.postMessage({ type: 'ready', payload: { modelId } });
}

async function runTranscribe(payload: {
  audio: Float32Array;
  sampleRate: number;
  language?: string;
  chunkIndex?: number;
}) {
  if (!transcriber) {
    postError('Model not loaded yet.');
    return;
  }
  abortRequested = false;
  const chunkIndex = payload.chunkIndex ?? 0;
  const offsetMs = chunkIndex * CHUNK_SECONDS * 1000;

  try {
    const output = await (transcriber as (
      audio: Float32Array,
      opts: Record<string, unknown>,
    ) => Promise<{ text?: string; chunks?: { text: string; timestamp: [number, number | null] }[] }>)(
      payload.audio,
      {
        language: payload.language,
        return_timestamps: true,
        chunk_length_s: CHUNK_SECONDS,
        stride_length_s: 5,
      },
    );

    if (abortRequested) return;

    const chunks = output?.chunks;
    if (chunks?.length) {
      for (const ch of chunks) {
        const start = (ch.timestamp?.[0] ?? 0) * 1000;
        const endRaw = ch.timestamp?.[1];
        const end = endRaw != null ? endRaw * 1000 : start + 1000;
        const text = ch.text?.trim() ?? '';
        if (!text) continue;
        self.postMessage({
          type: 'segment',
          payload: { text, startMs: offsetMs + start, endMs: offsetMs + end },
        });
      }
    } else if (output?.text?.trim()) {
      self.postMessage({
        type: 'segment',
        payload: {
          text: output.text.trim(),
          startMs: offsetMs,
          endMs: offsetMs + payload.audio.length / (payload.sampleRate / 1000),
        },
      });
    }

    self.postMessage({ type: 'chunk-done', payload: { chunkIndex } });
  } catch (err) {
    postError(err instanceof Error ? err.message : String(err));
  }
}

self.onmessage = async (e: MessageEvent) => {
  const data = e.data as { type?: string; payload?: unknown };
  if (!data?.type || !VALID_TYPES.has(data.type)) return;

  if (data.type === 'load') {
    try {
      await loadPipeline((data.payload ?? {}) as { dirHandle?: FileSystemDirectoryHandle; modelId?: string });
    } catch (err) {
      postError(err instanceof Error ? err.message : String(err));
    }
    return;
  }

  if (data.type === 'transcribe') {
    const p = data.payload as {
      audio: Float32Array;
      sampleRate: number;
      language?: string;
      chunkIndex?: number;
    };
    if (!(p?.audio instanceof Float32Array)) {
      postError('Invalid audio payload.');
      return;
    }
    await runTranscribe(p);
    return;
  }

  if (data.type === 'abort') {
    abortRequested = true;
  }
};

void loadedModelId;
