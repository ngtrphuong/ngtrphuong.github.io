/**
 * Tests for the meeting-notes diarization v2 pipeline: AHC clustering (clustering.ts),
 * window stitching (segmentation stitching), and transcript reconciliation.
 * All fixtures are synthetic — no model downloads.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  clusterEmbeddings,
  cosineSimilarity,
  DEFAULT_CLUSTERING_OPTIONS,
  type EmbeddedSegment,
} from '../src/scripts/tools/meeting-notes/clustering.ts';
import {
  planWindows,
  powersetToRawSegments,
  stitchWindows,
} from '../src/scripts/tools/meeting-notes/segmentation-stitching.ts';
import {
  mergeShortSegments,
  reconcileWithTranscript,
  runDiarizationPipeline,
  MIN_RECONCILE_COVERAGE,
  type DiarizationPipelineDeps,
} from '../src/scripts/tools/meeting-notes/diarization.ts';
import { LiveSpeakerTracker } from '../src/scripts/tools/meeting-notes/live-speaker-tracker.ts';
import { VadTurnTracker } from '../src/scripts/tools/meeting-notes/speaker-turns.ts';
import { sileroV6OrtConfig } from '../src/scripts/tools/meeting-notes/vad-v6-adapter.ts';
import type {
  DiarizationSegment,
  RawDiarizationSegment,
  TranscriptSegment,
} from '../src/scripts/tools/meeting-notes/types.ts';

const vec = (...v: number[]) => Float32Array.from(v);

const emb = (startMs: number, endMs: number, embedding: Float32Array): EmbeddedSegment => ({
  startMs,
  endMs,
  embedding,
});

// Wide-apart durations so the min-duration absorption pass stays inert unless a test wants it.
const LONG = 10_000;

test('clusterEmbeddings: empty input yields empty output', () => {
  assert.deepEqual(clusterEmbeddings([]), []);
});

test('clusterEmbeddings: identical embeddings merge into one cluster', () => {
  const result = clusterEmbeddings([
    emb(0, LONG, vec(1, 0, 0)),
    emb(LONG, 2 * LONG, vec(1, 0, 0)),
    emb(2 * LONG, 3 * LONG, vec(1, 0, 0)),
  ]);
  assert.deepEqual(result.map((r) => r.speakerIndex), [0, 0, 0]);
});

test('clusterEmbeddings: orthogonal embeddings stay separate', () => {
  const result = clusterEmbeddings([
    emb(0, LONG, vec(1, 0, 0)),
    emb(LONG, 2 * LONG, vec(0, 1, 0)),
    emb(2 * LONG, 3 * LONG, vec(0, 0, 1)),
  ]);
  assert.deepEqual(result.map((r) => r.speakerIndex), [0, 1, 2]);
});

test('clusterEmbeddings: speaker indices follow order of first appearance', () => {
  const a = vec(1, 0);
  const b = vec(0, 1);
  const result = clusterEmbeddings([
    emb(0, LONG, b),
    emb(LONG, 2 * LONG, a),
    emb(2 * LONG, 3 * LONG, b),
  ]);
  assert.deepEqual(result.map((r) => r.speakerIndex), [0, 1, 0]);
});

test('clusterEmbeddings: centroid re-estimation resists chaining (differs from single-linkage)', () => {
  // a–b are similar (0.80) and b–c are similar (~0.75), but a–c are not (0.20).
  // Single-linkage would chain all three into one cluster (max pairwise link 0.75 ≥ 0.6).
  // Centroid AHC merges a+b first, and the merged centroid's similarity to c drops to ~0.50,
  // below the 0.6 threshold — so c stays a separate speaker.
  const a = vec(1, 0);
  const b = vec(0.8, 0.6);
  const c = vec(0.2, 0.9798);
  assert.ok(cosineSimilarity(b, c) > 0.6, 'fixture: b–c must be above threshold');
  assert.ok(cosineSimilarity(a, c) < 0.6, 'fixture: a–c must be below threshold');

  const result = clusterEmbeddings(
    [emb(0, LONG, a), emb(LONG, 2 * LONG, b), emb(2 * LONG, 3 * LONG, c)],
    { mergeThreshold: 0.6 },
  );
  assert.deepEqual(result.map((r) => r.speakerIndex), [0, 0, 1]);
});

test('clusterEmbeddings: short-duration cluster is absorbed into its nearest neighbor', () => {
  // Orthogonal voice, but only 500 ms of speech — treated as a mis-clustered fragment.
  const result = clusterEmbeddings([
    emb(0, LONG, vec(1, 0)),
    emb(LONG, LONG + 500, vec(0, 1)),
    emb(2 * LONG, 3 * LONG, vec(1, 0)),
  ]);
  assert.deepEqual(result.map((r) => r.speakerIndex), [0, 0, 0]);
});

test('clusterEmbeddings: min-duration absorption can be disabled', () => {
  const result = clusterEmbeddings(
    [emb(0, LONG, vec(1, 0)), emb(LONG, LONG + 500, vec(0, 1))],
    { minSpeakerDurationMs: 0 },
  );
  assert.deepEqual(result.map((r) => r.speakerIndex), [0, 1]);
});

test('clusterEmbeddings: speakerCountHint stops merging early', () => {
  // All three pairwise similarities are above the threshold, so unhinted AHC would merge to 1.
  const a = vec(1, 0);
  const b = vec(0.95, 0.3122);
  const c = vec(0.9, 0.4359);
  const unhinted = clusterEmbeddings([emb(0, LONG, a), emb(LONG, 2 * LONG, b), emb(2 * LONG, 3 * LONG, c)]);
  assert.deepEqual(unhinted.map((r) => r.speakerIndex), [0, 0, 0]);

  const hinted = clusterEmbeddings(
    [emb(0, LONG, a), emb(LONG, 2 * LONG, b), emb(2 * LONG, 3 * LONG, c)],
    { speakerCountHint: 2 },
  );
  assert.equal(new Set(hinted.map((r) => r.speakerIndex)).size, 2);
});

test('clusterEmbeddings: speakerCountHint never forces merges below the threshold', () => {
  const result = clusterEmbeddings(
    [emb(0, LONG, vec(1, 0)), emb(LONG, 2 * LONG, vec(0, 1))],
    { speakerCountHint: 1 },
  );
  assert.deepEqual(result.map((r) => r.speakerIndex), [0, 1]);
});

test('clusterEmbeddings: deterministic — identical input, identical output, input untouched', () => {
  const build = () => [
    emb(0, LONG, vec(1, 0, 0)),
    emb(LONG, 2 * LONG, vec(0.9, 0.4359, 0)),
    emb(2 * LONG, 3 * LONG, vec(0, 1, 0)),
    emb(3 * LONG, 4 * LONG, vec(0, 0.9, 0.4359)),
    // Exact duplicates create similarity ties that must break deterministically.
    emb(4 * LONG, 5 * LONG, vec(1, 0, 0)),
    emb(5 * LONG, 6 * LONG, vec(0, 1, 0)),
  ];
  const input = build();
  const first = clusterEmbeddings(input);
  const second = clusterEmbeddings(build());
  assert.deepEqual(first, second);
  // Inputs must not be mutated (embeddings are normalized on copies).
  assert.deepEqual(input.map((s) => Array.from(s.embedding)), build().map((s) => Array.from(s.embedding)));
});

test('DEFAULT_CLUSTERING_OPTIONS: sane defaults', () => {
  // Matches the reference pyannote-3.1 pipeline's tuned AHC threshold for this exact
  // segmentation+embedding model pair (cosine distance 0.7046 → similarity ≈ 0.2954).
  // Anything much stricter over-splits real-world audio into one speaker per utterance.
  assert.ok(Math.abs(DEFAULT_CLUSTERING_OPTIONS.mergeThreshold - 0.2954) < 0.001);
  assert.equal(DEFAULT_CLUSTERING_OPTIONS.minSpeakerDurationMs, 3000);
  assert.equal(DEFAULT_CLUSTERING_OPTIONS.minEmbeddingSegmentMs, 1000);
});

test('clusterEmbeddings: speakerCountHint also floors the min-duration absorption pass', () => {
  // Two clearly distinct voices, one of them brief — with a hint of 2, the short cluster must
  // NOT be absorbed away (a quiet participant is still a participant).
  const segs = [emb(0, LONG, vec(1, 0)), emb(LONG, LONG + 1500, vec(0, 1))];
  const unhinted = clusterEmbeddings(segs);
  assert.equal(new Set(unhinted.map((r) => r.speakerIndex)).size, 1);
  const hinted = clusterEmbeddings(segs, { speakerCountHint: 2 });
  assert.equal(new Set(hinted.map((r) => r.speakerIndex)).size, 2);
});

test('clusterEmbeddings: knee detection stops cross-voice merges the threshold would allow', () => {
  // Two tight voice clusters whose cross-centroid similarity (~0.40) is above the default
  // merge threshold (~0.295) — a pure threshold cut would merge everyone into one speaker.
  // The sharp drop in the merge-similarity sequence (same-voice ≈0.95+ → cross ≈0.40) is a
  // knee, and the cut must land there instead.
  const result = clusterEmbeddings([
    emb(0, LONG, vec(1, 0)),
    emb(LONG, 2 * LONG, vec(0.995, 0.0998)),
    emb(2 * LONG, 3 * LONG, vec(0.2, 0.9798)),
    emb(3 * LONG, 4 * LONG, vec(0.25, 0.9682)),
  ]);
  assert.deepEqual(result.map((r) => r.speakerIndex), [0, 0, 1, 1]);
});

test('clusterEmbeddings: centroids are duration-weighted', () => {
  // Voice A: one long utterance at (1,0) plus one short noisy sliver leaning toward B.
  // With duration weighting the A centroid stays near (1,0), so a later pure-A utterance joins
  // it; with unweighted averaging the sliver would drag the centroid toward B.
  const a1 = emb(0, 10_000, vec(1, 0));
  const noisy = emb(10_000, 10_400, vec(0.45, 0.893)); // 400 ms sliver, mostly "B"-like
  const a2 = emb(20_000, 30_000, vec(0.995, 0.0998));
  const b = emb(40_000, 50_000, vec(0, 1));
  const result = clusterEmbeddings([a1, noisy, a2, b], {
    mergeThreshold: 0.6,
    minSpeakerDurationMs: 0,
    minEmbeddingSegmentMs: 0,
  });
  assert.equal(result[0].speakerIndex, result[2].speakerIndex, 'pure A utterances stay together');
  assert.notEqual(result[0].speakerIndex, result[3].speakerIndex, 'B stays separate');
});

// --- Window planning / powerset mapping / stitching (segmentation-stitching.ts) ---

const SR = 16000;

test('planWindows: 25 s of audio → three 10 s windows with 1 s overlap', () => {
  const windows = planWindows(25 * SR, SR);
  assert.deepEqual(windows, [
    { startSample: 0, endSample: 10 * SR, offsetMs: 0 },
    { startSample: 9 * SR, endSample: 19 * SR, offsetMs: 9000 },
    { startSample: 18 * SR, endSample: 25 * SR, offsetMs: 18000 },
  ]);
});

test('planWindows: audio shorter than one window → single unpadded window', () => {
  assert.deepEqual(planWindows(5 * SR, SR), [{ startSample: 0, endSample: 5 * SR, offsetMs: 0 }]);
});

test('planWindows: empty audio → no windows', () => {
  assert.deepEqual(planWindows(0, SR), []);
});

test('powersetToRawSegments: skips NO_SPEAKER, maps single classes, splits overlap classes', () => {
  const raw = powersetToRawSegments(
    [
      { id: 0, start: 0, end: 1, confidence: 0.9 },
      { id: 2, start: 1, end: 3, confidence: 0.8 },
      { id: 4, start: 3, end: 4, confidence: 0.7 },
    ],
    0,
    60_000,
  );
  assert.deepEqual(raw, [
    { startMs: 1000, endMs: 3000, windowLocalSpeaker: 1, confidence: 0.8 },
    { startMs: 3000, endMs: 4000, windowLocalSpeaker: 0, confidence: 0.7 },
    { startMs: 3000, endMs: 4000, windowLocalSpeaker: 1, confidence: 0.7 },
  ]);
});

test('powersetToRawSegments: shifts by window offset', () => {
  const raw = powersetToRawSegments([{ id: 1, start: 2, end: 4, confidence: 0.9 }], 9000, 60_000);
  assert.deepEqual(raw, [{ startMs: 11_000, endMs: 13_000, windowLocalSpeaker: 0, confidence: 0.9 }]);
});

test('powersetToRawSegments: truncates detections inside tail zero-padding', () => {
  // True audio ends at 21.5 s; the padded final window can "detect" speech past that.
  const raw = powersetToRawSegments(
    [
      { id: 1, start: 1, end: 5, confidence: 0.9 }, // 19–23 s → clamped at 21.5 s
      { id: 2, start: 6, end: 8, confidence: 0.8 }, // 24–26 s → entirely padding, dropped
    ],
    18_000,
    21_500,
  );
  assert.deepEqual(raw, [{ startMs: 19_000, endMs: 21_500, windowLocalSpeaker: 0, confidence: 0.9 }]);
});

test('stitchWindows: deduplicates overlap-region detections, preferring higher confidence', () => {
  const w0: RawDiarizationSegment[] = [
    { startMs: 2000, endMs: 5000, windowLocalSpeaker: 0, confidence: 0.9 },
    { startMs: 8500, endMs: 9800, windowLocalSpeaker: 1, confidence: 0.6 },
  ];
  const w1: RawDiarizationSegment[] = [
    { startMs: 8600, endMs: 9900, windowLocalSpeaker: 0, confidence: 0.8 }, // IoU ≈ 0.86 with w0's
    { startMs: 12_000, endMs: 14_000, windowLocalSpeaker: 1, confidence: 0.7 },
  ];
  const stitched = stitchWindows([w0, w1]);
  assert.deepEqual(stitched, [
    { startMs: 2000, endMs: 5000, windowLocalSpeaker: 0, confidence: 0.9 },
    { startMs: 8600, endMs: 9900, windowLocalSpeaker: 0, confidence: 0.8 },
    { startMs: 12_000, endMs: 14_000, windowLocalSpeaker: 1, confidence: 0.7 },
  ]);
});

test('stitchWindows: keeps lower-IoU neighbors as distinct segments', () => {
  const stitched = stitchWindows([
    [{ startMs: 8000, endMs: 9000, windowLocalSpeaker: 0, confidence: 0.9 }],
    [{ startMs: 8800, endMs: 12_000, windowLocalSpeaker: 0, confidence: 0.9 }], // IoU 0.05
  ]);
  assert.equal(stitched.length, 2);
});

test('stitchWindows: output is time-sorted', () => {
  const stitched = stitchWindows([
    [{ startMs: 5000, endMs: 6000, windowLocalSpeaker: 1, confidence: 0.5 }],
    [
      { startMs: 12_000, endMs: 13_000, windowLocalSpeaker: 0, confidence: 0.5 },
      { startMs: 9000, endMs: 9500, windowLocalSpeaker: 0, confidence: 0.5 },
    ],
  ]);
  assert.deepEqual(stitched.map((s) => s.startMs), [5000, 9000, 12_000]);
});

// --- Sliver merging, reconciliation, and the full pipeline (diarization.ts) ---

const rawSeg = (startMs: number, endMs: number, confidence = 1): RawDiarizationSegment => ({
  startMs,
  endMs,
  windowLocalSpeaker: 0,
  confidence,
});

const tSeg = (over: Partial<TranscriptSegment> & { id: string }): TranscriptSegment => ({
  startMs: 0,
  endMs: 1000,
  text: 'hello',
  isFinal: true,
  source: 'whisper',
  ...over,
});

test('mergeShortSegments: sliver merges into the preceding segment', () => {
  const merged = mergeShortSegments([rawSeg(0, 2000), rawSeg(2100, 2300), rawSeg(5000, 8000)], 400);
  assert.deepEqual(merged.map((s) => [s.startMs, s.endMs]), [[0, 2300], [5000, 8000]]);
});

test('mergeShortSegments: leading sliver attaches forward to the first long segment', () => {
  const merged = mergeShortSegments([rawSeg(0, 200), rawSeg(1000, 4000)], 400);
  assert.deepEqual(merged.map((s) => [s.startMs, s.endMs]), [[0, 4000]]);
});

test('mergeShortSegments: only slivers in input → kept as-is', () => {
  const merged = mergeShortSegments([rawSeg(0, 200), rawSeg(500, 650)], 400);
  assert.equal(merged.length, 2);
});

test('reconcileWithTranscript: assigns speaker by greatest overlap', () => {
  const diarization: DiarizationSegment[] = [
    { startMs: 0, endMs: 1200, speakerId: 'Speaker 1', confidence: 1 },
    { startMs: 4900, endMs: 6100, speakerId: 'Speaker 2', confidence: 1 },
  ];
  const result = reconcileWithTranscript(
    [tSeg({ id: 'a', startMs: 0, endMs: 1000, speakerId: 'old-guess' }), tSeg({ id: 'b', startMs: 5000, endMs: 6000 })],
    diarization,
  );
  assert.equal(result[0].speakerId, 'Speaker 1');
  assert.equal(result[1].speakerId, 'Speaker 2');
});

test('reconcileWithTranscript: below-coverage overlap leaves existing speakerId untouched', () => {
  // 200 ms overlap on a 2000 ms segment = 10% coverage < 30% threshold.
  const diarization: DiarizationSegment[] = [{ startMs: 0, endMs: 200, speakerId: 'Speaker 2', confidence: 1 }];
  const result = reconcileWithTranscript(
    [
      tSeg({ id: 'kept', startMs: 0, endMs: 2000, speakerId: 'Speaker 9' }),
      tSeg({ id: 'unset', startMs: 3000, endMs: 4000 }),
    ],
    diarization,
  );
  assert.equal(result[0].speakerId, 'Speaker 9');
  assert.equal(result[1].speakerId, undefined);
});

test('reconcileWithTranscript: turnBoundary marks speaker transitions', () => {
  const diarization: DiarizationSegment[] = [
    { startMs: 0, endMs: 2000, speakerId: 'Speaker 1', confidence: 1 },
    { startMs: 2000, endMs: 4000, speakerId: 'Speaker 2', confidence: 1 },
  ];
  const result = reconcileWithTranscript(
    [
      tSeg({ id: 'a', startMs: 0, endMs: 1000 }),
      tSeg({ id: 'b', startMs: 1000, endMs: 2000 }),
      tSeg({ id: 'c', startMs: 2200, endMs: 3200 }),
    ],
    diarization,
  );
  assert.deepEqual(result.map((r) => r.turnBoundary), [true, false, true]);
});

test('MIN_RECONCILE_COVERAGE is 30%', () => {
  assert.equal(MIN_RECONCILE_COVERAGE, 0.3);
});

// Pipeline tests: two distinguishable "voices" injected via a mock embedder keyed on which
// half of the (synthetic) audio the slice came from.
const SAMPLE_RATE = 16_000;

function makeDeps(over: Partial<DiarizationPipelineDeps> = {}): DiarizationPipelineDeps & {
  calls: { segment: number; detectSpeech: number; embed: Float32Array[] };
} {
  const calls = { segment: 0, detectSpeech: 0, embed: [] as Float32Array[] };
  return {
    calls,
    segment: async () => {
      calls.segment += 1;
      return [rawSeg(0, 2000, 0.9), rawSeg(3000, 5000, 0.8), rawSeg(6000, 8000, 0.85)];
    },
    detectSpeech: async () => {
      calls.detectSpeech += 1;
      return [
        { startMs: 0, endMs: 2000 },
        { startMs: 6000, endMs: 8000 },
      ];
    },
    embed: async (slice: Float32Array) => {
      calls.embed.push(slice);
      // Voice A for slices whose first sample is 1, voice B for first sample 2.
      return slice[0] === 1 ? Float32Array.from([1, 0]) : Float32Array.from([0, 1]);
    },
    ...over,
  };
}

/** 10 s of audio where 0–2.5 s is "voice A" (value 1) and the rest "voice B" (value 2). */
function makeSamples(): Float32Array {
  const samples = new Float32Array(10 * SAMPLE_RATE);
  samples.fill(1, 0, 2.5 * SAMPLE_RATE);
  samples.fill(2, 2.5 * SAMPLE_RATE);
  return samples;
}

test('runDiarizationPipeline: pyannote path clusters two voices and reconciles the transcript', async () => {
  const deps = makeDeps();
  const transcript = [
    tSeg({ id: 'a', startMs: 100, endMs: 1900 }),
    tSeg({ id: 'b', startMs: 3100, endMs: 4900 }),
    tSeg({ id: 'c', startMs: 6100, endMs: 7900 }),
  ];
  const result = await runDiarizationPipeline(makeSamples(), SAMPLE_RATE, transcript, deps, {
    minSpeakerDurationMs: 0,
  });

  assert.equal(result.engine, 'pyannote');
  assert.equal(deps.calls.detectSpeech, 0);
  assert.equal(result.speakerCount, 2);
  assert.equal(result.utteranceCount, 3);
  assert.equal(result.transcript[0].speakerId, 'Speaker 1');
  assert.equal(result.transcript[1].speakerId, 'Speaker 2');
  assert.equal(result.transcript[2].speakerId, 'Speaker 2');
  // Embeds received the PCM slices matching each utterance's time range.
  assert.equal(deps.calls.embed.length, 3);
  assert.equal(deps.calls.embed[0].length, 2 * SAMPLE_RATE);
});

test('runDiarizationPipeline: falls back to VAD intervals when segmentation rejects', async () => {
  const deps = makeDeps({
    segment: async () => {
      throw new Error('model failed to load');
    },
  });
  const result = await runDiarizationPipeline(
    makeSamples(),
    SAMPLE_RATE,
    [tSeg({ id: 'a', startMs: 100, endMs: 1900 })],
    deps,
    { minSpeakerDurationMs: 0 },
  );
  assert.equal(result.engine, 'vad-heuristic');
  assert.equal(deps.calls.detectSpeech, 1);
  assert.equal(result.speakerCount, 2);
  assert.equal(result.transcript[0].speakerId, 'Speaker 1');
});

test('runDiarizationPipeline: no speech found → empty result, transcript unchanged', async () => {
  const deps = makeDeps({ segment: async () => [] });
  const transcript = [tSeg({ id: 'a', speakerId: 'Speaker 3' })];
  const result = await runDiarizationPipeline(makeSamples(), SAMPLE_RATE, transcript, deps);
  assert.equal(result.speakerCount, 0);
  assert.equal(result.utteranceCount, 0);
  assert.deepEqual(result.transcript, transcript);
});

// --- Live voice-based speaker labeling (live-speaker-tracker.ts) ---

test('LiveSpeakerTracker: a returning voice reuses its label instead of minting a new one', () => {
  const tracker = new LiveSpeakerTracker(0.3);
  // A, A, B, A, B — the old pause heuristic would have produced 5 distinct speakers here.
  tracker.add(0, vec(1, 0), 5000);
  tracker.add(1, vec(0.95, 0.3122), 5000);
  tracker.add(2, vec(0, 1), 5000);
  tracker.add(3, vec(1, 0), 5000);
  const map = tracker.add(4, vec(0.05, 1), 5000);
  assert.equal(map.get(0), map.get(1));
  assert.equal(map.get(0), map.get(3));
  assert.equal(map.get(2), map.get(4));
  assert.notEqual(map.get(0), map.get(2));
  assert.equal(tracker.speakerCount, 2);
});

test('LiveSpeakerTracker: re-clustering corrects an earlier label (map is re-applied)', () => {
  // Two similar-ish voices: greedy first-come assignment could bind them together, but once
  // enough utterances accumulate the knee re-cluster separates them — including interval 0.
  const tracker = new LiveSpeakerTracker();
  tracker.add(0, vec(1, 0), 5000);
  tracker.add(1, vec(0.2, 0.9798), 5000); // sim to A ≈ 0.2 < threshold… distinct
  tracker.add(2, vec(0.995, 0.0998), 5000);
  const map = tracker.add(3, vec(0.25, 0.9682), 5000);
  assert.equal(map.get(0), map.get(2));
  assert.equal(map.get(1), map.get(3));
  assert.notEqual(map.get(0), map.get(1));
});

test('LiveSpeakerTracker: labelForInterval is null until the embedding resolves', () => {
  const tracker = new LiveSpeakerTracker(0.3);
  assert.equal(tracker.labelForInterval(0), null);
  tracker.add(0, vec(1, 0), 5000);
  assert.equal(tracker.labelForInterval(0), 'Speaker 1');
});

test('LiveSpeakerTracker: short utterances may join but never found a new speaker', () => {
  const tracker = new LiveSpeakerTracker(0.3);
  tracker.add(0, vec(1, 0), 5000);
  // 500 ms utterance of a very different voice — attaches to the nearest existing speaker
  // instead of founding "Speaker 2".
  const map = tracker.add(1, vec(0, 1), 500);
  assert.equal(map.get(1), 'Speaker 1');
  assert.equal(tracker.speakerCount, 1);
});

test('LiveSpeakerTracker: labelOffset continues numbering after existing speakers', () => {
  const tracker = new LiveSpeakerTracker(0.3, 2);
  const first = tracker.add(0, vec(1, 0), 5000);
  assert.equal(first.get(0), 'Speaker 3');
  const second = tracker.add(1, vec(0, 1), 5000);
  assert.equal(second.get(1), 'Speaker 4');
});

// --- Silero v6 rolling-context adapter (vad-v6-adapter.ts) ---

type FakeTensor = { type: string; data: Float32Array; dims: number[] };

function makeFakeOrt() {
  const calls: Record<string, FakeTensor>[] = [];
  class Tensor {
    type: string;
    data: Float32Array;
    dims: number[];
    constructor(type: string, data: Float32Array, dims: number[]) {
      this.type = type;
      this.data = data;
      this.dims = dims;
    }
  }
  const ort = {
    Tensor,
    InferenceSession: {
      create: async () => ({
        run: async (inputs: Record<string, FakeTensor>) => {
          calls.push(inputs);
          return { output: { data: [0.5] }, stateN: {} };
        },
      }),
    },
  };
  return { ort, calls };
}

const tensor = (data: Float32Array, dims: number[]): FakeTensor => ({ type: 'float32', data, dims });
const zeroState = () => tensor(new Float32Array(256), [2, 1, 128]);
const liveState = () => {
  const s = new Float32Array(256);
  s[0] = 0.7;
  return tensor(s, [2, 1, 128]);
};

test('sileroV6OrtConfig: extends [1,512] frames with a rolling 64-sample context', async () => {
  const { ort, calls } = makeFakeOrt();
  sileroV6OrtConfig(ort);
  const session = (await ort.InferenceSession.create()) as {
    run: (i: Record<string, FakeTensor>) => Promise<unknown>;
  };

  const frame1 = new Float32Array(512).fill(1);
  await session.run({ input: tensor(frame1, [1, 512]), state: zeroState() });
  assert.deepEqual(calls[0].input.dims, [1, 576]);
  assert.equal(calls[0].input.data.length, 576);
  // First frame: zero context prepended.
  assert.ok(calls[0].input.data.subarray(0, 64).every((v) => v === 0));
  assert.ok(calls[0].input.data.subarray(64).every((v) => v === 1));

  // Second frame: context must be the previous frame's last 64 samples (all ones).
  const frame2 = new Float32Array(512).fill(2);
  await session.run({ input: tensor(frame2, [1, 512]), state: liveState() });
  assert.ok(calls[1].input.data.subarray(0, 64).every((v) => v === 1));
  assert.ok(calls[1].input.data.subarray(64).every((v) => v === 2));
});

test('sileroV6OrtConfig: an all-zero state resets the rolling context', async () => {
  const { ort, calls } = makeFakeOrt();
  sileroV6OrtConfig(ort);
  const session = (await ort.InferenceSession.create()) as {
    run: (i: Record<string, FakeTensor>) => Promise<unknown>;
  };
  await session.run({ input: tensor(new Float32Array(512).fill(3), [1, 512]), state: zeroState() });
  // New stream: zero state again — context from frame 1 must NOT leak in.
  await session.run({ input: tensor(new Float32Array(512).fill(4), [1, 512]), state: zeroState() });
  assert.ok(calls[1].input.data.subarray(0, 64).every((v) => v === 0));
});

test('sileroV6OrtConfig: passes through non-silero run calls untouched', async () => {
  const { ort, calls } = makeFakeOrt();
  sileroV6OrtConfig(ort);
  const session = (await ort.InferenceSession.create()) as {
    run: (i: Record<string, FakeTensor>) => Promise<unknown>;
  };
  const odd = tensor(new Float32Array(100), [1, 100]);
  await session.run({ input: odd, state: liveState() });
  assert.equal(calls[0].input, odd);
});

test('sileroV6OrtConfig: applying twice does not double-wrap', async () => {
  const { ort, calls } = makeFakeOrt();
  sileroV6OrtConfig(ort);
  sileroV6OrtConfig(ort);
  const session = (await ort.InferenceSession.create()) as {
    run: (i: Record<string, FakeTensor>) => Promise<unknown>;
  };
  await session.run({ input: tensor(new Float32Array(512), [1, 512]), state: zeroState() });
  assert.deepEqual(calls[0].input.dims, [1, 576]); // 576, not 640
});

test('VadTurnTracker: speechEnd returns the closed interval index, intervalFor maps timestamps', () => {
  const tracker = new VadTurnTracker();
  tracker.speechStart(0);
  assert.equal(tracker.speechEnd(1000), 0);
  tracker.speechStart(3000);
  assert.equal(tracker.speechEnd(4500), 1);
  assert.equal(tracker.intervalFor(500), 0);
  assert.equal(tracker.intervalFor(3600), 1);
  // Unclosed/misfired speech produces no interval.
  tracker.speechStart(6000);
  tracker.misfire();
  assert.equal(tracker.speechEnd(7000), null);
});

test('runDiarizationPipeline: re-runs are deterministic (stable speaker ids for overrides)', async () => {
  const transcript = [tSeg({ id: 'a', startMs: 100, endMs: 1900 })];
  const first = await runDiarizationPipeline(makeSamples(), SAMPLE_RATE, transcript, makeDeps(), {
    minSpeakerDurationMs: 0,
  });
  const second = await runDiarizationPipeline(makeSamples(), SAMPLE_RATE, transcript, makeDeps(), {
    minSpeakerDurationMs: 0,
  });
  assert.deepEqual(first.diarization, second.diarization);
  assert.deepEqual(first.transcript, second.transcript);
});
