import { sendToBackground } from '../../utils/actions/messages';
import buildContentPlaylist from './yt_api/buildPlayList';
console.log('[ContentScript] Loaded...');

// Mutation Observer - Detecting YT navigation
let lastUrl = location.href;
const titleObserver = new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    handleNavigation();
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
  const res = await sendToBackground({ type: 'is_saved', videoId });

  // Notify UI injector script
  window.postMessage(
    {
      source: 'ytps-content',
      type: 'video-state',
      exists: res.exists,
      videoId,
    },
    '*'
  );
}
// ----------------------------
// Listen to extension messages
// ----------------------------
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'extract_playlist') {
    (async () => {
      const { playlist, error } = await buildContentPlaylist(document);
      sendResponse({ playlist, error });
    })();

    // return true keeps the message port open for async sendResponse()
    return true;
  }

  if (request.action === 'add_video') {
    injectAddVideo();
    return true;
  }
});

// Ask injector script to add the current video
function injectAddVideo() {
  window.postMessage({ source: 'ytps-content', type: 'user-click-add' }, '*');
}

// Run Navigation
handleNavigation();
