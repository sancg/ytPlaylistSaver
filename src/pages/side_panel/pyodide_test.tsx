import { useEffect, useRef, useState } from 'react';
import { PyWorkerRuntime } from '../../scripts/background/py_worker/PyWorkerRuntime';

export default function LoadPy() {
  const pyRef = useRef<PyWorkerRuntime | null>(null);
  const [output, setOutput] = useState<string>('waiting...');

  useEffect(() => {
    pyRef.current = new PyWorkerRuntime();
  }, []);

  async function helloPython() {
    if (!pyRef.current) return;

    const result = await pyRef.current.run('1 + 1');
    setOutput(`Python says: ${result}`);
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
