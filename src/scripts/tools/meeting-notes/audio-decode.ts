import { ALLOWED_AUDIO_MIMES, ALLOWED_EXTENSIONS, MAX_UPLOAD_BYTES, WHISPER_SAMPLE_RATE } from './constants.ts';

export type DecodedAudio = {
  samples: Float32Array;
  sampleRate: number;
  durationSec: number;
};

export function validateAudioBlob(blob: Blob, fileName?: string): void {
  if (blob.size > MAX_UPLOAD_BYTES) {
    throw new Error(`File is too large (max ${Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))} MB).`);
  }
  const mime = blob.type.split(';')[0]?.trim().toLowerCase() ?? '';
  if (mime && ALLOWED_AUDIO_MIMES.has(mime)) return;
  const ext = fileName ? fileName.slice(fileName.lastIndexOf('.')).toLowerCase() : '';
  if (ext && ALLOWED_EXTENSIONS.has(ext)) return;
  if (!mime && !ext) return;
  throw new Error('Unsupported file type. Use webm, wav, mp3, ogg, flac, or mp4.');
}

export async function decodeAudioBlob(blob: Blob, fileName?: string): Promise<DecodedAudio> {
  validateAudioBlob(blob, fileName);
  const ctx = new AudioContext();
  try {
    const buffer = await ctx.decodeAudioData(await blob.arrayBuffer());
    const mono = mixToMono(buffer);
    const samples =
      buffer.sampleRate === WHISPER_SAMPLE_RATE
        ? mono
        : resampleLinear(mono, buffer.sampleRate, WHISPER_SAMPLE_RATE);
    return {
      samples,
      sampleRate: WHISPER_SAMPLE_RATE,
      durationSec: samples.length / WHISPER_SAMPLE_RATE,
    };
  } finally {
    await ctx.close();
  }
}

export async function probeAudioDuration(blob: Blob, fileName?: string): Promise<number> {
  validateAudioBlob(blob, fileName);
  const ctx = new AudioContext();
  try {
    const buffer = await ctx.decodeAudioData(await blob.arrayBuffer());
    return buffer.duration;
  } finally {
    await ctx.close();
  }
}

function mixToMono(buffer: AudioBuffer): Float32Array {
  if (buffer.numberOfChannels === 1) {
    return buffer.getChannelData(0).slice();
  }
  const len = buffer.length;
  const out = new Float32Array(len);
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const ch = buffer.getChannelData(c);
    for (let i = 0; i < len; i++) out[i] += ch[i] / buffer.numberOfChannels;
  }
  return out;
}

function resampleLinear(input: Float32Array, fromRate: number, toRate: number): Float32Array {
  if (fromRate === toRate) return input;
  const ratio = fromRate / toRate;
  const outLen = Math.floor(input.length / ratio);
  const out = new Float32Array(outLen);
  for (let i = 0; i < outLen; i++) {
    const src = i * ratio;
    const idx = Math.floor(src);
    const frac = src - idx;
    const a = input[idx] ?? 0;
    const b = input[idx + 1] ?? a;
    out[i] = a + (b - a) * frac;
  }
  return out;
}

export function splitIntoChunks(
  samples: Float32Array,
  sampleRate: number,
  chunkSeconds: number,
): Float32Array[] {
  const chunkSize = Math.floor(sampleRate * chunkSeconds);
  if (samples.length <= chunkSize) return [samples];
  const chunks: Float32Array[] = [];
  for (let i = 0; i < samples.length; i += chunkSize) {
    chunks.push(samples.subarray(i, Math.min(i + chunkSize, samples.length)));
  }
  return chunks;
}
