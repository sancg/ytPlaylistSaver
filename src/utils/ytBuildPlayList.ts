import type { Video } from '../types/video';

(() => {
  const PLAY_LIST = [];
  const locatorPlayList = document.querySelectorAll(
    '#secondary-inner .playlist-items  a#wc-endpoint'
  ) as NodeListOf<HTMLAnchorElement> | null;

  if (!locatorPlayList) {
    return { error_message: 'general Playlist locator not found' };
  }

  for (let vid of locatorPlayList) {
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
    // console.log(video)
    PLAY_LIST.push(video);
  }
  const currentIndex = PLAY_LIST.findIndex((p) => p.currentIndex);
  const result = { currentIndex, playList: PLAY_LIST };
  const userResponse = confirm('Save Playlist?');

  if (!userResponse) {
    console.log(result);
    return;
  }

  // Ask user for playlist name
  const fileName = prompt('Enter a name for your playlist file:', 'playlist') || 'playlist';

  // Save JSON file
  const blob = new Blob([JSON.stringify(result)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${fileName}.json`;
  a.click();

  console.log(`File "${fileName}.json" saved!`);
})();
