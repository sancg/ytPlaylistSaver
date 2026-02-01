import { QueueListIcon } from '@heroicons/react/20/solid';

type CountChipProps = {
  count: number | string;
};

export function CountChip({ count }: CountChipProps) {
  return (
    <div className='absolute bottom-1 right-1 z-20 flex items-center gap-1 rounded-md bg-yt-bg-secondary/60 px-1 py-1 text-xs font-semibold text-white'>
      <div className='flex gap-0.5 justify-center items-center'>
        <QueueListIcon width={14} />
        <span>{typeof count === 'number' ? <>Videos {count}</> : <> {count}</>}</span>
      </div>
    </div>
  );
}
