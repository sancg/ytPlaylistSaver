import { useState } from 'react';
import type { Video } from '../types/video';
import { GET_PLAYLIST } from '../utils/actions';

export const Popup = () => {
  const [_playlist, _setPlaylist] = useState<Video[] | null>(null);
  const generatePlaylist = async () => {
    let result = null;
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.id) {
      result = await chrome.tabs.sendMessage(tab.id, {
        action: GET_PLAYLIST,
      });
    }

    return result;
  };
  const handleGetList = async () => {
    const { playlist, error } = await generatePlaylist();
    if (error) {
      console.error(error);
      return;
    }

    if (playlist) {
      const currentIndex = playlist.findIndex((p: Video) => p.currentIndex);
      const exportResult = { currentIndex, playlist };
      const fileName = prompt('Playlist Name:', 'playlist') || 'playlist';

      // Save JSON file
      const blob = new Blob([JSON.stringify(exportResult)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${fileName}.json`;
      a.click();
    }
  };

  return (
    <div>
      <button
        type='button'
        className='bg-[#e1002d] font-bold hover:bg-red-700 px-3 py-2 rounded w-full cursor-pointer'
        onClick={handleGetList}
      >
        Get Playlist
      </button>
    </div>
  );
};
