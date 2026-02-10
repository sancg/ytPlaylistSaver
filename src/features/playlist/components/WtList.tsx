import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Video } from '../../../types/video';
import { ThumbnailVariant } from '../../../components/Thumbnail';
import { Item } from './Item';
import { WtListSkeletonItem } from './SkeletonWtList';
import { ViewState } from '../types';
import { useRef } from 'react';
import { useVisibleObserver } from '../hooks/useVisibleObserver';
import { PlayIcon } from '@heroicons/react/20/solid';

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
export const WtList = ({
  playList,
  isLoading,
  imgVariant,
  chip,
  title,
  viewState,
  activeVideoId,
  onItemClick,
}: props) => {
  const refContent = useRef<HTMLDivElement>(null);
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
    return (
      <div>
        <WtListSkeletonItem items={1} />
      </div>
    );
  }

  return (
    <div>
      {playList.map((video, idx) => {
        return (
          <div ref={refContent} className='ref-content'>
            <div
              ref={observe}
              className={`flex flex-1 items-center py-2 hover:bg-yt-bg-tertiary hover:cursor-pointer`}
              onClick={() => {
                // Avoid repeating click on played video.
                if (activeVideoId !== video.id && viewState.view === 'VIDEOS')
                  return onItemClick?.({ ...video, currentIndex: idx + 1 });
                else if (viewState.view === 'PLAYLISTS') return onItemClick?.(video);
              }}
              key={video.id}
            >
              {renderIndex(video, activeVideoId!)}
              <Item
                video={video}
                activeVideoId={activeVideoId}
                imgVariant={imgVariant}
                chip={chip || video?.timeLength}
                title={title}
                viewState={viewState}
              />
              <div className='opacity-0 w-6 h-6 hover:opacity-100'>
                <button
                  className='hover:cursor-pointer'
                  type='button'
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(e);
                  }}
                >
                  <XMarkIcon width={20} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
