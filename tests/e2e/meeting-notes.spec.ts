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
    // No fake SpeechRecognition here — exercises the real resolvePrivacyMode() fallback path
    // against the actual browser API, on a fresh, un-primed profile.
    test.setTimeout(30_000);
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
