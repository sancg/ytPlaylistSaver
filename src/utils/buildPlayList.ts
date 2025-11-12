import type { Video } from '../types/video';

type LocatorMap = Record<
  'mini_player_view' | 'normal_view' | 'mobile_view',
  NodeListOf<HTMLAnchorElement> | null
>;

async function buildContentPlaylist(ctx: Document) {
  const playlist: Video[] = [];
  let skipVideo = 0;

  // Check what playlist selector is available
  const MINI_PLAYER_SELECTOR = 'ytd-miniplayer .playlist-items  a#wc-endpoint';
  const NORMAL_VIEW_SELECTOR = '#secondary-inner .playlist-items  a#wc-endpoint';
  const MOBILE_VIEW_SELECTOR = '#primary-inner .playlist-items a#wc-endpoint';

  const whichLocator: LocatorMap = {
    mini_player_view: ctx.querySelectorAll(MINI_PLAYER_SELECTOR),
    normal_view: ctx.querySelectorAll(NORMAL_VIEW_SELECTOR),
    mobile_view: ctx.querySelectorAll(MOBILE_VIEW_SELECTOR),
  };

  const validLocator = (
    Object.values(whichLocator) as (NodeListOf<HTMLAnchorElement> | null)[]
  ).find((list): list is NodeListOf<HTMLAnchorElement> => !!list && list.length > 0);
  const isLocator = validLocator && [...validLocator]?.length >= 1;

  if (!isLocator) {
    const obj = { error: 'general Playlist locator not found', playlist };
    console.error(obj);
    return obj;
  }

  const totalVideos = validLocator.length;
  console.log({ isLocator, total: totalVideos });
  await loadPLaylistImages(validLocator);

  for (const vid of validLocator) {
    const video: Video = { id: '', title: '', url: '', thumbImg: '' };

    video.id = new URL(vid.href).searchParams.get('v')!;
    video.url = vid.href;
    if (!video.id) {
      skipVideo++;
      console.warn('Video URL and ID was not detected for: ', vid);
      continue;
    }

    const isImg = vid.querySelector('yt-image > img') as HTMLImageElement;
    video.thumbImg = isImg?.src;

    video.title = vid.querySelector('#meta #video-title')?.ariaLabel ?? '';

    video.publishedBy = vid.querySelector('#byline-container > span')?.textContent ?? '';

    vid.querySelector('#index')?.textContent == '▶' ? (video.currentIndex = true) : false;

    video.timeLength = vid
      .querySelector('#thumbnail-container #time-status #text')
      ?.textContent?.trim();

    playlist.push(video);
  }

  console.log({ skipped: skipVideo, total: totalVideos, p: playlist });
  return { playlist, error: null };
}

async function loadPLaylistImages(videos: NodeListOf<HTMLElement>) {
  const videoItem = videos[0];
  const heighToScroll = videoItem.clientHeight;
  const containerToScroll = videoItem.parentElement?.parentElement;
  const originalPos = containerToScroll?.scrollTop;

  // 1) Ensure we read from the top
  console.log('scrolling to top...');
  containerToScroll?.scrollTo(0, 0);
  // 2) Load All Images content
  console.log('scrolling elements...');
  containerToScroll?.scrollBy({
    behavior: 'smooth',
    top: heighToScroll * videos.length,
  });
  await sleep(1500);
  // 3) Return to original position
  console.log('scrolling back to original position');
  containerToScroll?.scrollTo(0, originalPos || 0);
}
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { buildContentPlaylist };
