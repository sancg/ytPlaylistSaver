function addFavButton() {
  const container = document.querySelector(
    '#actions #actions-inner > #menu > ytd-menu-renderer'
  );

  if (!container || document.querySelector('#ytps-fav-btn')) return;

  const btn = document.createElement('button');
  btn.id = 'ytps-fav-btn';
  btn.textContent = '⭐ Favorite';
  btn.style.marginLeft = '12px';
  btn.style.padding = '6px 10px';
  btn.style.borderRadius = '8px';
  btn.style.cursor = 'pointer';

  btn.onclick = async () => {
    // TODO: Missing the published By attribute - low P
    const url = location.href;
    const title = document.title.replace(' - YouTube', '');
    const id = new URL(url).searchParams.get('v');
    const thumbImg = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

    const item = { id, title, url, thumbImg, addedAt: Date.now() };

    const existing =
      (await chrome.storage.local.get('download-ready'))['download-ready'] || [];

    await chrome.storage.local.set({
      'download-ready': [...existing, item],
    });

    btn.textContent = '⭐ Added!';
    btn.disabled = true;
  };

  container.append(btn);
}

setInterval(addFavButton, 1500);
