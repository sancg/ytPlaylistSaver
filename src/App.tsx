import './App.css';
import { Popup } from './components/Popup';

// type onResult = {
//   error_message?: string;
//   playlist?: Video[];
// };
const openViewer = () => {
  const url = chrome.runtime.getURL('playlist_viewer.html');
  chrome.tabs.create({ url });
};

function App() {
  return (
    <>
      <main>
        <div className='p-4 w-72 bg-[#0f0f0f] text-white'>
          <h2 className='text-lg font-semibold mb-3'>Playlist Saver</h2>
          <button
            className='bg-red-600 hover:bg-red-700 px-3 py-2 rounded w-full'
            onClick={openViewer}
          >
            Open Playlist Viewer
          </button>
          <p className='mt-3 text-sm text-gray-300'>
            Manage playlists, upload JSON, and play inside a YouTube-like page.
          </p>
        </div>
        <Popup />
      </main>
    </>
  );
}

export default App;
