import type { Video } from '../types/video';
import { XMarkIcon } from '@heroicons/react/24/outline';

type props = {
  video: Video;
};
export const Item = ({ video }: props) => {
  console.log({ video });
  return (
    <>
      <div className='flex flex-1 items-center'>
        {/* {renderIndex(video.id!)} */}
        <a hidden href={video.url!} />
        <img
          src={video.thumbImg}
          alt={video.title || 'thumbnail'}
          className='w-16 h-10 object-cover rounded'
        />
        <div className='self-baseline h-full flex-1 ml-2'>
          <h4 className='font-medium truncate whitespace-normal'>
            <span className='line-clamp-2'>{video.title}</span>
          </h4>
        </div>
      </div>
      <div className='opacity-0 w-6 h-6 hover:opacity-100'>
        <button className='hover:cursor-pointer' type='button' onClick={(e) => console.log(e)}>
          <XMarkIcon width={20} />
        </button>
      </div>
    </>
  );
};
