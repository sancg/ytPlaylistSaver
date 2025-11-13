declare global {
  interface Window {
    YT: typeof YT | undefined;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

// We'll define a type-safe Promise that resolves once YT is available
let ytApiPromise: Promise<typeof YT> | null = null;

export function loadYouTubeIframeAPI(): Promise<typeof YT> {
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise((resolve, reject) => {
    // Already available
    if (window.YT && window.YT.Player) {
      resolve(window.YT);
      return;
    }

    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('/assets/iframe_api.js'); // local copy
    script.async = true;
    script.defer = true;

    // YouTube calls this globally when ready
    window.onYouTubeIframeAPIReady = () => {
      if (window.YT) resolve(window.YT);
      else reject(new Error('YT not available after load'));
    };

    script.onerror = () => reject(new Error('Failed to load YouTube API'));
    document.body.appendChild(script);
  });

  return ytApiPromise;
}
