type Video = {
  id: string;
  title: string;
  url: string;
  thumbImg: string;
  publishedBy?: string;
  timeLength?: string;
  currentIndex?: boolean;
};

interface GetPlaylistCall {
  playlist: Video[];
  skipVideos: { video: Video[]; errorMsg: string }[];
  error: string | null;
}

type StoragePlaylist = { [key: string]: Video[] };

export { Video, GetPlaylistCall, StoragePlaylist };
