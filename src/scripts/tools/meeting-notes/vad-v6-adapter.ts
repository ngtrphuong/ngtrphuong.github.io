/**
 * Makes vad-web 0.0.30 drive the Silero **v6** graph correctly.
 *
 * Silero's official ONNX protocol (identical in v5 and v6 — see OnnxWrapper in
 * snakers4/silero-vad `src/silero_vad/utils_vad.py`) prepends a rolling 64-sample context to
 * every 512-sample frame, feeding `input` of shape [1, 576]. vad-web's SileroV5 class instead
 * feeds bare [1, 512] frames. The v5 graph happens to tolerate that; the v6 graph does not —
 * measured on clear speech, v6 fed bare frames never exceeds p≈0.10 (i.e. VAD never fires),
 * while under the official context protocol it behaves slightly *better* than v5
 * (speech mean p≈0.92, silence p≈0.01).
 *
 * vad-web exposes `ortConfig(ort)`, called right before it creates the inference session — this
 * adapter uses that hook to wrap `InferenceSession.create` so every session transparently
 * maintains the official rolling context. No fork of vad-web needed. The wrap applies only to
 * vad-web's own `onnxruntime-web/wasm` module instance (Transformers.js and NonRealTimeVAD use
 * different module instances) and passes through any run() whose inputs don't match the
 * silero frame signature.
 */

const CONTEXT_SAMPLES = 64;
const FRAME_SAMPLES = 512;
const PATCHED = Symbol.for('meeting-notes.silero-v6-context-adapter');

type OrtTensorLike = { data: Float32Array; dims?: readonly number[] };
type OrtSessionLike = {
  run: (inputs: Record<string, OrtTensorLike>) => Promise<unknown>;
};
type OrtModuleLike = {
  Tensor: new (type: string, data: Float32Array, dims: number[]) => OrtTensorLike;
  InferenceSession: {
    create: (...args: unknown[]) => Promise<OrtSessionLike>;
  };
  [PATCHED]?: boolean;
};

export function sileroV6OrtConfig(ortUnknown: unknown): void {
  const ort = ortUnknown as OrtModuleLike;
  if (ort[PATCHED]) return;
  ort[PATCHED] = true;

  const origCreate = ort.InferenceSession.create.bind(ort.InferenceSession);
  ort.InferenceSession.create = async (...args: unknown[]) => {
    const session = await origCreate(...args);
    // Rolling context is per-session (per MicVAD instance / audio stream).
    let context = new Float32Array(CONTEXT_SAMPLES);

    return new Proxy(session, {
      get(target, prop, receiver) {
        if (prop !== 'run') return Reflect.get(target, prop, receiver);
        return async (inputs: Record<string, OrtTensorLike>) => {
          const input = inputs?.input;
          const state = inputs?.state;
          if (!input?.data || !state?.data || input.dims?.[1] !== FRAME_SAMPLES) {
            return target.run(inputs);
          }
          // A freshly reset LSTM state (all zeros) marks a new stream — reset the context too.
          let stateIsZero = true;
          for (let i = 0; i < state.data.length; i++) {
            if (state.data[i] !== 0) {
              stateIsZero = false;
              break;
            }
          }
          if (stateIsZero) context = new Float32Array(CONTEXT_SAMPLES);

          const extended = new Float32Array(CONTEXT_SAMPLES + FRAME_SAMPLES);
          extended.set(context, 0);
          extended.set(input.data, CONTEXT_SAMPLES);
          context = input.data.slice(FRAME_SAMPLES - CONTEXT_SAMPLES);

          return target.run({
            ...inputs,
            input: new ort.Tensor('float32', extended, [1, extended.length]),
          });
        };
      },
    });
  };
}
