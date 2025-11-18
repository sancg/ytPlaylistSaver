import '../../styles/global.css';
import React, { useEffect, useState } from 'react';
import handleFileUpload from './uploadPlaylist';
import { cs } from '../../scripts/shared/constants';
import { createRoot } from 'react-dom/client';
import { BackgroundResponse, sendToBackground } from '../../utils/actions/messages';
import { ArrowUpOnSquareStackIcon } from '@heroicons/react/20/solid';

import type { StoragePlaylist, Video } from '../../types/video';
import LoadPy from './pyodide_test';

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
      <div>
        {Object.entries(multiPlaylist).map(([key, val]) => {
          console.log({ key });

          return (
            <div className='flex flex-1 items-center'>
              <img src={val[0].thumbImg}></img>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    // TODO: Fixing bug with the height display on Side Panel.
    <main className='bg-yt-bg w-full h-lvh p-2 text-yt-text-primary'>
      <div className='relative min-w-3xs h-full bg-yt-bg shadow-lg border rounded-xl border-yt-border  overflow-y-hidden'>
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
        {/* -------------------------------- */}
        <div className='h-full overflow-auto'>
          {renderPlaylists()}
          <LoadPy />
        </div>
      </div>
    </main>
  );
}
const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <SidePanel />
  </React.StrictMode>
);
