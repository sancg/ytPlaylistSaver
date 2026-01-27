import { CountChip } from './CountChip';

type ThumbnailVariant = 'single' | 'stacked';

type ThumbnailProps = {
  src: string;
  alt?: string;
  variant?: ThumbnailVariant;
  count?: number;
  className?: string;
  imageClassName?: string;
};

export function Thumbnail({
  src,
  alt,
  variant = 'single',
  count,
  className = '',
  imageClassName = '',
}: ThumbnailProps) {
  return (
    <div className={`relative aspect-video overflow-visible ${className}`}>
      {variant === 'stacked' && (
        <>
          <div className='absolute w-11/12 inset-0 translate-x-2 -translate-y-1 rounded-md bg-yt-accent-link/30' />
          <div className='absolute inset-0 translate-x-0 -translate-y-0.5 rounded-md bg-yt-accent-link' />
        </>
      )}

      <img
        src={src}
        alt={alt}
        className={`relative z-10 h-full w-full rounded-md object-cover ${imageClassName}`}
      />

      {typeof count === 'number' && <CountChip count={count} />}
    </div>
  );
}
