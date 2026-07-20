import { cosineSimilarity } from './clustering.ts';
import { DIARIZATION_SIMILARITY_THRESHOLD } from './constants.ts';
import { defaultSpeakerLabel } from './speaker-turns.ts';

/**
 * Online (greedy) voice clustering for live captions: each VAD-detected utterance's WeSpeaker
 * embedding is assigned to the most similar existing speaker centroid, or opens a new speaker
 * when no centroid is similar enough. This is what stops live speaker numbers from growing
 * forever — a returning voice re-attaches to its existing label instead of minting "Speaker N+1"
 * on every pause (the old pause-only heuristic had no identity signal at all, so it could only
 * count upward). Uses the same similarity threshold as the batch pipeline (see constants.ts).
 *
 * Greedy online clustering is weaker than the batch AHC pass (no re-visiting of early
 * assignments), which is fine live — "Identify speakers" remains the accurate post-hoc pass.
 */
export class LiveSpeakerTracker {
  #centroids: { embedding: Float32Array; count: number; label: string }[] = [];
  #intervalLabels = new Map<number, string>();
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

  /** Assigns an utterance's embedding to a speaker and remembers the interval → label mapping. */
  assign(intervalIndex: number, embedding: Float32Array): string {
    let best: { idx: number; sim: number } | null = null;
    for (let i = 0; i < this.#centroids.length; i++) {
      const sim = cosineSimilarity(embedding, this.#centroids[i].embedding);
      if (!best || sim > best.sim) best = { idx: i, sim };
    }

    let label: string;
    if (best && best.sim >= this.#threshold) {
      const c = this.#centroids[best.idx];
      const n = c.count + 1;
      for (let i = 0; i < c.embedding.length; i++) {
        c.embedding[i] = (c.embedding[i] * c.count + embedding[i]) / n;
      }
      c.count = n;
      label = c.label;
    } else {
      label = defaultSpeakerLabel(this.#labelOffset + this.#centroids.length);
      this.#centroids.push({ embedding: Float32Array.from(embedding), count: 1, label });
    }

    this.#intervalLabels.set(intervalIndex, label);
    return label;
  }

  /** The voice-based label for a VAD interval, or null if its embedding hasn't resolved yet. */
  labelForInterval(intervalIndex: number): string | null {
    return this.#intervalLabels.get(intervalIndex) ?? null;
  }
}
