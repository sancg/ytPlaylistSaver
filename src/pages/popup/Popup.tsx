import { cs } from '../../scripts/shared/constants';
import { sendToBackground } from '../../utils/actions/messages';

export const Popup = () => {
  const openSidePanel = async () => {
    // FIXME: Related to the side_panel view - TODO - only show in yt tabs
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (tab.id) await sendToBackground({ type: cs.OPEN_PANEL, payload: { id: tab.id } });
  };

  // const renderIconSP = () => {
  //   return (
  //     <div className='p-2' title='Open SidePanel'>
  //       <ArrowLeftEndOnRectangleIcon
  //         className='transition-all duration-300 ease-in-out hover:scale-125 hover:cursor-pointer'
  //         width={20}
  //         onClick={openSidePanel}
  //       />
  //     </div>
  //   );
  // };
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
