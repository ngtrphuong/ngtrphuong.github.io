/**
 * Web Worker for speaker-embedding extraction (WeSpeaker ResNet34-LM via Transformers.js).
 * Used post-hoc to diarize a completed recording — see diarization.ts for the clustering logic.
 */
import { AutoProcessor, AutoModel, env } from '@huggingface/transformers';
import { DirHandleCache } from '../../../scripts/tools/shared/dir-handle-cache.ts';
import { DIARIZATION_MODEL_ID } from '../../../scripts/tools/meeting-notes/constants.ts';

const VALID_TYPES = new Set(['load', 'embed']);

let processor: Awaited<ReturnType<typeof AutoProcessor.from_pretrained>> | null = null;
let model: Awaited<ReturnType<typeof AutoModel.from_pretrained>> | null = null;

function postError(message: string, requestId?: string) {
  self.postMessage({ type: 'error', payload: { message, requestId } });
}

async function loadModel(payload: { dirHandle?: FileSystemDirectoryHandle }) {
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

  // A ~6.7MB int8 model — plenty fast on CPU/WASM, no need for WebGPU's extra complexity/fallback.
  processor = await AutoProcessor.from_pretrained(DIARIZATION_MODEL_ID, { progress_callback });
  model = await AutoModel.from_pretrained(DIARIZATION_MODEL_ID, {
    dtype: 'int8',
    device: 'wasm',
    progress_callback,
  });

  self.postMessage({ type: 'ready' });
}

async function embed(payload: { requestId: string; audio: Float32Array }) {
  if (!processor || !model) {
    postError('Diarization model not loaded.', payload.requestId);
    return;
  }
  try {
    const inputs = await processor(payload.audio);
    const output = (await model(inputs)) as { last_hidden_state: { data: Float32Array } };
    const embedding = Array.from(output.last_hidden_state.data);
    self.postMessage({ type: 'embedding', payload: { requestId: payload.requestId, embedding } });
  } catch (err) {
    postError(err instanceof Error ? err.message : String(err), payload.requestId);
  }
}

self.onmessage = async (e: MessageEvent) => {
  const data = e.data as { type?: string; payload?: unknown };
  if (!data?.type || !VALID_TYPES.has(data.type)) return;

  if (data.type === 'load') {
    try {
      await loadModel((data.payload ?? {}) as { dirHandle?: FileSystemDirectoryHandle });
    } catch (err) {
      postError(err instanceof Error ? err.message : String(err));
    }
    return;
  }

  if (data.type === 'embed') {
    await embed(data.payload as { requestId: string; audio: Float32Array });
  }
};
