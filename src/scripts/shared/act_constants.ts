export const MSG = {
  EXTRACT_PLAYLIST: 'extract_playlist',
  ADD_VIDEO: 'add-video',
  IS_SAVED: 'is-saved',
  GET_VIDEOS: 'get-videos',
  REMOVE_VIDEO: 'remove-video',
} as const;

export type MessageType = (typeof MSG)[keyof typeof MSG];
