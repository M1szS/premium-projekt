// Plik: src/components/MemoryGrid.jsx
// Widok pamięci: siatka adresów i wartości. Pozwala edytować komórki.
import React from 'react';

export function MemoryGrid({ memory, flashAddress, onMemoryChange }) {
  // Rysuje tyle wierszy, ile aktualnie ma pamięć (tablica `memory`).

  return (
    <div className="panel">
      <div className="panel-header">Memory</div>
      <div className="panel-body">
        <div className="memory-grid">
          <div className="grid-row">
            <div className="mem-header">Address</div>
            <div className="mem-header">Value</div>
          </div>
          
          {memory.map((val, addr) => (
            <div key={addr} className={`mem-row ${flashAddress === addr ? 'flash' : ''}`}>
              <div className="mem-cell addr">{addr}</div>
              <div className="mem-cell">
                <input 
                  type="number" 
                  value={val} 
                  onChange={(e) => onMemoryChange(addr, parseInt(e.target.value, 10) || 0)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
