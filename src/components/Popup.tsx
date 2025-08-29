import { useState } from 'react';
import { Video } from '../types/video';
import { GET_PLAYLIST } from '../utils/actions';

export const Popup = () => {
  const [_playlist, setPlaylist] = useState<Video[] | null>(null);
  const handleGetList = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0].id;
      console.log({ currentTab });
      if (currentTab) {
        chrome.tabs.sendMessage(
          currentTab,
          {
            action: GET_PLAYLIST,
          },
          (response) => {
            console.log({ file: response });
            setPlaylist(response);
          }
        );
      }
    });
  };

  return (
    <div>
      <button
        type='button'
        className='bg-[#e1002d] font-bold hover:bg-red-700 px-3 py-2 rounded w-full'
        onClick={handleGetList}
      >
        Get Playlist
      </button>
    </div>
  );
};
