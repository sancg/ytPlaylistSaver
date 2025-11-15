import type { Video } from '../../types/video';

console.log('[Background] Ready...');

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'is_saved') {
    chrome.storage.local.get('download-ready').then((res) => {
      const list: Video[] = res['download-ready'] || [];
      const exists = list.some((v) => v.id === msg.videoId);
      sendResponse({ exists });
    });
    return true; // async
  }

  if (msg.type === 'add_video') {
    chrome.storage.local.get('download-ready').then((res) => {
      const list: Video[] = res['download-ready'] || [];
      const exists = list.some((v) => v.id === msg.video.id);

      if (!exists) list.push(msg.video);
      chrome.storage.local.set({ 'download-ready': list });
      sendResponse({ status: 'added' });
    });
    return true; // async
  }

  if (msg.type === 'get-videos') {
    chrome.storage.local.get('download-ready').then((res) => {
      sendResponse({ videos: (res['download-ready'] as Video[]) || [] });
    });
    return true;
  }

  if (msg.type === 'remove-video') {
    chrome.storage.local.get('download-ready').then((res) => {
      const list: Video[] = res['download-ready'] || [];
      const next = list.filter((v) => v.id !== msg.videoId);

      chrome.storage.local.set({ 'download-ready': next }).then(() => {
        sendResponse({ status: 'removed' });
      });
    });
    return true;
  }
});
