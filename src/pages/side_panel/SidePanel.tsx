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

import type { StoragePlaylist, Video } from '../../types/video';
import { WtList } from '../../features/playlist/components/WtList';
import { ViewState } from '../../features/playlist/types';
import { WtListSkeletonItem } from '../../features/playlist/components/SkeletonWtList';
import { BuildingLibraryIcon } from '@heroicons/react/24/outline';

function SidePanel() {
  const [view, setView] = useState<ViewState>({ type: 'PLAYLISTS', direction: 'back' });
  const [isLoading, setIsLoading] = useState(true);

  const handleSelectView = (playlistId: string) => {
    setView((prev) => {
      const newState: ViewState = { type: 'VIDEOS', playlistId, direction: 'forward' };
      console.log(prev, newState);
      return newState;
    });
  };

  const handleBack = () => {
    setView({ type: 'PLAYLISTS', direction: 'back' });
  };

  const [_playlist, setPlaylist] = useState<Video[]>([]);
  const [multiPlaylist, setMultiPlaylist] = useState<StoragePlaylist>({});
  const [currentVideo, _setCurrentVideo] = useState<Video | null>(null);

  useEffect(() => {
    setIsLoading(true);
    sendToBackground<BackgroundResponse<StoragePlaylist>>({
      type: cs.GET_VIDEOS,
    })
      .then((res) => {
        if (!res.error && res.data) {
          setMultiPlaylist(res.data);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const renderView = () => {
    return (
      <div
        className={`flex h-full w-full transition-transform ${
          view.type === 'PLAYLISTS'
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
                viewState={view}
                onClick={() => handleSelectView(plName)}
              />
            );
          })}
        </div>

        {/* VIDEOS VIEW */}
        <div className='w-full shrink-0 overflow-y-scroll yt-scrollbar'>
          {isLoading ? (
            <WtListSkeletonItem items={12} />
          ) : (
            view.type === 'VIDEOS' &&
            multiPlaylist[view.playlistId]?.map((video) => (
              <WtList
                key={video.id}
                playList={[video]}
                imgVariant='single'
                title={video.title}
                viewState={view}
              />
            ))
          )}
        </div>
      </div>
    );
  };
  return (
    <main className='bg-yt-bg w-full h-lvh p-1 text-yt-text-primary'>
      <div className='relative flex flex-col min-w-3xs h-full bg-yt-bg shadow-lg border rounded-2xl border-yt-border_2  overflow-y-hidden'>
        {/* ------ Loading JSON header ----- */}
        <div className='flex items-center justify-between p-4 bg-yt-bg-secondary w-full'>
          <div className='flex flex-col'>
            <div className='flex items-center gap-2'>
              {view.type === 'VIDEOS' ? (
                <button onClick={handleBack} className='text-sm font-medium hover:underline'>
                  <ArrowLeftStartOnRectangleIcon className='w-5' />
                </button>
              ) : (
                <div className='w-5 h-5'>
                  <BuildingLibraryIcon className='w-5' />
                </div>
              )}

              <h2 className='text-lg font-bold'>
                {view.type === 'PLAYLISTS' ? 'Playlists' : view.playlistId}
              </h2>
            </div>
            {currentVideo ? <span>1/2</span> : ''}
          </div>
          <label className='flex min-w-28 px-3 py-2 justify-around place-items-center cursor-pointer font-bold text-sm bg-yt-bg-tertiary rounded-2xl shadow-2xl hover:bg-yt-border'>
            <ArrowUpOnSquareStackIcon width={20} />
            Upload
            <input
              type='file'
              accept='.json'
              className='hidden'
              onChange={(ev) => handleFileUpload(ev, setPlaylist)}
            />
          </label>
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
