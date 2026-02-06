import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';
type props = {
  playlistId?: string;
  activeVideoIndex?: number | boolean;
  totalItems: number;
  actionClick: () => void;
};
export const PlaybackCount = ({
  playlistId,
  totalItems,
  activeVideoIndex,
  actionClick,
}: props) => {
  return (
    <>
      <button
        className='text-sm font-medium p-2 rounded-full hover:cursor-pointer hover:bg-yt-text-muted '
        onClick={actionClick}
      >
        <ArrowLeftStartOnRectangleIcon className='w-6' />
      </button>
      <div className='flex flex-col items-start'>
        <h2 className='text-base font-black truncate whitespace-normal line-clamp-1'>
          {playlistId}
        </h2>
        <div>
          {activeVideoIndex ? (
            <span>
              {activeVideoIndex}/{totalItems}
            </span>
          ) : (
            <span>{totalItems}</span>
          )}
        </div>
      </div>
    </>
  );
};
