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
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(msg, (response) => resolve(response));
  });
}

export { sendMessageTab, sendToBackground };
