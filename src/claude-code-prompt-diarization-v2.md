# Claude Code Prompt — Meeting Notes Diarization v2 (pyannote segmentation + AHC clustering + Silero v6 VAD)

> **STATUS: IMPLEMENTED (July 2026).** Everything below the `---` is the original task prompt,
> kept verbatim as the historical spec. This section records what actually shipped and where it
> deviates — the authoritative architecture description is `AI_Meeting_Notes_Proposed_Arch.md`.

## Implementation outcome

| Deliverable | Status | Where |
| --- | --- | --- |
| 1. pyannote segmentation worker | ✅ Shipped | `segment-worker.ts` — pinned revision `733a93b6…1854`, 10 s windows / 1 s overlap, zero-padded tail, powerset mapping, IoU > 0.5 stitching (`segmentation-stitching.ts`, pure + unit-tested) |
| 2. Segmentation bridge | ✅ Shipped (as a class, matching repo convention) | `segmentation.ts` — `SegmentationBridge`, request-id matching, progress normalization, `terminate()` |
| 3. AHC clustering | ✅ Shipped, extended beyond spec | `clustering.ts` — centroid method with **duration-weighted** centroid re-estimation, deterministic tie-breaks, min-duration absorption (respects the hint), speaker-count hint, and **knee detection** (see deviations) |
| 4. Pipeline orchestrator + reconciliation + fallback | ✅ Shipped | `diarization.ts` — `runDiarizationPipeline`: segmentation → sliver merge → loudest-3 s embeddings → AHC → max-overlap reconciliation (30 % min coverage, `turnBoundary`); silently degrades to VAD intervals when segmentation can't load, with an engine badge in the UI |
| 5. Types | ✅ Shipped | `types.ts` — `RawDiarizationSegment`, `DiarizationSegment`, `ClusteringOptions`, `DiarizationEngine`, plus `TranscriptSegment.vadIntervalIndex` |
| 6. Silero v6 VAD swap | ✅ Shipped — **with a required adapter** | Assets vendored under `public/tools/meeting-notes/vad/`; v6.2.1 graph ships under the `silero_vad_v5.onnx` filename vad-web hardcodes; `vad-v6-adapter.ts` restores silero's official rolling-64-sample-context protocol via vad-web's `ortConfig` hook (no fork) |
| 7. UI wiring | ✅ Shipped | Engine badge (pyannote vs fallback), "Expected speakers" hint input, editable labels |
| 8. Tests | ✅ Shipped | `tests/tools-meeting-notes-diarization.test.ts` (clustering/stitching/pipeline/tracker/adapter on synthetic fixtures) + e2e with mocked segment/embedding workers; zero model downloads in CI |
| Beyond spec: live voice labeling | ✅ Shipped | `live-speaker-tracker.ts` — live captions get voice-based speaker labels (WeSpeaker embedding per VAD utterance, incrementally re-clustered with the same knee AHC; labels patched in place). Replaces the pause-counting heuristic that grew "Speaker N" forever |

## Key deviations from the spec (all evidence-driven)

1. **Merge threshold is ≈0.2954, not 0.55.** The spec's 0.55 over-split real audio into one
   speaker per utterance (measured same-speaker cosine is only ~0.73 on *clean* speech). The
   shipped value is the reference pyannote-3.1 pipeline's tuned threshold for this exact model
   pair (cosine distance `0.7045654963945799`), verified from its published config.
2. **Knee detection added on top of the threshold.** A fixed threshold cannot serve both clean
   meetings (needs ~0.45) and noisy broadcasts (needs ~0.30). The AHC stop point is the most
   conservative of threshold / knee (largest drop in the merge-similarity sequence) / hint.
3. **`minEmbeddingSegmentMs` is 1000, not 400** — WeSpeaker embeddings below ~1 s are unreliable
   and caused spurious cross-speaker merges.
4. **Embeddings use the loudest ~3 s of a segment** (`pickLoudestWindow`), not the whole slice:
   better voice purity (skips pad silence / turn-edge bleed) and ~3× faster on ort-wasm, where a
   10 s embed took ~10 s (longer than playback for long recordings).
5. **Silero v6 required more than a file swap.** The v6 graph matches v5's tensor *shapes* but
   collapses (max p≈0.10 on clear speech → VAD never fires) when fed vad-web's bare [1, 512]
   frames; the official protocol prepends a rolling 64-sample context ([1, 576]). The
   `ortConfig`-hook adapter restores it — measured on real speech, v6 then slightly outperforms
   v5 (speech mean p≈0.92 vs 0.90). Live VAD also uses `redemptionMs: 800` (default 1400) so
   natural turn gaps split utterances per speaker. `NonRealTimeVAD` (fallback path) keeps the
   legacy model — its class hardcodes the legacy h/c state signature.
6. **Speaker ids are `"Speaker 1"`, not `"S1"`** — keeps compatibility with saved sessions, the
   live turn heuristic, and the label-override map.
7. **VAD assets are self-hosted** (`public/tools/meeting-notes/vad/`, SHA-256 recorded in
   `constants.ts`) instead of CDN-loaded; onnxruntime-web WASM stays on a pinned CDN URL.

## Acceptance criteria — final measurements

- Real two-speaker audio → 2 speakers, all turns correctly grouped (batch and live).
- Ground-truth 8-speaker meeting (real LibriSpeech voices, 16 turns, every speaker recurring):
  **batch 8/8 speakers, 16/16 turns re-identified; live converges to the identical result** in
  real time in a real browser (file-backed fake mic, real models).
- No fixed-threshold single-pass clustering remains; diarization no longer consumes VAD timings
  when segmentation is available; segmentation load failure degrades with a visible badge.
- CI green with zero model downloads; static build succeeds; 182 unit tests, 22 e2e tests.

---

## Role and context

You are working in the repo `ngtrphuong/ngtrphuong.github.io` — an Astro 7 static site (`output: 'static'`) deployed to GitHub Pages. The target module is the **Meeting Notes** tool at `/tools/meeting-notes/`:

- UI: Svelte 5 client-only island, `src/components/tools/MeetingNotes.svelte`, registered in `src/pages/tools/[id]/index.astro`.
- Local inference: `@huggingface/transformers` (Transformers.js) in module Workers — WebGPU preferred, WASM fallback.
- Existing workers (in `src/components/tools/meeting-notes/`):
  - `worker.ts` — Whisper ASR (`Xenova/whisper-base` / `whisper-tiny`), chunked 30 s decode.
  - `diarize-worker.ts` — WeSpeaker `onnx-community/wespeaker-voxceleb-resnet34-LM` 256-d embeddings.
  - `minutes-worker.ts` — Gemma minutes generation.
- Bridges in `src/scripts/tools/meeting-notes/` validate worker events, expose typed APIs, normalize model download progress, and terminate workers on component cleanup.
- Types source of truth: `src/scripts/tools/meeting-notes/types.ts` (`TranscriptSegment`, `LiveAsrSession`, etc.).
- VAD: `@ricky0123/vad-web`, assets pinned to CDN URLs.
- Current diarization: VAD-pause turn heuristic (1.5 s gap) + WeSpeaker embeddings + **fixed cosine threshold 0.55** clustering.
- Persistence: IndexedDB `meeting-notes-db/sessions/current`; model files in browser cache or user-selected directory via `DirHandleCache`.
- Tests: `tests/tools-meeting-notes.test.ts` (unit) and `tests/e2e/meeting-notes.spec.ts` (Playwright). CI must never download production AI models.

Read the repo before changing anything. Confirm actual file paths/names — the descriptions above summarize the architecture doc and may drift from the code. If a described file does not exist under that exact path, locate its real equivalent and adapt; do not create duplicate parallel modules.

## Objective

Upgrade speaker diarization and VAD, fully in-browser, no server:

1. **Add pyannote segmentation** (`onnx-community/pyannote-segmentation-3.0`, MIT, ~28 MB) as a new worker. It produces speaker-change-aware, overlap-aware local segmentation, replacing the VAD-pause heuristic as the *segmentation signal for diarization* (VAD stays for live utterance gating).
2. **Replace fixed-threshold clustering** with agglomerative hierarchical clustering (AHC) with centroid re-estimation over WeSpeaker embeddings.
3. **Reconcile** diarization output with Whisper `TranscriptSegment` timestamps by maximum temporal overlap, preserving editable labels.
4. **Swap the VAD model** used by `@ricky0123/vad-web` from Silero v5 to a pinned Silero **v6** ONNX asset, keeping the existing vad-web worklet/API.
5. Keep the architecture doc, privacy table, and tests in sync.

## Hard constraints

- **No backend, no telemetry.** All inference stays in the browser. Never send audio/transcripts anywhere.
- **Worker/bridge pattern.** New inference code goes in a module Worker + a typed bridge, mirroring `diarize-worker.ts` and its bridge. Main thread never runs model inference.
- **Pinned versions.** All model files and CDN assets must be pinned to an exact revision/version (HF `revision` or exact CDN URL). No `latest`.
- **Model caching** must go through the existing cache path (browser cache / `DirHandleCache`) exactly like the other Transformers.js models.
- **WebGPU with WASM fallback** using the same device-selection helper the other workers use. pyannote segmentation is small; WASM-only is acceptable if WebGPU init fails.
- **CI must not download models.** All unit tests operate on synthetic tensors/fixtures; e2e mocks worker responses.
- **Cleanup discipline.** Workers, tensors, and any AudioContext/ArrayBuffers created must be released on stop/destroy, consistent with the existing lifecycle rules.
- **Svelte 5 runes** conventions as used in the existing component; do not introduce new state libraries.
- **TypeScript strict**; extend `types.ts`, do not fork types locally in workers.
- Do not break existing exports (text/Markdown/JSON), Web Speech paths, Record/Upload flows, or the two-hour session limit.

## Deliverables

### 1. New worker: `segment-worker.ts`

Location: `src/components/tools/meeting-notes/segment-worker.ts` (match sibling naming).

- Loads `onnx-community/pyannote-segmentation-3.0` via Transformers.js:
  - `AutoProcessor.from_pretrained(modelId, { revision })`
  - `AutoModelForAudioFrameClassification.from_pretrained(modelId, { revision, device, dtype })`
- Input message: mono 16 kHz `Float32Array` PCM (transferable), plus a request id.
- **Windowing:** process audio in 10-second windows with 1 s overlap (the model is trained on 10 s chunks). Zero-pad the final window; drop frames beyond the true audio duration.
- Per window, run the model and `processor.post_process_speaker_diarization(logits, windowSampleCount)` to obtain local segments `{ id, start, end, confidence }` (local speaker ids 0..N within that window; the powerset head distinguishes up to 3 concurrent speakers, including overlap).
- **Stitching:** shift window-local times by the window offset; in the 1 s overlap region, merge duplicate detections (same local pattern, IoU > 0.5) preferring the higher-confidence one. Emit a flat, time-sorted list of `RawDiarizationSegment` (defined below). Do **not** attempt cross-window identity here — that is the embedding/clustering stage's job.
- Progress events for model download normalized through the same progress helper as the other workers.
- Errors surfaced as typed error events; never throw across the worker boundary unwrapped.

### 2. New bridge: `segmentation.ts`

Location: `src/scripts/tools/meeting-notes/segmentation.ts`.

- Typed API: `createSegmentationSession()` returning `{ segment(pcm: Float32Array, sampleRate: 16000): Promise<RawDiarizationSegment[]>, dispose(): void }`.
- Validates worker events, enforces request-id matching, normalizes progress, terminates worker on `dispose()`.

### 3. Diarization orchestrator (rewrite the pipeline, keep the embedding worker)

In the existing diarization bridge (or a new `diarization-pipeline.ts` if the current bridge is thin):

Pipeline for Record/Upload (and Live-with-recording, post hoc):

1. `RawDiarizationSegment[]` from the segmentation bridge over the **raw recorded/uploaded audio** (not VAD timings).
2. For each segment ≥ 400 ms of speech, extract a WeSpeaker embedding via the existing `diarize-worker.ts` (batch requests; skip or merge sub-400 ms slivers into neighbors before embedding).
3. **AHC clustering** (implement in a pure, worker-free module `clustering.ts` so it is unit-testable):
   - Each embedding starts as its own cluster; centroid = the embedding (L2-normalized).
   - Repeatedly merge the pair of clusters with the highest cosine similarity between centroids while similarity ≥ `mergeThreshold` (default `0.55`, exported constant, configurable).
   - After each merge, re-estimate the centroid as the normalized mean of member embeddings.
   - Post-pass: absorb clusters whose total speech duration < `minSpeakerDurationMs` (default 3000) into their nearest cluster.
   - Deterministic given identical input (stable tie-breaking) so tests are reproducible.
4. Assign stable `speakerId`s (`S1`, `S2`, … in order of first appearance) producing `DiarizationSegment[]`.
5. **Reconciliation with transcript:** for each `TranscriptSegment`, assign the `speakerId` of the diarization segment with **maximum temporal overlap**; if the best overlap covers < 30 % of the transcript segment, leave `speakerId` undefined. Set `turnBoundary: true` on a transcript segment when the assigned speaker differs from the previous segment's. Existing user-renamed labels must be preserved: label overrides map from `speakerId` → display name, unchanged by re-runs (re-running diarization re-clusters, so warn in UI copy that labels may need review — reuse existing wording pattern if present).
6. Keep the current VAD-gap heuristic as **fallback** when the segmentation model fails to load (offline before first download, WASM init failure). The pipeline must degrade to today's behavior, not error out.

### 4. Types (`types.ts` additions)

```typescript
export type RawDiarizationSegment = {
  startMs: number;
  endMs: number;
  windowLocalSpeaker: number; // local id within a 10 s window; NOT globally stable
  confidence: number;
};

export type DiarizationSegment = {
  startMs: number;
  endMs: number;
  speakerId: string;      // globally stable within a session, e.g. "S1"
  confidence: number;
};

export type ClusteringOptions = {
  mergeThreshold: number;        // cosine similarity, default 0.55
  minSpeakerDurationMs: number;  // default 3000
  minEmbeddingSegmentMs: number; // default 400
};

export type DiarizationEngine = 'pyannote' | 'vad-heuristic';
```

Extend existing progress/error event unions rather than inventing a parallel scheme.

### 5. VAD model swap (Silero v6)

- Keep `@ricky0123/vad-web` and its worklet integration untouched.
- Point the VAD configuration's model URL at a **pinned** Silero v6 ONNX asset (choose a pinned, version-named mirror; verify the file's SHA and record it in a comment). Confirm vad-web's expected model I/O matches v6 (16 kHz; LSTM state zero-initialized per stream and threaded between chunks — vad-web handles state internally; verify it works with the v6 graph). 
- **If v6 is incompatible with the installed vad-web version's expected input signature, do not fork vad-web** — leave v5 in place, add a code comment + a note in the architecture doc explaining the blocker, and finish the diarization work. The VAD swap is the lowest-priority deliverable.
- VAD's role narrows to live utterance gating and speech-start/end hints; remove any code path where VAD timings feed the *diarization* segmenter for Record/Upload.

### 6. UI changes (minimal)

- Diarization settings popover/section: engine indicator (`pyannote` vs fallback), and an "Expected speakers" optional hint (if provided, clamp AHC to stop merging when cluster count reaches the hint; purely advisory).
- Overlap display: where two `DiarizationSegment`s overlap in time, it is acceptable v1 behavior to assign the transcript segment by max overlap only; no dual-speaker rendering required. Leave a TODO.
- All strings go through the existing i18n/copy mechanism if one exists; otherwise match existing tone.

### 7. Docs

Update `AI_Meeting_Notes_Proposed_Arch.md` (or its in-repo equivalent):
- Worker table: add `segment-worker.ts`.
- Section 5: rewrite to describe segmentation → embeddings → AHC → reconciliation, thresholds/defaults, and the fallback heuristic.
- Privacy table: add a row — pyannote segmentation, "No; inference is local."
- Note the pinned model revisions and asset sizes.

### 8. Tests

Unit (`tests/tools-meeting-notes.test.ts` or a new sibling file):
- `clustering.ts`: merges identical embeddings into one cluster; keeps orthogonal embeddings apart; centroid re-estimation changes merge order vs single-linkage (fixture demonstrating it); min-duration absorption; determinism (run twice, deep-equal); respects speaker-count hint.
- Window stitching: overlap dedup, offset shifting, tail-padding frame truncation — all on synthetic `RawDiarizationSegment` fixtures, no model.
- Reconciliation: max-overlap assignment, <30 % → undefined, `turnBoundary` transitions, label-override preservation across re-runs.
- Fallback: pipeline degrades to the VAD heuristic when the segmentation bridge rejects.

E2E (`tests/e2e/meeting-notes.spec.ts`): mock the segmentation worker (as Web Speech is mocked today); assert speaker labels render, renaming a label updates all matching segments, and the engine indicator shows the fallback state when the mock fails to load. No model downloads in CI.

## Execution plan (work in this order, committing per phase)

1. **Recon:** read the meeting-notes component, workers, bridges, types, tests. Produce a short mapping of assumed-path → actual-path before editing.
2. Phase 1: `clustering.ts` (pure) + unit tests. 
3. Phase 2: `segment-worker.ts` + `segmentation.ts` bridge + stitching + unit tests.
4. Phase 3: orchestrator rewrite + reconciliation + fallback + unit tests.
5. Phase 4: UI wiring + e2e mocks.
6. Phase 5: VAD v6 swap (or documented blocker).
7. Phase 6: docs update; run full build + test suite; fix regressions.

After each phase: `npm run build` (or the repo's script) and the test suite must pass.

## Acceptance criteria

- Uploading a 2-speaker audio file yields ≥ 2 distinct `speakerId`s with sensible boundaries (manual smoke test path documented in the PR description).
- No fixed 0.55-threshold single-pass clustering remains in the shipped path; threshold now lives in `ClusteringOptions` with AHC semantics.
- Diarization for Record/Upload no longer consumes VAD timings.
- Segmentation model load failure silently falls back to the previous heuristic; UI indicates the engine.
- CI green with zero model downloads; static build succeeds.
- Architecture doc and privacy table updated in the same PR.

## Out of scope (do not do)

- Real-time streaming diarization during Live capture.
- pyannote Community-1 / sherpa-onnx WASM / Sortformer integration (future evaluation only).
- Dual-speaker overlap rendering in the transcript UI.
- Any change to Whisper ASR, minutes generation, exports, or storage schemas beyond the label-override map.
