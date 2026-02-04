import '../../styles/global.css';
import '../../styles/app.css';
import React, { useEffect, useState } from 'react';
import handleFileUpload from './uploadPlaylist';
import { cs } from '../../scripts/shared/constants';
import { createRoot } from 'react-dom/client';
import { BackgroundResponse, sendToBackground } from '../../utils/actions/messages';
import {
  ArrowLeftStartOnRectangleIcon,
  ArrowUpOnSquareStackIcon,
} from '@heroicons/react/20/solid';

import type { ViewState } from '../../features/playlist/types';
import type { StoragePlaylist, Video } from '../../types/video';
import type { SessionActionMessage, SidePanelSession } from '../../types/messages';
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
  const [currentVideo, _setCurrentVideo] = useState<Video | null>(null);

  const handlePlaylistView = (playlistId: string) => {
    const newState: ViewState = { view: 'VIDEOS', playlistId, direction: 'forward' };
    sendToBackground<SessionActionMessage>({ type: 'SET_SESSION', payload: newState }).then(
      (r) => console.log(r),
    );
    setPanelView(newState);
    setPlaylist(multiPlaylist[playlistId]); //
  };

  const handleBack = () => {
    const newState = { view: 'PLAYLISTS', direction: 'back', playlistId: null };
    sendToBackground<SessionActionMessage>({ type: 'SET_SESSION', payload: newState });
    setPanelView(newState as ViewState);
  };

  useEffect(() => {
    setIsLoading(true);
    sendToBackground<BackgroundResponse<StoragePlaylist>>({
      type: cs.GET_VIDEOS,
    })
      .then((res) => {
        if (res.error) {
          return;
        }

        if (res.data) {
          setMultiPlaylist(res.data);
          sendToBackground<SidePanelSession>({ type: 'GET_SESSION' }).then((r) => {
            if (r.view === 'PLAYLISTS') {
              setPanelView({ view: r.view, direction: 'back' });
              return;
            }

            if (r.view === 'VIDEOS') {
              setPanelView({
                view: r.view,
                playlistId: r.playlistId,
                direction: 'forward',
              } as ViewState);
              console.log({ Session: r, multiPlaylist });
              setPlaylist(res.data![r.playlistId!]);
            }
          });
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

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
          {Object.entries(multiPlaylist).map(([plName, val]) => {
            const video = val[0];

            return (
              <WtList
                isLoading={isLoading}
                key={plName}
                playList={[video]}
                imgVariant='stacked'
                chip={val.length}
                title={plName}
                viewState={panelView}
                onClick={() => handlePlaylistView(plName)}
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
              <WtList playList={playlist} imgVariant='single' viewState={panelView} />
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
        <div className='flex items-center justify-between py-4 px-2 bg-yt-bg-secondary w-full h-18'>
          <div className='flex flex-col'>
            <div className='flex items-center gap-2'>
              {panelView.view === 'VIDEOS' ? (
                <button
                  className='text-sm font-medium p-1 rounded-3xl hover:cursor-pointer hover:bg-yt-border'
                  onClick={handleBack}
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

              <h2 className='text-lg font-bold'>
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
                onChange={(ev) => handleFileUpload(ev, setPlaylist)}
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
