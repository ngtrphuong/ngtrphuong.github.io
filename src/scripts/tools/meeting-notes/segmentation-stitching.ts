import type { RawDiarizationSegment } from './types.ts';

/**
 * Pure windowing/stitching helpers for the pyannote segmentation worker (segment-worker.ts).
 * Kept free of any model/worker dependency so unit tests can exercise them on synthetic data.
 */

export const SEGMENTATION_WINDOW_SECONDS = 10;
export const SEGMENTATION_OVERLAP_SECONDS = 1;

export type SegmentationWindow = {
  startSample: number;
  /** End of the real (unpadded) audio in this window. */
  endSample: number;
  offsetMs: number;
};

/**
 * Splits audio into 10 s windows with 1 s overlap (the model is trained on 10 s chunks).
 * The final window may be shorter than 10 s — the worker zero-pads it before inference and
 * `clampToDuration` drops anything the model hallucinates inside the padding.
 */
export function planWindows(
  totalSamples: number,
  sampleRate: number,
  windowSeconds = SEGMENTATION_WINDOW_SECONDS,
  overlapSeconds = SEGMENTATION_OVERLAP_SECONDS,
): SegmentationWindow[] {
  if (totalSamples <= 0) return [];
  const windowSamples = Math.floor(windowSeconds * sampleRate);
  const hopSamples = Math.floor((windowSeconds - overlapSeconds) * sampleRate);
  const windows: SegmentationWindow[] = [];
  for (let start = 0; ; start += hopSamples) {
    const end = Math.min(start + windowSamples, totalSamples);
    windows.push({ startSample: start, endSample: end, offsetMs: (start / sampleRate) * 1000 });
    if (end >= totalSamples) break;
  }
  return windows;
}

/**
 * The pyannote-segmentation-3.0 powerset head emits 7 classes per frame:
 * 0 = no speaker, 1–3 = a single local speaker, 4–6 = a pair speaking at once.
 * Maps each post-processed segment to one RawDiarizationSegment per constituent speaker
 * (overlap classes emit two), shifted from window-local seconds to absolute milliseconds.
 */
const POWERSET_MEMBERS: Record<number, number[]> = {
  0: [],
  1: [0],
  2: [1],
  3: [2],
  4: [0, 1],
  5: [0, 2],
  6: [1, 2],
};

export type LocalSegment = { id: number; start: number; end: number; confidence: number };

export function powersetToRawSegments(
  localSegments: LocalSegment[],
  offsetMs: number,
  trueDurationMs: number,
): RawDiarizationSegment[] {
  const out: RawDiarizationSegment[] = [];
  for (const seg of localSegments) {
    const members = POWERSET_MEMBERS[seg.id] ?? [];
    const startMs = offsetMs + seg.start * 1000;
    const endMs = Math.min(offsetMs + seg.end * 1000, trueDurationMs);
    if (endMs <= startMs || startMs >= trueDurationMs) continue;
    for (const speaker of members) {
      out.push({ startMs, endMs, windowLocalSpeaker: speaker, confidence: seg.confidence });
    }
  }
  return out;
}

function intervalIoU(a: RawDiarizationSegment, b: RawDiarizationSegment): number {
  const intersection = Math.min(a.endMs, b.endMs) - Math.max(a.startMs, b.startMs);
  if (intersection <= 0) return 0;
  const union = Math.max(a.endMs, b.endMs) - Math.min(a.startMs, b.startMs);
  return intersection / union;
}

/**
 * Flattens per-window segment lists into one time-sorted list, deduplicating detections in the
 * 1 s overlap region between consecutive windows: two segments (from different windows) with
 * IoU > 0.5 are the same acoustic event seen twice — keep the higher-confidence one. Local
 * speaker ids are NOT comparable across windows, so identity is deliberately ignored here;
 * cross-window identity is the embedding/clustering stage's job.
 */
export function stitchWindows(perWindow: RawDiarizationSegment[][]): RawDiarizationSegment[] {
  const result: RawDiarizationSegment[] = [];
  for (const windowSegments of perWindow) {
    for (const seg of windowSegments) {
      let duplicateIdx = -1;
      for (let i = result.length - 1; i >= 0; i--) {
        if (result[i].endMs <= seg.startMs - 2000) break; // far behind the overlap zone
        if (intervalIoU(result[i], seg) > 0.5) {
          duplicateIdx = i;
          break;
        }
      }
      if (duplicateIdx >= 0) {
        if (seg.confidence > result[duplicateIdx].confidence) result[duplicateIdx] = seg;
      } else {
        result.push(seg);
      }
    }
  }
  return result.sort((a, b) => a.startMs - b.startMs || a.endMs - b.endMs);
}
