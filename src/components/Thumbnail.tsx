// import { useEffect, useRef, useState } from 'react';
import { CountChip } from './CountChip';

export type ThumbnailVariant = 'single' | 'stacked';

type ThumbnailProps = {
  src: string;
  alt?: string;
  variant?: ThumbnailVariant;
  count?: number | string;
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
  // const ref = useRef<HTMLDivElement>(null);
  // const [visible, setVisible] = useState(false);

  // useEffect(() => {
  //   if (!ref.current) {
  //     return;
  //   }

  //   const observer = new IntersectionObserver(
  //     ([entry]) => {
  //       console.log({ entry });
  //       if (entry.isIntersecting) {
  //         setVisible(true);
  //         observer.unobserve(entry.target);
  //       }
  //     },
  //     { rootMargin: '300px' },
  //   );

  //   observer.observe(ref.current);

  //   return () => {
  //     observer.disconnect();
  //   };
  // }, []);
  return (
    <div className={`relative aspect-video overflow-visible ${className}`}>
      {/* {visible && ( */}
      <>
        {variant === 'stacked' && (
          <>
            <div className='stack_1 w-[calc(100%-1rem)] absolute inset-0 translate-x-2 -translate-y-2 rounded-md border-t border-t-black bg-yt-accent-link/40' />
            <div className='stack_2 absolute inset-0 translate-x-0 -translate-y-1 rounded-md border-t border-t-black bg-yt-accent-link/90' />
          </>
        )}

        <img
          loading='lazy'
          src={src}
          alt={alt}
          className={`relative z-10 h-full w-full rounded-md border-t border-t-black object-cover ${imageClassName}`}
        />

        {count && <CountChip count={count} />}
      </>
      {/* )} */}
    </div>
  );
}
