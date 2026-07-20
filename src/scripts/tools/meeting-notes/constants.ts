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
 * VAD worklet + model assets are vendored (self-hosted) in public/tools/meeting-notes/vad/:
 * - vad.worklet.bundle.min.js and silero_vad_legacy.onnx come from @ricky0123/vad-web@0.0.30's
 *   dist and must be re-copied if that package is ever upgraded.
 * - silero_vad_v5.onnx actually contains the **Silero VAD v6.2.1** graph
 *   (github.com/snakers4/silero-vad tag v6.2.1, src/silero_vad/data/silero_vad.onnx,
 *   SHA-256 1a153a22f4509e292a94e67d6f9b85e8deb25b4988682b7e174c65279d8788e3). vad-web 0.0.30
 *   hardcodes the "silero_vad_v5.onnx" filename and only accepts model: "v5" | "legacy", but
 *   v6 was verified I/O-compatible with its SileroV5 class (same input/state/sr inputs and
 *   output/stateN outputs), so the v6 weights ship under the filename vad-web expects.
 * Self-hosting (instead of the previous jsdelivr URLs) pins the files by inclusion and removes
 * a runtime CDN dependency. onnxruntime-web's WASM stays on the CDN (large, version-pinned;
 * must match vad-web's own nested onnxruntime-web version in package-lock.json).
 */
const BASE_URL =
  (typeof import.meta !== 'undefined'
    ? (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL
    : undefined) ?? '/';
export const VAD_BASE_ASSET_PATH = `${BASE_URL.replace(/\/$/, '')}/tools/meeting-notes/vad/`;
export const VAD_ONNX_WASM_BASE_PATH = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.27.0/dist/';

/**
 * Real speaker-embedding model (WeSpeaker ResNet34-LM, ONNX, ~6.7MB int8) — verified to load and
 * run via @huggingface/transformers' AutoProcessor/AutoModel (registered model_type
 * "wespeaker-resnet" + WeSpeakerFeatureExtractor). Produces a 256-dim embedding per utterance;
 * embeddings are clustered by cosine similarity (diarization.ts) for real, voice-based speaker
 * labels — not the silence-gap heuristic used for the always-on default.
 */
export const DIARIZATION_MODEL_ID = 'onnx-community/wespeaker-voxceleb-resnet34-LM';
/**
 * Cosine similarity above which two utterances are clustered as the same speaker.
 * Taken from the reference pyannote/speaker-diarization-3.1 pipeline, which pairs exactly the
 * same two models (pyannote segmentation-3.0 + wespeaker-voxceleb-resnet34-LM) and clusters with
 * centroid-method AHC at cosine *distance* 0.7045654963945799 → similarity ≈ 0.2954.
 * The previous 0.55 was far too strict for real-world audio: measured same-speaker similarity is
 * only ~0.73 on *clean* speech, so any background music/noise pushed same-speaker pairs below
 * 0.55 and every utterance became its own "speaker" (observed: 86 speakers in one broadcast).
 */
export const DIARIZATION_SIMILARITY_THRESHOLD = 1 - 0.7045654963945799;

/**
 * Speaker-change/overlap-aware local segmentation (pyannote segmentation 3.0, MIT, ONNX ~5.7MB
 * fp32) — verified to load and run via AutoProcessor/AutoModelForAudioFrameClassification +
 * post_process_speaker_diarization in the installed @huggingface/transformers. Its powerset head
 * distinguishes up to 3 concurrent speakers per 10 s window (including overlapped speech), which
 * replaces VAD-pause timings as the segmentation signal for diarization. Revision pinned so a
 * hub-side update can never silently change inference behavior.
 */
export const SEGMENTATION_MODEL_ID = 'onnx-community/pyannote-segmentation-3.0';
export const SEGMENTATION_MODEL_REVISION = '733a93b6473d019a773298e08cefa686894b1854';

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
