import type { Video } from '../types/video';

const buildPlaylist = (ctx: Document) => {
  const playlist: Video[] = [];

  // Check what playlist selector is available
  // #1 The miniplayer view:
  const MINI_PLAYER_SELECTOR = 'ytd-miniplayer .playlist-items  a#wc-endpoint';
  const NORMAL_VIEW_SELECTOR = '#secondary-inner .playlist-items  a#wc-endpoint';
  const MOBILE_VIEW_SELECTOR = '#primary-inner .playlist-items a#wc-endpoint';
  let locatorPlaylist = ctx.querySelectorAll(
    MINI_PLAYER_SELECTOR
  ) as NodeListOf<HTMLAnchorElement> | null;

  const isLocator = locatorPlaylist && [...locatorPlaylist]?.length >= 1;
  console.log({ isLocator });

  if (!isLocator) {
    console.log('Getting the Playlist from: Normal View Selector');
    locatorPlaylist = ctx.querySelectorAll(NORMAL_VIEW_SELECTOR);
  }

  if (!isLocator) {
    console.log('Getting the Playlist from: Mobile View Selector');
    locatorPlaylist = ctx.querySelectorAll(MOBILE_VIEW_SELECTOR);
  }

  if (!isLocator) {
    const obj = { error: 'general Playlist locator not found', playlist };
    console.error(obj);
    return obj;
  }

  for (let vid of locatorPlaylist!) {
    const video: Video = {};

    video.id = new URL(vid.href).searchParams.get('v')!;
    video.url = vid.href;

    const isImg = vid.querySelector('yt-image > img') as HTMLImageElement;
    video.thumbImg = isImg?.src;

    video.title = vid.querySelector('#meta #video-title')?.ariaLabel!;

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
