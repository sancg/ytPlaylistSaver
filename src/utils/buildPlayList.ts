import { Video } from '../types/video';

export const buildPlayList = (ctx: Document) => {
  const playlist = [];
  const locatorPlayList = ctx.querySelectorAll(
    '#secondary-inner .playlist-items  a#wc-endpoint'
  ) as NodeListOf<HTMLAnchorElement> | null;

  if (!locatorPlayList) {
    return { error_message: 'general Playlist locator not found' };
  }

  for (let vid of locatorPlayList) {
    const video: Video = { id: null, title: null, url: null };

    video.id = new URL(vid.href).searchParams.get('v');
    video.url = vid.href;

    const isImg = vid.querySelector('yt-image > img') as HTMLImageElement;
    video.thumbImg = isImg?.src;

    video.title = vid.querySelector('#meta #video-title')?.ariaLabel ?? null;
    video.publishedBy = video.title?.split('게시자:').pop()?.trim();

    vid.querySelector('#index')?.textContent == '▶' ? (video.currentIndex = true) : false;

    video.timeLength = vid
      .querySelector('#thumbnail-container #time-status #text')
      ?.textContent?.trim();
    // console.log(video)
    playlist.push(video);
  }
  console.log(playlist);
  //   const currentIndex = PLAY_LIST.findIndex((p) => p.currentIndex);
  return { playlist };
};
