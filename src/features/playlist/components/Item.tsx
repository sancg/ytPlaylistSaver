import { Thumbnail, ThumbnailVariant } from '../../../components/Thumbnail';
import type { Video } from '../../../types/video';
import { ViewState } from '../types';

type state = Pick<ViewState, 'view'>;

type props = {
  video: Video;
  imgVariant: ThumbnailVariant;
  title?: string;
  chip?: string | number;
  viewState?: state;
  activeVideoId?: string;
};
export const Item = ({ video, title, imgVariant, viewState, chip, activeVideoId }: props) => {
  const currentVideo = video.id === activeVideoId;
  return (
    <div className={`flex flex-1 items-center pt-2`}>
      <Thumbnail
        className='w-32'
        src={video.thumbImg}
        variant={imgVariant}
        count={chip}
        activeVideoId={currentVideo}
      />
      <div className='self-baseline h-full flex-1 ml-2'>
        <h4
          className={`font-extrabold truncate whitespace-normal ${viewState?.view === 'VIDEOS' ? 'text-xs' : 'text-base'}`}
          title={title}
        >
          <span className='line-clamp-2'>{title ? <span>{title}</span> : video.title}</span>
        </h4>
      </div>
    </div>
  );
};
