/** Normalize Transformers.js progress_callback payloads (0–1 or 0–100). */
export function parseTransformersProgress(payload: unknown): { pct: number; status: string } {
  const p = (payload ?? {}) as {
    progress?: number;
    status?: string;
    file?: string;
    name?: string;
  };

  let pct = 0;
  if (typeof p.progress === 'number' && Number.isFinite(p.progress)) {
    pct = p.progress <= 1 ? Math.round(p.progress * 100) : Math.round(Math.min(100, p.progress));
  }

  const file = p.file ?? p.name ?? '';
  const status = p.status ?? '';
  let statusText = 'Loading model…';

  if (status === 'initiate') {
    statusText = file ? `Preparing: ${file}` : 'Preparing…';
  } else if (status === 'download' || status === 'progress') {
    statusText = file ? `Downloading ${file} (${pct}%)` : `Downloading… (${pct}%)`;
  } else if (status === 'done') {
    statusText = file ? `Loaded ${file}` : 'Loading…';
  } else if (status) {
    statusText = `${status}…`;
  } else if (file) {
    statusText = `Loading ${file}`;
  }

  return { pct, status: statusText };
}
