// src/components/PlaylistViewer.tsx
import '../../index.css';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import type { Video } from '../../types/video';
import { extractYouTubeID } from '../../utils/extraYoutube';
import Player from '../../components/Player';
import { ArrowUpOnSquareStackIcon } from '@heroicons/react/24/outline';
import { VideoList } from '../../components/VideoList';

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
    playList?: Video[];
  }): Video[] | null => {
    // pick the first non-null key
    const list = obj.playlist ?? obj.playList;
    if (!Array.isArray(list)) return null;

    return list.map((v) => ({
      ...v,
      id: v.id ?? extractYouTubeID(v.url ?? '') ?? undefined,
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
    <main className='bg-yt-bg w-full p-3'>
      <div className='flex flex-col h-(--yt-screen) gap-2 lg:flex-row'>
        <div className='w-full min-h-[600px] flex items-center justify-center bg-yt-bg rounded-xl border border-yt-bg-secondary'>
          <Player video={currentVideo} />
        </div>
        <aside className='min-w-2xs bg-yt-bg overflow-y-auto shadow-lg border rounded-xl border-yt-border text-yt-text-primary '>
          <div className='flex items-center justify-between p-4 bg-yt-bg-secondary'>
            <h2 className='text-lg font-bold'>Playlist</h2>
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
          <VideoList selectVideo={playVideo} list={playlist} />
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
