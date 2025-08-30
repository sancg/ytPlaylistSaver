import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Video } from '../types/video';

type PropTypes = {
  list: Video[];
  selectVideo: (vid: Video) => void;
};
export const VideoList = ({ list, selectVideo }: PropTypes) => {
  return (
    <div>
      <ul>
        {list.map((video, idx) => (
          <li
            key={idx}
            className='flex items-center gap-3 p-3 hover:bg-yt-bg-tertiary cursor-pointer'
            onClick={() => selectVideo(video)}
          >
            <div className='flex items-center gap-2 w-10/12 ml-2'>
              <a hidden href={video.url!} />
              <img
                src={video.thumbImg}
                alt={video.title || 'thumbnail'}
                className='w-16 h-10 object-cover rounded'
              />
              <div className='self-baseline h-full'>
                <h4 className='font-medium truncate whitespace-normal'>
                  <span className='line-clamp-2'>{video.title || `Video ${idx + 1}`}</span>
                </h4>
              </div>
            </div>
            <div className='hidden'>
              <XMarkIcon width={20} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
