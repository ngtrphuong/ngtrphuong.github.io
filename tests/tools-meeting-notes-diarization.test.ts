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
import type { RawDiarizationSegment } from '../src/scripts/tools/meeting-notes/types.ts';

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
  assert.equal(DEFAULT_CLUSTERING_OPTIONS.mergeThreshold, 0.55);
  assert.equal(DEFAULT_CLUSTERING_OPTIONS.minSpeakerDurationMs, 3000);
  assert.equal(DEFAULT_CLUSTERING_OPTIONS.minEmbeddingSegmentMs, 400);
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
