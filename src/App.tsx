import './App.css';
import { getPlaylist } from './utils/actions';
import { ArrowPathIcon, CloudArrowDownIcon } from '@heroicons/react/20/solid';
import type { GetPlaylistCall, Video } from './types/video';

const openViewer = () => {
  const url = chrome.runtime.getURL('html/pages/playlist_viewer.html');
  chrome.tabs.create({ url });
};

const refreshExtension = () => {
  chrome.runtime.reload();
  chrome.tabs.reload();
};

function App() {
  const handleGetPlaylist = async () => {
    const { playlist, error }: GetPlaylistCall = await getPlaylist();
    if (error) {
      console.error(error);
      return;
    }

    if (playlist) {
      const currentIndex = playlist.findIndex((p: Video) => p.currentIndex);
      const exportResult = { currentIndex, playlist };
      const fileName = prompt('Playlist Name:', 'playlist');
      if (!fileName) {
        console.warn("Download was 'canceled' from the user");
        return;
      }

      // Save JSON file
      const blob = new Blob([JSON.stringify(exportResult)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${fileName}.json`;
      a.click();
    }
  };

  return (
    <>
      <main>
        <div className='p-4 w-72 bg-yt-bg text-yt-text-primary'>
          <div className='flex items-center justify-between mb-2'>
            <h2 className='text-lg font-bold'>Playlist Saver</h2>
            <div className='flex items-center justify-around gap-1'>
              <div className='p-2' title='Get Playlist'>
                <CloudArrowDownIcon
                  className='transition-all duration-300 ease-in-out hover:scale-125 hover:cursor-pointer'
                  width={20}
                  onClick={handleGetPlaylist}
                />
              </div>
              <div className='p-2' title='Refresh App'>
                <ArrowPathIcon
                  width={20}
                  onClick={refreshExtension}
                  className='transition-all duration-300 ease-in-out hover:scale-125 hover:cursor-pointer'
                />
              </div>
            </div>
          </div>
          <p className='my-2 text-sm text-yt-text-secondary'>
            Manage playlists, upload JSON, and play inside a YouTube-like page.
          </p>
          <button
            className='bg-[#e1002d] font-bold hover:bg-red-700 px-3 py-2 rounded-2xl w-full'
            onClick={openViewer}
          >
            Open Playlist Viewer
          </button>
        </div>
      </main>
    </>
  );
}

export default App;
