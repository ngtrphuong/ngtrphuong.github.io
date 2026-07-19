import { clusterEmbeddings, DEFAULT_CLUSTERING_OPTIONS, type EmbeddedSegment } from './clustering.ts';
import { defaultSpeakerLabel } from './speaker-turns.ts';
import type {
  ClusteringOptions,
  DiarizationEngine,
  DiarizationSegment,
  RawDiarizationSegment,
  TranscriptSegment,
} from './types.ts';

/** Below this share of a transcript segment covered by its best diarization match, no speaker is assigned. */
export const MIN_RECONCILE_COVERAGE = 0.3;

export type SpeechInterval = { startMs: number; endMs: number };

export type DiarizationPipelineDeps = {
  /**
   * pyannote path: raw audio → speaker-change-aware segments (SegmentationBridge.segment).
   * A rejection here (model unavailable/offline/init failure) triggers the VAD fallback.
   */
  segment: (audio: Float32Array) => Promise<RawDiarizationSegment[]>;
  /** Fallback path: raw audio → plain VAD speech intervals (the pre-pyannote behavior). */
  detectSpeech: (audio: Float32Array) => Promise<SpeechInterval[]>;
  /** WeSpeaker voice embedding for one PCM slice (DiarizeBridge.embed). */
  embed: (audio: Float32Array) => Promise<Float32Array>;
};

export type DiarizationResult = {
  engine: DiarizationEngine;
  diarization: DiarizationSegment[];
  transcript: TranscriptSegment[];
  speakerCount: number;
  utteranceCount: number;
};

/**
 * Merges sub-`minMs` slivers into their nearest neighbor (by gap) — a segment that short cannot
 * produce a reliable voice embedding, and embedding it alone tends to spawn phantom speakers.
 * A sliver with no other segment to merge into is kept as-is (a weak embedding beats none).
 */
export function mergeShortSegments(
  segments: RawDiarizationSegment[],
  minMs = DEFAULT_CLUSTERING_OPTIONS.minEmbeddingSegmentMs,
): RawDiarizationSegment[] {
  const sorted = [...segments].sort((a, b) => a.startMs - b.startMs || a.endMs - b.endMs);
  const result: RawDiarizationSegment[] = [];
  const pendingSlivers: RawDiarizationSegment[] = [];

  const absorb = (target: RawDiarizationSegment, sliver: RawDiarizationSegment): RawDiarizationSegment => ({
    ...target,
    startMs: Math.min(target.startMs, sliver.startMs),
    endMs: Math.max(target.endMs, sliver.endMs),
  });

  for (const seg of sorted) {
    if (seg.endMs - seg.startMs >= minMs) {
      let merged = seg;
      // Slivers seen before the first long segment attach forward to it.
      while (pendingSlivers.length) merged = absorb(merged, pendingSlivers.shift()!);
      result.push(merged);
    } else if (result.length) {
      const prev = result[result.length - 1];
      result[result.length - 1] = absorb(prev, seg);
    } else {
      pendingSlivers.push(seg);
    }
  }
  // Only slivers in the whole input — keep them rather than returning nothing.
  return result.length ? result : pendingSlivers;
}

/**
 * Assigns each transcript segment the speakerId of the diarization segment it overlaps most
 * with. If the best overlap covers less than MIN_RECONCILE_COVERAGE of the transcript segment,
 * its existing speakerId is left untouched (never clobbered with a low-confidence guess).
 * `turnBoundary` is set where the effective speaker changes between consecutive segments.
 */
export function reconcileWithTranscript(
  segments: TranscriptSegment[],
  diarization: DiarizationSegment[],
): TranscriptSegment[] {
  let prevSpeaker: string | undefined;
  return segments.map((seg) => {
    let best: { speakerId: string; overlap: number } | null = null;
    for (const d of diarization) {
      const overlap = Math.min(seg.endMs, d.endMs) - Math.max(seg.startMs, d.startMs);
      if (overlap > 0 && (!best || overlap > best.overlap)) best = { speakerId: d.speakerId, overlap };
    }
    const durationMs = Math.max(1, seg.endMs - seg.startMs);
    const assigned =
      best && best.overlap / durationMs >= MIN_RECONCILE_COVERAGE ? best.speakerId : seg.speakerId;

    const out: TranscriptSegment = { ...seg, speakerId: assigned };
    if (assigned != null) {
      out.turnBoundary = assigned !== prevSpeaker;
      prevSpeaker = assigned;
    }
    return out;
  });
}

/**
 * The full diarization v2 pipeline: speaker-change-aware segmentation (pyannote, with VAD
 * intervals as the degraded fallback) → sliver merging → WeSpeaker embeddings → agglomerative
 * clustering → transcript reconciliation. Pure orchestration — all model inference is injected
 * via `deps`, so this is unit-testable without any model.
 */
export async function runDiarizationPipeline(
  samples: Float32Array,
  sampleRate: number,
  transcript: TranscriptSegment[],
  deps: DiarizationPipelineDeps,
  options: Partial<ClusteringOptions> = {},
  onStatus?: (status: string) => void,
): Promise<DiarizationResult> {
  const opts = { ...DEFAULT_CLUSTERING_OPTIONS, ...options };

  let engine: DiarizationEngine = 'pyannote';
  let raw: RawDiarizationSegment[];
  try {
    onStatus?.('Detecting speaker changes…');
    raw = await deps.segment(samples);
  } catch {
    // Degrade to the previous behavior (plain VAD speech intervals), never error out here.
    engine = 'vad-heuristic';
    onStatus?.('Detecting speech segments…');
    raw = (await deps.detectSpeech(samples)).map((iv) => ({
      startMs: iv.startMs,
      endMs: iv.endMs,
      windowLocalSpeaker: 0,
      confidence: 1,
    }));
  }

  const utterances = mergeShortSegments(raw, opts.minEmbeddingSegmentMs);
  if (utterances.length === 0) {
    return { engine, diarization: [], transcript, speakerCount: 0, utteranceCount: 0 };
  }

  const embedded: (EmbeddedSegment & { confidence: number })[] = [];
  for (let i = 0; i < utterances.length; i++) {
    const u = utterances[i];
    onStatus?.(`Analyzing speakers… (utterance ${i + 1}/${utterances.length})`);
    const startIdx = Math.max(0, Math.floor((u.startMs / 1000) * sampleRate));
    const endIdx = Math.min(samples.length, Math.ceil((u.endMs / 1000) * sampleRate));
    if (endIdx <= startIdx) continue;
    const embedding = await deps.embed(samples.subarray(startIdx, endIdx));
    embedded.push({ startMs: u.startMs, endMs: u.endMs, embedding, confidence: u.confidence });
  }
  if (embedded.length === 0) {
    return { engine, diarization: [], transcript, speakerCount: 0, utteranceCount: 0 };
  }

  const assignments = clusterEmbeddings(embedded, opts);

  // Session-stable ids in order of first appearance. Repo convention "Speaker N" (not the "S1"
  // scheme) so ids stay compatible with the live turn heuristic, saved sessions, and the
  // speaker-label override map.
  const diarization: DiarizationSegment[] = assignments.map((a, i) => ({
    startMs: a.startMs,
    endMs: a.endMs,
    speakerId: defaultSpeakerLabel(a.speakerIndex),
    confidence: embedded[i].confidence,
  }));

  return {
    engine,
    diarization,
    transcript: reconcileWithTranscript(transcript, diarization),
    speakerCount: new Set(diarization.map((d) => d.speakerId)).size,
    utteranceCount: diarization.length,
  };
}
