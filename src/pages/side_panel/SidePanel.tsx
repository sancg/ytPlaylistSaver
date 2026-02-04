import '../../styles/global.css';
import '../../styles/app.css';
import React, { useEffect, useState } from 'react';
import handleFileUpload from './uploadPlaylist';
import { cs } from '../../scripts/shared/constants';
import { createRoot } from 'react-dom/client';
import { bgPlaylistManager, sendToBackground } from '../../utils/actions/messages';
import {
  ArrowLeftStartOnRectangleIcon,
  ArrowUpOnSquareStackIcon,
} from '@heroicons/react/20/solid';

import type { ViewState } from '../../features/playlist/types';
import type { StoragePlaylist, Video } from '../../types/video';
import type { SessionActionMessage } from '../../types/messages';
import { WtList } from '../../features/playlist/components/WtList';
import { WtListSkeletonItem } from '../../features/playlist/components/SkeletonWtList';
import { BuildingLibraryIcon } from '@heroicons/react/24/outline';

function SidePanel() {
  const [panelView, setPanelView] = useState<ViewState>({
    view: 'PLAYLISTS',
    direction: 'back',
  });
  const [isLoading, setIsLoading] = useState(true);

  const [playlist, setPlaylist] = useState<Video[]>([]);
  const [multiPlaylist, setMultiPlaylist] = useState<StoragePlaylist>({});
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);

  const handleForwardView = (playlistId: string) => {
    const newState: ViewState = { view: 'VIDEOS', playlistId, direction: 'forward' };
    sendToBackground<SessionActionMessage>({ type: 'SET_SESSION', payload: newState });

    setPanelView(newState);
    setPlaylist(multiPlaylist[playlistId]);
  };

  const handleBackView = () => {
    const newState = { view: 'PLAYLISTS', direction: 'back', playlistId: null };
    sendToBackground<SessionActionMessage>({ type: 'SET_SESSION', payload: newState });
    setPanelView(newState as ViewState);
  };

  useEffect(() => {
    setIsLoading(true);

    sendToBackground({
      type: cs.GET_ALL_PLAYLIST,
    })
      .then((r: any) => {
        console.log(r);
        if (!r.playlists) return;
        setMultiPlaylist(r.playlists);

        return bgPlaylistManager('GET_SESSION', undefined).then((session) => ({
          session,
          playlists: r.playlists,
        }));
      })
      .then((d) => {
        const { session, playlists } = d!;
        if (session.view === 'PLAYLISTS') {
          setPanelView({ view: 'PLAYLISTS', direction: 'back' });
        }

        if (session.view === 'VIDEOS') {
          setPanelView({
            view: 'VIDEOS',
            playlistId: session.playlistId,
            direction: 'forward',
          } as ViewState);

          setPlaylist(playlists[session.playlistId!]);
        }
      })

      .finally(() => setIsLoading(false));
  }, []);

  const handleActiveVideo = (video: Video) => {
    console.info(`[SIDE_PANEL] Selecting video: `, video);
    setCurrentVideo(video);
    sendToBackground({ type: 'play_video', payload: { video } });
  };
  const renderView = () => {
    return (
      <div
        className={`flex h-full w-full transition-transform ${
          panelView.view === 'PLAYLISTS'
            ? 'translate-x-0 ease-in duration-150'
            : '-translate-x-full ease-out duration-75'
        }`}
      >
        {/* PLAYLISTS VIEW */}
        <div className='w-full shrink-0 overflow-y-scroll yt-scrollbar'>
          {Object.entries(multiPlaylist).map(([plName, values]) => {
            return (
              <WtList
                playList={[values[0]]}
                imgVariant='stacked'
                viewState={panelView}
                title={plName}
                chip={values.length}
                onItemClick={() => handleForwardView(plName)}
              />
            );
          })}
        </div>

        {/* VIDEOS VIEW */}
        <div className='w-full shrink-0 overflow-y-scroll yt-scrollbar'>
          {isLoading ? (
            <WtListSkeletonItem items={12} />
          ) : (
            panelView.view === 'VIDEOS' && (
              <WtList
                playList={playlist}
                imgVariant='single'
                viewState={panelView}
                onItemClick={() => handleActiveVideo}
              />
            )
          )}
        </div>
      </div>
    );
  };
  return (
    <main className='bg-yt-bg w-full h-lvh p-1 text-yt-text-primary'>
      <div className='relative flex flex-col min-w-3xs h-full bg-yt-bg shadow-lg border rounded-2xl border-yt-br_new  overflow-y-hidden'>
        {/* ------ Loading JSON header ----- */}
        <div className='flex items-center gap-2 justify-between py-4 px-2 bg-yt-bg-secondary w-full h-18'>
          <div className='flex flex-col'>
            <div className='flex items-center gap-2'>
              {panelView.view === 'VIDEOS' ? (
                <button
                  className='text-sm font-medium p-1 rounded-3xl hover:cursor-pointer hover:bg-yt-border'
                  onClick={handleBackView}
                >
                  <ArrowLeftStartOnRectangleIcon className='w-5' />
                </button>
              ) : (
                <button
                  className='text-sm font-medium p-1 rounded-3xl hover:cursor-pointer hover:bg-yt-border'
                  type='button'
                  onClick={() => {
                    sendToBackground({ type: cs.AVAILABLE_LIST });
                  }}
                >
                  <BuildingLibraryIcon className='w-5' />
                </button>
              )}

              <h2 className='text-base font-black truncate whitespace-normal line-clamp-1'>
                {panelView.view === 'PLAYLISTS' ? 'Playlists' : panelView.playlistId}
              </h2>
            </div>
            {currentVideo ? <span>1/2</span> : ''}
          </div>
          {panelView.view === 'PLAYLISTS' ? (
            <label className='flex min-w-28 px-3 py-2 justify-around place-items-center cursor-pointer font-bold text-sm bg-yt-bg-tertiary rounded-2xl border border-yt-border hover:bg-yt-border'>
              <ArrowUpOnSquareStackIcon width={20} />
              Upload
              <input
                type='file'
                accept='.json'
                className='hidden'
                onChange={(ev) => handleFileUpload(ev, setPlaylist, setMultiPlaylist)}
              />
            </label>
          ) : (
            <button className='min-w-28 py-2 px-3 rounded-2xl ring ring-yt-border'></button>
          )}
        </div>

        {/* VIEW STATE */}
        <aside className='h-full overflow-hidden'>{renderView()}</aside>
      </div>
    </main>
  );
}
const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <SidePanel />
  </React.StrictMode>,
);
