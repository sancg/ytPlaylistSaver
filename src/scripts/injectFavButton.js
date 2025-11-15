function addFavButton() {
  const container = document.querySelector('#above-the-fold #title');

  if (!container || document.querySelector('#ytps-fav-btn')) return;

  const btn = document.createElement('button');
  btn.id = 'ytps-fav-btn';
  btn.textContent = '⭐ Favorite';
  btn.style.marginLeft = '12px';
  btn.style.padding = '6px 10px';
  btn.style.borderRadius = '8px';
  btn.style.cursor = 'pointer';

  btn.onclick = async () => {
    const title = document.title.replace(' - YouTube', '');
    const url = location.href;
    const thumbnail = `https://i.ytimg.com/vi/${new URL(url).searchParams.get(
      'v'
    )}/hqdefault.jpg`;

    const item = { title, url, thumbnail, addedAt: Date.now() };

    const existing =
      (await chrome.storage.local.get('download-ready'))['download-ready'] || [];

    await chrome.storage.local.set({
      'download-ready': [...existing, item],
    });

    btn.textContent = '⭐ Added!';
    btn.disabled = true;
  };

  container.appendChild(btn);
}

setInterval(addFavButton, 1500);
