import './App.css';
import { Popup } from './components/Popup';

// type onResult = {
//   error_message?: string;
//   playlist?: Video[];
// };
const openViewer = () => {
  const url = chrome.runtime.getURL('html/pages/playlist_viewer.html');
  chrome.tabs.create({ url });
};

function App() {
  return (
    <>
      <main>
        <div className='p-4 w-72 bg-[#0f0f0f] text-white'>
          <h2 className='text-lg font-semibold mb-3'>Playlist Saver</h2>
          <Popup />
          <p className='mt-3 text-sm text-gray-300'>
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
