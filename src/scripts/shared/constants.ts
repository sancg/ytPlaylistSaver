export const cs = {
  ORIGIN: 'youtube.com/watch',
  EXTRACT_PLAYLIST: 'extract_pl',
  ADD_VIDEO: 'add_video',
  IS_SAVED: 'is_saved',
  GET_VIDEOS: 'get_videos',
  AVAILABLE_LIST: 'get_keys',
  REMOVE_VIDEO: 'remove_video',

  // PLaylist Actions
  GET_ALL_PLAYLIST: 'get_pl',
  GET_BY_KEY_PLAYLIST: 'get_by_key_pl',
  UPLOAD_PLAYLIST: 'new_pl',
  REMOVE_PLAYLIST: 'remove_pl',
  ALLOWED_EXTENSION: (url?: string) => {
    if (!url) return false;

    try {
      const u = new URL(url);
      return u.hostname.includes('youtube.com');
    } catch {
      return false;
    }
  },
} as const;

export type MessageType = (typeof cs)[keyof typeof cs];
