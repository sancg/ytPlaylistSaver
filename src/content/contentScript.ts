import { buildPlaylist } from '../utils/buildPlayList';
console.log('Content script loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log({ request, sender });

  if (request.action === 'get_playlist_from_youtube') {
    const result = buildPlaylist(document);
    if (result.error) {
      return sendResponse({ error: result.error });
    }

    console.log({ result });
    return sendResponse({ playlist: result });
  }

  return;
});
