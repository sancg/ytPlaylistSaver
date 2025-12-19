export const cs = {
  ORIGIN: 'youtube.com/watch',
  EXTRACT_PLAYLIST: 'extract_playlist',
  ADD_VIDEO: 'add_video',
  IS_SAVED: 'is_saved',
  GET_VIDEOS: 'get_videos',
  AVAILABLE_LIST: 'get_keys',
  REMOVE_VIDEO: 'remove_video',
  OPEN_PANEL: 'open_local_panel',

  // Workers dir:
  PYODIDE_DIR: 'assets/app/scripts/background/py_worker/py-worker.js',
} as const;

export type MessageType = (typeof cs)[keyof typeof cs];
