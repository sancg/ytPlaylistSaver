import { useMemo } from 'react';
import { buildYouTubeEmbedSrc } from '../utils/yt_api/embed';
// import { loadYouTubeIframeAPI } from '../utils/yt_api/load_yt_iframe';
import type { Video } from '../types/video';

type PropType = {
  video: Video | null;
};
export default function Player({ video }: PropType) {
  // const playerRef = useRef<HTMLDivElement>(null);
  // const ytPlayer = useRef<YT.Player>(null);

  // useEffect(() => {
  //   if (!video) {
  //     return;
  //   }

  //   loadYouTubeIframeAPI().then((YT) => {
  //     if (playerRef.current) {
  //       ytPlayer.current = new YT.Player(playerRef.current, {
  //         videoId: video.id,
  //         playerVars: {
  //           autoplay: 1,
  //           modestbranding: 1,
  //           rel: 0,
  //         },
  //         events: {
  //           onError: (e: any) => console.error('YT player Error', e.Data),
  //           onReady: (e: any) => e.target.playVideo(),
  //         },
  //       });
  //     }
  //   });

  //   return () => {
  //     console.log('clean up video?');
  //   };
  // }, [video]);

  if (!video) {
    return (
      <div className='flex items-center justify-center h-full text-yt-text-secondary text-lg'>
        Select a video
      </div>
    );
  }

  // const strVideo = video.title?.split(' ').slice(0, -2).join(' ');

  const src = useMemo(() => {
    if (!video.id) return '';
    return buildYouTubeEmbedSrc(video.id, {
      // autoplay: true,
      modestBranding: true,
      rel: 1,
      nocookie: true,
    });
  }, [video.id]);

  return (
    <>
      {/* <div id='player' ref={playerRef}></div> */}
      <iframe
        id='player'
        key={video.id}
        className='w-full h-full rounded-xl'
        src={src}
        allow='accelerometer; autoplay; encrypted-media; picture-in-picture'
        allowFullScreen={true}
        // title={strVideo}
        // referrerPolicy='strict-origin-when-cross-origin'
      />
    </>
  );
}
