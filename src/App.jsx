import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, SkipForward, Save, FolderOpen } from 'lucide-react';
import { ProcessorView } from './components/ProcessorView';
import { ProgramEditor } from './components/ProgramEditor';
import { MemoryGrid } from './components/MemoryGrid';
import { RAMEngine } from './lib/ramEngine';
import './styles/main.scss';

const initialProgram = [
  { label: '', instruction: 'READ', argument: '1', comment: '// read first number to memory[1]' },
  { label: '', instruction: 'READ', argument: '2', comment: '// read second number to memory[2]' },
  { label: '', instruction: 'LOAD', argument: '1', comment: '// load memory[1] to ACC' },
  { label: '', instruction: 'ADD', argument: '2', comment: '// add memory[2] to ACC' },
  { label: '', instruction: 'STORE', argument: '3', comment: '// store ACC to memory[3]' },
  { label: '', instruction: 'WRITE', argument: '3', comment: '// write memory[3] to output' },
  { label: '', instruction: 'HALT', argument: '', comment: '// end program' },
];

function App() {
  const [engineState, setEngineState] = useState(new RAMEngine());
  const [program, setProgram] = useState(initialProgram);
  const [isRunning, setIsRunning] = useState(false);
  const [flashAddr, setFlashAddr] = useState(-1);
  const engineRef = useRef(new RAMEngine());
  
  // Create an initial memory state copy to trigger re-renders
  const [memory, setMemory] = useState(Array(64).fill(0));
  const [inputTape, setInputTape] = useState([]);
  const [outputTape, setOutputTape] = useState([]);
  const [acc, setAcc] = useState(0);
  const [ip, setIp] = useState(0);
  const [error, setError] = useState(null);

  const syncState = () => {
    setMemory([...engineRef.current.memory]);
    setInputTape([...engineRef.current.inputTape]);
    setOutputTape([...engineRef.current.outputTape]);
    setAcc(engineRef.current.acc);
    setIp(engineRef.current.ip);
    setError(engineRef.current.error);
    if (engineRef.current.halted || engineRef.current.error) {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    engineRef.current.reset();
    engineRef.current.loadProgram(program, inputTape); // keep input tape or reset it? Let's keep it for now but maybe clear output
    engineRef.current.outputTape = [];
    setIsRunning(false);
    setError(null);
    setFlashAddr(-1);
    syncState();
  };

  const handleStep = () => {
    if (!engineRef.current.halted && !engineRef.current.error) {
      // Before step, remember memory to find diff for flashing
      const oldMem = [...engineRef.current.memory];
      
      engineRef.current.program = program; // update program in case it changed
      engineRef.current.step();
      
      // Find flashed address
      let changedAddr = -1;
      for (let i=0; i<engineRef.current.memory.length; i++) {
        if (engineRef.current.memory[i] !== oldMem[i]) {
          changedAddr = i;
          break;
        }
      }
      setFlashAddr(changedAddr);
      syncState();
      
      if (changedAddr !== -1) {
        setTimeout(() => setFlashAddr(-1), 500);
      }
    }
  };

  const handlePlayPause = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      if (engineRef.current.halted || engineRef.current.error) {
         handleReset();
      }
      engineRef.current.program = program;
      engineRef.current.labels = {};
      program.forEach((line, index) => {
        if (line.label && line.label.trim() !== '') {
          engineRef.current.labels[line.label.trim()] = index;
        }
      });
      setIsRunning(true);
    }
  };

  // Run loop
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

  const handleAddLine = () => {
    setProgram([...program, { label: '', instruction: '', argument: '', comment: '' }]);
  };

  const handleRemoveLine = (index) => {
    const newProg = [...program];
    newProg.splice(index, 1);
    setProgram(newProg);
  };

  const handleInputSubmit = (val) => {
    engineRef.current.inputTape.push(val);
    syncState();
  };

  const handleMemoryChange = (addr, val) => {
    engineRef.current.setMemory(addr, val);
    syncState();
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>RAM Machine Web</h1>
        <div className="controls">
          <button className="secondary"><FolderOpen size={18} /> Open</button>
          <button className="secondary"><Save size={18} /> Save</button>
          
          <div style={{width: '20px'}}></div>
          
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
