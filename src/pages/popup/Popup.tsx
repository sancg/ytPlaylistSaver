import { ArrowLeftEndOnRectangleIcon } from '@heroicons/react/20/solid';

export const Popup = () => {
  const openSidePanel = async () => {
    const { id } = await chrome.windows.getCurrent();
    await chrome.sidePanel.setOptions({
      path: 'src/pages/side_panel/side-panel.html',
      enabled: true,
      tabId: id,
    });
    await chrome.sidePanel.open({ windowId: id! });
  };
  return (
    <div className='p-2' title='Open SidePanel'>
      <ArrowLeftEndOnRectangleIcon
        className='transition-all duration-300 ease-in-out hover:scale-125 hover:cursor-pointer'
        width={20}
        onClick={openSidePanel}
      />
    </div>
  );
};
