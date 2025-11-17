import { cs } from '../shared/constants';
import type { StoragePlaylist, Video } from '../../types/video';

console.log('[Background] Ready...');
// NOTE: Open the SidePanel only in the YT tabs... see the docs.
// https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/functional-samples/cookbook.sidepanel-site-specific/service-worker.js
// It is fix when is in the same tab, I've should look into the set up better.
// Detecting tab URL changes
let tabUrl: string = '';
chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (!tab.url) return;
  tabUrl = tab.url;

  // Check tab focus
  if (!tab.active) {
    console.log('[BG] tab out of focus?');
  }

  if (info.status === 'complete') {
    const url = new URL(tab.url);
    // Check URL changes to update state on the UI -> M.W.
    if (url.href.includes(cs.ORIGIN)) {
      console.log({ info, tab, tabUrl, url: tab.url });
      if (tabId === tab.id) {
        console.log('[BG] Detecting change on the URL....');
        await chrome.tabs.sendMessage(tabId, {
          action: 'url_change',
          payload: { updatedUrl: tab.url },
        });
      }
      await chrome.sidePanel.setOptions({
        tabId: tab.id,
        path: 'src/pages/side_panel/side-panel.html',
        enabled: true,
      });
    } else {
      await chrome.sidePanel.setOptions({ tabId: tab.id, enabled: false });
    }
  }
});

chrome.runtime.onMessage.addListener((res, _sender, sendResponse) => {
  if (res.type === cs.OPEN_PANEL) {
    const { id } = res.payload.currentTab;
    // Intended to allow sidePanel if the URL is different from cs.ORIGIN
    // console.log({ tabUrl, sender, currentTab: url });

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
    return true;
  }

  if (res.type === cs.ADD_VIDEO) {
    chrome.storage.local.get('download-ready').then((st) => {
      const video = res.payload.video;
      if (!video) {
        console.log('[EARLY RETURN]');
        sendResponse({ error: 'no video provided on payload' });
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

      sendResponse({ exists: true });
    });
    return true;
  }

  if (res.type === cs.AVAILABLE_LIST) {
    chrome.storage.local.getKeys().then((r) => {
      console.log(r);
    });
    return true;
  }

  if (res.type === cs.GET_VIDEOS) {
    chrome.storage.local.get<StoragePlaylist>(null).then((data) => {
      console.log('[BG] Getting key-stored...', { data });
      if (!res) sendResponse({ res, error: 'No data available' });
      sendResponse({ data, error: null });
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

  return { error: 'Something happen on the listener' };
});
