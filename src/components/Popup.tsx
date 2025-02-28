export const Popup = () => {
  const handleGetList = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0].id;
      console.log({ currentTab });
      if (currentTab) {
        chrome.tabs.sendMessage(
          currentTab,
          {
            action: 'SELECT_PLAYLIST',
          },
          (r) => {
            console.log('Playlist Generated: ', r);
          }
        );
      }
    });
  };

  return (
    <div>
      <button type='button' onClick={handleGetList}>
        Playlist
      </button>
    </div>
  );
};
