// import { cs } from '../../scripts/shared/constants';
// import { sendToBackground } from '../../utils/actions/messages';

import { useEffect, useState } from 'react';
import { cs } from '../../scripts/shared/constants';

export const Popup = () => {
  const [canOpenPanel, setCanOpenPanel] = useState(false);

  useEffect(() => {
    (async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      setCanOpenPanel(cs.ALLOWED_EXTENSION(tab?.url));
    })();
  }, []);
  const openSidePanel = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.id) {
      const { enabled } = await chrome.sidePanel.getOptions({ tabId: tab.id });
      if (!enabled) {
        console.info(`Current tab does not have side-panel enabled - tab.id: ${tab.id}`);
        return;
      }

      await chrome.sidePanel.open({ tabId: tab.id });
    }
  };

  return (
    <button
      disabled={!canOpenPanel}
      className={`
      w-full px-3 py-2 rounded-2xl font-medium transition
      ${
        canOpenPanel
          ? 'bg-yt-accent-red text-white hover:bg-red-700 cursor-pointer'
          : 'bg-[#e5e5e5] text-[#909090] cursor-not-allowed'
      }
    `}
      onClick={openSidePanel}
    >
      Open Playlist Viewer
    </button>
  );
};
