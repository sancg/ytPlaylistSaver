import type { Video } from '../types/video';

type LocatorMap = Record<
  'mini_player_view' | 'normal_view' | 'mobile_view',
  NodeListOf<HTMLAnchorElement> | null
>;

const buildPlaylist = async (ctx: Document) => {
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

  console.log({ isLocator, total: validLocator.length });
  //TODO: Load all Images before getting the Playlist (It needs scroll through the list).
  const videoItem = validLocator[0];
  const heighToScroll = videoItem.clientHeight;
  const containerToScroll = videoItem.parentElement?.parentElement;
  const originalPos = containerToScroll?.scrollTop;

  // 1) Ensure we read from the top
  containerToScroll?.scrollTo(0, 0);
  console.log('scroll to top');
  // 2) Load All Images content
  await sleep(1000);
  validLocator.forEach(async (_item) => {
    containerToScroll?.scrollBy(0, heighToScroll);
    await sleep(2500);
  });
  await sleep(1000);
  // 3) Return to original position
  containerToScroll?.scrollTo(0, originalPos || 0);

  for (const vid of validLocator) {
    const video: Video = {};

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

  console.log({ skipped: skipVideo, total: validLocator.length });
  return { error: null, playlist };
};

function sleep(timeout: number) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

export { buildPlaylist };
