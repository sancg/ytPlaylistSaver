import { useRef } from 'react';
import { useVisibleObserver } from '../hooks/useVisibleObserver';
import { useRipple } from '../hooks/useRipple';

import { PlayIcon } from '@heroicons/react/20/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';

import type { Video } from '../../../types/video';
import type { ThumbnailVariant } from '../../../components/Thumbnail';
import type { ViewState } from '../types';

import { Snack, SnackSkeleton } from '.';

type props = {
  playList: Video[];
  viewState: Pick<ViewState, 'view'>;
  imgVariant: ThumbnailVariant;
  chip?: number | string;
  title?: string;
  isLoading?: boolean;
  activeVideoId?: string;
  onItemClick?: (video: Video) => void;
};

export default function WtList({
  playList,
  isLoading,
  imgVariant,
  chip,
  title,
  viewState,
  activeVideoId,
  onItemClick,
}: props) {
  const refContent = useRef<HTMLDivElement>(null);
  const { containerRef: buttonRef, createBorderRipple } = useRipple();

  const observe = useVisibleObserver(refContent.current, (_el) => {});

  const renderIndex = (video: Video, id: string) => {
    if (video.id === id) {
      return (
        <div className='h-full p-1 w-auto'>
          <PlayIcon width={14} className='m-auto' />
        </div>
      );
    }
    return <div className='h-full p-1'></div>;
  };

  if (isLoading) {
    return <SnackSkeleton items={1} />;
  }

  return (
    <div>
      {playList.map((video, idx) => {
        return (
          <div
            key={video.id}
            ref={refContent}
            className='ref-content relative group inline-block w-full'
          >
            <div
              ref={observe}
              className={`flex items-center py-2 hover:bg-yt-bg-tertiary hover:cursor-pointer hover:opacity-100`}
              onClick={() => {
                // Avoid repeating click on played video.
                if (activeVideoId !== video.id && viewState.view === 'VIDEOS')
                  return onItemClick?.({ ...video, currentIndex: idx + 1 });
                else if (viewState.view === 'PLAYLISTS') return onItemClick?.(video);
              }}
            >
              {renderIndex(video, activeVideoId!)}
              <Snack
                video={video}
                activeVideoId={activeVideoId}
                imgVariant={imgVariant}
                chip={chip || video?.timeLength}
                title={title}
                viewState={viewState}
              />
              <div className='w-10 flex items-center justify-center opacity-0 translate-x-1 scale-90 group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 transition-all duration-150 ease-out'>
                <button
                  className='relative overflow-hidden w-full h-10 rounded-full transition-colors duration-200 hover:cursor-pointer hover:bg-white/10 active:bg-white/20'
                  type='button'
                  ref={buttonRef}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onPointerUp={(e) => {
                    createBorderRipple(e);
                    e.stopPropagation();
                  }}
                >
                  <XMarkIcon className='w-6 h-6 m-auto' />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
