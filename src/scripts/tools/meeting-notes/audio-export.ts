/**
 * Save recorded audio as .webm (native MediaRecorder) or .mp3 (via mediabunny).
 * Mediabunny is loaded only when converting to MP3 so the Meeting Notes page
 * stays light and Playwright Chromium does not crash on initial navigation.
 */

export type AudioDownloadFormat = 'webm' | 'mp3';

let mp3EncoderReady: Promise<void> | null = null;

/** Lazy-register LAME WASM encoder only when the user requests .mp3. */
async function ensureMp3Encoder(): Promise<void> {
  if (!mp3EncoderReady) {
    mp3EncoderReady = (async () => {
      const { canEncodeAudio } = await import('mediabunny');
      if (await canEncodeAudio('mp3')) return;
      const { registerMp3Encoder } = await import('@mediabunny/mp3-encoder');
      registerMp3Encoder();
    })();
  }
  await mp3EncoderReady;
}

export function extensionForMime(mimeType: string): 'webm' | 'ogg' | 'mp4' | 'bin' {
  const base = mimeType.split(';')[0].trim().toLowerCase();
  if (base.includes('webm')) return 'webm';
  if (base.includes('ogg')) return 'ogg';
  if (base.includes('mp4') || base.includes('m4a') || base.includes('aac')) return 'mp4';
  return 'bin';
}

export function recordingBasename(prefix = 'meeting-recording'): string {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  return `${prefix}-${stamp}`;
}

/** Ensure the blob has a usable audio MIME (MediaRecorder sometimes omits type). */
export function normalizeRecordingBlob(blob: Blob, fallbackMime = 'audio/webm'): Blob {
  if (blob.type && blob.type !== 'application/octet-stream') return blob;
  return new Blob([blob], { type: fallbackMime });
}

export async function convertBlobToMp3(blob: Blob): Promise<Blob> {
  await ensureMp3Encoder();
  const {
    ALL_FORMATS,
    BlobSource,
    BufferTarget,
    Conversion,
    Input,
    Mp3OutputFormat,
    Output,
  } = await import('mediabunny');

  const input = new Input({
    source: new BlobSource(normalizeRecordingBlob(blob)),
    formats: ALL_FORMATS,
  });
  const output = new Output({
    format: new Mp3OutputFormat(),
    target: new BufferTarget(),
  });
  const conversion = await Conversion.init({ input, output });
  if (!conversion.isValid) {
    input.dispose();
    throw new Error(
      conversion.discardedTracks.length
        ? 'MP3 conversion failed: audio track could not be encoded in this browser.'
        : 'MP3 conversion configuration is invalid.',
    );
  }
  await conversion.execute();
  input.dispose();
  const buffer = output.target.buffer;
  if (!buffer) throw new Error('MP3 conversion produced an empty buffer.');
  return new Blob([buffer], { type: 'audio/mpeg' });
}

/**
 * Trigger a browser download with an explicit filename suffix (.webm / .mp3).
 * Returns the object URL created (caller may revoke later).
 */
export async function downloadRecordingBlob(
  blob: Blob,
  format: AudioDownloadFormat,
  basename = recordingBasename(),
): Promise<{ url: string; filename: string }> {
  const source = normalizeRecordingBlob(blob);
  let outBlob: Blob;
  let filename: string;

  if (format === 'mp3') {
    outBlob = await convertBlobToMp3(source);
    filename = `${basename}.mp3`;
  } else {
    const ext = extensionForMime(source.type);
    // Always advertise .webm when MediaRecorder used webm/opus; otherwise keep detected ext.
    const useExt = ext === 'bin' ? 'webm' : ext === 'webm' ? 'webm' : ext;
    outBlob = source.type.includes('webm') || useExt === 'webm'
      ? new Blob([source], { type: source.type || 'audio/webm' })
      : source;
    filename = `${basename}.${useExt}`;
    if (format === 'webm' && useExt !== 'webm') {
      // Prefer .webm label when caller asked for webm even if mime was ogg/mp4.
      filename = `${basename}.webm`;
      outBlob = new Blob([source], { type: 'audio/webm' });
    }
  }

  const url = URL.createObjectURL(outBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  a.remove();
  return { url, filename };
}
