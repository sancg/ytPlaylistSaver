import { extractYouTubeID } from '../../scripts/content/yt_api/extraYoutube';
import type { StoragePlaylist, Video } from '../../types/video';
import { sendToBackground } from '../../utils/actions/messages';

const normalizePlaylist = (obj: {
  playlist?: Video[];
  playList?: Video[]; // legacy - I returned an object with this name
}): Video[] | null => {
  const list = obj.playlist || obj.playList;
  if (!Array.isArray(list)) return null;

  return list.map((v) => ({
    ...v,
    id: v.id ?? extractYouTubeID(v.url || ''),
  }));
};

// Handle File Upload
const handleFileUpload = (
  event: React.ChangeEvent<HTMLInputElement>,
  setPlaylist: React.Dispatch<React.SetStateAction<Video[]>>,
  setMultiPlaylist: React.Dispatch<React.SetStateAction<StoragePlaylist>>,
) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const stripName = file.name.replace('.json', '').trim();

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parseObject = JSON.parse(e.target?.result as string);
      console.log({ parseObject });
      const uploadedPlaylist = normalizePlaylist(parseObject);
      console.log({ uploadedPlaylist });

      if (!uploadedPlaylist) {
        console.error('Invalid JSON format. Expected an array of videos.');
        return;
      }

      sendToBackground({
        type: 'UPLOAD_PLAYLIST',
        payload: { name: stripName, playlist: uploadedPlaylist },
      });

      setMultiPlaylist((prev) => ({ ...prev, [stripName]: uploadedPlaylist }));
      setPlaylist(uploadedPlaylist);
    } catch (err) {
      console.error('Error parsing JSON file', err);
    }
  };
  reader.readAsText(file);
};

export default handleFileUpload;
