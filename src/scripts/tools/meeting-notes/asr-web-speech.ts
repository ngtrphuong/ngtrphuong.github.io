import type { LiveAsrCallbacks, LiveAsrSession, PrivacyMode, TranscriptSegment } from './types.ts';
import { acquireDisplayStream, SystemAudioNotCapturedError } from './audio-capture.ts';

type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  processLocally?: boolean;
  start(audioTrack?: MediaStreamTrack): void;
  stop(): void;
  abort(): void;
  onresult: ((ev: SpeechRecognitionEventLike) => void) | null;
  onerror: ((ev: { error: string; message?: string }) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    length: number;
    [i: number]: {
      isFinal: boolean;
      [j: number]: { transcript: string };
    };
  };
}

interface SpeechRecognitionStatic {
  available?(options: {
    langs: string[];
    processLocally?: boolean;
    quality?: string;
  }): Promise<string>;
  install?(options: {
    langs: string[];
    processLocally?: boolean;
    quality?: string;
  }): Promise<void>;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  }
}

export type OnDeviceLangStatus = 'api-unavailable' | 'available' | 'downloadable' | 'unavailable';

export type LiveSessionOptions = {
  preferOnDevice: boolean;
  allowCloudFallback: boolean;
  /** Called with the mic stream so the UI can attach a parallel MediaRecorder (or a timing-only VAD instance). */
  onMediaStream?: (stream: MediaStream) => void | Promise<void>;
  /** Shared clock epoch (Date.now() at session start) so segment timestamps line up with an externally-tracked VAD timeline. Defaults to Date.now(). */
  sessionStartMs?: number;
};

let segmentCounter = 0;

function nextId(prefix: string): string {
  segmentCounter += 1;
  return `${prefix}-${segmentCounter}-${Date.now()}`;
}

function langPackOptions(language: string) {
  return { langs: [language], processLocally: true, quality: 'dictation' as const };
}

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

function getStaticApi(): SpeechRecognitionStatic | null {
  const Ctor = getSpeechRecognitionCtor();
  return Ctor ? (Ctor as unknown as SpeechRecognitionStatic) : null;
}

export function isWebSpeechSupported(): boolean {
  return typeof window !== 'undefined' &&
    (!!window.SpeechRecognition || !!window.webkitSpeechRecognition);
}

/** Chrome/Edge: SpeechRecognition.available + install for on-device packs. */
export function supportsOnDeviceLanguagePack(): boolean {
  if (typeof window === 'undefined') return false;
  const api = getStaticApi();
  return typeof api?.available === 'function' && typeof api?.install === 'function';
}

export async function checkOnDeviceLanguage(language: string): Promise<OnDeviceLangStatus> {
  const api = getStaticApi();
  if (!api?.available) return 'api-unavailable';
  try {
    const result = await api.available(langPackOptions(language));
    if (result === 'available') return 'available';
    if (result === 'downloadable') return 'downloadable';
    return 'unavailable';
  } catch {
    return 'unavailable';
  }
}

/** Download/install the on-device speech language pack (Chrome/Edge). Requires user gesture. */
export async function installOnDeviceLanguagePack(language: string): Promise<void> {
  const api = getStaticApi();
  if (!api?.install || !api.available) {
    throw new Error(
      'Your browser does not support on-device language pack install. Use Chrome or Edge, enable cloud fallback, or try Record/Upload with Whisper.',
    );
  }
  const opts = langPackOptions(language);
  let status = await api.available(opts);
  if (status === 'available') return;
  if (status !== 'downloadable') {
    throw new Error(
      `Language pack for ${language} cannot be downloaded in this browser. Try another language, enable cloud fallback, or use Record/Upload.`,
    );
  }
  await api.install(opts);
  status = await api.available(opts);
  if (status !== 'available') {
    throw new Error('Language pack install did not finish. Click Install again or enable cloud fallback.');
  }
}

export function onDeviceLangStatusLabel(status: OnDeviceLangStatus, language: string): string {
  switch (status) {
    case 'available':
      return `On-device pack for ${language} is installed.`;
    case 'downloadable':
      return `On-device pack for ${language} can be downloaded (~tens of MB).`;
    case 'unavailable':
      return `On-device pack for ${language} is not offered by this browser.`;
    case 'api-unavailable':
      return 'This browser uses cloud speech recognition (no local pack API).';
  }
}

function mapError(code: string): string {
  switch (code) {
    case 'not-allowed':
      return 'Microphone access was denied. Allow microphone for this site in browser settings.';
    case 'no-speech':
      return 'No speech detected. Try speaking closer to the microphone.';
    case 'network':
      return 'Network error during speech recognition. Check your connection or try on-device mode.';
    case 'language-not-supported':
      return 'Language not supported. Install the language pack or enable cloud fallback.';
    case 'aborted':
      return 'Speech recognition was stopped.';
    default:
      return `Speech recognition error: ${code}`;
  }
}

/** Errors that fire during normal continuous listening (silence, restarts) — not fatal. */
export function isBenignSpeechRecognitionError(code: string): boolean {
  return code === 'no-speech' || code === 'aborted';
}

export function isFatalSpeechErrorMessage(message: string): boolean {
  if (message.includes('denied')) return true;
  if (message.includes('not supported')) return true;
  if (message.includes('language pack unavailable')) return true;
  if (message.includes('Network error')) return true;
  if (message.startsWith('Speech recognition error:')) return true;
  return false;
}

async function resolvePrivacyMode(
  language: string,
  preferOnDevice: boolean,
  allowCloudFallback: boolean,
  callbacks: LiveAsrCallbacks,
): Promise<{ processLocally: boolean; mode: PrivacyMode }> {
  if (!preferOnDevice) {
    callbacks.onPrivacyMode('cloud-assisted');
    return { processLocally: false, mode: 'cloud-assisted' };
  }

  if (!supportsOnDeviceLanguagePack()) {
    callbacks.onPrivacyMode('cloud-assisted');
    return { processLocally: false, mode: 'cloud-assisted' };
  }

  const status = await checkOnDeviceLanguage(language);
  if (status === 'available') {
    callbacks.onPrivacyMode('on-device');
    return { processLocally: true, mode: 'on-device' };
  }

  if (status === 'downloadable') {
    if (allowCloudFallback) {
      callbacks.onPrivacyMode('cloud-assisted');
      return { processLocally: false, mode: 'cloud-assisted' };
    }
    throw new Error(
      'On-device language pack is not installed yet. Click Install language pack below, enable cloud fallback, or choose meeting-audio captions.',
    );
  }

  if (allowCloudFallback) {
    callbacks.onPrivacyMode('cloud-assisted');
    return { processLocally: false, mode: 'cloud-assisted' };
  }

  throw new Error(
    'On-device language pack unavailable. Click Install language pack below, enable cloud fallback, or choose another language.',
  );
}

/**
 * Chrome/Edge expose SpeechRecognition.start(MediaStreamTrack) from Chromium 135+.
 * Native .length is often 0, so do NOT use start.length for feature detection.
 */
export function chromiumMajorVersion(): number | null {
  if (typeof navigator === 'undefined') return null;
  const ua = navigator.userAgent;
  const m = ua.match(/(?:Chrome|Chromium|Edg|CriOS)\/(\d+)/);
  return m ? Number(m[1]) : null;
}

export function supportsTrackBasedRecognition(): boolean {
  if (!getSpeechRecognitionCtor()) return false;
  const major = chromiumMajorVersion();
  // Spec overload start(audioTrack) shipped in Chrome 135 / Edge 135.
  if (major != null && major >= 135) return true;
  // Non-Chromium: assume unsupported (Firefox has no Web Speech; Safari has no track overload).
  return false;
}

export function supportsMeetingAudioCaptions(): boolean {
  return typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices?.getDisplayMedia &&
    supportsTrackBasedRecognition();
}

function bindRecognitionHandlers(
  recognition: SpeechRecognitionInstance,
  sessionStartMs: number,
  finals: TranscriptSegment[],
  callbacks: LiveAsrCallbacks,
  getStopped: () => boolean,
  restart: () => void,
) {
  recognition.onresult = (event) => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      const text = result[0]?.transcript?.trim() ?? '';
      if (!text) continue;
      const now = Date.now() - sessionStartMs;
      const seg: TranscriptSegment = {
        id: nextId('ws'),
        startMs: Math.max(0, now - 2000),
        endMs: now,
        text,
        isFinal: result.isFinal,
        source: 'web-speech',
      };
      if (result.isFinal) {
        finals.push(seg);
        callbacks.onFinal(seg);
      } else {
        callbacks.onPartial(seg);
      }
    }
  };

  recognition.onerror = (ev) => {
    if (isBenignSpeechRecognitionError(ev.error)) return;
    callbacks.onError(mapError(ev.error));
  };

  recognition.onend = () => {
    if (!getStopped()) {
      window.setTimeout(restart, 300);
    }
  };
}

function createRecognition(
  language: string,
  processLocally: boolean,
): SpeechRecognitionInstance {
  const Ctor = getSpeechRecognitionCtor();
  if (!Ctor) throw new Error('Live captions are not supported in this browser.');
  const recognition = new Ctor();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = language;
  if ('processLocally' in recognition) {
    recognition.processLocally = processLocally;
  }
  return recognition;
}

export async function startLiveSession(
  language: string,
  opts: LiveSessionOptions,
  callbacks: LiveAsrCallbacks,
): Promise<LiveAsrSession> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
    video: false,
  });
  await opts.onMediaStream?.(stream);

  const { processLocally } = await resolvePrivacyMode(
    language,
    opts.preferOnDevice,
    opts.allowCloudFallback,
    callbacks,
  );

  const recognition = createRecognition(language, processLocally);
  const sessionStartMs = opts.sessionStartMs ?? Date.now();
  const finals: TranscriptSegment[] = [];
  let stopped = false;

  bindRecognitionHandlers(
    recognition,
    sessionStartMs,
    finals,
    callbacks,
    () => stopped,
    () => {
      try {
        recognition.start();
      } catch {
        /* ignore */
      }
    },
  );

  try {
    recognition.start();
  } catch (err) {
    stream.getTracks().forEach((t) => t.stop());
    throw err;
  }

  const releaseMic = () => stream.getTracks().forEach((t) => t.stop());

  return {
    stop: () =>
      new Promise((resolve) => {
        stopped = true;
        recognition.onend = null;
        try {
          recognition.stop();
        } catch {
          /* ignore */
        }
        releaseMic();
        resolve([...finals]);
      }),
    abort: () => {
      stopped = true;
      recognition.onend = null;
      try {
        recognition.abort();
      } catch {
        /* ignore */
      }
      releaseMic();
    },
  };
}

type TrackLiveOpts = LiveSessionOptions & {
  /** 'system' = tab/screen audio only; 'mixed' = mic + tab/screen. */
  source: 'system' | 'mixed';
};

async function startTrackBasedLiveSession(
  language: string,
  opts: TrackLiveOpts,
  callbacks: LiveAsrCallbacks,
): Promise<LiveAsrSession> {
  if (!supportsMeetingAudioCaptions()) {
    throw new Error(
      'Tab-audio captions need Chrome/Edge 135+. Update your browser, or use Microphone only + Web Speech.',
    );
  }

  const displayStream = await acquireDisplayStream();
  const systemTracks = displayStream.getAudioTracks();
  if (systemTracks.length === 0) {
    displayStream.getTracks().forEach((t) => t.stop());
    throw new SystemAudioNotCapturedError();
  }

  let micStream: MediaStream | null = null;
  let audioContext: AudioContext | null = null;
  let recognitionTrack = systemTracks[0];
  let recordStream: MediaStream = new MediaStream(systemTracks);

  try {
    if (opts.source === 'mixed') {
      const { mixMicWithAudioTracks } = await import('./audio-capture.ts');
      micStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        video: false,
      });
      const mixed = await mixMicWithAudioTracks(micStream, systemTracks);
      audioContext = mixed.audioContext;
      recordStream = mixed.mixedStream;
      recognitionTrack = mixed.mixedStream.getAudioTracks()[0] ?? systemTracks[0];
    }
  } catch (err) {
    displayStream.getTracks().forEach((t) => t.stop());
    micStream?.getTracks().forEach((t) => t.stop());
    throw err;
  }

  await opts.onMediaStream?.(recordStream);

  const { processLocally } = await resolvePrivacyMode(
    language,
    opts.preferOnDevice,
    opts.allowCloudFallback,
    callbacks,
  );

  const recognition = createRecognition(language, processLocally);
  const sessionStartMs = opts.sessionStartMs ?? Date.now();
  const finals: TranscriptSegment[] = [];
  let stopped = false;

  const restartWithTrack = () => {
    if (stopped || recognitionTrack.readyState !== 'live') return;
    try {
      recognition.start(recognitionTrack);
    } catch {
      /* ignore */
    }
  };

  bindRecognitionHandlers(
    recognition,
    sessionStartMs,
    finals,
    callbacks,
    () => stopped,
    restartWithTrack,
  );

  displayStream.getVideoTracks()[0]?.addEventListener(
    'ended',
    () => {
      if (!stopped) {
        stopped = true;
        try {
          recognition.stop();
        } catch {
          /* ignore */
        }
      }
    },
    { once: true },
  );

  try {
    recognition.start(recognitionTrack);
  } catch (err) {
    displayStream.getTracks().forEach((t) => t.stop());
    micStream?.getTracks().forEach((t) => t.stop());
    void audioContext?.close();
    throw err;
  }

  const releaseAll = () => {
    displayStream.getTracks().forEach((t) => t.stop());
    micStream?.getTracks().forEach((t) => t.stop());
    void audioContext?.close();
  };

  return {
    stop: () =>
      new Promise((resolve) => {
        stopped = true;
        recognition.onend = null;
        try {
          recognition.stop();
        } catch {
          /* ignore */
        }
        releaseAll();
        resolve([...finals]);
      }),
    abort: () => {
      stopped = true;
      recognition.onend = null;
      try {
        recognition.abort();
      } catch {
        /* ignore */
      }
      releaseAll();
    },
  };
}

/** Live captions from shared tab/screen audio (Chrome/Edge 135+). */
export async function startLiveMeetingSession(
  language: string,
  opts: LiveSessionOptions,
  callbacks: LiveAsrCallbacks,
): Promise<LiveAsrSession> {
  return startTrackBasedLiveSession(language, { ...opts, source: 'system' }, callbacks);
}

/** Live captions from mic + shared tab/screen audio mixed into one Web Speech track. */
export async function startLiveMixedSession(
  language: string,
  opts: LiveSessionOptions,
  callbacks: LiveAsrCallbacks,
): Promise<LiveAsrSession> {
  return startTrackBasedLiveSession(language, { ...opts, source: 'mixed' }, callbacks);
}
