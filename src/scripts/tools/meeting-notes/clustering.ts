import { DIARIZATION_SIMILARITY_THRESHOLD } from './constants.ts';
import type { ClusteringOptions } from './types.ts';

export type EmbeddedSegment = { startMs: number; endMs: number; embedding: Float32Array };

/** Cluster index in order of first appearance (0-based), per input segment. */
export type ClusterAssignment = { startMs: number; endMs: number; speakerIndex: number };

export const DEFAULT_CLUSTERING_OPTIONS: ClusteringOptions = {
  mergeThreshold: DIARIZATION_SIMILARITY_THRESHOLD,
  minSpeakerDurationMs: 3000,
  minEmbeddingSegmentMs: 400,
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

function centroidOf(members: number[], embeddings: Float32Array[]): Float32Array {
  const dim = embeddings[members[0]].length;
  const mean = new Float32Array(dim);
  for (const m of members) {
    const e = embeddings[m];
    for (let i = 0; i < dim; i++) mean[i] += e[i];
  }
  for (let i = 0; i < dim; i++) mean[i] /= members.length;
  return l2Normalize(mean);
}

/**
 * Agglomerative hierarchical clustering over speaker embeddings, with centroid re-estimation
 * after every merge (unlike single-linkage, a chain of pairwise-similar embeddings cannot pull
 * two genuinely different voices into one cluster — the merged centroid drifts away from the
 * chain's far end). Deterministic: exact-equal similarities tie-break on the smallest stable
 * cluster id pair, so identical input always yields identical output.
 *
 * `speakerCountHint`, when set, stops merging once that many clusters remain — it never forces
 * merges past `mergeThreshold`, so it can only preserve splits, not invent them.
 */
export function clusterEmbeddings(
  segments: EmbeddedSegment[],
  options: Partial<ClusteringOptions> = {},
): ClusterAssignment[] {
  const opts = { ...DEFAULT_CLUSTERING_OPTIONS, ...options };
  if (segments.length === 0) return [];

  const embeddings = segments.map((s) => l2Normalize(s.embedding));
  const durations = segments.map((s) => Math.max(0, s.endMs - s.startMs));

  let clusters: Cluster[] = segments.map((_, i) => ({
    id: i,
    members: [i],
    centroid: embeddings[i],
    totalDurationMs: durations[i],
  }));

  const minClusters = Math.max(1, opts.speakerCountHint ?? 1);

  while (clusters.length > minClusters) {
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
    if (!best || best.sim < opts.mergeThreshold) break;
    mergeInto(clusters, best.a, best.b, embeddings);
  }

  // Absorb clusters with too little total speech into their most similar neighbor — a "speaker"
  // heard for under a few seconds is far more likely a mis-clustered fragment than a real person.
  // Smallest first, so two slivers can pool into a real cluster instead of into each other.
  while (clusters.length > 1) {
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
    mergeInto(clusters, Math.min(nearest, smallest), Math.max(nearest, smallest), embeddings);
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

function mergeInto(clusters: Cluster[], a: number, b: number, embeddings: Float32Array[]) {
  const target = clusters[a];
  const source = clusters[b];
  target.id = Math.min(target.id, source.id);
  target.members = [...target.members, ...source.members].sort((x, y) => x - y);
  target.totalDurationMs += source.totalDurationMs;
  target.centroid = centroidOf(target.members, embeddings);
  clusters.splice(b, 1);
}
