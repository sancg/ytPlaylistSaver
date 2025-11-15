import { ct } from '.';
import { sendMessageTab } from '.';
import type { GetPlaylistCall } from '../../types/video';

async function getPlaylistTab(): Promise<GetPlaylistCall> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab.id) {
    const { playlist, error } = await sendMessageTab<GetPlaylistCall>(tab.id, {
      action: ct.EXTRACT_PLAYLIST,
    });

    return { playlist, error };
  }

  return { playlist: [], error: 'No response was received' };
}

export default getPlaylistTab;
