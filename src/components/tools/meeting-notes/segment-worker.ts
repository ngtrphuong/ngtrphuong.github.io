/**
 * Web Worker for speaker-change-aware segmentation (pyannote segmentation 3.0 via
 * Transformers.js). Produces overlap-aware speech segments used as the segmentation signal for
 * diarization — see diarization.ts for the embedding/clustering pipeline that consumes them.
 */
import { AutoProcessor, AutoModelForAudioFrameClassification, env } from '@huggingface/transformers';
import { DirHandleCache } from '../../../scripts/tools/shared/dir-handle-cache.ts';
import {
  SEGMENTATION_MODEL_ID,
  SEGMENTATION_MODEL_REVISION,
  WHISPER_SAMPLE_RATE,
} from '../../../scripts/tools/meeting-notes/constants.ts';
import {
  planWindows,
  powersetToRawSegments,
  stitchWindows,
  SEGMENTATION_WINDOW_SECONDS,
  type LocalSegment,
} from '../../../scripts/tools/meeting-notes/segmentation-stitching.ts';
import type { RawDiarizationSegment } from '../../../scripts/tools/meeting-notes/types.ts';

const VALID_TYPES = new Set(['load', 'segment']);

let processor: Awaited<ReturnType<typeof AutoProcessor.from_pretrained>> | null = null;
let model: Awaited<ReturnType<typeof AutoModelForAudioFrameClassification.from_pretrained>> | null = null;

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

  // ~5.7MB fp32 model — fast enough on CPU/WASM; skipping WebGPU keeps init failure modes out
  // (same call as the WeSpeaker embedding worker). Revision pinned — never track the hub tip.
  processor = await AutoProcessor.from_pretrained(SEGMENTATION_MODEL_ID, {
    revision: SEGMENTATION_MODEL_REVISION,
    progress_callback,
  });
  model = await AutoModelForAudioFrameClassification.from_pretrained(SEGMENTATION_MODEL_ID, {
    revision: SEGMENTATION_MODEL_REVISION,
    dtype: 'fp32',
    device: 'wasm',
    progress_callback,
  });

  self.postMessage({ type: 'ready' });
}

async function segment(payload: { requestId: string; audio: Float32Array }) {
  if (!processor || !model) {
    postError('Segmentation model not loaded.', payload.requestId);
    return;
  }
  try {
    const audio = payload.audio;
    const trueDurationMs = (audio.length / WHISPER_SAMPLE_RATE) * 1000;
    const windows = planWindows(audio.length, WHISPER_SAMPLE_RATE);
    const windowSamples = SEGMENTATION_WINDOW_SECONDS * WHISPER_SAMPLE_RATE;

    const perWindow: RawDiarizationSegment[][] = [];
    for (let w = 0; w < windows.length; w++) {
      const { startSample, endSample, offsetMs } = windows[w];
      // The model is trained on 10 s inputs — zero-pad a short tail window to the full length,
      // then let powersetToRawSegments truncate anything detected inside the padding.
      let samples = audio.subarray(startSample, endSample);
      if (samples.length < windowSamples) {
        const padded = new Float32Array(windowSamples);
        padded.set(samples);
        samples = padded;
      }
      const inputs = await processor(samples);
      const { logits } = (await model(inputs)) as { logits: unknown };
      const [localSegments] = (
        processor as unknown as {
          post_process_speaker_diarization: (l: unknown, n: number) => LocalSegment[][];
        }
      ).post_process_speaker_diarization(logits, samples.length);
      perWindow.push(powersetToRawSegments(localSegments, offsetMs, trueDurationMs));
      self.postMessage({
        type: 'segment-progress',
        payload: { requestId: payload.requestId, done: w + 1, total: windows.length },
      });
    }

    const segments = stitchWindows(perWindow);
    self.postMessage({ type: 'segments', payload: { requestId: payload.requestId, segments } });
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

  if (data.type === 'segment') {
    await segment(data.payload as { requestId: string; audio: Float32Array });
  }
};
