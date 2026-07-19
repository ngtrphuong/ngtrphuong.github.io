import type { TranscriptSegment } from './types.ts';

export function msToTimestamp(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function mergeSegments(segs: TranscriptSegment[]): TranscriptSegment[] {
  if (segs.length === 0) return [];
  const out: TranscriptSegment[] = [];
  for (const seg of segs) {
    const prev = out[out.length - 1];
    if (
      prev &&
      prev.source === seg.source &&
      prev.isFinal &&
      seg.isFinal &&
      seg.startMs - prev.endMs < 500 &&
      prev.text.trim() && seg.text.trim()
    ) {
      prev.text = `${prev.text.trim()} ${seg.text.trim()}`;
      prev.endMs = seg.endMs;
      if (seg.confidence != null) prev.confidence = seg.confidence;
    } else {
      out.push({ ...seg });
    }
  }
  return out;
}

export function finalSegments(segs: TranscriptSegment[]): TranscriptSegment[] {
  return segs.filter((s) => s.isFinal && s.text.trim());
}

export function segmentsToPlainText(segs: TranscriptSegment[]): string {
  return finalSegments(segs)
    .map((s) => `[${msToTimestamp(s.startMs)}] ${s.text.trim()}`)
    .join('\n');
}

export function segmentsToMarkdown(segs: TranscriptSegment[], title = 'Meeting transcript'): string {
  const rows = finalSegments(segs)
    .map((s) => `| ${msToTimestamp(s.startMs)} | ${escapeMdCell(s.text.trim())} |`)
    .join('\n');
  return `# ${title}\n\n| Time | Text |\n|------|------|\n${rows}\n`;
}

export function segmentsToJson(segs: TranscriptSegment[]): string {
  return JSON.stringify(finalSegments(segs), null, 2);
}

/** Replace interim segment in same time window or append. */
export function appendSegment(list: TranscriptSegment[], seg: TranscriptSegment): TranscriptSegment[] {
  const next = [...list];
  const idx = next.findIndex(
    (s) => !s.isFinal && s.source === seg.source && Math.abs(s.startMs - seg.startMs) < 2000,
  );
  if (idx >= 0) {
    next[idx] = seg;
    return next;
  }
  if (!seg.isFinal) {
    next.push(seg);
    return next;
  }
  const interimIdx = next.findIndex((s) => !s.isFinal && s.source === seg.source);
  if (interimIdx >= 0) {
    next[interimIdx] = seg;
    return next;
  }
  next.push(seg);
  return next;
}

function escapeMdCell(text: string): string {
  return text.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

export function fmtElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
