import { cs } from '../shared/constants';
import { handleAvailableSP } from './handleAvailableSP';
import { checkCommandShortcuts } from './commands';
import type { SessionActionMessage } from '../../types/messages';
import Handlers from './handleSession';
import type { Video } from '../../types/video';

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
  handleAvailableSP(tabId, tabUrl, 'onUpdated');
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
  handleAvailableSP(tabId, tab.url, 'onActivated');
});

// ----------------------------------
// SESSION CONTROLLER
// ----------------------------------
chrome.runtime.onMessage.addListener((msg: SessionActionMessage, sender, sendResponse) => {
  const handler = Handlers[msg.type];
  if (!handler) {
    return;
  }

  return handler(msg as any, sender, sendResponse);
});

// ---------------------------------
// PLAYLIST MANAGER
// ---------------------------------
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (!msg.type) {
    return;
  }

  if (msg.type === cs.GET_ALL_PLAYLIST) {
    chrome.storage.local.get('playlists').then((playlists) => {
      sendResponse(playlists);
    });

    return true;
  }

  // ** UPLOAD PLAYLIST TO LOCAL_STORAGE **
  if (msg.type === cs.UPLOAD_PLAYLIST) {
    (async () => {
      try {
        const { name, playlist } = msg.payload;

        const { playlists = {} } = await chrome.storage.local.get('playlists');

        const updated = {
          ...(playlists as object),
          [name]: playlist,
        };

        await chrome.storage.local.set({ playlists: updated });

        sendResponse({ status: 'ok' });
      } catch (error) {
        sendResponse({ error: String(error) });
      }
    })();

    return true;
  }

  if (msg.type === cs.REMOVE_PLAYLIST) {
  }
});
// ---------------------------------
// OPERATIONS ON UI -> VIDEOS CRUD
// ---------------------------------
// IMPROVE: Is it possible to refactor in function base listeners?
// docs.. https://developer.chrome.com/docs/extensions/develop/concepts/messaging#responses
chrome.runtime.onMessage.addListener((res, _sender, sendResponse) => {
  if (!res.type) return;

  if (res.type === cs.IS_SAVED) {
    const cID = res.payload.currentId;
    chrome.storage.local.get('download-ready').then((sg) => {
      const list: Video[] = (sg['download-ready'] as []) || [];
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

      const list: Video[] = (st['download-ready'] as []) || [];
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

      const list: Video[] = (st['download-ready'] as []) || [];
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

  if (res.type === cs.REMOVE_VIDEO) {
    chrome.storage.local.get('download-ready').then((res) => {
      const list: Video[] = (res['download-ready'] as []) || [];
      const next = list.filter((v) => v.id !== res.videoId);

      chrome.storage.local.set({ 'download-ready': next }).then(() => {
        sendResponse({ status: 'removed' });
      });
    });
    return true;
  }

  if (res.type === 'play_video') {
    // TODO: Send message to CS to replace location.href
  }

  return { error: 'Something happen on the listener' };
});
