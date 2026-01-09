async function handleTabState(tabId: number, urlString: string, _trigger: string) {
  const url = new URL(urlString);

  const isWatch = url.hostname === 'www.youtube.com' && url.pathname === '/watch';
  await chrome.sidePanel.setOptions({
    tabId,
    enabled: isWatch,
    path: isWatch ? 'src/pages/side_panel/side-panel.html' : undefined,
  });
}
export { handleTabState };
