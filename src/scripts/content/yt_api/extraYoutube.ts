export function extractYouTubeID(url: string): string {
  try {
    if (!url) return '';
    // support youtu.be short links
    const u = new URL(url);

    if (u.hostname.includes('youtu.be')) {
      return u.pathname.slice(1);
    }

    if (u.searchParams.has('v')) {
      return u.searchParams.get('v') ?? '';
    }
    // some embed or watch variations
    const match = url.match(/(?:v=|\/embed\/|\/v\/)([A-Za-z0-9_-]{6,})/);

    return match ? match[1] : '';
  } catch (e) {
    console.error(e);
    // fallback: regex find 11 char id
    const match = url.match(/([A-Za-z0-9_-]{11})/);
    return match ? match[1] : '';
  }
}
