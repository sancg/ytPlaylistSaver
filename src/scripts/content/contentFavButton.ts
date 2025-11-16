// console.log('[Injector] Loaded UI injector');

interface VideoStateEvent {
  source: 'ytps-content';
  type: 'update_state';
  exists: boolean;
  videoId: string;
}

// interface AddEvent {
//   source: 'ytps-content';
//   type: 'user-click-add';
// }

// Track current state
let button: HTMLButtonElement | null;
const BUTTON_ID = 'ytps-fav-btn';

/**
 * Create or update the injected button
 */
function renderButton(isSaved: boolean) {
  // If button exists, update it
  if (button) {
    updateButtonState(button, isSaved);
    return;
  }

  waitForContainer((container) => {
    button = document.createElement('button');
    button.id = BUTTON_ID;
    button.style.cssText = `
    font-family: "Roboto","Arial",sans-serif;
    font-weight: 500;
    margin-left: 8px;
    padding: 6px 12px;
    background-color: ${isSaved ? '#444' : '#065fd4'};
    color: ${isSaved ? '#d4d2d2' : 'white'};
    border-radius: 80%;
    border: none;
    cursor: ${isSaved ? 'auto' : 'pointer'};
    font-size: 14px;
  `;

    updateButtonState(button, isSaved);

    button.addEventListener('click', () => {
      console.log('[Injector] User clicked add');
      const url = location.href;
      const title = document.querySelector('h1.ytd-watch-metadata')?.textContent?.trim();
      const id = new URL(url).searchParams.get('v');
      const thumbImg = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

      const video = { id, title, url, thumbImg, addedAt: Date.now() };

      // Notify contentScript to store the video
      window.postMessage(
        {
          source: 'ytps-injector',
          action: 'add_video',
          payload: { video },
        },
        '*'
      );
    });

    container.appendChild(button);
  });
}

function waitForContainer(cb: (el: HTMLElement) => void) {
  const tryFind = () => {
    const container = document.querySelector<HTMLElement>(
      '#actions #actions-inner > #menu > ytd-menu-renderer'
    );

    if (container) {
      cb(container);
    } else {
      setTimeout(tryFind, 500);
    }
  };

  tryFind();
}

function updateButtonState(btn: HTMLButtonElement, isSaved: boolean) {
  const heart = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
</svg>
`;
  const heartAdded = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
</svg>
`;
  console.log({ heart, heartAdded });
  console.log('[BUTTON] updating state... ', isSaved);

  btn.textContent = isSaved ? 'Added' : 'Mark Fav';
  btn.disabled = isSaved;
  btn.style.backgroundColor = isSaved ? '#444' : '#065fd4';
  btn.style.color = isSaved ? '#d4d2d2' : '#fff';
  btn.style.cursor = isSaved ? 'auto' : 'pointer';
}

/**
 * Listen for messages coming from contentScript
 */
window.addEventListener('message', (ev) => {
  const msg = ev.data;

  // ensure message comes from contentScript
  if (!msg || msg.source !== 'ytps-content') return;

  // contentScript → injector : provide new video state
  if (msg.type === 'update_state') {
    const { exists } = msg as VideoStateEvent;
    console.log({ exists });
    console.log('[Injector] Received updated_state:', msg);

    renderButton(exists);
  }

  // contentScript → injector : user clicked “add” inside popup
  if (msg.type === 'user-click-add') {
    console.log('[Injector] Received add trigger from popup');
    simulateClick();
  }
});

/**
 * When popup triggers add_video, mimic a click on the YT button
 */
function simulateClick() {
  if (!button) return;
  button.click();
}
