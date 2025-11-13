import { FireIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { Video } from '../types/video';

type PropTypes = {
  list: Video[];
  currentVideo: Video | null;
  selectVideo: (vid: Video) => void;
};
export const VideoList = ({ list, currentVideo, selectVideo }: PropTypes) => {
  const renderIndex = (id: string) => {
    if (currentVideo?.id === id) {
      return (
        <div className='h-full p-1 w-8'>
          <FireIcon width={14} className='m-auto' />
        </div>
      );
    }
    return <div className='h-full p-1 w-6'></div>;
  };

  return (
    <div>
      <ul>
        {list.map((video, idx) => (
          <li
            key={idx}
            className={`flex items-center p-3 ${
              currentVideo?.id === video.id ? 'bg-(--yt-active)' : ''
            } hover:bg-yt-bg-tertiary cursor-pointer`}
          >
            <div className='flex flex-1 items-center' onClick={() => selectVideo(video)}>
              {renderIndex(video.id!)}
              <a hidden href={video.url!} />
              <img
                src={video.thumbImg}
                alt={video.title || 'thumbnail'}
                className='w-16 h-10 object-cover rounded'
              />
              <div className='self-baseline h-full flex-1 ml-2'>
                <h4 className='font-medium truncate whitespace-normal'>
                  <span className='line-clamp-2'>{video.title || `Video ${idx + 1}`}</span>
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
          </li>
        ))}
      </ul>
    </div>
  );
};
