import { buildContentPlaylist } from '../utils/buildPlayList';
console.log('Content script loaded');

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'get_playlist_from_youtube') {
    (async () => {
      const { playlist, error } = await buildContentPlaylist(document);
      console.log('Playlist extraction complete...');
      sendResponse({ playlist, error });
    })();

    // return true keeps the message port open for async sendResponse()
    return true;
  }

  return { status: 'success' };
});
