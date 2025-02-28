import { buildPlayList } from './src/utils/buildPlayList';

console.log('Content script loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log({ request, sender });
  console.log('Message received in content script:', request);
  if (request.action === 'SELECT_PLAYLIST') {
    const result = buildPlayList(document);
    sendResponse({ result });
  }

  sendResponse({ success: true });
});
