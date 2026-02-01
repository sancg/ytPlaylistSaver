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
  viewState: Pick<ViewState, 'type'>;
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
          <div onClick={onClick}>
            <a
              className='flex flex-1 items-center p-2 hover:bg-yt-bg-tertiary cursor-pointer'
              href={video.url}
              key={video.id}
            >
              <Item
                video={video}
                imgVariant={imgVariant}
                chip={chip}
                title={title}
                viewState={viewState}
              />
              <div className='opacity-0 w-6 h-6 hover:opacity-100'>
                <button
                  className='hover:cursor-pointer'
                  type='button'
                  onClick={(e) => console.log(e)}
                >
                  <XMarkIcon width={20} />
                </button>
              </div>
            </a>
          </div>
        );
      })}
    </div>
  );
};
