import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Video } from '../../../types/video';
import { ThumbnailVariant } from '../../../components/Thumbnail';
import { Item } from './Item';
import { WtListSkeletonItem } from './SkeletonWtList';
import { ViewState } from '../types';
import { Dispatch, SetStateAction, useRef } from 'react';
import { useVisibleObserver } from '../hooks/useVisibleObserver';

type props = {
  playList: Video[];
  isLoading?: boolean;
  imgVariant: ThumbnailVariant;
  chip?: number | string;
  title?: string;
  viewState: Pick<ViewState, 'view'>;
  onClick?: () => void | Dispatch<SetStateAction<Video | {}>>;
};
export const WtList = ({
  playList,
  isLoading,
  imgVariant,
  chip,
  title,
  viewState,
  onClick,
}: props) => {
  const refContent = useRef<HTMLDivElement>(null);
  const observe = useVisibleObserver(refContent.current, (el) => {
    console.log(el);
  });
  if (isLoading) {
    return (
      <div>
        <WtListSkeletonItem items={1} />
      </div>
    );
  }

  return (
    <div ref={refContent}>
      {playList.map((video) => {
        return (
          <div ref={observe}>
            <div
              className='flex flex-1 items-center p-2 hover:bg-yt-bg-tertiary hover:cursor-pointer'
              onClick={() => {
                // FIXME: Bug with lifting state to update current Video.
                console.log({ onClick, view: viewState.view });
                if (!onClick) {
                  return;
                }
                if (viewState.view === 'PLAYLISTS') return onClick();
                console.log(onClick.caller, onClick.name);
              }}
              key={video.id}
            >
              <Item
                video={video}
                imgVariant={imgVariant}
                chip={chip || video.timeLength}
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
