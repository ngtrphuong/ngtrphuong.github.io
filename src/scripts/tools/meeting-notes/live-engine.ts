import { MicVAD } from '@ricky0123/vad-web';
import {
  startLiveSession as startWebSpeechSession,
  startLiveMeetingSession as startWebSpeechMeetingSession,
  startLiveMixedSession as startWebSpeechMixedSession,
} from './asr-web-speech.ts';
import { startLiveSession as startVadWhisperSession } from './live-vad-asr.ts';
import { VadTurnTracker } from './speaker-turns.ts';
import { sileroV6OrtConfig } from './vad-v6-adapter.ts';
import { VAD_BASE_ASSET_PATH, VAD_ONNX_WASM_BASE_PATH } from './constants.ts';
import type { WhisperWorkerBridge } from './asr-whisper-bridge.ts';
import type { LiveAsrCallbacks, LiveAsrSession, LiveCaptionSource, LiveEngine } from './types.ts';

export type LiveEngineOptions = {
  engine: LiveEngine;
  /** Web Speech only — ignored for 'local-ai'. */
  preferOnDevice: boolean;
  allowCloudFallback: boolean;
  onMediaStream?: (stream: MediaStream) => void | Promise<void>;
};

/**
 * Live captions: Web Speech API (best accuracy, incl. Vietnamese) with a real-time VAD instance
 * running in parallel purely to time speaker turns, or LocalAI (Whisper gated by VAD, fully
 * on-device). Both return the same LiveAsrSession contract so the caller doesn't care which
 * engine is active.
 */
export async function startLiveEngine(
  source: LiveCaptionSource,
  opts: LiveEngineOptions,
  callbacks: LiveAsrCallbacks,
  whisperBridge: WhisperWorkerBridge,
  webSpeechLanguage: string,
  whisperLanguage: string,
): Promise<LiveAsrSession> {
  if (opts.engine === 'local-ai') {
    callbacks.onPrivacyMode('local-model');
    return startVadWhisperSession(
      source,
      { onMediaStream: opts.onMediaStream },
      {
        onFinal: callbacks.onFinal,
        onError: callbacks.onError,
        onSpeechStart: callbacks.onSpeechStart,
        onSpeechEnd: callbacks.onSpeechEnd,
        onUtterance: callbacks.onUtterance,
      },
      whisperBridge,
      whisperLanguage,
    );
  }

  return startWebSpeechWithVadTiming(source, opts, callbacks, webSpeechLanguage);
}

/**
 * Runs Web Speech for transcription and a timing-only VAD instance on the same stream, purely
 * to get accurate speech-start/speech-end timestamps (VAD's acoustic silence detection is a
 * more reliable pause signal than Web Speech's own fuzzy per-result timing) — used to tag each
 * final segment's `turnBoundary` for the speaker-label heuristic.
 */
async function startWebSpeechWithVadTiming(
  source: LiveCaptionSource,
  opts: LiveEngineOptions,
  callbacks: LiveAsrCallbacks,
  language: string,
): Promise<LiveAsrSession> {
  const sessionStartMs = Date.now();
  const tracker = new VadTurnTracker();
  let vad: Awaited<ReturnType<typeof MicVAD.new>> | null = null;

  const wrappedCallbacks: LiveAsrCallbacks = {
    ...callbacks,
    onFinal: (seg) => {
      const vadIntervalIndex = tracker.intervalFor(seg.startMs) ?? undefined;
      callbacks.onFinal({
        ...seg,
        turnBoundary: tracker.resolveTurnBoundary(seg.startMs),
        vadIntervalIndex,
      });
    },
  };

  const wsOpts = {
    preferOnDevice: opts.preferOnDevice,
    allowCloudFallback: opts.allowCloudFallback,
    sessionStartMs,
    onMediaStream: async (stream: MediaStream) => {
      await opts.onMediaStream?.(stream);
      try {
        vad = await MicVAD.new({
          getStream: async () => stream,
          // "v5" selects vad-web's SileroV5 model class — the vendored file it loads actually
          // holds the Silero v6 weights, driven through the official rolling-context protocol
          // by sileroV6OrtConfig (see vad-v6-adapter.ts and VAD_BASE_ASSET_PATH in constants).
          model: 'v5',
          ortConfig: sileroV6OrtConfig,
          // Close utterances after 0.8 s of silence (default 1.4 s) — natural turn-taking gaps
          // then reliably split utterances per speaker, which live voice labeling depends on
          // (an utterance spanning two speakers gets one blended label).
          redemptionMs: 800,
          baseAssetPath: VAD_BASE_ASSET_PATH,
          onnxWASMBasePath: VAD_ONNX_WASM_BASE_PATH,
          onSpeechStart: () => {
            tracker.speechStart(Date.now() - sessionStartMs);
            callbacks.onSpeechStart();
          },
          onSpeechEnd: (audio) => {
            const intervalIndex = tracker.speechEnd(Date.now() - sessionStartMs);
            callbacks.onSpeechEnd();
            // Hand the utterance PCM up for live voice-based speaker labeling.
            if (intervalIndex != null) callbacks.onUtterance?.(intervalIndex, audio);
          },
          onVADMisfire: () => tracker.misfire(),
        });
        await vad.start();
      } catch {
        // Timing-only VAD is a nice-to-have for speaker-turn marking — never block live
        // captions on it. Segments fall back to the gap-based heuristic (speaker-turns.ts).
        vad = null;
      }
    },
  };

  const normalized = source === 'meeting-audio' ? 'system' : source;
  const wsSession =
    normalized === 'system' ? await startWebSpeechMeetingSession(language, wsOpts, wrappedCallbacks)
    : normalized === 'mixed' ? await startWebSpeechMixedSession(language, wsOpts, wrappedCallbacks)
    : await startWebSpeechSession(language, wsOpts, wrappedCallbacks);

  return {
    stop: async () => {
      const result = await wsSession.stop();
      await vad?.destroy();
      return result;
    },
    abort: () => {
      wsSession.abort();
      void vad?.destroy();
    },
  };
}
