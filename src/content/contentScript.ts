import { buildPlaylist } from '../utils/buildPlayList';
console.log('Content script loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log({ request, sender });

  if (request.action === 'get_playlist_from_youtube') {
    const result = buildPlaylist(document);
    if (result.error) {
      sendResponse({ error: result.error, playlist: result.playlist });
      return;
    }

    sendResponse({ playlist: result.playlist, error: null });
  }

  return { status: 'success' };
});
