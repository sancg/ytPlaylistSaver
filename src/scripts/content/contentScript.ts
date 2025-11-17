import buildContentPlaylist from './yt_api/buildPlayList';
console.log('[ContentScript] Loaded...');

// Mutation Observer - Detecting YT navigation
let lastUrl = location.href;
const titleObserver = new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    // handleNavigation();
  }
});

titleObserver.observe(document.querySelector('title')!, {
  childList: true,
  subtree: true,
});

// handle Initial + SPA loads
async function handleNavigation() {
  console.log('[ContentScript] Navigation detected.');

  const videoId = new URL(location.href).searchParams.get('v');
  if (!videoId) return;

  // Ask background if video is saved
  const res = await chrome.runtime.sendMessage({
    type: 'is_saved',
    payload: { currentId: videoId },
  });

  // Notify UI injector script
  window.postMessage(
    {
      source: 'ytps-content',
      type: 'update_state',
      exists: res.exists,
      videoId,
    },
    '*'
  );
}
// ----------------------------
// Listen to extension messages
// ----------------------------
chrome.runtime.onMessage.addListener((req, _sender, sendResponse) => {
  if (req.action === 'url_change') {
    console.log('[CS] Reading message rom the BG worker...', req);
    handleNavigation(); // weird that an async function could be called even if it is not processed?
  }

  if (req.action === 'extract_playlist') {
    (async () => {
      const { playlist, skipVideos, error } = await buildContentPlaylist(document);
      sendResponse({ playlist, skipVideos, error });
    })();
    console.log('[CS] scraping completed...');
    // return true keeps the message port open for async sendResponse()
    return true;
  }

  if (req.action === 'add_video') {
    console.log('ALSO TRIGGERED BY ACCIDENT?');
    console.log('CS adding video... ', { req });
    injectAddVideo();
    return true;
  }

  return { success: true };
});

// Ask injector script to add the current video
function injectAddVideo() {
  console.log('[REACT to MAIN] Adding video...');
  window.postMessage({ source: 'ytps-content', type: 'add_video' }, '*');
}

window.addEventListener('message', (ev) => {
  const msg = ev.data;
  if (!msg || msg.source !== 'ytps-injector') return;

  if (msg.action === 'add_video') {
    console.log('[CS] injector requested add_video: ', msg);

    // Notify to the background if it could be saved
    chrome.runtime
      .sendMessage({ type: 'add_video', payload: { video: msg.payload.video } })
      .then((r) => {
        const msg = {
          source: 'ytps-content',
          type: 'update_state',
          exists: r.exists,
        };
        console.log('[CS] sending back to button [Real World]...', msg);
        window.postMessage(msg); // The contentFavButton receives the update
      });
  }
});
