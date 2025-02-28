import './App.css';
import { Popup } from './components/Popup';

// type onResult = {
//   error_message?: string;
//   playlist?: Video[];
// };
function App() {
  return (
    <>
      <main>
        <h1>Playlist Saver</h1>
        <Popup />
      </main>
    </>
  );
}

export default App;
