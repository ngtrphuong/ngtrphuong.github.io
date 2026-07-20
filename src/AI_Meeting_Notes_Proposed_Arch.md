# Meeting Notes — Implemented Architecture

Status: deployed at `/tools/meeting-notes/` on the Astro static site.

The tool is browser-first and has no application backend. LocalAI transcription, speaker
diarization, and meeting-minutes generation run in the browser. Web Speech can run on-device when
the browser language pack is installed; its enabled-by-default cloud fallback may send live audio
to the browser vendor and is disclosed in the UI.

## 1. Runtime and integration

- **Host:** Astro 7 static SSG on GitHub Pages (`output: 'static'`).
- **UI:** Svelte 5 client-only island, registered in `src/pages/tools/[id]/index.astro`.
- **Main component:** `src/components/tools/MeetingNotes.svelte`.
- **Local inference:** `@huggingface/transformers` using WebGPU when available and WASM fallback.
- **Capture:** Web Media APIs (`getUserMedia`, `getDisplayMedia`, `MediaRecorder`, Web Audio).
- **VAD:** `@ricky0123/vad-web`; the worklet and Silero models are self-hosted (vendored) under
  `public/tools/meeting-notes/vad/`. The live path runs the Silero **v6.2.1** graph (shipped under
  the `silero_vad_v5.onnx` filename vad-web hardcodes — SHA-256 recorded in `constants.ts`).
  v6 matches v5's tensor shapes but requires silero's official rolling-context input protocol
  ([1, 576] = 64 context + 512 frame); fed vad-web's bare [1, 512] frames its probabilities
  collapse and speech is never detected. `vad-v6-adapter.ts` restores the official protocol by
  wrapping session creation through vad-web's `ortConfig` hook (no fork). onnxruntime-web WASM
  still loads from a pinned CDN URL matching the installed version.
- **Persistence:** native IndexedDB for the current transcript session.
- **Optional model cache:** browser cache by default or a user-selected directory through the File
  System Access API.

No transcript, uploaded file, or recording is sent to this site because there is no server endpoint.

## 2. High-level architecture

```text
                         Astro static page
                                |
                    MeetingNotes.svelte (UI)
               _________/_______|_________\_________
              /                 |                   \
     Capture and live ASR   Local model workers   Browser storage
     - mic/display/mixed    - Whisper ASR         - transcript in IDB
     - Web Speech API       - diarization         - model cache
     - MediaRecorder        - minutes LLM         - optional directory
     - VAD timing
```

The main thread owns permissions, stream lifecycle, reactive state, transcript editing, exports,
and worker orchestration. Model loading and inference run in module workers so they do not block
the Svelte UI.

### Worker responsibilities

| Worker | Responsibility |
| --- | --- |
| `components/tools/meeting-notes/worker.ts` | Whisper model loading and chunked ASR |
| `components/tools/meeting-notes/segment-worker.ts` | pyannote speaker-change segmentation (windowed, overlap-aware) |
| `components/tools/meeting-notes/diarize-worker.ts` | WeSpeaker embedding extraction |
| `components/tools/meeting-notes/minutes-worker.ts` | Local Gemma model and streamed minutes generation |

Bridges in `src/scripts/tools/meeting-notes/` validate worker events, expose typed APIs, normalize
model progress, and terminate workers during component cleanup.

## 3. ASR strategy

The deployed design intentionally uses two interchangeable live engines instead of the originally
proposed sherpa-onnx/SenseVoice stack.

### 3.1 Web Speech API (default live engine)

- Produces interim word-by-word captions without downloading a model.
- Supports a primary BCP-47 language. Vietnamese is suitable for Vietnamese speech with occasional
  English terms, but this is not true automatic bilingual detection.
- Prefers local processing when Chrome/Edge exposes the on-device language-pack API.
- Falls back to browser-vendor cloud recognition when the user leaves **Allow cloud fallback**
  enabled. The current default is enabled so a fresh browser profile can start captions.
- Treats silence (`no-speech`) and user aborts as non-fatal; fatal permission, network, and language
  errors are surfaced in the UI.
- For system/tab audio, uses track-based `SpeechRecognition.start(audioTrack)`, currently requiring
  a supporting Chrome/Edge version (documented as 135+).

### 3.2 LocalAI (Whisper)

- Uses `Xenova/whisper-base` by default, with `Xenova/whisper-tiny` as the smaller option.
- Runs through Transformers.js in a Worker, using WebGPU when possible and WASM otherwise.
- Decodes audio to mono 16 kHz PCM and transcribes in 30-second chunks.
- Powers LocalAI live captions, Record transcription, and Upload transcription.
- LocalAI live mode is VAD-gated and emits a finalized line after an utterance/pause rather than
  Web Speech-style interim words.

Both live engines return the same `LiveAsrSession` contract (`stop` and `abort`) through
`live-engine.ts`.

## 4. Capture and operational modes

### 4.1 Audio sources

Live and Record support:

1. **Microphone:** `getUserMedia({ audio: true })`.
2. **System / tab:** `getDisplayMedia({ video: true, audio: true })`; video keeps the display share
   alive but only the audio track is recorded/transcribed.
3. **Microphone + system:** Web Audio mixes microphone and display audio into a destination stream.

The browser share dialog must include tab/system audio. Missing display audio is rejected with
actionable guidance. Stopping share from the browser UI ends capture and releases all tracks and
audio contexts.

### 4.2 Live

- Starts Web Speech or LocalAI against the selected source.
- Runs VAD in parallel for speech-start/end timing and speaker-turn hints.
- Can optionally record the same session with `MediaRecorder`.
- Auto-scroll follows new text while the user is near the bottom. Manual upward scrolling pauses
  follow mode and reveals **Jump to latest**.

### 4.3 Record

- Captures microphone, system/tab, or mixed audio with `MediaRecorder`.
- Collects one-second encoded chunks and enforces a two-hour session limit.
- On stop, decodes and transcribes the resulting Blob with Whisper.
- The recording remains in memory for user-initiated download and optional diarization.

### 4.4 Upload

- Accepts an explicit audio/video MIME and extension allowlist with a 50 MiB cap.
- Probes duration and decodes supported media to PCM in the browser.
- Sends PCM to the Whisper Worker and streams finalized segments/progress to the UI.

## 5. Speaker labels and diarization

There are two distinct mechanisms:

1. **Live voice labeling (`live-speaker-tracker.ts`):** each VAD-detected utterance's loudest
   ~3 s is embedded with WeSpeaker (model loads in the background when Live starts) and the
   accumulated set is re-clustered with the same knee-detecting AHC the batch pass uses — the
   full interval → label map is re-applied after every utterance, so earlier lines are corrected
   in place and labels converge to batch quality (verified: 8-speaker meeting → 8 stable,
   correctly reused labels). Beyond ~120 utterances new arrivals attach greedily to the frozen
   centroids (O(n³) cost control). Until the model is ready (or if it can't load), a VAD-pause
   turn heuristic (1.5 s gap fallback) provides provisional labels. Live VAD closes utterances
   after 0.8 s of silence (vad-web default 1.4 s) so natural turn gaps split per speaker.
2. **Optional voice diarization (post-hoc, "Identify speakers"):** a four-stage pipeline in
   `diarization.ts`, all inference in workers:
   1. **Segmentation:** `onnx-community/pyannote-segmentation-3.0` (pinned revision
      `733a93b6…1854`, ~5.7 MB fp32 ONNX) runs over the raw recording/upload in 10-second windows
      with 1-second overlap (`segment-worker.ts`). Its powerset head distinguishes up to three
      concurrent speakers per window, including overlapped speech. Windows are stitched with
      IoU > 0.5 overlap dedup (`segmentation-stitching.ts`). If this model cannot load, the
      pipeline silently degrades to plain VAD speech intervals (the pre-v2 behavior) and the UI
      badges the result as the fallback engine.
   2. **Embeddings:** segments shorter than 1 s are merged into a neighbor (WeSpeaker is
      unreliable below ~1 s), then `onnx-community/wespeaker-voxceleb-resnet34-LM` (~6.7 MB
      int8) produces a 256-dimensional voice embedding from the loudest ~3 s of each segment
      (`pickLoudestWindow` — real speech, not pad silence or turn-edge bleed; also keeps WASM
      embedding faster than playback) (`diarize-worker.ts`).
   3. **Clustering:** agglomerative hierarchical clustering with duration-weighted centroid
      re-estimation (`clustering.ts`). The stopping point is the most conservative of: the
      `≈0.295` similarity threshold (the reference pyannote-3.1 pipeline's tuned value for this
      exact model pair — cosine distance `0.7045654963945799`; the earlier `0.55` over-split
      real-world audio into one speaker per utterance), **knee detection** over the
      merge-similarity sequence (same-voice merges score high and the first cross-voice merge
      appears as a sharp drop — a fixed threshold alone under-splits noisy audio or over-merges
      clean audio), and the optional "Expected speakers" hint. Clusters with < 3 s of total
      speech are absorbed into their nearest neighbor (never below the hint). Verified on a
      real 8-speaker fixture: 8/8 speakers, all recurring turns correctly re-identified.
   4. **Reconciliation:** each transcript segment takes the speaker of its maximum-overlap
      diarization segment; below 30 % coverage the existing label is left untouched.
      `turnBoundary` is set where the assigned speaker changes.

Diarization requires audio from the latest recording/upload; Live must have optional recording
enabled. Labels remain editable, and renaming a label updates all matching segments. Re-running
re-clusters from scratch, so renamed labels should be reviewed afterwards. Where two speakers
overlap in time, the transcript line is assigned by maximum overlap only (no dual-speaker
rendering yet — TODO).

## 6. Meeting minutes

- `minutes.ts` builds the prompt, checks transcript readiness, parses the model output, and exports
  Markdown.
- `minutes-worker.ts` loads `onnx-community/gemma-4-E2B-it-ONNX`.
- Preferred execution is WebGPU with `q4f16`; WASM with `q4` is the fallback.
- Generated tokens stream to the UI and are parsed into title, attendees, agenda, decisions,
  action items, summary, and the source transcript.
- Minutes are an editable AI-generated draft and are never treated as automatically verified.

Minutes generation is user-triggered after enough finalized transcript text exists.

## 7. Current data contracts

The source of truth is `src/scripts/tools/meeting-notes/types.ts`.

```typescript
export type TranscriptSegment = {
  id: string;
  startMs: number;
  endMs: number;
  text: string;
  speakerId?: string;
  confidence?: number;
  isFinal: boolean;
  source: 'web-speech' | 'whisper';
  turnBoundary?: boolean;
};

export type PrivacyMode = 'on-device' | 'cloud-assisted' | 'local-model';
export type LiveEngine = 'web-speech' | 'local-ai';
export type ActiveTab = 'live' | 'record' | 'upload';
export type LiveCaptionSource = 'mic' | 'system' | 'mixed' | 'meeting-audio';

export type RawDiarizationSegment = {
  startMs: number;
  endMs: number;
  windowLocalSpeaker: number; // local to one 10 s window; NOT globally stable
  confidence: number;
};

export type DiarizationSegment = {
  startMs: number;
  endMs: number;
  speakerId: string; // session-stable, e.g. "Speaker 1"
  confidence: number;
};

export type ClusteringOptions = {
  mergeThreshold: number;        // cosine similarity, default 0.55
  minSpeakerDurationMs: number;  // default 3000
  minEmbeddingSegmentMs: number; // default 400
  speakerCountHint?: number;     // advisory clamp only
};

export type DiarizationEngine = 'pyannote' | 'vad-heuristic';

export type LiveAsrSession = {
  stop: () => Promise<TranscriptSegment[]>;
  abort: () => void;
};
```

`meeting-audio` is a compatibility alias normalized to `system`.

## 8. Storage and export

- The current transcript, selected language, and speaker-label overrides are saved in
  `meeting-notes-db/sessions/current` unless **Don't save transcript** is enabled.
- Raw recording audio is not persisted in IndexedDB.
- Transformers.js model files use browser cache or the user-selected directory through
  `DirHandleCache`.
- Transcript exports: plain text, Markdown, and JSON; copy uses text-safe browser APIs.
- Audio exports: native recording container (normally WebM/Opus) or MP3. MP3 conversion is loaded
  lazily through Mediabunny and `@mediabunny/mp3-encoder`.
- Object URLs, streams, workers, VAD instances, and AudioContexts are released on stop/destroy.

## 9. Privacy and browser boundaries

| Path | Audio leaves the device? |
| --- | --- |
| Web Speech with installed local language pack | No |
| Web Speech with cloud fallback | Yes, to the browser vendor |
| LocalAI live / Record / Upload | No; inference is local |
| pyannote segmentation | No; inference is local |
| VAD, diarization (embeddings/clustering), and minutes generation | No; inference is local |

Microphone/display permissions are requested only from a user action. Transcript and user-provided
labels are rendered as text, never injected as HTML. The tool does not log transcript or audio
content to analytics.

Browser limitations:

- Web Speech availability and behavior vary by vendor.
- Track-based system-audio recognition is not standardized across all browsers.
- Screen/system audio choices depend on OS and browser share-dialog capabilities.
- WebGPU improves local model speed but is optional because WASM fallback exists.
- Speaker grouping and AI-generated minutes are approximate and require user review.

## 10. Validation coverage

- `tests/tools-meeting-notes.test.ts` covers formatters, minutes parsing, source labels, audio
  export mapping, speech capability/error handling, speaker-turn logic, and Transformers progress
  normalization.
- `tests/tools-meeting-notes-diarization.test.ts` covers AHC clustering (determinism, centroid
  vs single-linkage behavior, min-duration absorption, speaker-count hint), window
  planning/stitching, powerset mapping, sliver merging, reconciliation, and the pipeline's
  pyannote/fallback paths — all on synthetic fixtures, no models.
- `tests/e2e/meeting-notes.spec.ts` covers hydration, privacy controls, engine/source selection,
  mocked Web Speech paths, mixed Vietnamese/English system-audio captions, recording options,
  responsive layout, transcript auto-follow behavior, and both diarization engines via mocked
  segment/embedding workers (including the fallback badge and label renaming).
- CI builds the static site and runs the frontend suite without downloading production AI models.
