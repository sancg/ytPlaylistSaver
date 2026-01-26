import { cs } from '../shared/constants';
import { handleTabState } from './handleStatePanel';
import { checkCommandShortcuts } from './commands';
import type { StoragePlaylist, Video } from '../../types/video';

console.log('[Background] Ready...');
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    checkCommandShortcuts();
  }
});

chrome.commands.onCommand.addListener(async (cmd) => {
  //FIXME: The error is still the same when querying for the current tab. Uncaught (in promise) Error: `sidePanel.open()` may only be called in response to a user gesture.
  if (cmd === 'toggle-side-panel') {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.id) {
      const { enabled } = await chrome.sidePanel.getOptions({ tabId: tab.id });
      if (!enabled) {
        console.info(`Current tab does not have side-panel enabled - tab.id: ${tab.id}`);
        return;
      }
      await chrome.sidePanel.open({ tabId: tab.id });
    }
  }
});

// NOTE: Open the SidePanel only in the YT tabs... see the docs.
// https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/functional-samples/cookbook.sidepanel-site-specific/service-worker.js
// Detecting tab URL changes
let tabUrl: string = '';
chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (!tab.url || !info.url) return;
  tabUrl = tab.url;
  if (cs.ALLOWED_EXTENSION(tabUrl)) {
    console.log('[BG] Sending message of tab onUpdated', { info, tab });
    try {
      await chrome.tabs.sendMessage(tabId, { action: 'url_change', payload: { tab } });
    } catch (error) {
      console.info('onUpdated: cs is not available', error);
    }
  }
  handleTabState(tabId, tabUrl, 'onUpdated');
});

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  const tab = await chrome.tabs.get(tabId);
  if (!tab.url) return;

  if (cs.ALLOWED_EXTENSION(tab.url)) {
    console.log('[BG] Sending message of tab onActivated', { tab });
    try {
      await chrome.tabs.sendMessage(tabId, { action: 'url_change', payload: { tab } });
    } catch (error) {
      // FIXME: This error occurs when [CS] is not available at the time of execution
      // 1. Implement a debounce when sendMessage()
      // 2. Ensure injection via chrome.scripting.executeScript() or similar
      console.info('onActivated: cs is not available - ', error);
    }
  }
  handleTabState(tabId, tab.url, 'onActivated');
});

chrome.runtime.onMessage.addListener((res, _sender, sendResponse) => {
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
        console.log('[BG] No id provided on payload');
        sendResponse({ error: 'no video provided on payload' });
      }

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

  if (res.type === cs.REMOVE_VIDEO) {
    chrome.storage.local.get('download-ready').then((st) => {
      const id = res.payload.id;
      if (!id) {
        console.warn(`[BG] No id provided on payload`);
        sendResponse({ error: 'No id provided on payload' });
      }

      const list: Video[] = st['download-ready'] || [];
      const updateList = list.filter((v) => v.id !== id);
      console.log(`Updated List: `, { list, updateList });

      chrome.storage.local.set({ 'download-ready': updateList }, () => {
        if (chrome.runtime.lastError) {
          console.error(`[BG] Storage couldn't be updated`, chrome.runtime.lastError);
          sendResponse({ error: "[BG] Storage couldn't be updated" });
        }
      });
      sendResponse({ exists: false, payload: updateList });
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
