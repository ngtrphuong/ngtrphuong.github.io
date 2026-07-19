import { MicVAD } from '@ricky0123/vad-web';
import { acquireDisplayStream, mixMicWithAudioTracks, SystemAudioNotCapturedError } from './audio-capture.ts';
import { VAD_BASE_ASSET_PATH, VAD_ONNX_WASM_BASE_PATH } from './constants.ts';
import type { WhisperWorkerBridge } from './asr-whisper-bridge.ts';
import type { LiveAsrSession, LiveCaptionSource, TranscriptSegment } from './types.ts';

export type LiveVadSessionOptions = {
  /** Called once the input stream is available, so the UI can attach a parallel recorder. */
  onMediaStream?: (stream: MediaStream) => void | Promise<void>;
};

/** This engine has no interim text and no privacy-mode switching (always on-device) — only these callbacks are used. */
export type LiveVadCallbacks = {
  onFinal: (seg: TranscriptSegment) => void;
  onError: (message: string) => void;
  onSpeechStart: () => void;
  onSpeechEnd: () => void;
};

type AcquiredStream = { stream: MediaStream; cleanup: () => void };

async function acquireMicStream(): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
    video: false,
  });
}

async function acquireSourceStream(
  source: LiveCaptionSource,
  onCaptureEnded: () => void,
): Promise<AcquiredStream> {
  const normalized = source === 'meeting-audio' ? 'system' : source;

  if (normalized === 'mic') {
    const stream = await acquireMicStream();
    return { stream, cleanup: () => stream.getTracks().forEach((t) => t.stop()) };
  }

  const displayStream = await acquireDisplayStream();
  const systemTracks = displayStream.getAudioTracks();
  if (systemTracks.length === 0) {
    displayStream.getTracks().forEach((t) => t.stop());
    throw new SystemAudioNotCapturedError();
  }
  displayStream.getVideoTracks()[0]?.addEventListener('ended', onCaptureEnded, { once: true });

  if (normalized === 'system') {
    return {
      stream: new MediaStream(systemTracks),
      cleanup: () => displayStream.getTracks().forEach((t) => t.stop()),
    };
  }

  // mixed
  const micStream = await acquireMicStream();
  const { mixedStream, audioContext } = await mixMicWithAudioTracks(micStream, systemTracks);
  return {
    stream: mixedStream,
    cleanup: () => {
      displayStream.getTracks().forEach((t) => t.stop());
      micStream.getTracks().forEach((t) => t.stop());
      void audioContext.close();
    },
  };
}

/**
 * Live captions via real-time voice-activity detection (@ricky0123/vad-web) + Whisper.
 * Replaces the old Web Speech API engine. There are no word-by-word interim captions —
 * Whisper is a batch decoder, so a caption only appears once VAD detects the end of an
 * utterance (a pause). Requires the Whisper model to already be loaded.
 */
export async function startLiveSession(
  source: LiveCaptionSource,
  opts: LiveVadSessionOptions,
  callbacks: LiveVadCallbacks,
  whisperBridge: WhisperWorkerBridge,
  language: string,
): Promise<LiveAsrSession> {
  let stopped = false;
  const finals: TranscriptSegment[] = [];

  const handleCaptureEnded = () => {
    if (stopped) return;
    callbacks.onError('Screen/tab sharing stopped.');
  };

  const { stream, cleanup } = await acquireSourceStream(source, handleCaptureEnded);

  try {
    await opts.onMediaStream?.(stream);

    const micVad = await MicVAD.new({
      getStream: async () => stream,
      baseAssetPath: VAD_BASE_ASSET_PATH,
      onnxWASMBasePath: VAD_ONNX_WASM_BASE_PATH,
      onSpeechStart: () => {
        if (!stopped) callbacks.onSpeechStart();
      },
      onSpeechEnd: async (audio) => {
        if (stopped) return;
        callbacks.onSpeechEnd();
        try {
          await whisperBridge.transcribeSamples(audio, language, {
            onProgress: () => {},
            onSegment: (seg) => {
              finals.push(seg);
              callbacks.onFinal(seg);
            },
            onError: (msg) => callbacks.onError(msg),
          });
        } catch (err: unknown) {
          callbacks.onError(err instanceof Error ? err.message : String(err));
        }
      },
      onVADMisfire: () => {
        if (!stopped) callbacks.onSpeechEnd();
      },
    });

    await micVad.start();

    const cleanupAll = () => {
      if (stopped) return;
      stopped = true;
      void micVad.destroy();
      cleanup();
    };

    return {
      stop: async () => {
        cleanupAll();
        return [...finals];
      },
      abort: () => cleanupAll(),
    };
  } catch (err) {
    cleanup();
    throw err;
  }
}
