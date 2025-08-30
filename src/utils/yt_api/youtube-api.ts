declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export function loadYouTubeAPI(): Promise<void> {
  return new Promise((resolve) => {
    if (window.YT?.Player) return resolve();

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => resolve();
  });
}
