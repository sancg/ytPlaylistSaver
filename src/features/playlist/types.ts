// FIXME: Animation motion does not go back/forward
type Direction = 'back' | 'forward';

type ViewState =
  | { type: 'PLAYLISTS'; direction?: Direction }
  | { type: 'VIDEOS'; playlistId: string; direction?: Direction };
export type { ViewState };
