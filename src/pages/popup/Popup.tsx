import { cs } from '../../scripts/shared/constants';
import { sendToBackground } from '../../utils/actions/messages';

export const Popup = () => {
  const openSidePanel = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.id) {
      const { enabled } = await chrome.sidePanel.getOptions({ tabId: tab.id });
      if (!enabled) {
        console.info(`Current tab does not have side-panel enabled - tab.id: ${tab.id}`);
        return;
      }

      await sendToBackground({
        type: cs.OPEN_PANEL,
        payload: { currentTab: tab },
      });
    }
  };

  return (
    <button
      //bg-[#e1002d]
      className='bg-yt-accent-red font-bold hover:cursor-pointer hover:bg-red-700 px-3 py-2 rounded-2xl w-full'
      onClick={openSidePanel}
    >
      Open Playlist Viewer
    </button>
  );
};
