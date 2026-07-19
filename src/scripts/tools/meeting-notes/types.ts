export type TranscriptSegment = {
  id: string;
  startMs: number;
  endMs: number;
  text: string;
  speakerId?: string;
  confidence?: number;
  isFinal: boolean;
  source: 'web-speech' | 'whisper';
  /**
   * Set by engines that have a precise, VAD-derived signal for "this segment starts a new
   * speaker turn" (see live-engine.ts). When present, the UI uses it directly instead of its
   * own gap-based fallback heuristic (speaker-turns.ts). Still a heuristic, not real diarization.
   */
  turnBoundary?: boolean;
};

export type PrivacyMode = 'on-device' | 'cloud-assisted' | 'local-model';

/** Live STT engine: Web Speech (preferred — best accuracy) or LocalAI (Whisper, fully offline/private). */
export type LiveEngine = 'web-speech' | 'local-ai';

export type LiveAsrCallbacks = {
  /** Interim (non-final) text — only fires for the Web Speech engine; Whisper has no partials. */
  onPartial: (seg: TranscriptSegment) => void;
  onFinal: (seg: TranscriptSegment) => void;
  onError: (message: string) => void;
  onPrivacyMode: (mode: PrivacyMode) => void;
  /** VAD detected the start/end of an utterance. Drives a "Listening…" indicator, and — for the
   * Web Speech engine — timestamps used to mark speaker turns (see live-engine.ts). */
  onSpeechStart: () => void;
  onSpeechEnd: () => void;
};

export type LiveAsrSession = {
  stop: () => Promise<TranscriptSegment[]>;
  abort: () => void;
};

export type FileAsrCallbacks = {
  onProgress: (pct: number, status: string) => void;
  onSegment: (seg: TranscriptSegment) => void;
  onError: (message: string) => void;
};

export type MinutesResult = {
  title: string;
  attendees: string[];
  agenda: string[];
  decisions: string[];
  actionItems: { owner?: string; task: string; due?: string }[];
  summary: string;
  rawTranscript: TranscriptSegment[];
};

export type WhisperPhase = 'idle' | 'loading' | 'ready' | 'transcribing' | 'error';
export type LivePhase = 'idle' | 'listening' | 'error';
export type RecordPhase = 'idle' | 'recording' | 'error';
export type ActiveTab = 'live' | 'record' | 'upload';
/**
 * Live caption audio source.
 * - mic: microphone only
 * - system: shared tab/screen audio (Teams/Meet/Zoom)
 * - mixed: microphone + system/tab audio
 * - meeting-audio: alias kept for older sessions → treated as system
 */
export type LiveCaptionSource = 'mic' | 'system' | 'mixed' | 'meeting-audio';
