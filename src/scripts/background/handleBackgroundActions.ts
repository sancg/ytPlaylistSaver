import { CoordinatorActionMap, SidePanelSession } from '../../types/messages';
import { StoragePlaylist } from '../../types/video';

const DEFAULT_SESSION: SidePanelSession = {
  view: 'PLAYLISTS',
};

let sidePanelOpen = false;

type Handler<K extends keyof CoordinatorActionMap> = (
  msg: CoordinatorActionMap[K],
  sender: chrome.runtime.MessageSender,
  sendResponse: (res?: any) => void,
) => void | true;

const Handlers: { [K in keyof CoordinatorActionMap]: Handler<K> } = {
  GET_SESSION: (_, __, sendResponse) => {
    chrome.storage.session.get('session', (res) => {
      sendResponse(res.session ?? DEFAULT_SESSION);
    });
    return true;
  },

  SET_SESSION: (msg) => {
    chrome.storage.session.get('session', (res) => {
      chrome.storage.session.set({
        session: { ...(res.session ?? DEFAULT_SESSION), ...msg.payload },
      });
    });
    return true;
  },

  PLAY_VIDEO: (msg) => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (tab?.id) chrome.tabs.sendMessage(tab.id, msg);
    });
  },

  VIDEO_CHANGED: (msg) => {
    if (sidePanelOpen) {
      chrome.runtime.sendMessage(msg);
    }
  },

  SIDE_PANEL_OPEN: (msg) => {
    chrome.storage.sync;
    sidePanelOpen = msg.payload.open;
  },

  GET_ALL_PLAYLIST: (_, __, sendResponse) => {
    chrome.storage.local.get('playlists').then((playlists) => {
      sendResponse(playlists as StoragePlaylist);
    });

    return true;
  },

  UPLOAD_PLAYLIST: (msg, _, sendResponse) => {
    try {
      const { name, playlist } = msg.payload;

      chrome.storage.local
        .get('playlists')
        .then((playlists) => {
          const updated = {
            ...(playlists as object),
            [name]: playlist,
          };
          return updated;
        })
        .then(async (update) => {
          await chrome.storage.local.set({ playlists: update });
          sendResponse(msg.response);
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (error) {
      sendResponse({ error: String(error) });
    }

    return true;
  },
};

export default Handlers;
