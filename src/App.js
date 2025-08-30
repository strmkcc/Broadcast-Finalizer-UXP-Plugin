import React, { useState } from 'react';
import './App.css';

// In UXP, require is on the window object. In Node/Jest, it's global.
const requireFunc = typeof window === 'undefined' ? require : window.require;

let nativeModule, ppro;
try {
  nativeModule = requireFunc("broadcast-finalizer-native");
  ppro = requireFunc("premierepro");
} catch (e) {
  // In a test environment, these modules might not exist and that's okay.
  console.log("Running in an environment without native module access.");
  nativeModule = { processAudio: () => '{"received": {}, "meters": {}}' };
  ppro = { project: { getActiveProject: async () => ({ activeSequence: { name: "Mock Sequence" } }) } };
}


function App() {
  const [meters, setMeters] = useState(null);
  const [voLevel, setVoLevel] = useState(0);
  const [musicLevel, setMusicLevel] = useState(0);
  const [fxLevel, setFxLevel] = useState(0);
  const [sequenceName, setSequenceName] = useState('');

  const handleAnalyzeClick = () => {
    try {
      const options = { voLevel, musicLevel, fxLevel };
      const resultStr = nativeModule.processAudio(options);
      const result = JSON.parse(resultStr);
      setMeters(result);
    } catch (e) {
      console.error("Error calling native module:", e);
      alert("Error calling native module: " + e.message);
    }
  };

  const getSequenceName = async () => {
    try {
      const project = await ppro.project.getActiveProject();
      const sequence = project.activeSequence;
      if (sequence) {
        setSequenceName(sequence.name);
      } else {
        setSequenceName("No active sequence");
      }
    } catch (e) {
      console.error("Error getting sequence name:", e);
      alert("Error getting sequence name: " + e.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Broadcast Finalizer</h1>

        <div className="controls">
          <div className="fader">
            <label>VO Level: {voLevel} dB</label>
            <input type="range" min="-18" max="18" value={voLevel} onChange={(e) => setVoLevel(parseFloat(e.target.value))} />
          </div>
          <div className="fader">
            <label>Music Level: {musicLevel} dB</label>
            <input type="range" min="-18" max="18" value={musicLevel} onChange={(e) => setMusicLevel(parseFloat(e.target.value))} />
          </div>
          <div className="fader">
            <label>FX Level: {fxLevel} dB</label>
            <input type="range" min="-18" max="18" value={fxLevel} onChange={(e) => setFxLevel(parseFloat(e.target.value))} />
          </div>
        </div>

        <button onClick={handleAnalyzeClick}>Analyze (Mock)</button>

        <div className="ppro-integration">
          <button onClick={getSequenceName}>Get Active Sequence Name</button>
          {sequenceName && <p>Sequence: {sequenceName}</p>}
        </div>

        {meters && (
          <div className="meters">
            <h2>Meter Readings (Mock Data)</h2>
            <pre>{JSON.stringify(meters, null, 2)}</pre>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
