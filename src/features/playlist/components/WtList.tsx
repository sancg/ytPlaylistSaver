import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Video } from '../../../types/video';
import { ThumbnailVariant } from '../../../components/Thumbnail';
import { Item } from './Item';
import { WtListSkeletonItem } from './SkeletonWtList';
import { ViewState } from '../types';

type props = {
  playList: Video[];
  isLoading?: boolean;
  imgVariant: ThumbnailVariant;
  chip?: number | string;
  title?: string;
  viewState: Pick<ViewState, 'view'>;
  onClick?: () => void;
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
  if (isLoading) {
    return (
      <div>
        <WtListSkeletonItem items={1} />
      </div>
    );
  }

  return (
    <div>
      {playList.map((video) => {
        return (
          <div>
            <div
              className='flex flex-1 items-center p-2 hover:bg-yt-bg-tertiary hover:cursor-pointer'
              onClick={onClick}
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
