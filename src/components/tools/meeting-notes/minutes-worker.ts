/**
 * Worker for meeting minutes generation (local LLM).
 */
import { pipeline, TextStreamer, env } from '@huggingface/transformers';
import { DirHandleCache } from '../../../scripts/tools/shared/dir-handle-cache.ts';

const MODEL_ID = 'onnx-community/gemma-4-E2B-it-ONNX';

let generator: Awaited<ReturnType<typeof pipeline>> | null = null;

self.onmessage = async (e: MessageEvent) => {
  const { type, payload } = e.data as { type: string; payload: unknown };

  if (type === 'load') {
    try {
      const p = payload as { dirHandle?: FileSystemDirectoryHandle } | undefined;
      if (p?.dirHandle) {
        env.useCustomCache = true;
        env.useBrowserCache = false;
        (env as unknown as { customCache?: DirHandleCache }).customCache = new DirHandleCache(p.dirHandle);
      } else {
        env.useBrowserCache = true;
        env.useCustomCache = false;
      }

      const progress_callback = (progress: unknown) => {
        self.postMessage({ type: 'progress', payload: progress });
      };

      try {
        generator = await pipeline('text-generation', MODEL_ID, {
          device: 'webgpu',
          dtype: 'q4f16',
          progress_callback,
        });
      } catch {
        // No WebGPU (or no adapter) — fall back to CPU/WASM. q4 (not q4f16) is the CPU-compatible
        // quantized variant actually published for this model.
        generator = await pipeline('text-generation', MODEL_ID, {
          device: 'wasm',
          dtype: 'q4',
          progress_callback,
        });
      }

      self.postMessage({ type: 'ready' });
    } catch (err: unknown) {
      self.postMessage({ type: 'error', payload: err instanceof Error ? err.message : String(err) });
    }
    return;
  }

  if (type === 'generate') {
    if (!generator) {
      self.postMessage({ type: 'error', payload: 'Model not loaded yet.' });
      return;
    }
    try {
      const p = payload as { prompt: string };
      const messages = [{ role: 'user', content: p.prompt }];

      const tokenizer = (generator as unknown as {
        tokenizer: ConstructorParameters<typeof TextStreamer>[0];
      }).tokenizer;
      const streamer = new TextStreamer(tokenizer, {
        skip_prompt: true,
        skip_special_tokens: true,
        callback_function: (text: string) => {
          self.postMessage({ type: 'token', payload: text });
        },
      });

      await (generator as unknown as (
        msgs: unknown[],
        opts: Record<string, unknown>,
      ) => Promise<void>)(messages, {
        max_new_tokens: 768,
        do_sample: false,
        streamer,
      });

      self.postMessage({ type: 'done', payload: '' });
    } catch (err: unknown) {
      self.postMessage({ type: 'error', payload: err instanceof Error ? err.message : String(err) });
    }
  }
};
