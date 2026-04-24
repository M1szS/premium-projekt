import React, { useState } from 'react';
import { Play, Send } from 'lucide-react';

export function ProcessorView({ engine, onInput }) {
  const [inputValue, setInputValue] = useState('');

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== '') {
      onInput(parseInt(inputValue, 10));
      setInputValue('');
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">Processor</div>
      <div className="panel-body processor-state">
        
        <div className="register">
          <div className="label">Instruction Pointer (IP)</div>
          <div className="value">{engine.ip}</div>
        </div>

        <div className="register">
          <div className="label">Accumulator (ACC)</div>
          <div className="value">{engine.acc}</div>
        </div>

        <div className="tape-section">
          <div className="label">Input Tape (READ)</div>
          <div className="tape">
            {engine.inputTape.map((val, i) => (
              <span key={i} className="tape-item">{val}</span>
            ))}
          </div>
          <form className="tape-input-wrapper" onSubmit={handleInputSubmit}>
            <input 
              type="number" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Add to input..."
            />
            <button type="submit"><Send size={16} /></button>
          </form>
        </div>

        <div className="tape-section">
          <div className="label">Output Tape (WRITE)</div>
          <div className="tape">
            {engine.outputTape.map((val, i) => (
              <span key={i} className="tape-item">{val}</span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
