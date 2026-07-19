import {
  acquireDisplayStream,
  mixMicWithAudioTracks,
  SystemAudioNotCapturedError,
  type RecordInputSource,
} from './audio-capture.ts';
import { MAX_RECORD_MS } from './constants.ts';

export type { RecordInputSource } from './audio-capture.ts';

function mimeTypeCandidates(): string[] {
  const preferred = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4'];
  if (typeof MediaRecorder === 'undefined') return preferred;
  const supported = preferred.filter((t) => MediaRecorder.isTypeSupported(t));
  // Empty string = let the browser pick a default mime type.
  return [...supported, ''];
}

function pickMimeType(): string {
  return mimeTypeCandidates().find((t) => t.length > 0) ?? 'audio/webm';
}

export class SessionRecorder {
  #stream: MediaStream | null = null;
  #displayStream: MediaStream | null = null;
  #micStream: MediaStream | null = null;
  #audioContext: AudioContext | null = null;
  #recorder: MediaRecorder | null = null;
  #chunks: Blob[] = [];
  #startedAt = 0;
  #mimeType = pickMimeType();
  /** When false, stop()/abort() will not call track.stop() on #stream (caller owns it). */
  #releaseStreamOnCleanup = true;
  #inputSource: RecordInputSource = 'mic';

  /** Fired when the user stops screen/tab share from the browser UI. */
  onCaptureEnded?: () => void;

  get elapsedMs(): number {
    return this.#startedAt ? Date.now() - this.#startedAt : 0;
  }

  get mimeType(): string {
    return this.#mimeType;
  }

  get inputSource(): RecordInputSource {
    return this.#inputSource;
  }

  async start(): Promise<void> {
    await this.startWithSource('mic');
  }

  async startWithSource(source: RecordInputSource): Promise<void> {
    this.#releaseStreamOnCleanup = true;
    this.#inputSource = source;
    const stream = await this.#acquireInputStream(source);
    await this.#beginRecording(stream);
  }

  /** Use an existing mic stream (e.g. shared with live captions). */
  async startWithStream(stream: MediaStream, opts?: { releaseStreamOnStop?: boolean }): Promise<void> {
    this.#releaseStreamOnCleanup = opts?.releaseStreamOnStop ?? false;
    this.#inputSource = 'mic';
    await this.#beginRecording(stream);
  }

  async #acquireInputStream(source: RecordInputSource): Promise<MediaStream> {
    if (source === 'mic') {
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      this.#micStream = micStream;
      return micStream;
    }

    this.#displayStream = await acquireDisplayStream();
    const displayTrack = this.#displayStream.getVideoTracks()[0];
    displayTrack?.addEventListener('ended', () => this.onCaptureEnded?.(), { once: true });

    const audioTracks = this.#displayStream.getAudioTracks();
    if (audioTracks.length === 0) {
      this.#releaseCaptureResources();
      throw new SystemAudioNotCapturedError();
    }

    if (source === 'system') {
      return new MediaStream(audioTracks);
    }

    const micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    this.#micStream = micStream;
    const { mixedStream, audioContext } = await mixMicWithAudioTracks(micStream, audioTracks);
    this.#audioContext = audioContext;
    return mixedStream;
  }

  async #beginRecording(stream: MediaStream): Promise<void> {
    if (this.#recorder?.state === 'recording') return;
    this.#chunks = [];

    const liveTracks = stream.getAudioTracks().filter((t) => t.readyState === 'live');
    if (liveTracks.length === 0) {
      throw new Error('No live audio tracks available to record. Check microphone / share permissions.');
    }

    let lastError: unknown;
    for (const mime of mimeTypeCandidates()) {
      const recordStream = new MediaStream(liveTracks.map((t) => t.clone()));
      try {
        const recorder = mime
          ? new MediaRecorder(recordStream, { mimeType: mime })
          : new MediaRecorder(recordStream);
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) this.#chunks.push(e.data);
        };
        recorder.start(1000);
        this.#stream = recordStream;
        this.#recorder = recorder;
        this.#mimeType = recorder.mimeType || mime || 'audio/webm';
        this.#startedAt = Date.now();
        return;
      } catch (err) {
        lastError = err;
        recordStream.getTracks().forEach((t) => t.stop());
      }
    }

    this.#stream = null;
    const detail = lastError instanceof Error ? lastError.message : String(lastError ?? 'unknown error');
    throw new Error(`Could not start audio recorder (${detail}). Try another browser or audio source.`);
  }

  async stop(): Promise<Blob> {
    const rec = this.#recorder;
    if (!rec || rec.state === 'inactive') {
      this.#cleanup();
      return new Blob(this.#chunks, { type: this.#mimeType });
    }
    return new Promise((resolve, reject) => {
      rec.onstop = () => {
        const blob = new Blob(this.#chunks, { type: this.#mimeType });
        this.#cleanup();
        resolve(blob);
      };
      rec.onerror = () => {
        this.#cleanup();
        reject(new Error('Recording failed.'));
      };
      rec.stop();
    });
  }

  abort(): void {
    try {
      if (this.#recorder?.state === 'recording') this.#recorder.stop();
    } catch {
      /* ignore */
    }
    this.#chunks = [];
    this.#cleanup();
  }

  isOverLimit(): boolean {
    return this.elapsedMs >= MAX_RECORD_MS;
  }

  #releaseCaptureResources(): void {
    this.#displayStream?.getTracks().forEach((t) => t.stop());
    this.#displayStream = null;
    if (this.#releaseStreamOnCleanup) {
      this.#micStream?.getTracks().forEach((t) => t.stop());
    }
    this.#micStream = null;
    if (this.#audioContext) {
      void this.#audioContext.close();
      this.#audioContext = null;
    }
  }

  #cleanup(): void {
    // Always stop the recording stream (cloned tracks owned by SessionRecorder).
    this.#stream?.getTracks().forEach((t) => t.stop());
    this.#releaseCaptureResources();
    this.#stream = null;
    this.#recorder = null;
    this.#startedAt = 0;
  }
}
