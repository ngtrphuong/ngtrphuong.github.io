export type RecordInputSource = 'mic' | 'system' | 'mixed';

export function supportsDisplayMediaCapture(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getDisplayMedia;
}

export function recordSourceLabel(source: RecordInputSource): string {
  switch (source) {
    case 'mic':
      return 'Microphone';
    case 'system':
      return 'System / tab audio';
    case 'mixed':
      return 'Microphone + system audio';
  }
}

export class SystemAudioNotCapturedError extends Error {
  constructor() {
    super(
      'System audio was not captured. In the browser share dialog, pick a tab or screen and enable ' +
      '"Share tab audio" or "Share system audio", then try again.',
    );
    this.name = 'SystemAudioNotCapturedError';
  }
}

/** Request tab/screen capture; keeps the display stream alive for the recording session. */
export async function acquireDisplayStream(): Promise<MediaStream> {
  return navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: true,
  } as MediaStreamConstraints);
}

/** Mix mic + display audio tracks into one stream for MediaRecorder. */
export async function mixMicWithAudioTracks(
  micStream: MediaStream,
  audioTracks: MediaStreamTrack[],
): Promise<{ mixedStream: MediaStream; audioContext: AudioContext }> {
  const audioContext = new AudioContext();
  await audioContext.resume().catch(() => {});
  const dest = audioContext.createMediaStreamDestination();

  if (audioTracks.length > 0) {
    audioContext
      .createMediaStreamSource(new MediaStream(audioTracks))
      .connect(dest);
  }

  audioContext.createMediaStreamSource(micStream).connect(dest);
  return { mixedStream: dest.stream, audioContext };
}
