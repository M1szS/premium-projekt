import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export function ProgramEditor({ program, activeLine, onChange, onAddLine, onRemoveLine }) {
  
  const handleChange = (index, field, value) => {
    const newProgram = [...program];
    newProgram[index] = { ...newProgram[index], [field]: value };
    onChange(newProgram);
  };

  return (
    <div className="panel">
      <div className="panel-header">Program Editor</div>
      <div className="panel-body">
        <div className="editor-grid">
          {/* Header */}
          <div className="grid-row">
            <div className="grid-header">LN</div>
            <div className="grid-header">Label</div>
            <div className="grid-header">Instr</div>
            <div className="grid-header">Arg</div>
            <div className="grid-header">Comment</div>
          </div>
          
          {/* Rows */}
          {program.map((line, index) => (
            <div key={index} className={`grid-row ${activeLine === index ? 'active' : ''}`}>
              <div className="grid-cell ln">{index}</div>
              <div className="grid-cell">
                <input 
                  type="text" 
                  value={line.label} 
                  onChange={(e) => handleChange(index, 'label', e.target.value)}
                  placeholder="LBL"
                />
              </div>
              <div className="grid-cell">
                <input 
                  type="text" 
                  value={line.instruction} 
                  onChange={(e) => handleChange(index, 'instruction', e.target.value)}
                  placeholder="ADD"
                />
              </div>
              <div className="grid-cell">
                <input 
                  type="text" 
                  value={line.argument} 
                  onChange={(e) => handleChange(index, 'argument', e.target.value)}
                  placeholder="=10"
                />
              </div>
              <div className="grid-cell" style={{ display: 'flex' }}>
                <input 
                  type="text" 
                  value={line.comment} 
                  onChange={(e) => handleChange(index, 'comment', e.target.value)}
                  placeholder="// Comment"
                  style={{ flex: 1 }}
                />
                <button 
                  onClick={() => onRemoveLine(index)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--error-color)', cursor: 'pointer', padding: '0 0.5rem' }}
                  title="Remove Line"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="editor-actions">
          <button onClick={onAddLine}><Plus size={14} /> Add Line</button>
        </div>
      </div>
    </div>
  );
}
