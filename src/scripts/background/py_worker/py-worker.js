// py-worker.js — Classic Worker
let pyodide = null;
let indexURL = null;

self.onmessage = async (event) => {
  const { type, code, payload } = event.data;

  if (type === 'init') {
    // Receive the indexURL from the parent
    indexURL = payload.indexURL;

    importScripts(indexURL + 'pyodide.js');

    pyodide = await loadPyodide({ indexURL });

    await cacheYTPackage(pyodide);
    console.log(
      pyodide.runPython(`
import sys
sys.version`)
    );
    self.postMessage({ type: 'ready' });
    return;
  }

  if (type === 'run') {
    try {
      const result = await pyodide.runPythonAsync(code);
      self.postMessage({ type: 'result', result });
    } catch (err) {
      self.postMessage({ type: 'error', error: err.toString() });
    }
  }
};

async function cacheYTPackage(pyodide) {
  // 1) Check if yt_dlp already importable (cache)
  const already = await pyodide.runPythonAsync(`
try:
    import yt_dlp
    True
except Exception:
    False
`);
  if (already) {
    console.log('[PY] yt-dlp already installed (cache hit)');
    return { success: true, data: { name: 'yt-dlp', installed: true, fromCache: true } };
  }
  console.log('[PY] Installing yt-dlp...');
  // 2) Load micropip (JS API). This uses the documented approach. :contentReference[oaicite:2]{index=2}
  // await pyodide.loadPackage('micropip'); // resolves when micropip is available
  const installCode = `
await micropip.install("micropip")
import micropip
await micropip.install("yt-dlp")
`;
  try {
    await pyodide.runPythonAsync(installCode);
    return { success: true, data: { name: 'yt-dlp', installed: true, fromCache: false } };
  } catch (error) {
    // bubble useful info back
    throw new Error('yt-dlp install failed: ' + String(error));
  }
}
