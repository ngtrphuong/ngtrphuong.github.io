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
