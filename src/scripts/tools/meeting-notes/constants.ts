export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;
export const MAX_RECORD_MS = 2 * 60 * 60 * 1000;
export const WHISPER_SAMPLE_RATE = 16000;
export const WHISPER_MODEL_BASE = 'Xenova/whisper-base';
export const WHISPER_MODEL_TINY = 'Xenova/whisper-tiny';
export const WHISPER_MODEL_DEFAULT = WHISPER_MODEL_BASE;
export const CHUNK_SECONDS = 30;
export const DEFAULT_LANG = 'en-US';
export const IDB_NAME = 'meeting-notes-db';
export const IDB_STORE = 'sessions';
export const SESSION_ID = 'current';
export const HINT_DISMISSED_KEY = 'meeting-notes-hint-dismissed';
/** Silence gap (ms) between two VAD-detected utterances that suggests a new speaker turn. Heuristic only — not voice identification. */
export const SPEAKER_TURN_GAP_MS = 1500;

/**
 * @ricky0123/vad-web and its bundled onnxruntime-web default to loading worklet/model/WASM
 * assets relative to "./", which breaks under Vite (dev pre-bundling rewrites the dynamic
 * import path; the static build has no guarantee these files are copied alongside the JS).
 * Point both at jsdelivr instead — same "fetch WASM from a CDN at runtime" pattern already
 * used by the PDF tool's qpdf.wasm loading. Versions must match what's actually installed
 * (see package-lock.json — vad-web pins its own nested onnxruntime-web, independent of the
 * one @huggingface/transformers uses).
 */
export const VAD_BASE_ASSET_PATH = 'https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.30/dist/';
export const VAD_ONNX_WASM_BASE_PATH = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.27.0/dist/';

/**
 * Real speaker-embedding model (WeSpeaker ResNet34-LM, ONNX, ~6.7MB int8) — verified to load and
 * run via @huggingface/transformers' AutoProcessor/AutoModel (registered model_type
 * "wespeaker-resnet" + WeSpeakerFeatureExtractor). Produces a 256-dim embedding per utterance;
 * embeddings are clustered by cosine similarity (diarization.ts) for real, voice-based speaker
 * labels — not the silence-gap heuristic used for the always-on default.
 */
export const DIARIZATION_MODEL_ID = 'onnx-community/wespeaker-voxceleb-resnet34-LM';
/** Cosine similarity above which two utterances are clustered as the same speaker. Heuristic — retune if it over/under-splits in practice. */
export const DIARIZATION_SIMILARITY_THRESHOLD = 0.55;

export const ALLOWED_AUDIO_MIMES = new Set([
  'audio/webm',
  'audio/wav',
  'audio/x-wav',
  'audio/mpeg',
  'audio/mp3',
  'audio/ogg',
  'audio/flac',
  'audio/mp4',
  'audio/x-m4a',
  'video/webm',
  'video/mp4',
  'video/quicktime',
]);

export const ALLOWED_EXTENSIONS = new Set([
  '.webm', '.wav', '.mp3', '.mpeg', '.ogg', '.flac', '.mp4', '.m4a', '.mov', '.mkv',
]);

export const LANGUAGE_OPTIONS = [
  { value: 'en-US', label: 'English (US)', whisper: 'en' },
  { value: 'vi-VN', label: 'Vietnamese', whisper: 'vi' },
  { value: 'ja-JP', label: 'Japanese', whisper: 'ja' },
  { value: 'ko-KR', label: 'Korean', whisper: 'ko' },
  { value: 'zh-CN', label: 'Chinese (Simplified)', whisper: 'zh' },
] as const;

export const WHISPER_MODEL_OPTIONS = [
  { value: WHISPER_MODEL_TINY, label: 'Tiny (~40 MB)', sizeHint: '~40 MB' },
  { value: WHISPER_MODEL_BASE, label: 'Base (~75 MB)', sizeHint: '~75 MB' },
] as const;

export function whisperLangFromBcp47(bcp47: string): string {
  return bcp47.split('-')[0]?.toLowerCase() ?? 'en';
}
