type Video = {
  id: string;
  title: string;
  url: string;
  thumbImg: string;
  thumbnailList?: ThumbList[];
  publishedBy?: string;
  timeLength?: string;
  currentIndex?: boolean | number;
  addedAt?: number;
};

type ThumbList = {
  url: string;
  height: number;
  width: number;
};

interface GetPlaylistCall {
  playlist: Video[];
  skipVideos: { video: Video[]; errorMsg: string }[];
  error: string | null;
}

type StoragePlaylist = Record<string, Video[]>;

export { Video, ThumbList, GetPlaylistCall, StoragePlaylist };
