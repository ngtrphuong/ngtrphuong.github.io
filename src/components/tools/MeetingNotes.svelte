<svelte:options runes={false} />

<script lang="ts">
  import { onDestroy, onMount, tick } from 'svelte';
  import { startLiveEngine } from '@scripts/tools/meeting-notes/live-engine.ts';
  import {
    isWebSpeechSupported,
    supportsMeetingAudioCaptions,
    isFatalSpeechErrorMessage,
    supportsOnDeviceLanguagePack,
    checkOnDeviceLanguage,
    installOnDeviceLanguagePack,
    onDeviceLangStatusLabel,
    type OnDeviceLangStatus,
  } from '@scripts/tools/meeting-notes/asr-web-speech.ts';
  import { suggestsNewTurn, defaultSpeakerLabel } from '@scripts/tools/meeting-notes/speaker-turns.ts';
  import { WhisperWorkerBridge } from '@scripts/tools/meeting-notes/asr-whisper-bridge.ts';
  import { SessionRecorder } from '@scripts/tools/meeting-notes/audio-record.ts';
  import {
    recordSourceLabel,
    supportsDisplayMediaCapture,
    type RecordInputSource,
  } from '@scripts/tools/meeting-notes/audio-capture.ts';
  import {
    downloadRecordingBlob,
    normalizeRecordingBlob,
    recordingBasename,
    type AudioDownloadFormat,
  } from '@scripts/tools/meeting-notes/audio-export.ts';
  import { probeAudioDuration, decodeAudioBlob } from '@scripts/tools/meeting-notes/audio-decode.ts';
  import { NonRealTimeVAD } from '@ricky0123/vad-web';
  import { DiarizeBridge } from '@scripts/tools/meeting-notes/diarize-bridge.ts';
  import { clusterSpeakers, reconcileWithTranscript, type SpeakerEmbedding } from '@scripts/tools/meeting-notes/diarization.ts';
  import {
    DEFAULT_LANG,
    HINT_DISMISSED_KEY,
    LANGUAGE_OPTIONS,
    VAD_BASE_ASSET_PATH,
    VAD_ONNX_WASM_BASE_PATH,
    WHISPER_MODEL_DEFAULT,
    WHISPER_MODEL_OPTIONS,
    whisperLangFromBcp47,
  } from '@scripts/tools/meeting-notes/constants.ts';
  import {
    appendSegment,
    fmtElapsed,
    msToTimestamp,
    segmentsToJson,
    segmentsToMarkdown,
    segmentsToPlainText,
  } from '@scripts/tools/meeting-notes/format.ts';
  import {
    buildMinutesPrompt,
    canGenerateMinutes,
    minutesToMarkdown,
    parseMinutesResponse,
  } from '@scripts/tools/meeting-notes/minutes.ts';
  import { clearSession, loadSession, saveSession } from '@scripts/tools/meeting-notes/storage.ts';
  import type {
    ActiveTab,
    LiveAsrSession,
    LiveCaptionSource,
    LiveEngine,
    LivePhase,
    MinutesResult,
    PrivacyMode,
    RecordPhase,
    TranscriptSegment,
    WhisperPhase,
  } from '@scripts/tools/meeting-notes/types.ts';

  let activeTab: ActiveTab = 'live';
  let language = DEFAULT_LANG;
  let liveEngine: LiveEngine = 'web-speech';
  let preferOnDevice = true;
  // Default on: most fresh browser profiles don't have the on-device speech pack installed yet,
  // and without this, Live captions fail outright with "On-device language pack unavailable"
  // instead of falling back — a confusing "it just doesn't work" first impression.
  let allowCloudFallback = true;
  let recordLiveAudio = true;
  let privacyMode: PrivacyMode = 'on-device';
  let privacyLabel = 'On-device';

  let whisperPhase: WhisperPhase = 'idle';
  let livePhase: LivePhase = 'idle';
  let recordPhase: RecordPhase = 'idle';
  let loadProgress = 0;
  let loadStatusText = '';
  let transcribeProgress = 0;
  let transcribeStatus = '';
  let errorMessage = '';
  let downloadBusy = false;

  let segments: TranscriptSegment[] = [];
  let dontPersist = false;
  let hintDismissed = false;

  let selectedModel = WHISPER_MODEL_DEFAULT;
  let dirHandle: FileSystemDirectoryHandle | null = null;
  let dirName = '';

  let selectedFile: File | null = null;
  let fileDurationSec: number | null = null;

  let recordInputSource: RecordInputSource = 'mic';

  let liveCaptionSource: LiveCaptionSource = 'mic';
  let liveStatusHint = '';
  let listeningForSpeech = false;

  let langPackStatus: OnDeviceLangStatus | 'checking' = 'checking';
  let langPackInstalling = false;

  let liveSession: LiveAsrSession | null = null;
  let micStream: MediaStream | null = null;
  let liveRecorder: SessionRecorder | null = null;

  let recorder: SessionRecorder | null = null;
  let lastRecordingBlob: Blob | null = null;
  let downloadRecordingUrl: string | null = null;
  let lastRecordingFilename = 'meeting-recording.webm';

  let elapsedSec = 0;
  let timerId: ReturnType<typeof setInterval> | null = null;

  let whisperBridge: WhisperWorkerBridge | null = null;
  let minutesWorker: Worker | null = null;

  let minutesPhase: 'idle' | 'loading-model' | 'generating' | 'ready' | 'error' = 'idle';
  let minutesDraft: MinutesResult | null = null;
  let minutesRawOutput = '';
  let showStopCaptureModal = false;
  let pendingTab: ActiveTab | null = null;

  let lastSegmentEndMs: number | null = null;
  let turnCount = 0;
  let speakerLabelOverrides: Record<string, string> = {};

  let diarizeBridge: DiarizeBridge | null = null;
  let diarizationPhase: 'idle' | 'loading' | 'running' | 'ready' | 'error' = 'idle';
  let diarizationProgress = 0;
  let diarizationStatusText = '';

  let transcriptPanel: HTMLDivElement | null = null;
  let transcriptAutoFollow = true;
  const TRANSCRIPT_BOTTOM_THRESHOLD_PX = 56;

  const webSpeechOk = isWebSpeechSupported();
  const displayMediaOk = supportsDisplayMediaCapture();
  const meetingCaptionsOk = supportsMeetingAudioCaptions();

  $: whisperLang = whisperLangFromBcp47(language);
  $: hasTranscript = segments.some((s) => s.isFinal && s.text.trim());
  $: hasInterimSegment = segments.some((s) => !s.isFinal);
  $: normalizedLiveSource = liveCaptionSource === 'meeting-audio' ? 'system' : liveCaptionSource;
  $: liveIdleOrError = livePhase === 'idle' || livePhase === 'error';
  $: recordIdleOrError = recordPhase === 'idle' || recordPhase === 'error';
  $: canStartLiveWebSpeech =
    webSpeechOk && liveIdleOrError && recordPhase !== 'recording' &&
    (normalizedLiveSource === 'mic' || meetingCaptionsOk);
  $: canStartLiveLocalAi =
    whisperPhase === 'ready' && liveIdleOrError && recordPhase !== 'recording' &&
    (normalizedLiveSource === 'mic' || displayMediaOk);
  $: canStartLive = liveEngine === 'local-ai' ? canStartLiveLocalAi : canStartLiveWebSpeech;
  $: canStopLive = livePhase === 'listening';
  $: canLoadWhisper = whisperPhase === 'idle' || whisperPhase === 'error';
  $: canStartRecord = recordIdleOrError && livePhase !== 'listening' && whisperPhase !== 'transcribing';
  $: canStopRecord = recordPhase === 'recording';
  $: canTranscribeRecording = whisperPhase === 'ready' && !!lastRecordingBlob && livePhase !== 'listening' && recordPhase !== 'recording';
  $: canTranscribeFile = whisperPhase === 'ready' && !!selectedFile && livePhase !== 'listening' && recordPhase !== 'recording';
  $: showWhisperBlock = activeTab === 'record' || activeTab === 'upload' || (activeTab === 'live' && liveEngine === 'local-ai');
  $: showFirstRunHint = showWhisperBlock && !hintDismissed && whisperPhase === 'idle';
  $: showMinutesBtn = canGenerateMinutes(segments);
  $: diarizationSource = lastRecordingBlob ?? (activeTab === 'upload' ? selectedFile : null);
  $: canDiarize = hasTranscript && !!diarizationSource && diarizationPhase !== 'loading' && diarizationPhase !== 'running';
  $: langPackStatusText = langPackStatus === 'checking'
    ? 'Checking on-device language pack…'
    : onDeviceLangStatusLabel(langPackStatus as OnDeviceLangStatus, language);
  $: showInstallLangPack = preferOnDevice && supportsOnDeviceLanguagePack() && langPackStatus === 'downloadable' && liveEngine === 'web-speech';
  $: canInstallLangPack = showInstallLangPack && !langPackInstalling && livePhase !== 'listening';
  $: showWebSpeechPrivacy = liveEngine === 'web-speech';

  function isTranscriptNearBottom(): boolean {
    if (!transcriptPanel) return true;
    return transcriptPanel.scrollHeight - transcriptPanel.scrollTop - transcriptPanel.clientHeight
      <= TRANSCRIPT_BOTTOM_THRESHOLD_PX;
  }

  function onTranscriptScroll() {
    transcriptAutoFollow = isTranscriptNearBottom();
  }

  function transcriptViewport(node: HTMLDivElement) {
    transcriptPanel = node;
    return () => {
      if (transcriptPanel === node) transcriptPanel = null;
    };
  }

  async function followTranscriptToLatest() {
    await tick();
    if (transcriptAutoFollow && transcriptPanel) {
      transcriptPanel.scrollTop = transcriptPanel.scrollHeight;
    }
  }

  async function jumpTranscriptToLatest() {
    transcriptAutoFollow = true;
    await followTranscriptToLatest();
  }

  function getWhisperBridge(): WhisperWorkerBridge {
    if (!whisperBridge) {
      whisperBridge = new WhisperWorkerBridge();
    }
    return whisperBridge;
  }

  async function refreshLangPackStatus() {
    if (!webSpeechOk || !preferOnDevice || liveEngine !== 'web-speech') {
      langPackStatus = 'api-unavailable';
      return;
    }
    langPackStatus = 'checking';
    langPackStatus = await checkOnDeviceLanguage(language);
  }

  async function installLangPack() {
    if (!canInstallLangPack) return;
    langPackInstalling = true;
    errorMessage = '';
    try {
      await installOnDeviceLanguagePack(language);
      langPackStatus = 'available';
    } catch (err: unknown) {
      errorMessage = err instanceof Error ? err.message : String(err);
    } finally {
      langPackInstalling = false;
    }
  }

  function onLanguageChange() {
    if (activeTab === 'live') void refreshLangPackStatus();
  }

  function onPreferOnDeviceChange() {
    if (activeTab === 'live') void refreshLangPackStatus();
  }

  function privacyLabelFor(mode: PrivacyMode): string {
    if (mode === 'on-device') return 'On-device';
    if (mode === 'cloud-assisted') return 'Cloud-assisted';
    return 'Local Whisper model';
  }

  function updatePrivacyBadge(mode: PrivacyMode) {
    privacyMode = mode;
    privacyLabel = privacyLabelFor(mode);
  }

  function onLiveEngineChange() {
    if (liveEngine === 'local-ai') {
      updatePrivacyBadge('local-model');
    } else {
      updatePrivacyBadge(preferOnDevice ? 'on-device' : 'cloud-assisted');
      void refreshLangPackStatus();
    }
  }

  function startTimer() {
    stopTimer();
    elapsedSec = 0;
    timerId = setInterval(() => { elapsedSec += 1; }, 1000);
  }

  function stopTimer() {
    if (timerId) clearInterval(timerId);
    timerId = null;
  }

  async function persistIfEnabled() {
    if (!dontPersist && segments.length) {
      await saveSession(segments, language, speakerLabelOverrides);
    }
  }

  function handleLiveError(msg: string) {
    // Web Speech fires benign errors during normal continuous listening (silence, restarts) —
    // only treat those as a status hint. LocalAI (Whisper+VAD) has no such transient errors.
    if (liveEngine === 'web-speech' && !isFatalSpeechErrorMessage(msg)) {
      liveStatusHint = msg;
      return;
    }
    errorMessage = msg;
    livePhase = 'error';
  }

  /**
   * Prefers the engine's own VAD-timestamp-derived turnBoundary hint (see live-engine.ts) —
   * accurate acoustic pause detection — falling back to the plain gap heuristic (speaker-turns.ts)
   * when no such hint is available (Record/Upload's Whisper-only path). Heuristic either way —
   * not a verified speaker identity.
   */
  function resolveSpeakerId(seg: TranscriptSegment): string {
    const isNewTurn = seg.turnBoundary ?? suggestsNewTurn(lastSegmentEndMs ?? undefined, seg.startMs);
    if (isNewTurn) turnCount += 1;
    return defaultSpeakerLabel(Math.max(0, turnCount - 1));
  }

  function renameSpeaker(speakerId: string | undefined, value: string) {
    if (!speakerId) return;
    speakerLabelOverrides = { ...speakerLabelOverrides, [speakerId]: value };
  }

  function addSegment(seg: TranscriptSegment) {
    liveStatusHint = '';
    if (!seg.isFinal) {
      // Interim (Web Speech only) — show the live partial text, don't touch turn/speaker state.
      segments = appendSegment(segments, seg);
      void followTranscriptToLatest();
      return;
    }
    const speakerId = resolveSpeakerId(seg);
    lastSegmentEndMs = seg.endMs;
    segments = appendSegment(segments, { ...seg, speakerId });
    void followTranscriptToLatest();
    void persistIfEnabled();
  }

  async function pickDirectory() {
    if (!('showDirectoryPicker' in window)) {
      alert('Your browser does not support choosing a cache folder. The model will use built-in browser cache.');
      return;
    }
    try {
      dirHandle = await (window as Window & { showDirectoryPicker: (o: unknown) => Promise<FileSystemDirectoryHandle> })
        .showDirectoryPicker({ mode: 'readwrite', id: 'meeting-notes-model-cache' });
      dirName = dirHandle.name;
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        alert('Could not open directory: ' + err.message);
      }
    }
  }

  function clearDirectory() {
    dirHandle = null;
    dirName = '';
  }

  async function loadWhisperModel() {
    if (whisperPhase === 'loading') return;
    whisperPhase = 'loading';
    loadProgress = 0;
    loadStatusText = 'Initializing…';
    errorMessage = '';
    updatePrivacyBadge('local-model');
    try {
      await getWhisperBridge().loadModel(
        { dirHandle: dirHandle ?? undefined, modelId: selectedModel },
        (pct, status) => {
          loadProgress = Math.max(0, Math.min(100, pct));
          loadStatusText = status;
        },
      );
      whisperPhase = 'ready';
      loadStatusText = '';
    } catch (err: unknown) {
      errorMessage = err instanceof Error ? err.message : String(err);
      whisperPhase = 'error';
    }
  }

  async function attachLiveRecorder(stream: MediaStream) {
    if (!recordLiveAudio) return;
    liveRecorder = new SessionRecorder();
    await liveRecorder.startWithStream(stream, { releaseStreamOnStop: false });
  }

  function liveCallbacks() {
    return {
      onPartial: (seg: TranscriptSegment) => addSegment(seg),
      onFinal: (seg: TranscriptSegment) => addSegment(seg),
      onError: handleLiveError,
      onPrivacyMode: (mode: PrivacyMode) => updatePrivacyBadge(mode),
      onSpeechStart: () => { listeningForSpeech = true; },
      onSpeechEnd: () => { listeningForSpeech = false; },
    };
  }

  async function startLive() {
    if (!canStartLive) return;
    errorMessage = '';
    liveStatusHint = '';
    livePhase = 'idle';
    revokeDownloadUrl();
    lastRecordingBlob = null;
    liveRecorder = null;

    const source = normalizedLiveSource;

    try {
      liveSession = await startLiveEngine(
        source,
        {
          engine: liveEngine,
          preferOnDevice,
          allowCloudFallback,
          onMediaStream: async (stream: MediaStream) => {
            micStream = stream;
            await attachLiveRecorder(stream);
          },
        },
        liveCallbacks(),
        getWhisperBridge(),
        language,
        whisperLang,
      );
      liveStatusHint = liveEngine === 'local-ai'
        ? 'LocalAI (Whisper): captions appear after each pause in speech.'
        : source === 'mic'
          ? 'Web Speech on microphone.'
          : source === 'mixed'
            ? 'Web Speech on microphone + tab/system audio (mixed).'
            : 'Web Speech on tab/system audio. Keep the shared tab audible.';
      livePhase = 'listening';
      startTimer();
    } catch (err: unknown) {
      errorMessage = err instanceof Error ? err.message : String(err);
      micStream?.getTracks().forEach((t) => t.stop());
      micStream = null;
      // Stay idle so Start remains usable after a failed attempt.
      livePhase = 'idle';
    }
  }

  async function stopLive() {
    stopTimer();
    listeningForSpeech = false;
    if (liveRecorder) {
      try {
        const blob = normalizeRecordingBlob(await liveRecorder.stop());
        lastRecordingBlob = blob;
        revokeDownloadUrl();
        downloadRecordingUrl = URL.createObjectURL(blob);
        lastRecordingFilename = `${recordingBasename()}.${blob.type.includes('webm') ? 'webm' : 'webm'}`;
        setTimeout(() => revokeDownloadUrl(), 5 * 60 * 1000);
      } catch {
        /* recording optional */
      }
      liveRecorder = null;
    }
    await liveSession?.stop();
    liveSession = null;
    micStream?.getTracks().forEach((t) => t.stop());
    micStream = null;
    livePhase = 'idle';

    await persistIfEnabled();
    void refreshLangPackStatus();
  }

  async function startRecording() {
    if (!canStartRecord) return;
    errorMessage = '';
    lastRecordingBlob = null;
    revokeDownloadUrl();
    recorder = new SessionRecorder();
    recorder.onCaptureEnded = () => {
      if (recordPhase === 'recording') void stopRecordingOnly();
    };
    try {
      await recorder.startWithSource(recordInputSource);
      recordPhase = 'recording';
      startTimer();
    } catch (err: unknown) {
      errorMessage = err instanceof Error ? err.message : String(err);
      recorder?.abort();
      recorder = null;
      // Stay idle so Start remains usable after a failed attempt.
      recordPhase = 'idle';
    }
  }

  async function finalizeRecordingBlob(): Promise<Blob | null> {
    if (!recorder) return null;
    const blob = normalizeRecordingBlob(await recorder.stop());
    recorder = null;
    lastRecordingBlob = blob;
    revokeDownloadUrl();
    downloadRecordingUrl = URL.createObjectURL(blob);
    lastRecordingFilename = `${recordingBasename()}.webm`;
    setTimeout(() => revokeDownloadUrl(), 10 * 60 * 1000);
    return blob;
  }

  async function stopRecordingOnly() {
    if (!recorder || recordPhase !== 'recording') return;
    stopTimer();
    recordPhase = 'idle';
    try {
      await finalizeRecordingBlob();
    } catch (err: unknown) {
      errorMessage = err instanceof Error ? err.message : String(err);
      recordPhase = 'error';
    }
  }

  async function stopAndTranscribe() {
    if (!recorder || recordPhase !== 'recording') return;
    stopTimer();
    recordPhase = 'idle';
    try {
      const blob = await finalizeRecordingBlob();
      if (!blob) return;
      if (whisperPhase !== 'ready') {
        errorMessage = 'Recording saved. Load the Whisper model, then click Transcribe recording.';
        return;
      }
      await runTranscribe(blob, lastRecordingFilename);
    } catch (err: unknown) {
      errorMessage = err instanceof Error ? err.message : String(err);
      recordPhase = 'error';
    }
  }

  async function transcribeLastRecording() {
    if (!lastRecordingBlob || !canTranscribeRecording) return;
    await runTranscribe(lastRecordingBlob, lastRecordingFilename);
  }

  async function saveRecordingAs(format: AudioDownloadFormat) {
    if (!lastRecordingBlob || downloadBusy) return;
    downloadBusy = true;
    errorMessage = '';
    try {
      const { url, filename } = await downloadRecordingBlob(lastRecordingBlob, format);
      lastRecordingFilename = filename;
      // Keep a preview URL for the UI as well (webm native blob).
      if (format === 'webm') {
        revokeDownloadUrl();
        downloadRecordingUrl = url;
      } else {
        // Temporary URL for the converted file — revoke after a short delay.
        setTimeout(() => URL.revokeObjectURL(url), 60_000);
      }
    } catch (err: unknown) {
      errorMessage = err instanceof Error ? err.message : String(err);
    } finally {
      downloadBusy = false;
    }
  }

  function revokeDownloadUrl() {
    if (downloadRecordingUrl) {
      URL.revokeObjectURL(downloadRecordingUrl);
      downloadRecordingUrl = null;
    }
  }

  async function runTranscribe(blob: Blob, fileName?: string) {
    whisperPhase = 'transcribing';
    transcribeProgress = 0;
    transcribeStatus = 'Decoding audio…';
    updatePrivacyBadge('local-model');
    try {
      const newSegs = await getWhisperBridge().transcribeBlob(blob, whisperLang, {
        onProgress: (pct, status) => {
          transcribeProgress = pct;
          transcribeStatus = status;
        },
        onSegment: (seg) => addSegment(seg),
        onError: (msg) => { errorMessage = msg; },
      }, fileName);
      void newSegs;
      whisperPhase = 'ready';
      transcribeStatus = '';
    } catch (err: unknown) {
      errorMessage = err instanceof Error ? err.message : String(err);
      whisperPhase = 'ready';
    }
  }

  async function onFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    selectedFile = file;
    fileDurationSec = null;
    if (!file) return;
    try {
      fileDurationSec = await probeAudioDuration(file, file.name);
    } catch (err: unknown) {
      errorMessage = err instanceof Error ? err.message : String(err);
      selectedFile = null;
      input.value = '';
    }
  }

  async function transcribeFile() {
    if (!selectedFile || !canTranscribeFile) return;
    await runTranscribe(selectedFile, selectedFile.name);
  }

  function switchTab(tab: ActiveTab) {
    if (tab === activeTab) return;
    if (livePhase === 'listening' || recordPhase === 'recording') {
      pendingTab = tab;
      showStopCaptureModal = true;
      return;
    }
    activeTab = tab;
    if (tab === 'live') {
      void refreshLangPackStatus();
      if (privacyMode === 'local-model') {
        updatePrivacyBadge(liveEngine === 'local-ai' ? 'local-model' : (preferOnDevice ? 'on-device' : 'cloud-assisted'));
      }
    }
  }

  async function confirmStopCapture() {
    if (livePhase === 'listening') await stopLive();
    if (recordPhase === 'recording') {
      recorder?.abort();
      recorder = null;
      recordPhase = 'idle';
      stopTimer();
    }
    showStopCaptureModal = false;
    if (pendingTab) {
      activeTab = pendingTab;
      pendingTab = null;
    }
  }

  function dismissHint() {
    hintDismissed = true;
    try { sessionStorage.setItem(HINT_DISMISSED_KEY, '1'); } catch { /* ignore */ }
  }

  async function clearAllSession() {
    if (whisperPhase === 'transcribing') {
      if (!confirm('Transcription in progress. Clear anyway?')) return;
      whisperBridge?.abort();
      whisperPhase = 'ready';
    }
    segments = [];
    transcriptAutoFollow = true;
    minutesDraft = null;
    minutesRawOutput = '';
    lastSegmentEndMs = null;
    turnCount = 0;
    speakerLabelOverrides = {};
    diarizationPhase = 'idle';
    diarizationStatusText = '';
    await clearSession();
  }

  async function copyTranscript() {
    await navigator.clipboard.writeText(segmentsToPlainText(segments));
  }

  function downloadMd() {
    const content = segmentsToMarkdown(segments);
    downloadText(content, 'meeting-transcript.md', 'text/markdown');
  }

  function downloadJson() {
    downloadText(segmentsToJson(segments), 'meeting-transcript.json', 'application/json');
  }

  function downloadText(content: string, name: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function generateMinutes() {
    if (!showMinutesBtn) return;
    minutesPhase = 'loading-model';
    minutesRawOutput = '';
    minutesDraft = null;
    errorMessage = '';

    if (!minutesWorker) {
      minutesWorker = new Worker(new URL('./meeting-notes/minutes-worker.ts', import.meta.url), { type: 'module' });
    }

    const prompt = buildMinutesPrompt(segments);

    await new Promise<void>((resolve, reject) => {
      const onMsg = (e: MessageEvent) => {
        const { type, payload } = e.data as { type: string; payload: unknown };
        if (type === 'ready') {
          minutesPhase = 'generating';
          minutesWorker!.postMessage({ type: 'generate', payload: { prompt } });
        } else if (type === 'token') {
          minutesRawOutput += String(payload ?? '');
        } else if (type === 'done') {
          minutesWorker!.removeEventListener('message', onMsg);
          resolve();
        } else if (type === 'error') {
          minutesWorker!.removeEventListener('message', onMsg);
          reject(new Error(String(payload ?? 'Minutes generation failed')));
        }
      };
      minutesWorker!.addEventListener('message', onMsg);
      minutesWorker!.postMessage({ type: 'load', payload: { dirHandle: dirHandle ?? undefined } });
    }).catch((err: unknown) => {
      errorMessage = err instanceof Error ? err.message : String(err);
      minutesPhase = 'error';
      return;
    });

    if (minutesPhase === 'generating' || minutesRawOutput) {
      minutesDraft = parseMinutesResponse(minutesRawOutput, segments);
      minutesPhase = minutesDraft ? 'ready' : 'error';
      if (!minutesDraft) errorMessage = 'Could not parse minutes from model output. Try again or edit manually.';
    }
  }

  function downloadMinutesMd() {
    if (!minutesDraft) return;
    downloadText(minutesToMarkdown(minutesDraft), 'meeting-minutes.md', 'text/markdown');
  }

  function getDiarizeBridge(): DiarizeBridge {
    if (!diarizeBridge) diarizeBridge = new DiarizeBridge();
    return diarizeBridge;
  }

  /**
   * Real, voice-based speaker diarization (WeSpeaker embeddings + cosine clustering) — a post-hoc
   * pass over the most recent recording/upload, replacing the silence-gap heuristic's speakerId
   * assignments. Only covers segments overlapping that one audio source; if the transcript spans
   * multiple recordings/tabs, older segments from a different source are left untouched.
   */
  async function runDiarization() {
    if (!canDiarize || !diarizationSource) return;
    const source = diarizationSource;

    diarizationPhase = 'loading';
    diarizationProgress = 0;
    diarizationStatusText = 'Loading diarization model…';
    errorMessage = '';

    try {
      const bridge = getDiarizeBridge();
      if (!bridge.isReady) {
        await bridge.loadModel({ dirHandle: dirHandle ?? undefined }, (pct, status) => {
          diarizationProgress = pct;
          diarizationStatusText = status;
        });
      }

      diarizationPhase = 'running';
      diarizationStatusText = 'Decoding audio…';
      const decoded = await decodeAudioBlob(source, source instanceof File ? source.name : undefined);

      diarizationStatusText = 'Detecting speech segments…';
      const vad = await NonRealTimeVAD.new({
        modelURL: `${VAD_BASE_ASSET_PATH}silero_vad_legacy.onnx`,
        ortConfig: (ort) => {
          (ort as unknown as { env: { wasm: { wasmPaths: string } } }).env.wasm.wasmPaths = VAD_ONNX_WASM_BASE_PATH;
        },
      });

      const embeddings: SpeakerEmbedding[] = [];
      let count = 0;
      for await (const { audio, start, end } of vad.run(decoded.samples, decoded.sampleRate)) {
        count += 1;
        diarizationStatusText = `Analyzing speakers… (utterance ${count})`;
        const embedding = await bridge.embed(audio);
        embeddings.push({ startMs: start, endMs: end, embedding });
      }

      const clustered = clusterSpeakers(embeddings);
      segments = reconcileWithTranscript(segments, clustered);
      void persistIfEnabled();

      diarizationPhase = 'ready';
      diarizationStatusText = embeddings.length
        ? `Identified ${new Set(clustered.map((c) => c.speakerId)).size} speaker(s) across ${embeddings.length} utterance(s).`
        : 'No speech segments detected in the audio.';
    } catch (err: unknown) {
      errorMessage = err instanceof Error ? err.message : String(err);
      diarizationPhase = 'error';
    }
  }

  onMount(() => {
    try { hintDismissed = sessionStorage.getItem(HINT_DISMISSED_KEY) === '1'; } catch { /* ignore */ }

    void loadSession().then((stored) => {
      if (stored?.segments?.length) {
        segments = stored.segments;
        void followTranscriptToLatest();
        language = stored.language ?? DEFAULT_LANG;
        speakerLabelOverrides = stored.speakerLabelOverrides ?? {};
      }
      if (activeTab === 'live') void refreshLangPackStatus();
    });

    if (activeTab === 'live') void refreshLangPackStatus();

    updatePrivacyBadge('on-device');

    const recordLimitCheck = setInterval(() => {
      if (recordPhase === 'recording' && recorder?.isOverLimit()) {
        void stopAndTranscribe();
      }
    }, 5000);

    return () => clearInterval(recordLimitCheck);
  });

  onDestroy(() => {
    stopTimer();
    liveSession?.abort();
    liveRecorder?.abort();
    recorder?.abort();
    whisperBridge?.terminate();
    minutesWorker?.terminate();
    diarizeBridge?.terminate();
    revokeDownloadUrl();
    micStream?.getTracks().forEach((t) => t.stop());
  });
</script>

<style>
  .transcript-panel {
    min-height: 200px;
    max-height: 420px;
    overflow-y: auto;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    overscroll-behavior: contain;
    scrollbar-gutter: stable;
  }
  .transcript-wrap {
    min-width: 0;
  }
  .transcript-segment {
    min-width: 0;
  }
  .speaker-label-input {
    max-width: min(14rem, 100%);
  }
  .jump-latest-btn {
    position: absolute;
    right: 0.75rem;
    bottom: 0.75rem;
    z-index: 1;
    box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.45);
  }
  .interim-line {
    opacity: 0.55;
    font-style: italic;
  }
  .mic-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #dc3545;
    display: inline-block;
    animation: pulse 1.2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.35; }
  }
  .nav-tabs .nav-link { cursor: pointer; }
  .card-body,
  .mn-col,
  fieldset {
    min-width: 0;
  }
  .mn-actions .btn {
    flex: 0 1 auto;
  }
  .status-progress {
    flex: 1 1 160px;
    min-width: 120px;
    max-width: 200px;
  }
  @media (max-width: 575.98px) {
    .card-body {
      padding: 1rem;
    }
    .nav-tabs {
      flex-wrap: nowrap;
      overflow-x: auto;
      overflow-y: hidden;
    }
    .nav-tabs .nav-link {
      white-space: nowrap;
    }
    .transcript-panel {
      min-height: 180px;
      max-height: 50svh;
    }
    .mn-actions .btn {
      flex: 1 1 100%;
    }
    #status-strip {
      align-items: flex-start !important;
      flex-wrap: wrap;
    }
    .status-progress {
      flex-basis: 100%;
      max-width: none;
    }
  }
  /* Two-column layout: configuration on the left, transcript/output on the right — both scroll
     independently once they exceed a viewport-relative height, so the whole tool "fits" on one
     screen on desktop instead of requiring a long page scroll. Mobile keeps natural stacking. */
  @media (min-width: 992px) {
    .mn-col {
      max-height: min(78vh, 900px);
      overflow-y: auto;
    }
  }
</style>

<div class="card google-anno-skip">
  <div class="card-body">

    <div class="alert alert-info mb-3 d-flex align-items-center flex-wrap gap-2" role="alert">
      <span
        id="privacy-badge"
        class="badge"
        class:bg-success={privacyMode === 'on-device'}
        class:bg-warning={privacyMode === 'cloud-assisted'}
        class:text-dark={privacyMode === 'cloud-assisted'}
        class:bg-info={privacyMode === 'local-model'}
      >{privacyLabel}</span>
      <span>
        {#if privacyMode === 'cloud-assisted'}
          Audio may be sent to your browser vendor for live captions (Web Speech cloud fallback). Everything else stays on this device.
        {:else}
          Transcript text and audio processing stay in your browser — nothing is uploaded.
        {/if}
      </span>
    </div>

    {#if errorMessage}
      <div class="alert alert-danger mb-3" id="error-msg" role="alert">
        <i class="fas fa-triangle-exclamation me-2"></i>{errorMessage}
      </div>
    {/if}

    {#if livePhase === 'error' && errorMessage.includes('denied')}
      <div class="alert alert-warning mb-3" id="mic-denied-alert" role="alert">
        Allow microphone access in your browser site settings for this page, then try again.
      </div>
    {/if}

    <div class="row g-3 align-items-start">
      <div class="col-lg-5 mn-col">
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <button type="button" class="nav-link" class:active={activeTab === 'live'} id="tab-live" on:click={() => switchTab('live')}>Live</button>
      </li>
      <li class="nav-item">
        <button type="button" class="nav-link" class:active={activeTab === 'record'} id="tab-record" on:click={() => switchTab('record')}>Record</button>
      </li>
      <li class="nav-item">
        <button type="button" class="nav-link" class:active={activeTab === 'upload'} id="tab-upload" on:click={() => switchTab('upload')}>Upload</button>
      </li>
    </ul>

    {#if showFirstRunHint}
      <div class="alert alert-secondary mb-3" id="first-run-hint" role="alert">
        <strong>First time on Record / Upload?</strong> Load the Whisper model once (~40–75 MB). It stays cached in your browser.
        <strong>Live</strong> defaults to Web Speech API — no Whisper download needed unless you switch to LocalAI.
        <button type="button" class="btn btn-sm btn-outline-secondary ms-2" on:click={dismissHint}>Dismiss</button>
      </div>
    {/if}

    <div class="mb-3">
      <label class="form-label fw-semibold" for="lang-select">Language</label>
      <select id="lang-select" class="form-select" bind:value={language} on:change={onLanguageChange} disabled={livePhase === 'listening' || recordPhase === 'recording'}>
        {#each LANGUAGE_OPTIONS as opt (opt.value)}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </div>

    {#if activeTab === 'live'}
      <p class="text-muted small">Real-time captions from mic and/or meeting audio.</p>

      <fieldset class="mb-3 border rounded p-3" id="live-engine-fieldset" disabled={livePhase === 'listening'}>
        <legend class="form-label fw-semibold mb-2 w-auto px-2">Speech engine</legend>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="live-engine" id="live-engine-webspeech" value="web-speech" bind:group={liveEngine} on:change={onLiveEngineChange} />
          <label class="form-check-label" for="live-engine-webspeech">
            <strong>Web Speech API</strong> <span class="badge bg-primary-subtle text-primary-emphasis ms-1">Recommended</span>
            <br /><span class="text-muted small">Best accuracy, including Vietnamese. Live word-by-word captions.</span>
          </label>
        </div>
        <div class="form-check mt-2">
          <input class="form-check-input" type="radio" name="live-engine" id="live-engine-localai" value="local-ai" bind:group={liveEngine} on:change={onLiveEngineChange} />
          <label class="form-check-label" for="live-engine-localai">
            <strong>LocalAI</strong> <span class="text-muted">(Whisper, fully offline/private)</span>
            <br /><span class="text-muted small">Works without internet or in Firefox. Captions appear after each pause; load the Whisper model below first.</span>
          </label>
        </div>
      </fieldset>

      <fieldset class="mb-3" id="live-source-fieldset" disabled={livePhase === 'listening'}>
        <legend class="form-label fw-semibold mb-2">Caption source</legend>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="live-source" id="live-src-mic" value="mic" bind:group={liveCaptionSource} />
          <label class="form-check-label" for="live-src-mic">
            <strong>Microphone</strong> <span class="text-muted">(your voice near the mic)</span>
          </label>
        </div>
        {#if displayMediaOk}
          <div class="form-check">
            <input class="form-check-input" type="radio" name="live-source" id="live-src-system" value="system" bind:group={liveCaptionSource} />
            <label class="form-check-label" for="live-src-system">
              <strong>System / tab audio</strong> <span class="text-muted">(what you hear — Teams / Meet / Zoom)</span>
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="live-source" id="live-src-mixed" value="mixed" bind:group={liveCaptionSource} />
            <label class="form-check-label" for="live-src-mixed">
              <strong>Microphone + system audio</strong> <span class="text-muted">(mix both into one caption stream)</span>
            </label>
          </div>
        {/if}
      </fieldset>

      {#if normalizedLiveSource !== 'mic'}
        <div class="alert alert-info py-2 mb-3" id="live-meeting-help" role="note">
          <strong>Teams / Zoom / Meet:</strong> click Start, share the <strong>meeting browser tab</strong>, and enable <strong>Share tab audio</strong>.
          {#if liveEngine !== 'local-ai'}
            Captions use <strong>Web Speech API</strong> on that audio track (Chrome/Edge 135+).
          {:else}
            Audio is transcribed continuously via LocalAI (Whisper) as you speak.
          {/if}
        </div>
        {#if liveEngine !== 'local-ai' && !meetingCaptionsOk}
          <div class="alert alert-warning py-2 mb-3" role="alert">
            Tab-audio Web Speech needs Chrome/Edge 135+. Use <strong>Microphone</strong>, switch to <strong>LocalAI</strong>, or use Record/Upload.
          </div>
        {/if}
      {:else if liveEngine !== 'local-ai' && !webSpeechOk}
        <div class="alert alert-warning">Live mic captions require Chrome, Edge, or Safari. Use <strong>LocalAI</strong> or <strong>Record</strong> instead.</div>
      {/if}

      {#if showWebSpeechPrivacy}
      <div class="form-check mb-2">
        <input class="form-check-input" type="checkbox" id="prefer-on-device" bind:checked={preferOnDevice} on:change={onPreferOnDeviceChange} disabled={livePhase === 'listening'} />
        <label class="form-check-label" for="prefer-on-device">Prefer on-device recognition</label>
      </div>
      <div class="form-check mb-2">
        <input class="form-check-input" type="checkbox" id="allow-cloud-fallback" bind:checked={allowCloudFallback} disabled={livePhase === 'listening'} />
        <label class="form-check-label" for="allow-cloud-fallback">Allow cloud fallback if on-device unavailable</label>
      </div>
      {/if}

      <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" id="record-live-audio" bind:checked={recordLiveAudio} disabled={livePhase === 'listening'} />
        <label class="form-check-label" for="record-live-audio">Also save an audio recording while captioning (.webm / .mp3 after Stop)</label>
      </div>

      {#if liveEngine === 'web-speech' && preferOnDevice && webSpeechOk}
        <div class="border rounded p-3 mb-3" id="lang-pack-panel">
          <h6 class="fw-semibold mb-2">On-device language pack</h6>
          <p class="text-muted small mb-2" id="lang-pack-status">{langPackStatusText}</p>
          {#if langPackStatus === 'available'}
            <span class="badge bg-success"><i class="fas fa-check me-1"></i>Installed</span>
          {:else if langPackInstalling}
            <span class="badge bg-info"><i class="fas fa-spinner fa-spin me-1"></i>Installing…</span>
          {:else if showInstallLangPack}
            <button type="button" class="btn btn-sm btn-outline-info" id="install-lang-pack-btn" disabled={!canInstallLangPack} on:click={installLangPack}>
              <i class="fas fa-download me-1"></i>Install language pack
            </button>
            <p class="text-muted small mt-2 mb-0">
              Requires Chrome or Edge. Download stays in the browser (not on this site). You can also add the language in
              <code>chrome://settings/languages</code> then return here and click Install.
            </p>
          {:else if langPackStatus === 'unavailable'}
            <p class="text-muted small mb-0">
              Add <strong>{language}</strong> in
              <code>chrome://settings/languages</code>
              (Chrome/Edge — paste in the address bar), wait for speech components to finish downloading, reload this page, then check again.
              Or enable <strong>Allow cloud fallback</strong> / switch to <strong>LocalAI</strong>.
            </p>
          {:else if langPackStatus === 'api-unavailable'}
            <p class="text-muted small mb-0">Safari and some browsers always use cloud recognition — enable cloud fallback or use LocalAI.</p>
          {/if}
        </div>
      {/if}

      {#if liveStatusHint && livePhase === 'listening'}
        <div class="alert alert-secondary py-2 mb-3" id="live-status-hint" role="status">{liveStatusHint}</div>
      {/if}
      <div class="d-flex gap-2 mb-3 flex-wrap">
        {#if livePhase !== 'listening'}
          <button type="button" class="btn btn-primary" id="start-live-btn" disabled={!canStartLive} on:click={startLive}>
            <i class="fas fa-microphone me-1"></i>Start live captions
          </button>
        {:else}
          <button type="button" class="btn btn-danger" id="stop-live-btn" on:click={stopLive}>
            <i class="fas fa-stop me-1"></i>Stop captions
          </button>
        {/if}
        {#if lastRecordingBlob}
          <button type="button" class="btn btn-outline-secondary" id="download-recording-webm-btn" disabled={downloadBusy} on:click={() => saveRecordingAs('webm')}>
            Download .webm
          </button>
          <button type="button" class="btn btn-outline-secondary" id="download-recording-mp3-btn" disabled={downloadBusy} on:click={() => saveRecordingAs('mp3')}>
            Download .mp3
          </button>
        {/if}
      </div>
      <p class="text-muted small mb-0">
        {#if liveEngine === 'web-speech'}
          Web Speech gives live word-by-word captions — no model download needed.
        {:else}
          LocalAI needs the Whisper model loaded (below).
        {/if}
        Saved audio always uses a <code>.webm</code> or <code>.mp3</code> filename.
      </p>
    {/if}

    {#if activeTab === 'record'}
      <p class="text-muted small">Record microphone, system/tab audio, or both — save as .webm/.mp3, then optionally transcribe with Whisper.</p>
      <fieldset class="mb-3" id="record-source-fieldset" disabled={recordPhase === 'recording'}>
        <legend class="form-label fw-semibold mb-2">Audio source</legend>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="record-source" id="record-src-mic" value="mic" bind:group={recordInputSource} />
          <label class="form-check-label" for="record-src-mic">Microphone</label>
        </div>
        {#if displayMediaOk}
          <div class="form-check">
            <input class="form-check-input" type="radio" name="record-source" id="record-src-system" value="system" bind:group={recordInputSource} />
            <label class="form-check-label" for="record-src-system">System / tab audio</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="record-source" id="record-src-mixed" value="mixed" bind:group={recordInputSource} />
            <label class="form-check-label" for="record-src-mixed">Microphone + system audio</label>
          </div>
        {:else}
          <p class="text-muted small mb-0">System audio capture requires a desktop browser with screen sharing (Chrome, Edge, or Firefox).</p>
        {/if}
      </fieldset>
      {#if recordInputSource !== 'mic' && displayMediaOk}
        <div class="alert alert-secondary py-2 mb-3" id="system-audio-help" role="note">
          <strong>Capturing meeting audio:</strong> when prompted, share the <strong>browser tab</strong> running your call (Zoom, Teams, Meet, etc.) and enable
          <strong>Share tab audio</strong>. For desktop-wide sound, share your <strong>entire screen</strong> and enable
          <strong>Share system audio</strong> (Windows/macOS; availability varies by browser and OS).
        </div>
      {/if}
      <div class="d-flex gap-2 mb-3 flex-wrap">
        {#if recordPhase !== 'recording'}
          <button type="button" class="btn btn-primary" id="start-record-btn" disabled={!canStartRecord} on:click={startRecording}>
            <i class="fas fa-circle me-1"></i>Start recording
          </button>
        {:else}
          <button type="button" class="btn btn-outline-danger" id="stop-record-btn" on:click={stopRecordingOnly}>
            <i class="fas fa-stop me-1"></i>Stop &amp; save
          </button>
          <button type="button" class="btn btn-danger" id="stop-transcribe-btn" on:click={stopAndTranscribe}>
            <i class="fas fa-stop me-1"></i>Stop and transcribe
          </button>
        {/if}
        {#if lastRecordingBlob && recordPhase !== 'recording'}
          <button type="button" class="btn btn-outline-secondary" id="download-recording-btn-record" disabled={downloadBusy} on:click={() => saveRecordingAs('webm')}>
            Download .webm
          </button>
          <button type="button" class="btn btn-outline-secondary" id="download-recording-mp3-btn-record" disabled={downloadBusy} on:click={() => saveRecordingAs('mp3')}>
            Download .mp3
          </button>
          <button type="button" class="btn btn-outline-primary" id="transcribe-recording-btn" disabled={!canTranscribeRecording} on:click={transcribeLastRecording}>
            Transcribe recording
          </button>
        {/if}
      </div>
      {#if lastRecordingBlob && recordPhase !== 'recording'}
        <p class="text-muted small" id="recording-ready-hint">Recording ready: <code>{lastRecordingFilename}</code> — download .webm/.mp3 or transcribe after loading Whisper.</p>
      {/if}
    {/if}

    {#if activeTab === 'upload'}
      <p class="text-muted small">Transcribe an existing audio or video file.</p>
      <div class="mb-3">
        <input type="file" class="form-control" id="file-input" accept="audio/*,video/*,.webm,.wav,.mp3,.ogg,.flac,.mp4,.m4a" on:change={onFileSelected} disabled={whisperPhase === 'loading'} />
        {#if selectedFile}
          <small class="text-muted d-block mt-1">{selectedFile.name}{fileDurationSec != null ? ` — ${Math.round(fileDurationSec)}s` : ''}</small>
        {/if}
      </div>
      <button type="button" class="btn btn-primary mb-3" id="transcribe-file-btn" disabled={!canTranscribeFile} on:click={transcribeFile}>
        Transcribe file
      </button>
    {/if}

    {#if showWhisperBlock}
    <hr />
    <h6 class="fw-semibold">Whisper transcription model</h6>
    <p class="text-muted small">
      {#if activeTab === 'live'}
        Used by the LocalAI live engine.
      {:else}
        Used by Record and Upload (and by Live if you switch to LocalAI).
      {/if}
    </p>
      <div class="mb-2">
        <label class="form-label" for="model-select">Model</label>
        <select id="model-select" class="form-select form-select-sm" bind:value={selectedModel} disabled={whisperPhase === 'loading' || whisperPhase === 'ready' || whisperPhase === 'transcribing'}>
          {#each WHISPER_MODEL_OPTIONS as m (m.value)}
            <option value={m.value}>{m.label}</option>
          {/each}
        </select>
      </div>
      <div class="mb-2 d-flex align-items-center gap-2 flex-wrap">
        {#if dirName}
          <span class="badge bg-success"><i class="fas fa-folder-open me-1"></i>{dirName}</span>
          <button type="button" class="btn btn-outline-secondary btn-sm" on:click={clearDirectory} disabled={whisperPhase === 'loading'}>Clear folder</button>
        {:else if whisperPhase === 'idle' || whisperPhase === 'error'}
          <button type="button" class="btn btn-outline-secondary btn-sm" on:click={pickDirectory}>Pick cache folder (optional)</button>
        {/if}
      </div>
      {#if whisperPhase === 'idle' || whisperPhase === 'error'}
        <button type="button" class="btn btn-info text-white mb-2" id="load-whisper-btn" disabled={!canLoadWhisper} on:click={loadWhisperModel}>
          <i class="fas fa-download me-1"></i>Load transcription model
        </button>
      {/if}
      {#if whisperPhase === 'loading'}
        <div class="mb-3">
          <div class="d-flex justify-content-between mb-1">
            <small class="text-muted">{loadStatusText}</small>
            <small class="text-muted">{loadProgress}%</small>
          </div>
          <div class="progress" style="height: 8px">
            <div class="progress-bar bg-info" style="width: {loadProgress}%"></div>
          </div>
        </div>
      {/if}
      {#if whisperPhase === 'ready'}
        <div class="alert alert-success py-2 mb-2"><i class="fas fa-check me-1"></i>Model ready</div>
      {/if}
    {/if}

    {#if livePhase === 'listening' || recordPhase === 'recording' || whisperPhase === 'transcribing'}
      <div class="d-flex align-items-center gap-2 mb-3 p-2 border rounded flex-wrap" id="status-strip">
        {#if whisperPhase !== 'transcribing'}
          <span class="mic-indicator" id="mic-indicator"></span>
          <span>{livePhase === 'listening'
            ? (listeningForSpeech ? 'Speech detected…' : 'Listening for speech…')
            : `Recording (${recordSourceLabel(recordInputSource)})`}</span>
          <span class="text-muted" id="elapsed-timer">{fmtElapsed(elapsedSec)}</span>
        {:else}
          <span>Transcribing… {transcribeProgress}%</span>
          <small class="text-muted">{transcribeStatus}</small>
          <div class="progress status-progress" style="height: 6px">
            <div class="progress-bar" style="width: {transcribeProgress}%"></div>
          </div>
        {/if}
      </div>
    {/if}

      </div>

      <div class="col-lg-7 mn-col">
    <h6 class="fw-semibold">Transcript</h6>
    <div class="position-relative transcript-wrap mb-3">
    <div
      class="border rounded p-3 bg-dark text-light transcript-panel"
      id="transcript-panel"
      aria-label="Live transcript"
      aria-live="polite"
      role="log"
      {@attach transcriptViewport}
      on:scroll={onTranscriptScroll}
    >
      {#if segments.length === 0 && !listeningForSpeech}
        <span class="text-muted">No transcript yet — start live captions, record, or upload a file.</span>
      {:else}
        {#each segments as seg (seg.id)}
          <div class="transcript-segment" class:interim-line={!seg.isFinal}>
            <span class="text-info small me-2">[{msToTimestamp(seg.startMs)}]</span>
            {#if seg.speakerId}
              <input
                class="form-control-plaintext form-control-sm d-inline-block fw-semibold text-warning speaker-label-input p-0 me-1"
                style="width: auto; min-width: 90px; border-bottom: 1px dashed currentColor;"
                title="Click to rename this speaker — renames every line using this label"
                value={speakerLabelOverrides[seg.speakerId] ?? seg.speakerId}
                on:change={(e) => renameSpeaker(seg.speakerId, (e.currentTarget as HTMLInputElement).value)}
              />:
            {/if}
            {seg.text}
          </div>
        {/each}
        {#if listeningForSpeech && !hasInterimSegment}
          <div class="interim-line" id="listening-placeholder">Listening…</div>
        {/if}
      {/if}
    </div>
    {#if !transcriptAutoFollow}
      <button
        type="button"
        class="btn btn-info btn-sm text-dark jump-latest-btn"
        aria-controls="transcript-panel"
        aria-label="Resume automatic transcript scrolling and jump to latest"
        on:click={jumpTranscriptToLatest}
      >
        <i class="fas fa-arrow-down me-1" aria-hidden="true"></i>Jump to latest
      </button>
    {/if}
    </div>

    <div class="d-flex gap-2 flex-wrap mb-3 mn-actions">
      <button type="button" class="btn btn-outline-secondary btn-sm" id="copy-transcript-btn" disabled={!hasTranscript} on:click={copyTranscript}>Copy</button>
      <button type="button" class="btn btn-outline-secondary btn-sm" disabled={!hasTranscript} on:click={downloadMd}>Download MD</button>
      <button type="button" class="btn btn-outline-secondary btn-sm" disabled={!hasTranscript} on:click={downloadJson}>Download JSON</button>
      <button type="button" class="btn btn-outline-danger btn-sm" id="clear-session-btn" on:click={clearAllSession}>Clear session</button>
    </div>

    <div class="form-check mb-4">
      <input class="form-check-input" type="checkbox" id="dont-persist" bind:checked={dontPersist} />
      <label class="form-check-label" for="dont-persist">Don't save transcript to this browser</label>
    </div>

    {#if hasTranscript}
      <hr />
      <h6 class="fw-semibold">Speaker diarization</h6>
      <p class="text-muted small">
        Identify who's speaking using real voice-embedding clustering (WeSpeaker) — more accurate than the automatic pause-based labels above. Runs on the most recent recording/upload only.
      </p>
      <button type="button" class="btn btn-secondary btn-sm mb-2" id="diarize-btn" disabled={!canDiarize} on:click={runDiarization}>
        {diarizationPhase === 'loading' || diarizationPhase === 'running' ? 'Identifying speakers…' : 'Identify speakers'}
      </button>
      {#if !diarizationSource}
        <p class="text-muted small mb-2">Needs a recording or uploaded file — check "Also save an audio recording" on Live, or use Record/Upload.</p>
      {/if}
      {#if diarizationPhase === 'loading' || diarizationPhase === 'running'}
        <div class="mb-2">
          <div class="d-flex justify-content-between mb-1">
            <small class="text-muted">{diarizationStatusText}</small>
            {#if diarizationPhase === 'loading'}<small class="text-muted">{diarizationProgress}%</small>{/if}
          </div>
          <div class="progress" style="height: 6px">
            <div class="progress-bar bg-secondary" style="width: {diarizationPhase === 'loading' ? diarizationProgress : 100}%"></div>
          </div>
        </div>
      {/if}
      {#if diarizationPhase === 'ready'}
        <p class="text-success small mb-2"><i class="fas fa-check me-1"></i>{diarizationStatusText}</p>
      {/if}
    {/if}

    {#if showMinutesBtn}
      <hr />
      <h6 class="fw-semibold">Meeting minutes (AI draft)</h6>
      <p class="text-muted small">Generate structured minutes from the transcript using a local model. Review before sharing.</p>
      <button type="button" class="btn btn-secondary mb-3" disabled={minutesPhase === 'loading-model' || minutesPhase === 'generating'} on:click={generateMinutes}>
        {minutesPhase === 'generating' || minutesPhase === 'loading-model' ? 'Generating…' : 'Generate minutes'}
      </button>
      {#if minutesDraft}
        <div class="border rounded p-3 mb-3">
          <p class="small text-warning"><em>AI-generated draft — review before sharing.</em></p>
          <div class="mb-2">
            <label class="form-label" for="mom-title">Title</label>
            <input id="mom-title" class="form-control form-control-sm" bind:value={minutesDraft.title} />
          </div>
          <div class="mb-2">
            <label class="form-label" for="mom-summary">Summary</label>
            <textarea id="mom-summary" class="form-control form-control-sm" rows="3" bind:value={minutesDraft.summary}></textarea>
          </div>
          <div class="mb-2">
            <label class="form-label" for="mom-decisions">Decisions (one per line)</label>
            <textarea id="mom-decisions" class="form-control form-control-sm" rows="3" value={minutesDraft.decisions.join('\n')} on:input={(e) => { minutesDraft!.decisions = (e.currentTarget as HTMLTextAreaElement).value.split('\n').filter(Boolean); }}></textarea>
          </div>
          <div class="mb-2">
            <label class="form-label" for="mom-actions">Action items (one per line)</label>
            <textarea id="mom-actions" class="form-control form-control-sm" rows="3" value={minutesDraft.actionItems.map((a) => a.task).join('\n')} on:input={(e) => { minutesDraft!.actionItems = (e.currentTarget as HTMLTextAreaElement).value.split('\n').filter(Boolean).map((task) => ({ task })); }}></textarea>
          </div>
          <button type="button" class="btn btn-outline-secondary btn-sm" on:click={downloadMinutesMd}>Download minutes MD</button>
        </div>
      {/if}
    {/if}
      </div>
    </div>

  </div>
</div>

{#if showStopCaptureModal}
  <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,.5)">
    <div class="modal-dialog">
      <div class="modal-content bg-dark text-light">
        <div class="modal-header">
          <h5 class="modal-title">Stop active capture?</h5>
        </div>
        <div class="modal-body">Switching tabs will stop the current live session or recording.</div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" on:click={() => { showStopCaptureModal = false; pendingTab = null; }}>Stay</button>
          <button type="button" class="btn btn-danger" on:click={confirmStopCapture}>Stop</button>
        </div>
      </div>
    </div>
  </div>
{/if}
