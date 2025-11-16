import { cs } from '../shared/constants';
import type { Video } from '../../types/video';

console.log('[Background] Ready...');

// TODO: Open the SidePanel only in the Youtube tabs
// chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
//   if (!tab.url) return;

//   if (info.status === 'complete') {
//     const url = new URL(tab.url);
//     // Enables the side panel on google.com
//     if (url.href.includes(cs.ORIGIN)) {
//       await chrome.sidePanel.setOptions({
//         tabId,
//         path: 'src/pages/side_panel/side-panel.html',
//         enabled: true,
//       });
//     } else {
//       // Disables the side panel on all other sites
//       await chrome.sidePanel.setOptions({
//         tabId,
//         path: 'src/pages/side_panel/side-panel.html',
//         enabled: false,
//       });
//     }
//   }
// });

chrome.runtime.onMessage.addListener((res, _sender, sendResponse) => {
  if (res.type === cs.OPEN_PANEL) {
    const id = res.payload.id;
    (async () => {
      await chrome.sidePanel.open({ tabId: id });
    })();

    return true;
  }

  if (res.type === cs.IS_SAVED) {
    const cID = res.payload.currentId;
    chrome.storage.local.get('download-ready').then((sg) => {
      const list: Video[] = sg['download-ready'] || [];
      const exists = list.some((v) => {
        if (!v.id) {
          return false;
        }
        return v.id === cID;
      });

      sendResponse({ exists });
    });
    return true; // async
  }

  if (res.type === cs.ADD_VIDEO) {
    chrome.storage.local.get('download-ready').then((st) => {
      const video = res.payload.video;
      if (!video) {
        console.log('[EARLY RETURN]');
        return;
      }
      console.log({ video, res });
      const list: Video[] = st['download-ready'] || [];
      const exists = list.some((v) => {
        if (!v.id) {
          return false;
        }
        return v.id === video.id;
      });
      console.log('ADD VIDEO: ', { list, exists });

      if (!exists) list.push(video);
      chrome.storage.local.set({ 'download-ready': list });

      // chrome.runtime.sendMessage({ action: 'update_state', payload: { exists: true } });
      sendResponse({ exists: true });
    });
    return true; // async
  }

  if (res.type === cs.AVAILABLE_LIST) {
    chrome.storage.local.getKeys().then((r) => {
      console.log(r);
    });
    return true;
  }
  if (res.type === cs.GET_VIDEOS) {
    chrome.storage.local.get('download-ready').then((res) => {
      sendResponse({ videos: (res['download-ready'] as Video[]) || [] });
    });
    return true;
  }

  if (res.type === cs.REMOVE_VIDEO) {
    chrome.storage.local.get('download-ready').then((res) => {
      const list: Video[] = res['download-ready'] || [];
      const next = list.filter((v) => v.id !== res.videoId);

      chrome.storage.local.set({ 'download-ready': next }).then(() => {
        sendResponse({ status: 'removed' });
      });
    });
    return true;
  }
});
