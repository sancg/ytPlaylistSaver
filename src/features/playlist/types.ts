// FIXME: Animation motion does not go back/forward
type Direction = 'back' | 'forward';

type ViewState =
  | { view: 'PLAYLISTS'; direction?: Direction }
  | { view: 'VIDEOS'; playlistId: string; direction?: Direction };
export type { ViewState };
