import { clusterEmbeddings, cosineSimilarity, type EmbeddedSegment } from './clustering.ts';
import { DIARIZATION_SIMILARITY_THRESHOLD } from './constants.ts';
import { defaultSpeakerLabel } from './speaker-turns.ts';

/**
 * Voice-based speaker labels for live captions. Each VAD-detected utterance's WeSpeaker
 * embedding is recorded, and the whole set is re-clustered with the same knee-detecting AHC the
 * batch "Identify speakers" pass uses (clustering.ts) — so live labels converge to batch quality
 * as the meeting progresses, instead of a greedy first-come assignment that can never revisit an
 * early mistake. The UI patches earlier lines whenever a re-cluster changes their label.
 *
 * This is what stops live speaker numbers from growing forever: a returning voice re-attaches
 * to its existing label (the old pause-only heuristic had no identity signal at all, so it could
 * only count upward).
 *
 * Cost control: full re-clustering is O(n³) in utterance count, so beyond RECLUSTER_MAX
 * utterances new arrivals are greedily attached to the frozen cluster centroids instead
 * (typical meetings produce an utterance every ~5–10 s, so the exact regime covers ~15–20 min).
 * Utterances shorter than ~1 s have unreliable fingerprints: they may join their nearest
 * existing speaker but never found a new one.
 */

const RECLUSTER_MAX = 120;
const MIN_RELIABLE_MS = 1000;

type LiveUtterance = { intervalIndex: number; embedding: Float32Array; durationMs: number };
type Centroid = { label: string; embedding: Float32Array; totalDurationMs: number };

export class LiveSpeakerTracker {
  #utterances: LiveUtterance[] = [];
  #labels = new Map<number, string>();
  #centroids: Centroid[] = [];
  #threshold: number;
  #labelOffset: number;

  /** `labelOffset` continues numbering after speakers already present in the transcript. */
  constructor(threshold = DIARIZATION_SIMILARITY_THRESHOLD, labelOffset = 0) {
    this.#threshold = threshold;
    this.#labelOffset = labelOffset;
  }

  get speakerCount(): number {
    return this.#centroids.length;
  }

  /**
   * Records an utterance and returns the updated interval → label map (labels for earlier
   * intervals may have changed — the caller should re-apply the whole map).
   */
  add(intervalIndex: number, embedding: Float32Array, durationMs = Infinity): Map<number, string> {
    const reliable = durationMs >= MIN_RELIABLE_MS;
    const reclusterRegime = this.#utterances.filter((u) => u.durationMs >= MIN_RELIABLE_MS).length < RECLUSTER_MAX;

    if (reliable && reclusterRegime) {
      this.#utterances.push({ intervalIndex, embedding: Float32Array.from(embedding), durationMs });
      this.#recluster();
      // Short utterances labeled earlier may re-attach to better centroids now.
      for (const u of this.#utterances) {
        if (u.durationMs < MIN_RELIABLE_MS) this.#labels.set(u.intervalIndex, this.#nearestLabel(u.embedding));
      }
    } else {
      // Greedy attachment: nearest centroid; a reliable non-matching voice founds a new speaker.
      this.#utterances.push({ intervalIndex, embedding: Float32Array.from(embedding), durationMs });
      let best: Centroid | null = null;
      let bestSim = -Infinity;
      for (const c of this.#centroids) {
        const sim = cosineSimilarity(embedding, c.embedding);
        if (sim > bestSim) {
          bestSim = sim;
          best = c;
        }
      }
      if (best && (bestSim >= this.#threshold || !reliable)) {
        this.#labels.set(intervalIndex, best.label);
      } else if (reliable || !best) {
        const label = defaultSpeakerLabel(this.#labelOffset + this.#centroids.length);
        this.#centroids.push({ label, embedding: Float32Array.from(embedding), totalDurationMs: durationMs });
        this.#labels.set(intervalIndex, label);
      }
    }

    return new Map(this.#labels);
  }

  /** The voice-based label for a VAD interval, or null if its embedding hasn't resolved yet. */
  labelForInterval(intervalIndex: number): string | null {
    return this.#labels.get(intervalIndex) ?? null;
  }

  #recluster(): void {
    const reliable = this.#utterances.filter((u) => u.durationMs >= MIN_RELIABLE_MS);
    if (reliable.length === 0) return;
    // Chronological pseudo-times keep cluster numbering stable across re-runs (clusterEmbeddings
    // numbers clusters by order of first appearance in its input).
    const segments: EmbeddedSegment[] = reliable.map((u, i) => ({
      startMs: i * 10_000,
      endMs: i * 10_000 + u.durationMs,
      embedding: u.embedding,
    }));
    const assignments = clusterEmbeddings(segments, { minEmbeddingSegmentMs: 0, minSpeakerDurationMs: 0 });

    const byCluster = new Map<number, { members: number[]; totalMs: number }>();
    assignments.forEach((a, i) => {
      if (!byCluster.has(a.speakerIndex)) byCluster.set(a.speakerIndex, { members: [], totalMs: 0 });
      const c = byCluster.get(a.speakerIndex)!;
      c.members.push(i);
      c.totalMs += reliable[i].durationMs;
    });

    this.#centroids = [];
    for (const [speakerIndex, c] of [...byCluster].sort((a, b) => a[0] - b[0])) {
      const label = defaultSpeakerLabel(this.#labelOffset + speakerIndex);
      const dim = reliable[0].embedding.length;
      const mean = new Float32Array(dim);
      let tw = 0;
      for (const m of c.members) {
        const w = Math.max(1, reliable[m].durationMs);
        tw += w;
        for (let i = 0; i < dim; i++) mean[i] += reliable[m].embedding[i] * w;
      }
      for (let i = 0; i < dim; i++) mean[i] /= tw;
      this.#centroids.push({ label, embedding: mean, totalDurationMs: c.totalMs });
      for (const m of c.members) this.#labels.set(reliable[m].intervalIndex, label);
    }
  }

  #nearestLabel(embedding: Float32Array): string {
    let best: string | null = null;
    let bestSim = -Infinity;
    for (const c of this.#centroids) {
      const sim = cosineSimilarity(embedding, c.embedding);
      if (sim > bestSim) {
        bestSim = sim;
        best = c.label;
      }
    }
    return best ?? defaultSpeakerLabel(this.#labelOffset);
  }
}
