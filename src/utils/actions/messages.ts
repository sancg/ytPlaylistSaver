import { MessageMap } from '../../types/messages';

function sendMessageTab<T = unknown>(tabId: number, message: unknown): Promise<T> {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response as T);
      }
    });
  });
}

export type BackgroundResponse<T> = {
  data: T | null;
  error: string | null;
};

function sendToBackground<TResponse>(msg: any): Promise<TResponse> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(msg, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }

      if (response === undefined) {
        reject(new Error(`No response received for ${msg.type}`));
        return;
      }

      resolve(response as TResponse);
    });
  });
}

function bgPlaylistManager<K extends keyof MessageMap>(
  type: K,
  payload: MessageMap[K]['payload'],
): Promise<MessageMap[K]['response']> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type, payload }, (response: MessageMap[K]['response']) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }

      if (!response) {
        reject(new Error(`No response for ${type}`));
        return;
      }

      resolve(response);
    });
  });
}

export { sendMessageTab, sendToBackground, bgPlaylistManager };
