import { DIARIZATION_SIMILARITY_THRESHOLD } from './constants.ts';
import type { ClusteringOptions } from './types.ts';

export type EmbeddedSegment = { startMs: number; endMs: number; embedding: Float32Array };

/** Cluster index in order of first appearance (0-based), per input segment. */
export type ClusterAssignment = { startMs: number; endMs: number; speakerIndex: number };

export const DEFAULT_CLUSTERING_OPTIONS: ClusteringOptions = {
  mergeThreshold: DIARIZATION_SIMILARITY_THRESHOLD,
  minSpeakerDurationMs: 3000,
  // WeSpeaker embeddings are unreliable below ~1 s — shorter detections (often overlap-class
  // fragments nested inside a longer utterance) get merged into a neighbor instead of being
  // embedded alone, where their noisy fingerprints caused spurious cross-speaker merges.
  minEmbeddingSegmentMs: 1000,
};

export function cosineSimilarity(a: Float32Array, b: Float32Array): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function l2Normalize(v: Float32Array): Float32Array {
  let norm = 0;
  for (let i = 0; i < v.length; i++) norm += v[i] * v[i];
  norm = Math.sqrt(norm);
  const out = new Float32Array(v.length);
  if (norm === 0) return out;
  for (let i = 0; i < v.length; i++) out[i] = v[i] / norm;
  return out;
}

type Cluster = {
  /** Smallest input index of any member — stable identity used for deterministic tie-breaking. */
  id: number;
  members: number[];
  centroid: Float32Array;
  totalDurationMs: number;
};

function centroidOf(members: number[], embeddings: Float32Array[], durations: number[]): Float32Array {
  // Duration-weighted mean: a long utterance is a far more reliable voice sample than a short
  // fragment, and an unweighted mean lets one noisy 0.5 s sliver drag the centroid as hard as
  // a 6 s utterance (observed to cause cross-speaker merges on real meetings).
  const dim = embeddings[members[0]].length;
  const mean = new Float32Array(dim);
  let totalWeight = 0;
  for (const m of members) {
    const e = embeddings[m];
    const w = Math.max(1, durations[m]);
    totalWeight += w;
    for (let i = 0; i < dim; i++) mean[i] += e[i] * w;
  }
  for (let i = 0; i < dim; i++) mean[i] /= totalWeight;
  return l2Normalize(mean);
}

/**
 * The knee detector only considers cutting where the post-drop merge similarity is already
 * below this ceiling (two clusters this dissimilar are plausibly different voices) and the
 * drop from the previous merge is at least this large (a real gap, not gradual decay).
 */
const KNEE_CEILING = 0.5;
const KNEE_MIN_DROP = 0.1;

function findBestPair(clusters: Cluster[]): { a: number; b: number; sim: number } | null {
  let best: { a: number; b: number; sim: number } | null = null;
  for (let a = 0; a < clusters.length; a++) {
    for (let b = a + 1; b < clusters.length; b++) {
      const sim = cosineSimilarity(clusters[a].centroid, clusters[b].centroid);
      if (
        !best ||
        sim > best.sim ||
        (sim === best.sim &&
          (clusters[a].id < clusters[best.a].id ||
            (clusters[a].id === clusters[best.a].id && clusters[b].id < clusters[best.b].id)))
      ) {
        best = { a, b, sim };
      }
    }
  }
  return best;
}

/** Similarity of each greedy merge, in order, if merging ran all the way down to one cluster. */
function simulateMergeSimilarities(
  clusters: Cluster[],
  embeddings: Float32Array[],
  durations: number[],
): number[] {
  const sims: number[] = [];
  while (clusters.length > 1) {
    const best = findBestPair(clusters)!;
    sims.push(best.sim);
    mergeInto(clusters, best.a, best.b, embeddings, durations);
  }
  return sims;
}

/**
 * How many greedy merges to perform — the most conservative (fewest merges) of:
 * - threshold: stop at the first merge whose similarity falls below `mergeThreshold`;
 * - knee: stop at the largest drop in the merge-similarity sequence (same-voice merges score
 *   high, and the first cross-voice merge shows up as a sharp fall — a fixed threshold alone
 *   cannot serve both clean audio, where same-voice pairs sit ≈0.55+, and noisy audio, where
 *   they degrade toward 0.3);
 * - hint: stop once `speakerCountHint` clusters remain.
 */
function decideMergeBudget(sims: number[], opts: ClusteringOptions, clusterCount: number): number {
  const hintBudget =
    opts.speakerCountHint != null
      ? Math.max(0, clusterCount - Math.max(1, opts.speakerCountHint))
      : sims.length;

  let thresholdBudget = sims.findIndex((s) => s < opts.mergeThreshold);
  if (thresholdBudget === -1) thresholdBudget = sims.length;

  let kneeBudget = sims.length;
  let bestDrop = KNEE_MIN_DROP;
  for (let i = 0; i + 1 < sims.length; i++) {
    const drop = sims[i] - sims[i + 1];
    if (sims[i + 1] < KNEE_CEILING && drop >= bestDrop) {
      bestDrop = drop;
      kneeBudget = i + 1;
    }
  }

  return Math.min(hintBudget, thresholdBudget, kneeBudget);
}

/**
 * Agglomerative hierarchical clustering over speaker embeddings, with duration-weighted
 * centroid re-estimation after every merge (unlike single-linkage, a chain of pairwise-similar
 * embeddings cannot pull two genuinely different voices into one cluster — the merged centroid
 * drifts away from the chain's far end). Deterministic: exact-equal similarities tie-break on
 * the smallest stable cluster id pair, so identical input always yields identical output.
 *
 * The stopping point combines the merge threshold, knee detection over the merge-similarity
 * sequence, and the optional `speakerCountHint` (see decideMergeBudget). The hint never forces
 * merges past `mergeThreshold` — it can only preserve splits, not invent them.
 */
export function clusterEmbeddings(
  segments: EmbeddedSegment[],
  options: Partial<ClusteringOptions> = {},
): ClusterAssignment[] {
  const opts = { ...DEFAULT_CLUSTERING_OPTIONS, ...options };
  if (segments.length === 0) return [];

  const embeddings = segments.map((s) => l2Normalize(s.embedding));
  const durations = segments.map((s) => Math.max(0, s.endMs - s.startMs));

  const makeClusters = (): Cluster[] =>
    segments.map((_, i) => ({
      id: i,
      members: [i],
      centroid: embeddings[i],
      totalDurationMs: durations[i],
    }));

  const mergeSims = simulateMergeSimilarities(makeClusters(), embeddings, durations);
  const budget = decideMergeBudget(mergeSims, opts, segments.length);

  const clusters = makeClusters();
  for (let step = 0; step < budget; step++) {
    const best = findBestPair(clusters)!;
    mergeInto(clusters, best.a, best.b, embeddings, durations);
  }

  // Absorb clusters with too little total speech into their most similar neighbor — a "speaker"
  // heard for under a few seconds is far more likely a mis-clustered fragment than a real person.
  // Smallest first, so two slivers can pool into a real cluster instead of into each other.
  // Never reduces the cluster count below an explicit speakerCountHint — the user said how many
  // speakers there are, so a small cluster may simply be a quiet participant.
  while (clusters.length > Math.max(1, opts.speakerCountHint ?? 1)) {
    let smallest = -1;
    for (let i = 0; i < clusters.length; i++) {
      if (clusters[i].totalDurationMs >= opts.minSpeakerDurationMs) continue;
      if (
        smallest === -1 ||
        clusters[i].totalDurationMs < clusters[smallest].totalDurationMs ||
        (clusters[i].totalDurationMs === clusters[smallest].totalDurationMs &&
          clusters[i].id < clusters[smallest].id)
      ) {
        smallest = i;
      }
    }
    if (smallest === -1) break;
    let nearest = -1;
    let nearestSim = -Infinity;
    for (let i = 0; i < clusters.length; i++) {
      if (i === smallest) continue;
      const sim = cosineSimilarity(clusters[smallest].centroid, clusters[i].centroid);
      if (sim > nearestSim || (sim === nearestSim && clusters[i].id < clusters[nearest].id)) {
        nearest = i;
        nearestSim = sim;
      }
    }
    mergeInto(clusters, Math.min(nearest, smallest), Math.max(nearest, smallest), embeddings, durations);
  }

  // Number clusters by order of first appearance in the input (which callers keep time-sorted).
  const clusterBySegment = new Map<number, Cluster>();
  for (const c of clusters) for (const m of c.members) clusterBySegment.set(m, c);
  const speakerIndexByClusterId = new Map<number, number>();
  const assignments: ClusterAssignment[] = [];
  for (let i = 0; i < segments.length; i++) {
    const c = clusterBySegment.get(i)!;
    if (!speakerIndexByClusterId.has(c.id)) {
      speakerIndexByClusterId.set(c.id, speakerIndexByClusterId.size);
    }
    assignments.push({
      startMs: segments[i].startMs,
      endMs: segments[i].endMs,
      speakerIndex: speakerIndexByClusterId.get(c.id)!,
    });
  }
  return assignments;
}

function mergeInto(
  clusters: Cluster[],
  a: number,
  b: number,
  embeddings: Float32Array[],
  durations: number[],
) {
  const target = clusters[a];
  const source = clusters[b];
  target.id = Math.min(target.id, source.id);
  target.members = [...target.members, ...source.members].sort((x, y) => x - y);
  target.totalDurationMs += source.totalDurationMs;
  target.centroid = centroidOf(target.members, embeddings, durations);
  clusters.splice(b, 1);
}
