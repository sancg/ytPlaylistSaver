import { Thumbnail, ThumbnailVariant } from '../../../components/Thumbnail';
import type { Video } from '../../../types/video';

type props = {
  video: Video;
  imgVariant: ThumbnailVariant;
  title?: string;
  chip?: string | number;
};
export const Item = ({ video, title, imgVariant, chip }: props) => {
  console.log({ video });
  return (
    <div className='flex flex-1 items-center pt-2'>
      <Thumbnail className='w-32' src={video.thumbImg} variant={imgVariant} count={chip} />
      <div className='self-baseline h-full flex-1 ml-2'>
        <h4 className='font-extrabold truncate whitespace-normal text-base' title={title}>
          <span className='line-clamp-2'>{title ? <span>{title}</span> : video.title}</span>
        </h4>
      </div>
    </div>
  );
};
