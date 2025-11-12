import { GET_PLAYLIST, sendMessageTab } from '.';
import type { GetPlaylistCall } from '../../types/video';

async function getPlaylist(): Promise<GetPlaylistCall> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab.id) {
    const { playlist, error } = await sendMessageTab<GetPlaylistCall>(tab.id, {
      action: GET_PLAYLIST,
    });

    // Detect if we loaded all images if not return fail
    if (!error) {
      const shouldHaveValues = playlist.filter(
        (vid) => !vid.id || !vid.title || !vid.thumbImg || !vid.url
      );
      if (shouldHaveValues.length > 0) {
        return {
          playlist: shouldHaveValues,
          error: 'Missing key information on this playlist',
        };
      }
    }

    return { playlist, error };
  }

  return { playlist: [], error: 'No response was received' };
}

export default getPlaylist;
