import { useState } from 'react';

export default function LoadPy() {
  const [output, setOutput] = useState<string>('waiting...');

  async function helloPython() {
    setOutput('testing chrome.downloads');
  }

  return (
    <div style={{ padding: '16px' }}>
      <button
        className='hover:cursor-pointer hover:bg-cyan-700'
        onClick={helloPython}
        style={{
          background: '#1d4ed8',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
        }}
      >
        Run Python
      </button>

      <p style={{ marginTop: '16px' }}>{output}</p>
    </div>
  );
}
