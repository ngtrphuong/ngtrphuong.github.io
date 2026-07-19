import { SPEAKER_TURN_GAP_MS } from './constants.ts';

/**
 * Heuristic only: a silence gap this long between two VAD-detected utterances suggests a
 * new speaker turn. This is NOT voice identification — it cannot tell who is speaking or
 * whether it's the same person as before, only that there was a pause.
 */
export function suggestsNewTurn(
  prevSegmentEndMs: number | undefined,
  nextSegmentStartMs: number,
  gapMs = SPEAKER_TURN_GAP_MS,
): boolean {
  if (prevSegmentEndMs == null) return true;
  return nextSegmentStartMs - prevSegmentEndMs >= gapMs;
}

export function defaultSpeakerLabel(turnIndex: number): string {
  return `Speaker ${turnIndex + 1}`;
}

export type VadInterval = { index: number; startMs: number; endMs: number };

/** Finds the VAD interval a timestamp falls inside, or the nearest one if it falls in a gap. */
export function intervalIndexForTimestamp(intervals: VadInterval[], atMs: number): number | null {
  if (intervals.length === 0) return null;
  for (const iv of intervals) {
    if (atMs >= iv.startMs && atMs <= iv.endMs) return iv.index;
  }
  let best = intervals[0];
  let bestDist = Math.min(Math.abs(atMs - best.startMs), Math.abs(atMs - best.endMs));
  for (const iv of intervals) {
    const dist = Math.min(Math.abs(atMs - iv.startMs), Math.abs(atMs - iv.endMs));
    if (dist < bestDist) {
      best = iv;
      bestDist = dist;
    }
  }
  return best.index;
}

/**
 * Tracks VAD speech-start/speech-end timestamps during a live session and uses them to decide
 * whether an ASR-produced segment (from an engine with its own, fuzzier segment timing — e.g.
 * Web Speech's "now minus ~2s" estimate) starts a new speaker turn. VAD's acoustic silence
 * detection is a more reliable pause signal than an ASR engine's own result cadence, but this
 * is still a heuristic — a pause is not proof of a different speaker.
 */
export class VadTurnTracker {
  #intervals: VadInterval[] = [];
  #nextIndex = 0;
  #openStartMs: number | null = null;
  #lastAssignedIndex: number | null = null;

  speechStart(atMs: number): void {
    this.#openStartMs = atMs;
  }

  speechEnd(atMs: number): void {
    if (this.#openStartMs == null) return;
    this.#intervals.push({ index: this.#nextIndex, startMs: this.#openStartMs, endMs: atMs });
    this.#nextIndex += 1;
    this.#openStartMs = null;
  }

  /** VAD flagged a speech start that turned out too short to count — discard it. */
  misfire(): void {
    this.#openStartMs = null;
  }

  /** Call once per final ASR segment. Returns true if it should be marked as a new speaker turn. */
  resolveTurnBoundary(segmentStartMs: number): boolean {
    const idx = intervalIndexForTimestamp(this.#intervals, segmentStartMs);
    if (idx === null) return this.#lastAssignedIndex === null;
    const isNew = idx !== this.#lastAssignedIndex;
    this.#lastAssignedIndex = idx;
    return isNew;
  }
}
