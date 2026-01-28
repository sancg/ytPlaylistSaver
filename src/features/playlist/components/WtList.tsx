import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Video } from '../../../types/video';
import { Thumbnail, ThumbnailVariant } from '../../../components/Thumbnail';

type props = {
  playList: Video[];
  imgVariant: ThumbnailVariant;
  chip?: number;
};
export const WtList = ({ playList, imgVariant, chip }: props) => {
  return (
    <div>
      {playList.map((video) => {
        return (
          <>
            <a
              className='flex flex-1 items-center p-2 hover:bg-yt-bg-tertiary cursor-pointer'
              href={video.url}
              key={video.id}
            >
              {/* <div className='h-full p-1 w-6'></div> */}
              <div className='flex flex-1 items-center pt-2'>
                <Thumbnail
                  className='w-32'
                  src={video.thumbImg}
                  variant={imgVariant}
                  count={chip}
                />
                <div className='self-baseline h-full flex-1 ml-2'>
                  <h4 className='font-medium truncate whitespace-normal'>
                    <span className='line-clamp-2'>
                      {video.title} - {video.timeLength}
                    </span>
                  </h4>
                </div>
              </div>
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
          </>
        );
      })}
    </div>
  );
};
