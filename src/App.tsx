import { ArrowPathIcon } from '@heroicons/react/20/solid';
import './App.css';
import { Popup } from './components/Popup';

const openViewer = () => {
  const url = chrome.runtime.getURL('html/pages/playlist_viewer.html');
  chrome.tabs.create({ url });
};

const refreshExtension = () => {
  chrome.runtime.reload();
  chrome.tabs.reload();
};

function App() {
  return (
    <>
      <main>
        <div className='p-4 w-72 bg-[#0f0f0f] text-white'>
          <div className='flex items-center justify-between mb-2'>
            <h2 className='text-lg font-semibold'>Playlist Saver</h2>
            <ArrowPathIcon width={20} onClick={refreshExtension} className='cursor-pointer' />
          </div>
          <Popup />
          <p className='my-2 text-sm text-gray-300'>
            Manage playlists, upload JSON, and play inside a YouTube-like page.
          </p>
          <button
            className='bg-[#e1002d] font-bold hover:bg-red-700 px-3 py-2 rounded w-full'
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
