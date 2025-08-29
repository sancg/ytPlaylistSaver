import { GET_PLAYLIST } from '../utils/actions';
import { buildPlaylist } from '../utils/buildPlayList';

console.log('Content script loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log({ request, sender });
  if (request.action === GET_PLAYLIST) {
    const response = buildPlaylist(document);
    console.log('Message received in content script:', response);
    sendResponse({ response });
  }

  sendResponse({ success: false });
});
