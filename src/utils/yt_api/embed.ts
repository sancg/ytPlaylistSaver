export function buildYouTubeEmbedSrc(
  videoId: string,
  opts?: {
    autoplay?: boolean;
    modestBranding?: boolean;
    rel?: 0 | 1;
    nocookie?: boolean; // privacy-enhanced mode
  }
) {
  const { autoplay = true, modestBranding = true, rel = 0, nocookie = false } = opts ?? {};

  const base = nocookie
    ? `https://www.youtube-nocookie.com/embed/${videoId}`
    : `https://www.youtube.com/embed/${videoId}`;

  const params = new URLSearchParams({
    enablejsapi: '1',
    origin: `chrome-extension://${chrome.runtime.id}`,
    playsinline: '1',
    rel: String(rel),
    modestbranding: modestBranding ? '1' : '0',
    autoplay: autoplay ? '1' : '0',
  });

  return `${base}?${params.toString()}`;
}
