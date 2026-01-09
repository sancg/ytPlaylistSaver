import { Video } from '../../types/video';
import { getPlaylistTab } from '../../utils/actions';

const handleGetPlaylist = async () => {
  const { playlist, skipVideos, error } = await getPlaylistTab();
  console.log({ ext_log: { playlist, skipVideos, error } });

  if (skipVideos || error) {
    console.warn('Controlled Error: ', { playlist, skipVideos, error });
    return;
  }

  if (playlist) {
    const currentIndex = playlist.findIndex((p: Video) => p.currentIndex);
    const exportResult = { currentIndex, playlist };
    const fileName = prompt('Playlist Name:', 'playlist');
    if (!fileName) {
      console.log("Download was 'canceled' from the user");
      return;
    }

    // Save JSON file
    const blob = new Blob([JSON.stringify(exportResult)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${fileName}.json`;
    a.click();
  }
};
export default handleGetPlaylist;
