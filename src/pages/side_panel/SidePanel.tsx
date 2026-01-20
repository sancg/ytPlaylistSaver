import '../../styles/global.css';
import '../../styles/app.css';
import React, { useEffect, useState } from 'react';
import handleFileUpload from './uploadPlaylist';
import { cs } from '../../scripts/shared/constants';
import { createRoot } from 'react-dom/client';
import { BackgroundResponse, sendToBackground } from '../../utils/actions/messages';
import { ArrowUpOnSquareStackIcon } from '@heroicons/react/20/solid';

import type { StoragePlaylist, Video } from '../../types/video';
import { XMarkIcon } from '@heroicons/react/24/outline';

function SidePanel() {
  const [_playlist, setPlaylist] = useState<Video[]>([]);
  const [multiPlaylist, setMultiPlaylist] = useState<StoragePlaylist>({});
  const [currentVideo, _setCurrentVideo] = useState<Video | null>(null);

  useEffect(() => {
    sendToBackground<BackgroundResponse<StoragePlaylist>>({
      type: cs.GET_VIDEOS,
    }).then((res) => {
      if (!res.error && res.data) {
        setMultiPlaylist(res.data);
      }
    });
  }, []);

  const renderPlaylists = () => {
    if (!multiPlaylist) return;
    console.log('Rendering Multi-playlist...', { multiPlaylist });
    return (
      <>
        {Object.entries(multiPlaylist).map(([key, val]) => {
          console.log({ storageKey: key, videos: val });
          return val.map((v) => {
            const video = v;

            return (
              <div className='flex flex-1 items-center p-2'>
                <div className='flex flex-1 items-center'>
                  <a hidden href={video.url!} />
                  <img
                    src={video.thumbImg}
                    alt={video.title || 'thumbnail'}
                    className='w-28 object-cover rounded'
                  />
                  <div className='self-baseline h-full flex-1 ml-2'>
                    <h4 className='font-medium truncate whitespace-normal'>
                      <span className='line-clamp-2'>
                        {key} - {val.length}
                      </span>
                    </h4>
                  </div>
                </div>
                <div className='opacity-0 w-6 h-6 hover:opacity-100'>
                  <button
                    className='hover:cursor-pointer'
                    type='button'
                    onClick={(e) => console.log(e)}
                  >
                    <XMarkIcon width={20} />
                  </button>
                </div>
              </div>
            );
          });
        })}
      </>
    );
  };

  return (
    // TODO: Fixing bug with the height display on Side Panel.
    <main className='bg-yt-bg w-full h-lvh p-2 text-yt-text-primary'>
      <div className='relative flex flex-col min-w-3xs h-full bg-yt-bg shadow-lg border rounded-xl border-yt-border  overflow-y-hidden'>
        {/* ------ Loading JSON header ----- */}
        <div className='flex items-center justify-between p-4 bg-yt-bg-secondary w-full'>
          <div className='flex flex-col'>
            <h2 className='text-lg font-bold'>Playlists</h2>
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
        <aside className='h-full yt-scrollbar overflow-y-scroll scroll-smooth'>
          {renderPlaylists()}
        </aside>
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
