import { GET_PLAYLIST } from '.';
import type { GetPlaylistCall } from '../../types/video';

const getPlaylist = async (): Promise<GetPlaylistCall> => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab.id) {
    const result = await chrome.tabs.sendMessage(tab.id, {
      action: GET_PLAYLIST,
    });
    return result;
  }

  return { error: 'No response was received', playlist: [] };
};

export default getPlaylist;
