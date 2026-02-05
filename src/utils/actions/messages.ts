import { CoordinatorActionMap } from '../../types/messages';

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

function sendToBackground<T extends keyof CoordinatorActionMap>(
  msg: CoordinatorActionMap[T],
): Promise<CoordinatorActionMap[T]> {
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

      resolve(response);
    });
  });
}

export { sendMessageTab, sendToBackground };
