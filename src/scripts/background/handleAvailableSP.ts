import { cs } from '../shared/constants';

async function handleAvailableSP(tabId: number, urlString: string, _trigger: string) {
  const isWatch = cs.ALLOWED_EXTENSION(urlString);
  await chrome.sidePanel.setOptions({
    tabId,
    enabled: isWatch,
    path: isWatch ? 'src/pages/side_panel/side-panel.html' : undefined,
  });
}

export { handleAvailableSP };
