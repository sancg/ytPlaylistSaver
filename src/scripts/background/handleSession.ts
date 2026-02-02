import { SessionActionMap, SidePanelSession } from '../../types/messages';

const DEFAULT_SESSION: SidePanelSession = {
  view: 'PLAYLISTS',
};

let sidePanelOpen = false;

type Handler<K extends keyof SessionActionMap> = (
  msg: SessionActionMap[K],
  sender: chrome.runtime.MessageSender,
  sendResponse: (res?: any) => void,
) => void | true;

const Handlers: { [K in keyof SessionActionMap]: Handler<K> } = {
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
    sidePanelOpen = msg.open;
  },
};

export default Handlers;
