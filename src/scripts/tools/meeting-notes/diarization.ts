import { DIARIZATION_SIMILARITY_THRESHOLD } from './constants.ts';
import { defaultSpeakerLabel } from './speaker-turns.ts';
import type { TranscriptSegment } from './types.ts';

export type SpeakerEmbedding = { startMs: number; endMs: number; embedding: Float32Array };
export type ClusteredUtterance = { startMs: number; endMs: number; speakerId: string };

function cosineSimilarity(a: Float32Array, b: Float32Array): number {
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

/**
 * Greedy online clustering: assign each utterance's speaker embedding to the most similar
 * existing speaker centroid (cosine similarity), or start a new speaker cluster if none are
 * similar enough. This is a real, voice-based clustering (unlike the silence-gap heuristic in
 * speaker-turns.ts) — a full agglomerative pass that revisits earlier assignments would be more
 * accurate, but this greedy single-pass approach is cheap, simple, and works well when speakers
 * don't change mid-utterance.
 */
export function clusterSpeakers(
  utterances: SpeakerEmbedding[],
  threshold = DIARIZATION_SIMILARITY_THRESHOLD,
): ClusteredUtterance[] {
  const centroids: { embedding: Float32Array; count: number; speakerId: string }[] = [];
  const results: ClusteredUtterance[] = [];

  for (const u of utterances) {
    let best: { idx: number; sim: number } | null = null;
    for (let i = 0; i < centroids.length; i++) {
      const sim = cosineSimilarity(u.embedding, centroids[i].embedding);
      if (!best || sim > best.sim) best = { idx: i, sim };
    }

    if (best && best.sim >= threshold) {
      const c = centroids[best.idx];
      const n = c.count + 1;
      for (let i = 0; i < c.embedding.length; i++) {
        c.embedding[i] = (c.embedding[i] * c.count + u.embedding[i]) / n;
      }
      c.count = n;
      results.push({ startMs: u.startMs, endMs: u.endMs, speakerId: c.speakerId });
    } else {
      const speakerId = defaultSpeakerLabel(centroids.length);
      centroids.push({ embedding: Float32Array.from(u.embedding), count: 1, speakerId });
      results.push({ startMs: u.startMs, endMs: u.endMs, speakerId });
    }
  }

  return results;
}

/**
 * Assigns each transcript segment the speakerId of the clustered utterance it overlaps most with
 * (by time). Segments with no overlapping utterance keep their existing speakerId untouched.
 */
export function reconcileWithTranscript(
  segments: TranscriptSegment[],
  clustered: ClusteredUtterance[],
): TranscriptSegment[] {
  return segments.map((seg) => {
    let best: { idx: number; overlap: number } | null = null;
    for (let i = 0; i < clustered.length; i++) {
      const c = clustered[i];
      const overlap = Math.min(seg.endMs, c.endMs) - Math.max(seg.startMs, c.startMs);
      if (overlap > 0 && (!best || overlap > best.overlap)) best = { idx: i, overlap };
    }
    return best ? { ...seg, speakerId: clustered[best.idx].speakerId } : seg;
  });
}
