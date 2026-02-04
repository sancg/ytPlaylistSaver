type SidePanelSession = {
  view: 'PLAYLISTS' | 'VIDEOS';
  playlistId?: string;
  activeVideoId?: string;
};

type SessionActionMessage =
  | { type: 'GET_SESSION' }
  | { type: 'SET_SESSION'; payload: Partial<SidePanelSession> }
  | { type: 'PLAY_VIDEO'; videoId: string }
  | { type: 'VIDEO_CHANGED'; videoId: string }
  | { type: 'SIDE_PANEL_OPEN'; open: boolean };

type SessionActionMap = {
  GET_SESSION: { type: 'GET_SESSION' };
  SET_SESSION: { type: 'SET_SESSION'; payload: Partial<SidePanelSession> };
  PLAY_VIDEO: { type: 'PLAY_VIDEO'; videoId: string };
  VIDEO_CHANGED: { type: 'VIDEO_CHANGED'; videoId: string };
  SIDE_PANEL_OPEN: { type: 'SIDE_PANEL_OPEN'; open: boolean };
};
interface MessageMap {
  GET_ALL_PLAYLIST: {
    payload: void;
    response: {
      playlists: StoragePlaylist;
    };
  };

  UPLOAD_PLAYLIST: {
    payload: {
      name: string;
      playlist: Video[];
    };
    response: {
      status: 'ok';
    };
  };

  GET_SESSION: {
    payload: void;
    response: SidePanelSession;
  };
}

export { SidePanelSession, SessionActionMap, SessionActionMessage, MessageMap };
