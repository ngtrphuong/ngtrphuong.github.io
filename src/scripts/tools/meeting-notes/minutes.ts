import { finalSegments } from './format.ts';
import type { MinutesResult, TranscriptSegment } from './types.ts';

const MIN_SEGMENTS_FOR_MINUTES = 3;

export function canGenerateMinutes(segments: TranscriptSegment[]): boolean {
  return finalSegments(segments).length >= MIN_SEGMENTS_FOR_MINUTES;
}

export function buildMinutesPrompt(segments: TranscriptSegment[]): string {
  const lines = finalSegments(segments)
    .map((s) => `[${Math.floor(s.startMs / 1000)}s] ${s.text.trim()}`)
    .join('\n');

  return `You are a meeting secretary. From the transcript below, produce structured meeting minutes as JSON only (no markdown fences).

Required JSON shape:
{
  "title": "string",
  "attendees": ["name or role"],
  "agenda": ["topic"],
  "decisions": ["decision"],
  "actionItems": [{ "owner": "optional", "task": "string", "due": "optional" }],
  "summary": "2-4 sentence summary"
}

Transcript:
${lines}`;
}

export function parseMinutesResponse(raw: string, transcript: TranscriptSegment[]): MinutesResult | null {
  const trimmed = raw.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;

  try {
    const parsed = JSON.parse(jsonMatch[0]) as Partial<MinutesResult>;
    if (!parsed || typeof parsed !== 'object') return null;

    return {
      title: String(parsed.title ?? 'Meeting notes'),
      attendees: Array.isArray(parsed.attendees) ? parsed.attendees.map(String) : [],
      agenda: Array.isArray(parsed.agenda) ? parsed.agenda.map(String) : [],
      decisions: Array.isArray(parsed.decisions) ? parsed.decisions.map(String) : [],
      actionItems: Array.isArray(parsed.actionItems)
        ? parsed.actionItems.map((a) => ({
            owner: a?.owner ? String(a.owner) : undefined,
            task: String(a?.task ?? ''),
            due: a?.due ? String(a.due) : undefined,
          })).filter((a) => a.task)
        : [],
      summary: String(parsed.summary ?? ''),
      rawTranscript: finalSegments(transcript),
    };
  } catch {
    return null;
  }
}

export function minutesToMarkdown(m: MinutesResult): string {
  const lines = [
    `# ${m.title}`,
    '',
    '## Summary',
    m.summary || '_No summary._',
    '',
    '## Attendees',
    ...(m.attendees.length ? m.attendees.map((a) => `- ${a}`) : ['- _Unknown_']),
    '',
    '## Agenda',
    ...(m.agenda.length ? m.agenda.map((a) => `- ${a}`) : ['- _None recorded_']),
    '',
    '## Decisions',
    ...(m.decisions.length ? m.decisions.map((d) => `- ${d}`) : ['- _None recorded_']),
    '',
    '## Action items',
    ...(m.actionItems.length
      ? m.actionItems.map((a) => `- ${a.task}${a.owner ? ` (@${a.owner})` : ''}${a.due ? ` — due ${a.due}` : ''}`)
      : ['- _None recorded_']),
    '',
    '---',
    '',
    '_AI-generated draft — review before sharing._',
  ];
  return lines.join('\n');
}
