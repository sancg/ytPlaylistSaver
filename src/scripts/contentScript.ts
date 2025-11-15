import buildContentPlaylist from '../utils/buildPlayList';
console.log('CS connection...');

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'extract_playlist') {
    (async () => {
      const { playlist, error } = await buildContentPlaylist(document);
      sendResponse({ playlist, error });
    })();

    // return true keeps the message port open for async sendResponse()
    return true;
  }

  if (request.action === 'add_video') {
    const btn = document.querySelector<HTMLButtonElement>('#ytps-fav-btn');
    btn?.click();
  }
  return { status: 'success' };
});
