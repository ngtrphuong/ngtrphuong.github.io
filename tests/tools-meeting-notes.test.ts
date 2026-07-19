/**
 * Tests for meeting-notes format helpers and minutes parsing.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  appendSegment,
  mergeSegments,
  msToTimestamp,
  segmentsToMarkdown,
} from '../src/scripts/tools/meeting-notes/format.ts';
import {
  buildMinutesPrompt,
  canGenerateMinutes,
  parseMinutesResponse,
} from '../src/scripts/tools/meeting-notes/minutes.ts';
import { recordSourceLabel } from '../src/scripts/tools/meeting-notes/audio-capture.ts';
import { parseTransformersProgress } from '../src/scripts/tools/shared/transformers-progress.ts';
import {
  suggestsNewTurn,
  defaultSpeakerLabel,
  intervalIndexForTimestamp,
  VadTurnTracker,
  type VadInterval,
} from '../src/scripts/tools/meeting-notes/speaker-turns.ts';
import { onDeviceLangStatusLabel, isBenignSpeechRecognitionError, isFatalSpeechErrorMessage } from '../src/scripts/tools/meeting-notes/asr-web-speech.ts';
import type { TranscriptSegment } from '../src/scripts/tools/meeting-notes/types.ts';

const seg = (over: Partial<TranscriptSegment>): TranscriptSegment => ({
  id: over.id ?? '1',
  startMs: over.startMs ?? 0,
  endMs: over.endMs ?? 1000,
  text: over.text ?? 'hello',
  isFinal: over.isFinal ?? true,
  source: over.source ?? 'whisper',
  ...over,
});

test('msToTimestamp: 832000 ms → 00:13:52', () => {
  assert.equal(msToTimestamp(832000), '00:13:52');
});

test('msToTimestamp: includes hours when needed', () => {
  assert.equal(msToTimestamp(3661000), '01:01:01');
});

test('mergeSegments: merges adjacent same-source finals', () => {
  const input = [
    seg({ id: 'a', startMs: 0, endMs: 1000, text: 'Hello' }),
    seg({ id: 'b', startMs: 1100, endMs: 2000, text: 'world' }),
  ];
  const merged = mergeSegments(input);
  assert.equal(merged.length, 1);
  assert.equal(merged[0].text, 'Hello world');
});

test('segmentsToMarkdown: omits interim segments', () => {
  const md = segmentsToMarkdown([
    seg({ text: 'draft', isFinal: false }),
    seg({ text: 'final line', isFinal: true, startMs: 12000 }),
  ]);
  assert.match(md, /final line/);
  assert.doesNotMatch(md, /draft/);
});

test('appendSegment: replaces interim in same window', () => {
  const list = [seg({ id: 'i', isFinal: false, text: 'hel', startMs: 0 })];
  const next = appendSegment(list, seg({ id: 'f', isFinal: true, text: 'hello', startMs: 0 }));
  assert.equal(next.length, 1);
  assert.equal(next[0].text, 'hello');
  assert.equal(next[0].isFinal, true);
});

test('canGenerateMinutes: requires at least 3 final segments', () => {
  assert.equal(canGenerateMinutes([]), false);
  assert.equal(canGenerateMinutes([seg({}), seg({ id: '2' })]), false);
  assert.equal(
    canGenerateMinutes([seg({}), seg({ id: '2' }), seg({ id: '3' })]),
    true,
  );
});

test('parseMinutesResponse: extracts JSON object', () => {
  const raw = 'Here is JSON:\n{"title":"Standup","attendees":["A"],"agenda":[],"decisions":["Ship"],"actionItems":[{"task":"Fix bug"}],"summary":"Quick sync."}';
  const result = parseMinutesResponse(raw, [seg({ text: 'test' })]);
  assert.ok(result);
  assert.equal(result!.title, 'Standup');
  assert.equal(result!.decisions[0], 'Ship');
});

test('buildMinutesPrompt: includes transcript lines', () => {
  const prompt = buildMinutesPrompt([seg({ text: 'Welcome team', startMs: 5000 })]);
  assert.match(prompt, /Welcome team/);
  assert.match(prompt, /JSON/);
});

test('recordSourceLabel: names system capture mode', () => {
  assert.match(recordSourceLabel('system'), /tab audio/i);
  assert.match(recordSourceLabel('mixed'), /Microphone/i);
});

test('extensionForMime: maps MediaRecorder mime to suffix', async () => {
  const { extensionForMime, normalizeRecordingBlob } = await import(
    '../src/scripts/tools/meeting-notes/audio-export.ts'
  );
  assert.equal(extensionForMime('audio/webm;codecs=opus'), 'webm');
  assert.equal(extensionForMime('audio/ogg'), 'ogg');
  const blob = normalizeRecordingBlob(new Blob(['x'], { type: '' }));
  assert.equal(blob.type, 'audio/webm');
});

test('suggestsNewTurn: first segment is always a new turn', () => {
  assert.equal(suggestsNewTurn(undefined, 0), true);
});

test('suggestsNewTurn: gap above threshold suggests a new turn', () => {
  assert.equal(suggestsNewTurn(1000, 3000, 1500), true);
});

test('suggestsNewTurn: gap below threshold does not suggest a new turn', () => {
  assert.equal(suggestsNewTurn(1000, 1800, 1500), false);
});

test('defaultSpeakerLabel: formats 1-based speaker labels', () => {
  assert.equal(defaultSpeakerLabel(0), 'Speaker 1');
  assert.equal(defaultSpeakerLabel(2), 'Speaker 3');
});

test('intervalIndexForTimestamp: finds the interval containing a timestamp', () => {
  const intervals: VadInterval[] = [
    { index: 0, startMs: 0, endMs: 1000 },
    { index: 1, startMs: 3000, endMs: 4000 },
  ];
  assert.equal(intervalIndexForTimestamp(intervals, 500), 0);
  assert.equal(intervalIndexForTimestamp(intervals, 3500), 1);
});

test('intervalIndexForTimestamp: falls back to the nearest interval for a timestamp in a gap', () => {
  const intervals: VadInterval[] = [
    { index: 0, startMs: 0, endMs: 1000 },
    { index: 1, startMs: 3000, endMs: 4000 },
  ];
  assert.equal(intervalIndexForTimestamp(intervals, 1100), 0);
  assert.equal(intervalIndexForTimestamp(intervals, 2900), 1);
});

test('intervalIndexForTimestamp: empty interval list returns null', () => {
  assert.equal(intervalIndexForTimestamp([], 100), null);
});

test('VadTurnTracker: first resolved segment is always a new turn', () => {
  const tracker = new VadTurnTracker();
  tracker.speechStart(0);
  tracker.speechEnd(500);
  assert.equal(tracker.resolveTurnBoundary(200), true);
});

test('VadTurnTracker: segments in the same VAD interval are not a new turn', () => {
  const tracker = new VadTurnTracker();
  tracker.speechStart(0);
  tracker.speechEnd(2000);
  assert.equal(tracker.resolveTurnBoundary(100), true);
  assert.equal(tracker.resolveTurnBoundary(1500), false);
});

test('VadTurnTracker: a new VAD interval (a real pause) is a new turn', () => {
  const tracker = new VadTurnTracker();
  tracker.speechStart(0);
  tracker.speechEnd(1000);
  tracker.speechStart(3000);
  tracker.speechEnd(4000);
  assert.equal(tracker.resolveTurnBoundary(500), true);
  assert.equal(tracker.resolveTurnBoundary(3500), true);
});

test('VadTurnTracker: misfire discards an open interval without creating a false turn', () => {
  const tracker = new VadTurnTracker();
  tracker.speechStart(0);
  tracker.misfire();
  tracker.speechStart(100);
  tracker.speechEnd(1000);
  assert.equal(tracker.resolveTurnBoundary(500), true);
});

test('onDeviceLangStatusLabel: describes downloadable state', () => {
  const label = onDeviceLangStatusLabel('downloadable', 'vi-VN');
  assert.match(label, /vi-VN/);
  assert.match(label, /download/i);
});

test('isBenignSpeechRecognitionError: treats silence as non-fatal', () => {
  assert.equal(isBenignSpeechRecognitionError('no-speech'), true);
  assert.equal(isBenignSpeechRecognitionError('aborted'), true);
  assert.equal(isBenignSpeechRecognitionError('not-allowed'), false);
});

test('isFatalSpeechErrorMessage: mic denied is fatal', () => {
  assert.equal(isFatalSpeechErrorMessage('Microphone access was denied. Allow microphone for this site in browser settings.'), true);
  assert.equal(isFatalSpeechErrorMessage('No speech detected. Try speaking closer to the microphone.'), false);
});

test('supportsTrackBasedRecognition: uses Chromium major version, not start.length', async () => {
  const { chromiumMajorVersion } = await import(
    '../src/scripts/tools/meeting-notes/asr-web-speech.ts'
  );
  // In Node there is no navigator — helper should return null without throwing.
  assert.equal(chromiumMajorVersion(), null);
});

test('parseTransformersProgress: handles fractional and percent values', () => {
  const fractional = parseTransformersProgress({ progress: 0.42, status: 'download', file: 'model.bin' });
  assert.equal(fractional.pct, 42);
  assert.match(fractional.status, /42%/);

  const percent = parseTransformersProgress({ progress: 67, status: 'progress' });
  assert.equal(percent.pct, 67);
});
