import '../../index.css';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import Player from '../../components/Player';
import { VideoList } from '../../components/VideoList';
import { extractYouTubeID } from '../../utils/extraYoutube';
import { ArrowUpOnSquareStackIcon } from '@heroicons/react/24/outline';
import type { Video } from '../../types/video';

const STORAGE_KEY = 'playlist';

export const PlaylistViewer: React.FC = () => {
  const [playlist, setPlaylist] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);

  useEffect(() => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      if (result[STORAGE_KEY]) {
        setPlaylist(result[STORAGE_KEY]);
      }
    });
  }, []);

  // Save playlist to chrome.storage whenever it changes
  useEffect(() => {
    if (playlist.length > 0) {
      chrome.storage.local.set({ [STORAGE_KEY]: playlist });
    }
  }, [playlist]);

  const normalizePlaylist = (obj: {
    playlist?: Video[];
    // playList?: Video[]; // legacy - I returned an object with this name
  }): Video[] | null => {
    const list = obj.playlist;
    if (!Array.isArray(list)) return null;

    return list.map((v) => ({
      ...v,
      id: v.id ?? extractYouTubeID(v.url || ''),
    }));
  };

  // Handle File Upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parseObject = JSON.parse(e.target?.result as string);
        const uploadedPlaylist = normalizePlaylist(parseObject);
        console.log({ uploadedPlaylist });

        if (!uploadedPlaylist) {
          console.error('Invalid JSON format. Expected an array of videos.');
          return;
        }

        setPlaylist(uploadedPlaylist);
      } catch (err) {
        console.error('Error parsing JSON file', err);
      }
    };
    reader.readAsText(file);
  };

  // Play selected video
  const playVideo = (video: Video) => {
    setCurrentVideo(video);
  };

  return (
    <main className='bg-yt-bg w-full p-4'>
      <div className='flex flex-col h-(--yt-screen) gap-4 lg:flex-row'>
        <div className='w-full min-h-[600px] flex items-center justify-center bg-yt-bg rounded-xl border border-yt-bg-secondary'>
          <Player video={currentVideo} />
        </div>
        <aside className='relative min-w-3xs bg-yt-bg overflow-y-auto shadow-lg border rounded-xl border-yt-border text-yt-text-primary '>
          <div className='static flex items-center justify-between p-4 bg-yt-bg-secondary w-full'>
            <div className='flex flex-col'>
              <h2 className='text-lg font-bold'>Playlist</h2>
              {currentVideo ? <span>1/2</span> : ''}
            </div>
            <label className='flex min-w-28 px-3 py-2 justify-around place-items-center cursor-pointer font-bold text-sm bg-yt-bg-tertiary rounded-2xl shadow-2xl hover:bg-yt-border'>
              <ArrowUpOnSquareStackIcon width={20} />
              Upload
              <input
                type='file'
                accept='.json'
                className='hidden'
                onChange={handleFileUpload}
              />
            </label>
          </div>
          {/* TODO: When selecting a video the list should snap to top if surpass 60% of the height VideoList*/}
          <VideoList selectVideo={playVideo} currentVideo={currentVideo} list={playlist} />
        </aside>
      </div>
    </main>
  );
};

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <PlaylistViewer />
  </React.StrictMode>
);
