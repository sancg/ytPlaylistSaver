import type { Video } from '../types/video';

const buildPlaylist = (ctx: Document) => {
  const playlist: Video[] = [];

  let locatorPlaylist = ctx.querySelectorAll(
    '#secondary-inner .playlist-items  a#wc-endpoint'
  ) as NodeListOf<HTMLAnchorElement> | null;

  if (!locatorPlaylist || locatorPlaylist.length < 1) {
    console.log('Trying Mobile View Selector');
    locatorPlaylist = ctx.querySelectorAll('#primary-inner .playlist-items a#wc-endpoint');
  }

  if (!locatorPlaylist || locatorPlaylist.length < 1) {
    const obj = { error: 'general Playlist locator not found', playlist };
    console.error(obj);
    return obj;
  }

  for (let vid of locatorPlaylist) {
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
