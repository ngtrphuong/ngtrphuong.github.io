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

/**
 * A speaker-active interval produced by the pyannote segmentation model for one 10 s window.
 * `windowLocalSpeaker` is only meaningful within that window (the powerset head numbers up to
 * 3 concurrent speakers locally) — cross-window identity comes later, from embedding clustering.
 */
export type RawDiarizationSegment = {
  startMs: number;
  endMs: number;
  windowLocalSpeaker: number;
  confidence: number;
};

/** A diarized interval with a session-stable speaker id (assigned by embedding clustering). */
export type DiarizationSegment = {
  startMs: number;
  endMs: number;
  speakerId: string;
  confidence: number;
};

export type ClusteringOptions = {
  /** Cosine similarity between cluster centroids above which two clusters merge. */
  mergeThreshold: number;
  /** Clusters with less total speech than this are absorbed into their nearest neighbor. */
  minSpeakerDurationMs: number;
  /** Segments shorter than this are merged into a neighbor instead of being embedded alone. */
  minEmbeddingSegmentMs: number;
  /** Optional "expected speakers" hint: stop merging once this many clusters remain. Advisory only. */
  speakerCountHint?: number;
};

/** Which segmentation signal produced the current diarization result. */
export type DiarizationEngine = 'pyannote' | 'vad-heuristic';

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
