import type { Video } from '../types/video';

type LocatorMap = Record<
  'mini_player_view' | 'normal_view' | 'mobile_view',
  NodeListOf<HTMLAnchorElement> | null
>;

const buildPlaylist = (ctx: Document) => {
  const playlist: Video[] = [];

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
  for (const vid of validLocator) {
    const video: Video = {};

    video.id = new URL(vid.href).searchParams.get('v')!;
    video.url = vid.href;

    const isImg = vid.querySelector('yt-image > img') as HTMLImageElement;
    video.thumbImg = isImg?.src;

    video.title = vid.querySelector('#meta #video-title')?.ariaLabel ?? '';

    video.publishedBy = video.title?.split('게시자:').pop()?.trim();

    vid.querySelector('#index')?.textContent == '▶' ? (video.currentIndex = true) : false;

    video.timeLength = vid
      .querySelector('#thumbnail-container #time-status #text')
      ?.textContent?.trim();

    playlist.push(video);
  }

  return { error: null, playlist };
};

export { buildPlaylist };
