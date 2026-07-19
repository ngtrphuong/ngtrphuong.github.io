/** Minimal subset of Transformers.js CacheInterface for env.customCache. */
export interface CacheInterface {
  match(request: string): Promise<Response | undefined>;
  put(
    request: string,
    response: Response,
    progress_callback?: (data: { progress: number; loaded: number; total: number }) => void,
  ): Promise<void>;
  delete?(request: string): Promise<boolean>;
}

/** File System Access API cache for Transformers.js model weights. */
export class DirHandleCache implements CacheInterface {
  constructor(private handle: FileSystemDirectoryHandle) {}

  private urlToSegments(url: string): string[] {
    try {
      const parsed = new URL(url);
      return [parsed.hostname, ...parsed.pathname.split('/').filter(Boolean)];
    } catch {
      return url.split('/').filter(Boolean);
    }
  }

  async match(request: string): Promise<Response | undefined> {
    const segments = this.urlToSegments(request);
    try {
      let dir: FileSystemDirectoryHandle = this.handle;
      for (let i = 0; i < segments.length - 1; i++) {
        dir = await dir.getDirectoryHandle(segments[i]);
      }
      const fileHandle = await dir.getFileHandle(segments[segments.length - 1]);
      const file = await fileHandle.getFile();
      return new Response(file, {
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
          'Content-Length': String(file.size),
        },
      });
    } catch {
      return undefined;
    }
  }

  async put(
    request: string,
    response: Response,
    progress_callback?: (data: { progress: number; loaded: number; total: number }) => void,
  ): Promise<void> {
    const segments = this.urlToSegments(request);
    let dir: FileSystemDirectoryHandle = this.handle;
    for (let i = 0; i < segments.length - 1; i++) {
      dir = await dir.getDirectoryHandle(segments[i], { create: true });
    }
    const fileHandle = await dir.getFileHandle(segments[segments.length - 1], { create: true });
    const writable = await fileHandle.createWritable();

    const contentLength = response.headers.get('Content-Length');
    const total = parseInt(contentLength ?? '0', 10);
    let loaded = 0;
    const reader = response.body!.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      await writable.write(value);
      loaded += value.length;
      progress_callback?.({ progress: total > 0 ? loaded / total : 0, loaded, total });
    }
    await writable.close();
  }

  async delete(request: string): Promise<boolean> {
    const segments = this.urlToSegments(request);
    try {
      let dir: FileSystemDirectoryHandle = this.handle;
      for (let i = 0; i < segments.length - 1; i++) {
        dir = await dir.getDirectoryHandle(segments[i]);
      }
      await dir.removeEntry(segments[segments.length - 1]);
      return true;
    } catch {
      return false;
    }
  }
}
