// src/components/PlaylistViewer.tsx
import '../index.css';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import type { Video } from '../types/video';
import { extractYouTubeID } from '../utils/extraYoutube';

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
    console.log({ currentVideo: video });
    setCurrentVideo(video);
  };

  return (
    <div className='flex h-screen bg-yt-bg overflow-y-hidden'>
      {/* Main - Video Player */}
      <main className='flex-1 flex items-center my-2 ml-2 justify-center bg-[#0f0f0f]'>
        {currentVideo ? (
          <iframe
            className='w-full h-full'
            src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1&rel=0&modestbranding=1&start=0&enablejsapi=1`}
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
            allowFullScreen
            width='640'
            height='360'
            title={currentVideo.title!}
          />
        ) : (
          <div className='text-yt-text-secondary text-lg'>Select a video to play</div>
        )}
      </main>
      {/* Sidebar - Playlist */}
      <aside className='w-1/4 bg-yt-bg m-2 overflow-y-auto shadow-lg border rounded-xl border-yt-border text-yt-text-primary'>
        <div className='p-4 flex items-center justify-between'>
          <h2 className='text-lg font-bold'>Playlist</h2>
          <label className='cursor-pointer px-2 py-1 text-sm bg-yt-accent-red text-yt-text-primary rounded hover:bg-blue-600'>
            Upload JSON
            <input type='file' accept='.json' className='hidden' onChange={handleFileUpload} />
          </label>
        </div>
        <ul>
          {playlist.map((video, idx) => (
            <li
              key={idx}
              className='flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer'
              onClick={() => playVideo(video)}
            >
              <a hidden href={video.url!} />
              <img
                src={video.thumbImg}
                alt={video.title || 'thumbnail'}
                className='w-16 h-10 object-cover rounded'
              />
              <span className='text-sm font-medium truncate'>
                {video.title || `Video ${idx + 1}`}
              </span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
};

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <PlaylistViewer />
  </React.StrictMode>
);

// import React, { useEffect, useState, useRef } from 'react';
// import { createRoot } from 'react-dom/client';
// import type { Video } from '../types/video';

// import '../main.css';
// import { extractYouTubeID } from '../common/utils';

// function PlaylistViewer() {
//   const [playlist, setPlaylist] = useState<Video[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(null);
//   const fileInputRef = useRef(null);

//   // Load saved playlist on mount
//   useEffect(() => {
//     chrome.storage.local.get(['playlist'], (res) => {
//       if (res.playlist) setPlaylist(res.playlist);
//     });
//   }, []);

//   // Save playlist when it changes
//   useEffect(() => {
//     chrome.storage.local.set({ playlist });
//   }, [playlist]);

//   function handleFileUpload(e) {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (ev) => {
//       try {
//         const data = JSON.parse(ev.target.result);
//         // validate shape (array of { url, thumbnail })
//         if (!Array.isArray(data)) throw new Error('JSON must be an array');
//         setPlaylist(data);
//         setCurrentIndex(null);
//       } catch (err) {
//         alert('Invalid JSON file: ' + err.message);
//       }
//     };
//     reader.readAsText(file);
//   }

//   function playIndex(i) {
//     setCurrentIndex(i);
//   }

//   function removeIndex(i) {
//     setPlaylist((p) => p.filter((_, idx) => idx !== i));
//     if (currentIndex === i) setCurrentIndex(null);
//   }

//   // play next helper (wrap)
//   function playNext() {
//     if (playlist.length === 0) return;
//     if (currentIndex === null) {
//       setCurrentIndex(0);
//       return;
//     }
//     const next = (currentIndex + 1) % playlist.length;
//     setCurrentIndex(next);
//   }

//   function loadInternalExample() {
//     // fetch from public/data/playlist.json inside extension bundle
//     const url = chrome.runtime.getURL('data/playlist.json');
//     fetch(url)
//       .then((r) => r.json())
//       .then((data) => setPlaylist(data))
//       .catch((err) => alert('Failed to load internal JSON: ' + err));
//   }

//   const currentVideo = currentIndex !== null ? playlist[currentIndex] : null;
//   const videoId = currentVideo ? extractYouTubeID(currentVideo.url) : null;
//   const iframeSrc = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : '';

//   return (
//     <div className='min-h-screen bg-[#0f0f0f] text-white'>
//       <header className='flex items-center justify-between p-4 bg-[#202020]'>
//         <h1 className='text-2xl font-semibold'>📺 My Playlist Viewer</h1>

//         <div className='flex gap-2 items-center'>
//           <input
//             ref={fileInputRef}
//             type='file'
//             accept='.json'
//             onChange={handleFileUpload}
//             className='hidden'
//             id='fileInput'
//           />
//           <button
//             className='px-3 py-2 bg-gray-700 rounded'
//             onClick={() => fileInputRef.current && fileInputRef.current.click()}
//           >
//             Upload JSON
//           </button>

//           <button className='px-3 py-2 bg-gray-700 rounded' onClick={loadInternalExample}>
//             Load example
//           </button>

//           <button
//             className='px-3 py-2 bg-red-600 rounded'
//             onClick={() => {
//               chrome.storage.local.remove('playlist', () => {
//                 setPlaylist([]);
//                 setCurrentIndex(null);
//               });
//             }}
//           >
//             Clear saved
//           </button>
//         </div>
//       </header>

//       <main className='md:flex md:gap-4 p-4'>
//         <section className='md:w-2/3'>
//           <div className='bg-black aspect-video mb-4 rounded overflow-hidden'>
//             {videoId ? (
//               <iframe
//                 id='ytPlayer'
//                 title='YouTube Player'
//                 src={iframeSrc}
//                 width='100%'
//                 height='100%'
//                 frameBorder='0'
//                 allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
//                 allowFullScreen
//               />
//             ) : (
//               <div className='flex items-center justify-center h-full text-gray-400'>
//                 Select a video to play
//               </div>
//             )}
//           </div>

//           <div className='flex gap-2'>
//             <button
//               className='px-3 py-2 rounded bg-gray-700'
//               onClick={() => {
//                 if (currentIndex !== null) {
//                   setCurrentIndex((c) => (c > 0 ? c - 1 : playlist.length - 1));
//                 }
//               }}
//             >
//               Prev
//             </button>
//             <button className='px-3 py-2 rounded bg-gray-700' onClick={playNext}>
//               Next
//             </button>
//           </div>
//         </section>

//         <aside className='md:w-1/3 mt-4 md:mt-0'>
//           <h2 className='text-lg mb-2'>Playlist ({playlist.length})</h2>
//           <div className='space-y-2 max-h-[60vh] overflow-auto'>
//             {playlist.map((v, i) => (
//               <div
//                 key={i}
//                 className={`flex items-center gap-3 p-2 rounded ${
//                   i === currentIndex ? 'bg-[#2a2a2a]' : 'hover:bg-[#191919]'
//                 }`}
//               >
//                 <img
//                   src={v.thumbnail}
//                   alt='thumb'
//                   className='w-28 h-16 object-cover rounded'
//                 />
//                 <div className='flex-1'>
//                   <div className='text-sm truncate'>{v.url}</div>
//                   <div className='mt-1 text-xs text-gray-400'>#{i + 1}</div>
//                 </div>

//                 <div className='flex flex-col gap-1'>
//                   <button
//                     className='px-2 py-1 text-xs bg-gray-700 rounded'
//                     onClick={() => playIndex(i)}
//                   >
//                     Play
//                   </button>
//                   <button
//                     className='px-2 py-1 text-xs bg-red-600 rounded'
//                     onClick={() => removeIndex(i)}
//                   >
//                     Remove
//                   </button>
//                 </div>
//               </div>
//             ))}
//             {playlist.length === 0 && (
//               <div className='text-gray-400 text-sm'>
//                 No videos yet. Upload a JSON or load the example.
//               </div>
//             )}
//           </div>
//         </aside>
//       </main>
//     </div>
//   );
// }

// const root = createRoot(document.getElementById('root')!);
// root.render(<PlaylistViewer />);
