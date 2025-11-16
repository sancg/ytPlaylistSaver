import { cs } from '../../scripts/shared/constants';
import { sendMessageTab } from '.';
import type { GetPlaylistCall } from '../../types/video';

async function getPlaylistTab(): Promise<GetPlaylistCall> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab.id) {
    const { playlist, error } = await sendMessageTab<GetPlaylistCall>(tab.id, {
      action: cs.EXTRACT_PLAYLIST,
    });

    return { playlist, error };
  }

  return { playlist: [], error: 'No response was received' };
}

export default getPlaylistTab;
