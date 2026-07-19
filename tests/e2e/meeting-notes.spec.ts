import { test, expect } from '@playwright/test';
import { gotoAndWaitForReady } from './navigation.ts';

test.describe('Meeting Notes tool', () => {
  test.beforeEach(async ({ page }) => {
    await gotoAndWaitForReady(page, '/tools/meeting-notes/', page.locator('#tab-live'));
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Meeting Notes/i);
  });

  test('shows privacy alert and tabs', async ({ page }) => {
    await expect(page.locator('#privacy-badge')).toBeVisible();
    await expect(page.locator('#tab-live')).toBeVisible();
    await expect(page.locator('#tab-record')).toBeVisible();
    await expect(page.locator('#tab-upload')).toBeVisible();
  });

  test('speaker diarization section is hidden until there is a transcript', async ({ page }) => {
    await expect(page.locator('#diarize-btn')).toHaveCount(0);
  });

  test('transcript panel and copy button exist', async ({ page }) => {
    await expect(page.locator('#transcript-panel')).toBeVisible();
    await expect(page.locator('#copy-transcript-btn')).toBeVisible();
  });

  test('meeting notes layout stays within a mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    const layout = await page.evaluate(() => {
      const card = document.querySelector('.card.google-anno-skip');
      const panel = document.querySelector('#transcript-panel');
      const cardRect = card?.getBoundingClientRect();
      const panelRect = panel?.getBoundingClientRect();
      return {
        viewportWidth: window.innerWidth,
        cardLeft: cardRect?.left ?? -1,
        cardRight: cardRect?.right ?? Number.POSITIVE_INFINITY,
        panelLeft: panelRect?.left ?? -1,
        panelRight: panelRect?.right ?? Number.POSITIVE_INFINITY,
      };
    });

    expect(layout.cardLeft).toBeGreaterThanOrEqual(0);
    expect(layout.cardRight).toBeLessThanOrEqual(layout.viewportWidth + 1);
    expect(layout.panelLeft).toBeGreaterThanOrEqual(0);
    expect(layout.panelRight).toBeLessThanOrEqual(layout.viewportWidth + 1);
    await expect(page.locator('#copy-transcript-btn')).toBeVisible();
  });

  test('live tab shows STT engines and caption sources', async ({ page }) => {
    await expect(page.locator('#live-engine-webspeech')).toBeChecked();
    await expect(page.locator('#live-engine-localai')).toBeVisible();
    await expect(page.locator('#live-src-mic')).toBeChecked();
    await expect(page.locator('#live-src-system')).toBeVisible();
    await expect(page.locator('#live-src-mixed')).toBeVisible();
  });

  test('live tab shows language pack panel for Web Speech', async ({ page }) => {
    await expect(page.locator('#lang-pack-panel')).toBeVisible();
  });

  test('cloud fallback is on by default so Live works without a pre-installed language pack', async ({ page }) => {
    // Regression test: with this off, a fresh profile without the on-device pack throws
    // "On-device language pack unavailable" the instant Start is clicked, and captions never run.
    await expect(page.locator('#allow-cloud-fallback')).toBeChecked();
  });

  test('live tab start button is enabled by default (Web Speech needs no model)', async ({ page }) => {
    await expect(page.locator('#start-live-btn')).toBeEnabled();
  });

  test('live mic Web Speech starts without an on-device language pack (cloud fallback)', async ({ page, context }) => {
    // Keep CI deterministic: the mock intentionally omits the on-device static API, which
    // exercises resolvePrivacyMode() falling back to cloud-assisted recognition.
    test.setTimeout(30_000);
    await page.evaluate(() => {
      class FakeSpeechRecognition {
        continuous = false;
        interimResults = false;
        lang = '';
        processLocally = false;
        onresult: ((ev: unknown) => void) | null = null;
        onerror: ((ev: unknown) => void) | null = null;
        onend: (() => void) | null = null;
        start() {}
        stop() {}
        abort() {}
      }
      const target = window as unknown as {
        SpeechRecognition: typeof FakeSpeechRecognition;
        webkitSpeechRecognition: typeof FakeSpeechRecognition;
      };
      target.SpeechRecognition = FakeSpeechRecognition;
      target.webkitSpeechRecognition = FakeSpeechRecognition;
    });
    await context.grantPermissions(['microphone']);
    await page.locator('#start-live-btn').click();
    await expect(page.locator('#stop-live-btn')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#error-msg')).not.toBeVisible();
    await page.locator('#stop-live-btn').click();
  });

  test('switching to LocalAI disables start until the Whisper model is loaded', async ({ page }) => {
    await page.locator('#live-engine-localai').check();
    await expect(page.locator('#start-live-btn')).toBeDisabled();
    await expect(page.locator('#load-whisper-btn')).toBeVisible();
  });

  test('live tab has optional audio recording toggle', async ({ page }) => {
    await expect(page.locator('#record-live-audio')).toBeVisible();
    await expect(page.locator('#record-live-audio')).toBeChecked();
  });

  test('system/tab source shows meeting help', async ({ page }) => {
    await page.locator('#live-src-system').check();
    await expect(page.locator('#live-meeting-help')).toBeVisible();
  });

  test('system audio Web Speech transcribes mixed Vietnamese and English', async ({ page }) => {
    test.setTimeout(30_000);

    await page.addInitScript(() => {
      class FakeSpeechRecognition {
        continuous = false;
        interimResults = false;
        lang = '';
        processLocally = false;
        onresult: ((ev: unknown) => void) | null = null;
        onerror: ((ev: unknown) => void) | null = null;
        onend: (() => void) | null = null;

        start(audioTrack?: MediaStreamTrack) {
          (window as unknown as { __recognitionTrackKind?: string }).__recognitionTrackKind =
            audioTrack?.kind;
          setTimeout(() => {
            this.onresult?.({
              resultIndex: 0,
              results: [{
                isFinal: true,
                0: { transcript: 'Xin chào team, hôm nay chúng ta review the release plan.' },
                length: 1,
              }],
            });
          }, 100);
        }

        stop() {
          this.onend?.();
        }

        abort() {
          this.onend?.();
        }
      }

      (window as unknown as { SpeechRecognition: unknown }).SpeechRecognition =
        FakeSpeechRecognition;
      (window as unknown as { webkitSpeechRecognition: unknown }).webkitSpeechRecognition =
        FakeSpeechRecognition;
    });

    await page.goto('/tools/meeting-notes/');
    await page.locator('#tab-live').waitFor({ state: 'visible' });

    await page.evaluate(() => {
      const original = navigator.mediaDevices.getDisplayMedia?.bind(navigator.mediaDevices);
      navigator.mediaDevices.getDisplayMedia = async () => {
        const audioContext = new AudioContext();
        await audioContext.resume();
        const destination = audioContext.createMediaStreamDestination();
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        gain.gain.value = 0.1;
        oscillator.connect(gain);
        gain.connect(destination);
        oscillator.start();

        const canvas = document.createElement('canvas');
        const videoTrack = canvas.captureStream(1).getVideoTracks()[0];
        const audioTrack = destination.stream.getAudioTracks()[0];
        (window as unknown as { __systemAudioCleanup?: () => void }).__systemAudioCleanup = () => {
          try { oscillator.stop(); } catch { /* ignore */ }
          videoTrack.stop();
          audioTrack.stop();
          void audioContext.close();
          if (original) navigator.mediaDevices.getDisplayMedia = original;
        };
        return new MediaStream([videoTrack, audioTrack]);
      };
    });

    await page.locator('#lang-select').selectOption('vi-VN');
    await page.locator('#live-src-system').check();
    await page.locator('#prefer-on-device').uncheck();
    await page.locator('#start-live-btn').click();

    await expect(page.locator('#stop-live-btn')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#transcript-panel')).toContainText(
      'Xin chào team, hôm nay chúng ta review the release plan.',
      { timeout: 5000 },
    );
    expect(await page.evaluate(
      () => (window as unknown as { __recognitionTrackKind?: string }).__recognitionTrackKind,
    )).toBe('audio');

    await page.locator('#stop-live-btn').click();
    await page.evaluate(() => {
      (window as unknown as { __systemAudioCleanup?: () => void }).__systemAudioCleanup?.();
    });
  });

  test('record tab allows start without Whisper loaded', async ({ page }) => {
    await page.locator('#tab-record').click();
    await expect(page.locator('#start-record-btn')).toBeEnabled();
    await expect(page.locator('#load-whisper-btn')).toBeVisible();
  });

  test('record tab shows audio source options', async ({ page }) => {
    await page.locator('#tab-record').click();
    await expect(page.locator('#record-src-mic')).toBeVisible();
    await expect(page.locator('#record-src-system')).toBeVisible();
    await expect(page.locator('#record-src-mixed')).toBeVisible();
    await expect(page.locator('#system-audio-help')).toBeHidden();
    await page.locator('#record-src-system').check();
    await expect(page.locator('#system-audio-help')).toBeVisible();
  });

  test('record mic flow saves blob and exposes .webm / .mp3 downloads', async ({ page, context }) => {
    test.setTimeout(90_000);
    await context.grantPermissions(['microphone']);
    await page.locator('#tab-record').click();
    await page.locator('#record-src-mic').check();

    await page.evaluate(async () => {
      const ctx = new AudioContext();
      await ctx.resume();
      const dest = ctx.createMediaStreamDestination();
      const osc = ctx.createOscillator();
      osc.frequency.value = 440;
      osc.connect(dest);
      osc.start();
      // Keep a silent gain so the destination stays active for MediaRecorder.
      const gain = ctx.createGain();
      gain.gain.value = 0.2;
      osc.disconnect();
      osc.connect(gain);
      gain.connect(dest);
      const orig = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getUserMedia = async () => {
        if (ctx.state === 'suspended') await ctx.resume();
        // Return cloned tracks so SessionRecorder cleanup does not kill the source.
        return new MediaStream(dest.stream.getAudioTracks().map((t) => t.clone()));
      };
      (window as unknown as { __restoreGum?: () => void }).__restoreGum = () => {
        navigator.mediaDevices.getUserMedia = orig;
        try { osc.stop(); } catch { /* ignore */ }
        void ctx.close();
      };
    });

    await page.locator('#start-record-btn').click();
    await expect(page.locator('#stop-record-btn')).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(1200);
    await page.locator('#stop-record-btn').click();

    await expect(page.locator('#download-recording-btn-record')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#download-recording-mp3-btn-record')).toBeVisible();
    await expect(page.locator('#recording-ready-hint')).toContainText('.webm');

    const downloadPromise = page.waitForEvent('download', { timeout: 15000 });
    await page.locator('#download-recording-btn-record').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.webm$/i);

    const mp3DownloadPromise = page.waitForEvent('download', { timeout: 30000 });
    await page.locator('#download-recording-mp3-btn-record').click();
    const mp3Download = await mp3DownloadPromise;
    expect(mp3Download.suggestedFilename()).toMatch(/\.mp3$/i);

    await page.evaluate(() => {
      (window as unknown as { __restoreGum?: () => void }).__restoreGum?.();
    });
  });

  test('live mic Web Speech can start/stop and offer .webm/.mp3 save', async ({ page, context }) => {
    test.setTimeout(90_000);
    await context.grantPermissions(['microphone']);

    await page.addInitScript(() => {
      class FakeSpeechRecognition {
        continuous = false;
        interimResults = false;
        lang = '';
        onresult: ((ev: unknown) => void) | null = null;
        onerror: ((ev: unknown) => void) | null = null;
        onend: (() => void) | null = null;
        start() {
          const emit = (text: string) => {
            this.onresult?.({
              resultIndex: 0,
              results: [{ isFinal: true, 0: { transcript: text }, length: 1 }],
            });
          };
          (window as unknown as { __emitTranscript?: (text: string) => void })
            .__emitTranscript = emit;
          setTimeout(() => emit('hello from fake speech'), 200);
        }
        stop() {
          this.onend?.();
        }
        abort() {
          this.onend?.();
        }
      }
      (window as unknown as { SpeechRecognition: unknown }).SpeechRecognition = FakeSpeechRecognition;
      (window as unknown as { webkitSpeechRecognition: unknown }).webkitSpeechRecognition =
        FakeSpeechRecognition;
    });

    await page.goto('/tools/meeting-notes/');
    await page.locator('#tab-live').waitFor({ state: 'visible' });

    await page.evaluate(async () => {
      const ctx = new AudioContext();
      await ctx.resume();
      const dest = ctx.createMediaStreamDestination();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      gain.gain.value = 0.2;
      osc.frequency.value = 440;
      osc.connect(gain);
      gain.connect(dest);
      osc.start();
      const orig = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getUserMedia = async () => {
        if (ctx.state === 'suspended') await ctx.resume();
        // Return cloned tracks so SessionRecorder cleanup does not kill the source.
        return new MediaStream(dest.stream.getAudioTracks().map((t) => t.clone()));
      };
      (window as unknown as { __restoreLive?: () => void }).__restoreLive = () => {
        navigator.mediaDevices.getUserMedia = orig;
        try { osc.stop(); } catch { /* ignore */ }
        void ctx.close();
      };
    });

    await page.locator('#live-src-mic').check();
    await page.locator('#allow-cloud-fallback').check();
    await page.locator('#record-live-audio').check();
    await page.locator('#start-live-btn').click();
    await expect(page.locator('#stop-live-btn')).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(800);

    await page.evaluate(() => {
      const emit = (window as unknown as { __emitTranscript?: (text: string) => void })
        .__emitTranscript;
      for (let i = 1; i <= 50; i += 1) {
        emit?.(`Dòng hội thoại số ${i} with an English phrase for the responsive transcript.`);
      }
    });
    await expect(page.locator('#transcript-panel')).toContainText('Dòng hội thoại số 50');
    await expect.poll(() => page.locator('#transcript-panel').evaluate((el) =>
      el.scrollHeight - el.scrollTop - el.clientHeight,
    )).toBeLessThanOrEqual(2);

    await page.locator('#transcript-panel').evaluate((el) => {
      el.scrollTop = 0;
      el.dispatchEvent(new Event('scroll'));
    });
    await expect(page.getByRole('button', { name: /jump to latest/i })).toBeVisible();

    await page.evaluate(() => {
      (window as unknown as { __emitTranscript?: (text: string) => void }).__emitTranscript?.(
        'Nội dung mới should not steal the user scroll position.',
      );
    });
    await expect(page.locator('#transcript-panel')).toContainText('Nội dung mới');
    expect(await page.locator('#transcript-panel').evaluate((el) => el.scrollTop)).toBeLessThan(10);

    await page.getByRole('button', { name: /jump to latest/i }).click();
    await expect.poll(() => page.locator('#transcript-panel').evaluate((el) =>
      el.scrollHeight - el.scrollTop - el.clientHeight,
    )).toBeLessThanOrEqual(2);
    await expect(page.getByRole('button', { name: /jump to latest/i })).toBeHidden();

    await page.locator('#stop-live-btn').click();
    await expect(page.locator('#download-recording-webm-btn')).toBeVisible({ timeout: 8000 });
    await expect(page.locator('#download-recording-mp3-btn')).toBeVisible();

    await page.evaluate(() => {
      (window as unknown as { __restoreLive?: () => void }).__restoreLive?.();
    });
  });

  // NOTE: there is no automated end-to-end test of the LocalAI live path's real transcript
  // (speak -> VAD detects utterance -> Whisper transcribes -> caption appears). There's no
  // injectable fake for @ricky0123/vad-web + the Whisper worker, and downloading the real
  // model in CI would be slow/flaky. Known coverage gap — verify manually in a real browser.

  /** Minimal 16 kHz mono PCM16 WAV of a sine tone — content is irrelevant to the mocked models. */
  function makeWavBuffer(seconds: number): Buffer {
    const sampleRate = 16000;
    const numSamples = Math.floor(seconds * sampleRate);
    const dataSize = numSamples * 2;
    const buf = Buffer.alloc(44 + dataSize);
    buf.write('RIFF', 0);
    buf.writeUInt32LE(36 + dataSize, 4);
    buf.write('WAVE', 8);
    buf.write('fmt ', 12);
    buf.writeUInt32LE(16, 16);
    buf.writeUInt16LE(1, 20); // PCM
    buf.writeUInt16LE(1, 22); // mono
    buf.writeUInt32LE(sampleRate, 24);
    buf.writeUInt32LE(sampleRate * 2, 28);
    buf.writeUInt16LE(2, 32);
    buf.writeUInt16LE(16, 34);
    buf.write('data', 36);
    buf.writeUInt32LE(dataSize, 40);
    for (let i = 0; i < numSamples; i++) {
      buf.writeInt16LE(Math.round(Math.sin((2 * Math.PI * 440 * i) / sampleRate) * 8000), 44 + i * 2);
    }
    return buf;
  }

  /**
   * Produces a transcript (fake SpeechRecognition live flow) and selects a synthetic WAV on the
   * Upload tab, leaving the page ready for the "Identify speakers" button. Assumes the caller
   * already installed init scripts and will re-navigate first.
   */
  async function prepareTranscriptAndUpload(page: import('@playwright/test').Page) {
    await page.goto('/tools/meeting-notes/');
    await page.locator('#tab-live').waitFor({ state: 'visible' });
    await page.locator('#live-src-mic').check();
    await page.locator('#allow-cloud-fallback').check();
    await page.locator('#record-live-audio').uncheck();
    await page.locator('#start-live-btn').click();
    await expect(page.locator('#stop-live-btn')).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(400);
    await page.evaluate(() => {
      const emit = (window as unknown as { __emitTranscript?: (text: string) => void }).__emitTranscript;
      emit?.('first mocked line for diarization');
      emit?.('second mocked line for diarization');
    });
    await expect(page.locator('#transcript-panel')).toContainText('second mocked line');
    await page.locator('#stop-live-btn').click();

    await page.locator('#tab-upload').click();
    await page.locator('#file-input').setInputFiles({
      name: 'meeting.wav',
      mimeType: 'audio/wav',
      buffer: makeWavBuffer(8),
    });
    await expect(page.locator('#diarize-btn')).toBeEnabled();
  }

  /** Fake SpeechRecognition + fake segment/diarize workers, installed before page scripts run. */
  async function installDiarizationMocks(page: import('@playwright/test').Page, opts: { segmentLoadFails: boolean }) {
    await page.addInitScript((segmentLoadFails: boolean) => {
      class FakeSpeechRecognition {
        continuous = false;
        interimResults = false;
        lang = '';
        onresult: ((ev: unknown) => void) | null = null;
        onerror: ((ev: unknown) => void) | null = null;
        onend: (() => void) | null = null;
        start() {
          (window as unknown as { __emitTranscript?: (text: string) => void }).__emitTranscript = (text) => {
            this.onresult?.({ resultIndex: 0, results: [{ isFinal: true, 0: { transcript: text }, length: 1 }] });
          };
        }
        stop() { this.onend?.(); }
        abort() { this.onend?.(); }
      }
      (window as unknown as { SpeechRecognition: unknown }).SpeechRecognition = FakeSpeechRecognition;
      (window as unknown as { webkitSpeechRecognition: unknown }).webkitSpeechRecognition = FakeSpeechRecognition;

      // Fake only the diarization-related workers (matched by chunk basename) — the mocked
      // segment worker reports two local speakers over an 8 s file; the mocked embedding worker
      // returns orthogonal "voices" keyed on slice length so clustering finds two speakers.
      type FakeMsg = { type?: string; payload?: { requestId?: string; audio?: { length: number } } };
      const OrigWorker = window.Worker;
      const makeFake = (kind: 'segment' | 'embed') => ({
        onmessage: null as ((ev: { data: unknown }) => void) | null,
        onerror: null,
        postMessage(msg: FakeMsg) {
          const respond = (data: unknown) => setTimeout(() => this.onmessage?.({ data }), 10);
          if (msg?.type === 'load') {
            if (kind === 'segment' && segmentLoadFails) {
              respond({ type: 'error', payload: { message: 'mock: segmentation unavailable' } });
            } else {
              respond({ type: 'ready' });
            }
          } else if (msg?.type === 'segment') {
            respond({
              type: 'segments',
              payload: {
                requestId: msg.payload?.requestId,
                segments: [
                  { startMs: 0, endMs: 3000, windowLocalSpeaker: 0, confidence: 0.9 },
                  { startMs: 3000, endMs: 8000, windowLocalSpeaker: 1, confidence: 0.9 },
                ],
              },
            });
          } else if (msg?.type === 'embed') {
            const len = msg.payload?.audio?.length ?? 0;
            respond({
              type: 'embedding',
              payload: { requestId: msg.payload?.requestId, embedding: len < 60000 ? [1, 0] : [0, 1] },
            });
          }
        },
        terminate() {},
      });
      window.Worker = new Proxy(OrigWorker, {
        construct(target, args: [string | URL, WorkerOptions?]) {
          const url = String(args[0] ?? '');
          if (url.includes('segment-worker')) return makeFake('segment') as unknown as Worker;
          if (url.includes('diarize-worker')) return makeFake('embed') as unknown as Worker;
          return new target(...args);
        },
      });
    }, opts.segmentLoadFails);
  }

  test('diarization with mocked workers labels two speakers and shows the pyannote engine badge', async ({ page, context }) => {
    test.setTimeout(60_000);
    await context.grantPermissions(['microphone']);
    await installDiarizationMocks(page, { segmentLoadFails: false });
    await prepareTranscriptAndUpload(page);

    await expect(page.locator('#expected-speakers')).toBeVisible();
    await page.locator('#diarize-btn').click();

    await expect(page.locator('#diarize-engine')).toBeVisible({ timeout: 20_000 });
    await expect(page.locator('#diarize-engine')).toHaveText(/Speaker-change model/);
    await expect(page.locator('.text-success')).toContainText('Identified 2 speaker(s)');

    // Both transcript lines fall inside the first (0–3 s) diarized segment → same speaker chip.
    const labels = page.locator('.speaker-label-input');
    await expect(labels).toHaveCount(2);
    expect(await labels.nth(0).inputValue()).toBe('Speaker 1');
    expect(await labels.nth(1).inputValue()).toBe('Speaker 1');

    // Renaming one label renames every segment using it.
    await labels.nth(0).fill('Alice');
    await labels.nth(0).press('Tab');
    expect(await labels.nth(1).inputValue()).toBe('Alice');
  });

  test('diarization falls back to pause-based segmentation when the model fails to load', async ({ page, context }) => {
    // The mocked segment worker rejects its load; the pipeline must degrade to the VAD
    // fallback (real silero VAD over the file — fetched from the pinned CDN, not an AI model
    // download) and surface the fallback engine badge instead of erroring out.
    test.setTimeout(90_000);
    await context.grantPermissions(['microphone']);
    await installDiarizationMocks(page, { segmentLoadFails: true });
    await prepareTranscriptAndUpload(page);

    await page.locator('#diarize-btn').click();
    await expect(page.locator('#diarize-engine')).toBeVisible({ timeout: 45_000 });
    await expect(page.locator('#diarize-engine')).toHaveText(/Fallback: pause-based/);
    await expect(page.locator('#error-msg')).not.toBeVisible();
  });

  test('clicking load whisper shows progress or error when HF blocked', async ({ page }) => {
    await page.locator('#tab-upload').click();
    await page.route('https://huggingface.co/**', (route) => route.abort());
    await page.locator('#load-whisper-btn').click();
    await expect(page.locator('.progress, #error-msg, .alert-success')).toBeVisible({ timeout: 8000 });
  });

  test('upload tab has file input', async ({ page }) => {
    await page.locator('#tab-upload').click();
    await expect(page.locator('#file-input')).toBeVisible();
  });
});
