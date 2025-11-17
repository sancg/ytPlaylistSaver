type Video = {
  id: string;
  title: string;
  url: string;
  thumbImg: string;
  publishedBy?: string;
  timeLength?: string;
  currentIndex?: boolean;
};

export interface GetPlaylistCall {
  playlist: Video[];
  skipVideos: { video: Video[]; errorMsg: string }[];
  error: string | null;
}

export { Video, GetPlaylistCall };
