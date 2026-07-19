# Architectural Specification: AI-Meeting-Notes

A 100% client-side, zero-cost, private-by-default meeting transcription and summary (Minutes of Meeting) tool designed to run completely inside the browser on GitHub Pages.

---

## 1. Core Technical Stack

To maintain compatibility with a static host (GitHub Pages) while targeting Vietnamese and English natively, the engine relies on WebAssembly (WASM) for audio intelligence and WebGPU for LLM reasoning.

### 1.1 Audio Processing & Automatic Speech Recognition (ASR)
*   **Engine:** `sherpa-onnx` compiled to WebAssembly (WASM).
*   **Acoustic Model:** **SenseVoice** (by Alibaba, quantized to ONNX format).
    *   *Why SenseVoice?* On the Hugging Face Open ASR Leaderboard, it significantly outperforms traditional Whisper variants in latency and throughput. It provides native multi-lingual support (optimized for Vietnamese and English) and handles streaming tasks gracefully on consumer-grade CPUs without freezing the browser thread.
*   **Voice Activity Detection (VAD):** Integrated `Silero-VAD` via `sherpa-onnx` to isolate speech from background noise and dead air before feeding arrays into the ASR engine.

### 1.2 LLM Reasoning (Minutes of Meeting - MoM Creation)
*   **Engine:** `@mlc-ai/web-llm` utilizing **WebGPU** acceleration.
*   **Model:** **Qwen2.5-7B-Instruct** (or `Llama-3-8B-Instruct` as fallback).
    *   *Why Qwen2.5?* It offers exceptional multi-lingual context processing, yielding highly structured, localized Vietnamese summaries from mixed Eng/Vie transcripts compared to smaller English-centric models.

---

## 2. Multi-Threaded Worker Architecture

To prevent heavy AI models and streaming audio buffers from locking the browser's Main UI thread, the application operates via an asymmetric **Event-Driven Web Worker** structure.

```text
       [ MAIN UI THREAD ]
      /                  \
(Raw PCM / Blobs)   (Finalized Transcripts)
    /                      \
   v                        v
[ Audio Worker ]       [ LLM Worker ]
(WASM: sherpa-onnx)    (WebGPU: WebLLM)
```

### 2.1 The Main UI Thread
*   Manages layout rendering (DOM changes).
*   Initiates microphone permissions via `navigator.mediaDevices.getUserMedia`.
*   Directs configuration choices (Spoken Language, Target MoM Language).
*   Initializes recording pipelines and pipes input directly to specialized threads.

### 2.2 Audio Worker (`audio.worker.ts`)
*   Instantiates the `sherpa-onnx` runtime environment.
*   Maintains an internal state machine handling VAD segment framing and speaker clustering (Diarization).
*   Receives raw `Float32Array` audio chunks, processes them via `OnlineRecognizer` or `OfflineRecognizer`, and posts back semantic JSON events (`onPartialTranscript`, `onFinalTranscript`).

### 2.3 LLM Worker (`llm.worker.ts`)
*   Bootstraps the `@mlc-ai/web-llm` engine over WebGPU.
*   Fetches and caches model weights inside the browser's local sandbox storage (`IndexedDB`).
*   Receives aggregated meeting notes at the end of execution and streams Markdown tokens back to the UI thread via text-streaming hooks.

---

## 3. Operational Modes Matrix

The application must support three core structural workflows using unified contracts:

### 3.1 Live Mode (Real-Time Subtitling)
1.  **Capture:** UI initializes the `AudioContext` and sets up an `AudioWorkletProcessor` or `ScriptProcessorNode` to slice real-time mic inputs into **250ms chunks**.
2.  **Pipeline:** Chunks are continuously sent via `postMessage` to the Audio Worker. `sherpa-onnx` streams data into its internal buffers, performing immediate VAD segmentation and ASR.
3.  **UI Feedback:** The worker fires back `onPartialTranscript` events instantly to give a responsive feedback loop, changing to `onFinalTranscript` once silence thresholds are met.
4.  **Completion:** Stopping the pipeline triggers a transcript payload bundle dispatch into the LLM Worker for MoM composition.

### 3.2 Record Mode (Background Capture)
1.  **Capture:** Operates identically to *Live Mode* behind the scenes to balance computing load across the session.
2.  **UI Feedback:** The UI thread intentionally decouples from rendering partial/final transcript events in the DOM. This protects low-end client machines from heavy GUI layout cycles during long calls.
3.  **Completion:** Once the user completes the session, a single macro-render cycle populates the transcript interface while simultaneously triggering the local LLM.

### 3.3 Upload Mode (Batch File Processing)
1.  **Capture:** User uploads a local multi-media asset (`.mp3`, `.wav`, `.m4a`).
2.  **Decoding:** The UI reads the object array buffer and leverages the native browser API (`AudioContext.decodeAudioData()`) to decompress it into a monolithic, uncompressed mono channel `Float32Array`.
3.  **Pipeline:** The entire float array goes straight into the Audio Worker. The worker instantiates an **`OfflineRecognizer` batch process**. It chunks the array dynamically, matches voiceprint similarities for speaker clusters, and executes high-speed batch text extractions.

---

## 4. Unified Data Layer & TypeScript Interfaces

Ensure Claude Code adheres to the following unified interfaces to keep the pipeline interchangeable:

```typescript
export interface TranscriptSegment {
  speakerId: string;    // e.g., "SPEAKER_01", "SPEAKER_02"
  text: string;         // Segment transcription text
  startTime: number;    // Absolute segment timestamp (seconds)
  endTime: number;      // Absolute segment timestamp (seconds)
}

export interface OperationalConfig {
  mode: 'LIVE' | 'RECORD' | 'UPLOAD';
  spokenLanguage: 'vi' | 'en' | 'auto';
  outputLanguage: 'vi' | 'en';
  exportFormat: 'webm' | 'mp3';
}

export interface IAudioEngine {
  init(config: OperationalConfig): Promise<void>;
  processStreamChunk(chunk: Float32Array): void;
  processFullFile(buffer: Float32Array): Promise<TranscriptSegment[]>;
  terminateSession(): Promise<TranscriptSegment[]>;
}

export interface ILLMEngine {
  initEngine(onProgress: (progress: number) => void): Promise<void>;
  generateMinutes(
    transcript: TranscriptSegment[],
    targetLang: string,
    onTokenStream: (token: string) => void
  ): Promise<string>;
}
```

---

## 5. Memory Management & Storage Strategy

### 5.1 Storage Optimization (Bypassing localStorage Constraints)
*   **IndexedDB Default:** All runtime transcript structures, session tracking lists, and downloaded `WebLLM` model weights are stored in **IndexedDB** via a library wrapper like `idb` or `localForage`. This allows safe multi-gigabyte data limits governed flexibly by OS disk space allocations.
*   **File System Access API Extension:** Integrate `window.showDirectoryPicker()`. If activated by the user, the application asks for explicit host directory file permissions, letting the UI directly create and modify individual localized `.json` files inside their desktop folder environment.

### 5.2 Dynamic Audio Multi-Plexing & Export Pipeline
When recording begins in *Live* or *Record* modes, the raw microphone stream splits into two distinct processing vectors:

1.  **The AI Vector:** Supplies continuous float array data blocks directly into the Audio Worker for runtime processing.
2.  **The Retention Vector:** Feeds raw streams into parallel encoders to support file downloads:
    *   **`.webm` Export:** Pipes audio directly to the browser's native `MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' })`. It requires negligible compute resources and aggregates safe binary chunks in the background.
    *   **`.mp3` Export:** Because standard browser runtimes lack built-in native MP3 compression pipelines, the audio stream pipes directly into a separate `AudioEncoderWorker` compiled with `lamejs`. To guard against **Out of Memory (OOM)** browser tab crashes, the encoder handles data chunks on a **rolling interval (rolling every 5 seconds)**, converting raw PCM slices into compressed MP3 byte blocks instantly and appending them into IndexedDB file fragments on the fly.

---

## 6. Prompting Guide for Claude Code Implementation

When instructing Claude Code to start writing code blocks for this project, you can pass these exact iterative tasks:

1.  *"Set up a Vite project optimized for GitHub Pages deployment. Configure a Web Worker pooling strategy to import `sherpa-onnx` as a WASM asset and initialize its runtime asynchronously."*
2.  *"Write the Audio Encoder Web Worker utilizing `lamejs` to accept raw PCM arrays streaming from a Media Audio node, encoding them in 5-second intervals to prevent UI allocation leaks."*
3.  *"Implement a File System Access API service wrapper that falls back to IndexedDB if the user's browser fails modern file picker feature detection."*
4.  *"Design the `WebLLM` integration using a customizable system context template that translates mixed Vietnamese/English conversation arrays into highly structured corporate meeting summaries."*
