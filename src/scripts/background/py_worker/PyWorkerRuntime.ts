import { cs } from '../../shared/constants';

export type PythonResult = any;
export type StdLine = { type: string; [k: string]: any };

export class PyWorkerRuntime {
  private indexURL: string;
  private worker: Worker;
  private ready: Promise<void>;

  constructor() {
    this.worker = new Worker(chrome.runtime.getURL(cs.PYODIDE_DIR), {
      type: 'classic',
    });

    this.ready = new Promise((resolve) => {
      this.worker.onmessage = (e) => {
        const data = e.data;
        if (data.type === 'ready') {
          console.log('[PY_WORKER] worker created...');
          resolve();
        }
        if (data.type === 'install') {
          // optional: we could surface install progress
          console.debug('[PY_WORKER] install:', data.info);
        }

        if (data.type === 'error') {
          console.error('[PY_WORKER] init error:', data.error);
        }
      };
    });

    // Get the pyodide root
    this.indexURL = chrome.runtime.getURL('assets/pyodide/');

    // initialize worker
    this.worker.postMessage({ type: 'init', payload: { indexURL: this.indexURL } });

    // Proactively ask worker to load our python module (path must match dist)
    const modulePath = chrome.runtime.getURL('assets/app/scripts/python/download.py');
    // load after ready to avoid racing (we can do this async)
    this.ready.then(() => {
      this.worker.postMessage({ type: 'load_python_module', payload: { path: modulePath } });
    });
  }

  async run(code: string): Promise<PythonResult> {
    await this.ready;

    return new Promise((resolve, reject) => {
      this.worker.onmessage = (e) => {
        if (e.data.type === 'result') return resolve(e.data.result);
        if (e.data.type === 'error') return reject(e.data.error);
      };

      this.worker.postMessage({ type: 'run', code });
    });
  }

  // download with callback for stdout lines
  async download(
    url: string,
    options?: Record<string, any>,
    onStdout?: (line: StdLine | string) => void
  ): Promise<void> {
    await this.ready;

    return new Promise((resolve, reject) => {
      const onMessage = (e: MessageEvent) => {
        const data = e.data;
        if (!data) return;

        if (data.type === 'stdout') {
          const text: string = data.text;
          // pyodide may send partial chunks; split by newline and parse JSON where possible
          const lines = text.split(/\r?\n/).filter(Boolean);
          for (const ln of lines) {
            try {
              const parsed = JSON.parse(ln);
              if (onStdout) onStdout(parsed);
            } catch (err) {
              if (onStdout) onStdout(ln);
            }
          }
        } else if (data.type === 'stderr') {
          if (onStdout) onStdout({ type: 'stderr', msg: data.text });
        } else if (data.type === 'done') {
          this.worker.removeEventListener('message', onMessage);
          resolve();
        } else if (data.type === 'error') {
          this.worker.removeEventListener('message', onMessage);
          reject(data.error);
        } else if (data.type === 'module_loaded') {
          // ignore or notify
        }
      };

      this.worker.addEventListener('message', onMessage);

      this.worker.postMessage({ type: 'download', payload: { url, options } });
    });
  }
}
