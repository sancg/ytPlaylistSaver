import type { Video } from '../../../types/video';

type LocatorMap = Record<
  'mini_player_view' | 'normal_view' | 'mobile_view',
  NodeListOf<HTMLAnchorElement> | null
>;

async function buildContentPlaylist(ctx: Document) {
  const playlist: Video[] = [];
  const skipVideos: { video: Video; errMsg: string }[] = [];

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
    const obj = { playlist, skipVideos, error: 'Playlist locator not found' };
    console.error(obj.error);
    return obj;
  }

  await loadPLaylistImages(validLocator);

  for (const vid of validLocator) {
    const video: Video = { id: '', title: '', url: '', thumbImg: '' };

    video.id = new URL(vid.href).searchParams.get('v')!;
    video.title = vid.querySelector('#meta #video-title')?.ariaLabel ?? '';
    video.url = vid.href;

    const isImg = vid.querySelector('yt-image > img') as HTMLImageElement;
    video.thumbImg = isImg?.src;

    if (!video.id) {
      console.warn('Video ID is missing for video: ', video);
      skipVideos.push({ video, errMsg: 'video ID not found' });
      continue;
    }

    if (!video.thumbImg) {
      console.warn('Video Thumbnail is missing for video: ', video);
      skipVideos.push({ video, errMsg: 'video thumbnail not found' });
      continue;
    }

    video.publishedBy =
      vid.querySelector('#byline-container > span')?.textContent?.trim() ?? '';
    vid.querySelector('#index')?.textContent == '▶' ? (video.currentIndex = true) : false;
    video.timeLength = vid
      .querySelector('#thumbnail-container #time-status #text')
      ?.textContent?.trim();

    playlist.push(video);
  }

  // General Error Message if we skip videos
  if (skipVideos.length > 0) {
    return {
      playlist,
      skipVideos,
      error: 'Missing key information on this playlist',
    };
  }

  console.log({ skipped: skipVideos.length, total: validLocator.length, p: playlist });
  return { playlist, skipVideos: null, error: null };
}

async function loadPLaylistImages(videos: NodeListOf<HTMLElement>) {
  const videoItem = videos[0];
  const heighToScroll = videoItem.clientHeight * videos.length;
  const containerToScroll = videoItem.parentElement?.parentElement;
  const originalPos = containerToScroll?.scrollTop;

  if (!containerToScroll) {
    return;
  }

  // Detect viewport scrolling related to the Items height
  if (containerToScroll.clientHeight >= heighToScroll) {
    return;
  }

  // 1) Ensure we scroll from the top
  containerToScroll.scrollTo(0, 0);
  // 2) Load all images content
  containerToScroll.scrollBy({
    behavior: 'smooth',
    top: heighToScroll,
  });
  await sleep(1500);

  // 3) Return to original position
  containerToScroll.scrollTo(0, originalPos || 0);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default buildContentPlaylist;
