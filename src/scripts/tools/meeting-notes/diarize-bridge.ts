import { parseTransformersProgress } from '../shared/transformers-progress.ts';

const VALID_WORKER_TYPES = new Set(['progress', 'ready', 'embedding', 'error']);

type WorkerMessage =
  | { type: 'progress'; payload: { progress?: number; status?: string; file?: string; name?: string } }
  | { type: 'ready' }
  | { type: 'embedding'; payload: { requestId: string; embedding: number[] } }
  | { type: 'error'; payload: { message: string; requestId?: string } };

export class DiarizeBridge {
  #worker: Worker | null = null;
  #ready = false;
  #loadResolve: (() => void) | null = null;
  #loadReject: ((err: Error) => void) | null = null;
  #loadProgressCb: ((pct: number, status: string) => void) | null = null;
  #pending = new Map<string, { resolve: (embedding: Float32Array) => void; reject: (err: Error) => void }>();
  #nextId = 0;

  #ensureWorker(): Worker {
    if (!this.#worker) {
      this.#worker = new Worker(new URL('../../../components/tools/meeting-notes/diarize-worker.ts', import.meta.url), {
        type: 'module',
      });
      this.#worker.onmessage = (e: MessageEvent) => this.#onMessage(e.data);
      this.#worker.onerror = (e) => {
        const err = new Error(e.message ?? 'Diarization worker error');
        this.#loadReject?.(err);
        for (const p of this.#pending.values()) p.reject(err);
        this.#pending.clear();
      };
    }
    return this.#worker;
  }

  get isReady(): boolean {
    return this.#ready;
  }

  loadModel(
    opts: { dirHandle?: FileSystemDirectoryHandle } = {},
    onProgress?: (pct: number, status: string) => void,
  ): Promise<void> {
    const worker = this.#ensureWorker();
    this.#ready = false;
    this.#loadProgressCb = onProgress ?? null;
    return new Promise((resolve, reject) => {
      this.#loadResolve = resolve;
      this.#loadReject = reject;
      worker.postMessage({ type: 'load', payload: opts });
    });
  }

  embed(audio: Float32Array): Promise<Float32Array> {
    if (!this.#worker || !this.#ready) {
      return Promise.reject(new Error('Diarization model is not loaded.'));
    }
    const requestId = String(this.#nextId++);
    const buffer = audio.slice().buffer;
    return new Promise((resolve, reject) => {
      this.#pending.set(requestId, { resolve, reject });
      this.#worker!.postMessage({ type: 'embed', payload: { requestId, audio: new Float32Array(buffer) } }, [buffer]);
    });
  }

  terminate(): void {
    this.#worker?.terminate();
    this.#worker = null;
    this.#ready = false;
    for (const p of this.#pending.values()) p.reject(new Error('Diarization terminated'));
    this.#pending.clear();
  }

  #onMessage(data: WorkerMessage) {
    if (!data?.type || !VALID_WORKER_TYPES.has(data.type)) return;

    if (data.type === 'progress') {
      const { pct, status } = parseTransformersProgress(data.payload);
      this.#loadProgressCb?.(pct, status);
      return;
    }

    if (data.type === 'ready') {
      this.#ready = true;
      this.#loadProgressCb = null;
      this.#loadResolve?.();
      this.#loadResolve = null;
      this.#loadReject = null;
      return;
    }

    if (data.type === 'embedding') {
      const pending = this.#pending.get(data.payload.requestId);
      pending?.resolve(Float32Array.from(data.payload.embedding));
      this.#pending.delete(data.payload.requestId);
      return;
    }

    if (data.type === 'error') {
      const err = new Error(data.payload?.message ?? 'Diarization failed.');
      const requestId = data.payload?.requestId;
      if (requestId && this.#pending.has(requestId)) {
        this.#pending.get(requestId)?.reject(err);
        this.#pending.delete(requestId);
      } else {
        this.#loadReject?.(err);
        this.#loadResolve = null;
        this.#loadReject = null;
      }
    }
  }
}
