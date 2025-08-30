// PlaylistViewer.tsx (excerpt)
import { useMemo } from 'react';
import { buildYouTubeEmbedSrc } from '../utils/yt_api/embed';
import type { Video } from '../types/video';

type PropType = {
  video: Video | null;
};
export default function Player({ video }: PropType) {
  if (!video) {
    return (
      <div className='flex items-center justify-center h-full text-yt-text-secondary text-lg'>
        Select a video
      </div>
    );
  }

  const src = useMemo(() => {
    if (!video.id) return '';
    return buildYouTubeEmbedSrc(video.id, {
      autoplay: true,
      modestBranding: true,
      rel: 0,
      nocookie: true, // try toggling this if you still get error 153
    });
  }, [video.id]);

  return (
    <>
      <iframe
        id='youtube-player'
        itemType='text/html'
        key={src}
        className='w-full h-full rounded-xl'
        src={src}
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture'
        allowFullScreen
        title={video.title}
      />
    </>
  );
}
