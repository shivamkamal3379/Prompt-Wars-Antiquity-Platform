import { useState } from 'react';
import Welcome from './components/Welcome';
import Dashboard from './components/Dashboard';

function App() {
  const [started, setStarted] = useState(false);

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden bg-slate-950">
      {/* Intro Welcome Screen */}
      {!started && <Welcome onEnter={() => setStarted(true)} />}
      
      {/* Main Dashboard App (Fades in seamlessly when started) */}
      {started && (
        <div className="animate-fade-in">
          <Dashboard />
        </div>
      )}
    </div>
  );
}

export default App;
