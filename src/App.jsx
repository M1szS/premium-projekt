// Plik: src/App.jsx
// Główny komponent aplikacji "RAM Machine".
// Zarządza stanem symulatora, kontrolkami odtwarzania,
// edytorem programu, widokiem pamięci oraz taśmami I/O.
// Komentarze i etykiety w aplikacji są w języku polskim.
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, SkipForward, Save, FolderOpen } from 'lucide-react';
import { ProcessorView } from './components/ProcessorView';
import { ProgramEditor } from './components/ProgramEditor';
import { MemoryGrid } from './components/MemoryGrid';
import { RAMEngine } from './lib/ramEngine';
import './styles/main.scss';

// Przykładowy program startowy: dodawanie dwóch liczb z wejścia
const initialProgram = [];

function App() {
  const [program, setProgram] = useState(initialProgram);
  const [isRunning, setIsRunning] = useState(false);
  const [flashAddr, setFlashAddr] = useState(-1);
  const engineRef = useRef(new RAMEngine());
  const fileInputRef = useRef(null);
  
  // Create an initial memory state copy to trigger re-renders
  const [memory, setMemory] = useState(Array(64).fill(0));
  const [inputTape, setInputTape] = useState([]);
  const [outputTape, setOutputTape] = useState([]);
  const [acc, setAcc] = useState(0);
  const [ip, setIp] = useState(0);
  const [error, setError] = useState(null);

  // Synchronizuje stan React z wewnętrznym silnikiem symulatora
  const syncState = () => {
    const e = engineRef.current;
    setMemory([...e.memory]);
    setInputTape([...e.inputTape]);
    setOutputTape([...e.outputTape]);
    setAcc(e.acc);
    setIp(e.ip);
    setError(e.error);
    if (e.halted || e.error) setIsRunning(false);
  };

  // Znajduje adres pierwszej zmienionej komórki pamięci
  const findChangedAddress = (oldMem, newMem) => {
    for (let i = 0; i < newMem.length; i++) {
      if (newMem[i] !== oldMem[i]) return i;
    }
    return -1;
  };

  // Resetuje silnik i przywraca podstawowy stan
  const handleReset = () => {
    engineRef.current.reset();
    engineRef.current.loadProgram(program, inputTape); // keep input tape or reset it? Let's keep it for now but maybe clear output
    engineRef.current.outputTape = [];
    setIsRunning(false);
    setError(null);
    setFlashAddr(-1);
    syncState();
  };

  // Wykonuje pojedynczy krok instrukcji w silniku
  const handleStep = () => {
    if (!engineRef.current.halted && !engineRef.current.error) {
      const oldMem = [...engineRef.current.memory];

      engineRef.current.program = program; // keep program in sync
      engineRef.current.step();

      const changedAddr = findChangedAddress(oldMem, engineRef.current.memory);
      setFlashAddr(changedAddr);
      syncState();

      if (changedAddr !== -1) setTimeout(() => setFlashAddr(-1), 500);
    }
  };

  // Przełącznik odtwarzania: start/pauza symulacji
  const handlePlayPause = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      if (engineRef.current.halted || engineRef.current.error) {
         handleReset();
      }
      engineRef.current.program = program;
      // build label map from program
      const labels = {};
      program.forEach((line, index) => {
        if (line.label && line.label.trim() !== '') labels[line.label.trim()] = index;
      });
      engineRef.current.labels = labels;
      setIsRunning(true);
    }
  };

  // Pętla uruchamiana podczas odtwarzania (wywoływana co 500ms)
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        if (!engineRef.current.halted && !engineRef.current.error) {
          handleStep();
        } else {
          setIsRunning(false);
        }
      }, 500); // 500ms delay between instructions
    }
    return () => clearInterval(interval);
  }, [isRunning, program]); // Need program in dep to keep it updated

  // Dodaje pustą linię do programu w edytorze
  const handleAddLine = () => {
    setProgram([...program, { label: '', instruction: '', argument: '', comment: '' }]);
  };

  const handleRemoveLine = (index) => {
    const newProg = [...program];
    newProg.splice(index, 1);
    setProgram(newProg);
  };

  // Dodaje wartość do taśmy wejściowej silnika
  const handleInputSubmit = (val) => {
    engineRef.current.inputTape.push(val);
    syncState();
  };

  // Zmienia wartość w pamięci silnika pod adresem `addr`
  const handleMemoryChange = (addr, val) => {
    engineRef.current.setMemory(addr, val);
    syncState();
  };

  const handleSaveProgram = () => {
    const data = JSON.stringify(program, null, 2);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(data);
    const link = document.createElement('a');
    link.href = dataStr;
    link.download = 'ram_program.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenProgram = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const loadedProgram = JSON.parse(event.target.result);
        setProgram(loadedProgram);
        handleReset();
      } catch (err) {
        alert("Failed to load program: " + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  return (
    <div className="app-container">
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept=".json"
        onChange={handleOpenProgram}
      />
      <header className="header">
        <h1>RAM Machine Web</h1>
        <div className="controls">
          <button className="secondary" onClick={() => fileInputRef.current.click()}>
            <FolderOpen size={18} /> Open
          </button>
          <button className="secondary" onClick={handleSaveProgram}>
            <Save size={18} /> Save
          </button>
          <div style={{ width: '20px' }} />
          <button className="primary" onClick={handlePlayPause}>
            {isRunning ? <Pause size={18} /> : <Play size={18} />}
            {isRunning ? 'Pause' : 'Play'}
          </button>
          <button className="secondary" onClick={handleStep} disabled={isRunning || engineRef.current.halted}>
            <SkipForward size={18} /> Step
          </button>
          <button className="error" onClick={handleReset}>
            <Square size={18} /> Reset
          </button>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          <strong>Runtime Error:</strong> {error}
        </div>
      )}

      <div className="main-content">
        <ProcessorView 
          engine={{ ip, acc, inputTape, outputTape }} 
          onInput={handleInputSubmit}
        />
        
        <ProgramEditor 
          program={program} 
          activeLine={ip}
          onChange={setProgram}
          onAddLine={handleAddLine}
          onRemoveLine={handleRemoveLine}
        />
        
        <MemoryGrid 
          memory={memory} 
          flashAddress={flashAddr}
          onMemoryChange={handleMemoryChange}
        />
      </div>
    </div>
  );
}

export default App;
