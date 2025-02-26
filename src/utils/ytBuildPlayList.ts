(() => {
  const PLAY_LIST = [];
  const locatorPlayList = document.querySelectorAll(
    '#secondary-inner .playlist-items  a#wc-endpoint'
  );

  for (let vid of locatorPlayList) {
    const video = {};

    video.url = vid.href;
    video.id = new URL(vid.href).searchParams.get('v');

    video.thumbImg = vid.querySelector('yt-image > img').src;
    video.title = vid.querySelector('#meta #video-title').ariaLabel;
    video.publishedBy = video.title.split('게시자:').pop().trim();

    vid.querySelector('#index')?.textContent != '' ? (video.currentWatch = true) : false;

    video.timeLenght = vid
      .querySelector('#thumbnail-container #time-status #text')
      .textContent.trim();
    // console.log(video)
    PLAY_LIST.push(video);
  }
  const currentIndex = PLAY_LIST.findIndex((p) => p.currentWatch);
  const result = JSON.stringify({ currentIndex, playList: PLAY_LIST });

  // Ask user for playlist name
  const fileName = prompt('Enter a name for your playlist file:', 'playlist') || 'playlist';

  // Save JSON file
  const blob = new Blob([result], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${fileName}.json`;
  a.click();

  console.log(`File "${fileName}.json" saved!`);
})();
