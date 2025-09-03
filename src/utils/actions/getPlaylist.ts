import { GET_PLAYLIST } from '.';
import type { GetPlaylistCall } from '../../types/video';

const getPlaylist = async (): Promise<GetPlaylistCall> => {
  let result = null;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab.id) {
    result = await chrome.tabs.sendMessage(tab.id, {
      action: GET_PLAYLIST,
    });
  }

  return result;
};

export default getPlaylist;
