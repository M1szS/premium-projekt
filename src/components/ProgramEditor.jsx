import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const INSTRUCTIONS = [
  'READ', 'WRITE', 'LOAD', 'STORE', 'ADD', 'SUB', 'MULT', 'DIV', 'JUMP', 'JGTZ', 'JZERO', 'HALT', 'NOP'
];

export function ProgramEditor({ program, activeLine, onChange, onAddLine, onRemoveLine }) {
  
  const getAutoComment = (inst, arg) => {
    if (!inst) return '';
    const instruction = inst.toUpperCase();
    const cleanArg = arg ? arg.trim() : '';
    
    let target = '';
    if (cleanArg.startsWith('=')) {
      target = `value ${cleanArg.substring(1)}`;
    } else if (cleanArg.startsWith('*') || cleanArg.startsWith('^')) {
      target = `address pointed to by address ${cleanArg.substring(1)}`;
    } else if (cleanArg) {
      target = `address ${cleanArg}`;
    }

    switch (instruction) {
      case 'READ': return `// read input to ${target || 'address'}`;
      case 'WRITE': return `// write ${target || 'value'} to output`;
      case 'LOAD': return `// load ${target || 'value'} to accumulator`;
      case 'STORE': return `// store accumulator to ${target || 'address'}`;
      case 'ADD': return `// add ${target || 'value'} to accumulator`;
      case 'SUB': return `// subtract ${target || 'value'} from accumulator`;
      case 'MULT': return `// multiply accumulator by ${target || 'value'}`;
      case 'DIV': return `// divide accumulator by ${target || 'value'}`;
      case 'JUMP': return `// jump to label/line ${cleanArg}`;
      case 'JGTZ': return `// jump to ${cleanArg} if ACC > 0`;
      case 'JZERO': return `// jump to ${cleanArg} if ACC == 0`;
      case 'HALT': return `// halt program execution`;
      case 'NOP': return `// no operation`;
      default: return '';
    }
  };

  const handleChange = (index, field, value) => {
    const newProgram = [...program];
    const updatedLine = { ...newProgram[index], [field]: value };
    
    // Update comment automatically
    if (field === 'instruction' || field === 'argument') {
      updatedLine.comment = getAutoComment(updatedLine.instruction, updatedLine.argument);
    }
    
    newProgram[index] = updatedLine;
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
            <div className="grid-header">Instr</div>
            <div className="grid-header">Arg</div>
            <div className="grid-header">Comment</div>
          </div>
          
          {/* Rows */}
          {program.map((line, index) => (
            <div key={index} className={`grid-row ${activeLine === index ? 'active' : ''}`}>
              <div className="grid-cell ln">{index}</div>
              <div className="grid-cell">
                <select 
                  className="instr-select"
                  value={line.instruction} 
                  onChange={(e) => handleChange(index, 'instruction', e.target.value)}
                >
                  <option value="">--</option>
                  {INSTRUCTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="grid-cell">
                <input 
                  type="text" 
                  value={line.argument} 
                  onChange={(e) => handleChange(index, 'argument', e.target.value)}
                  placeholder="=10"
                />
              </div>
              <div className="grid-cell" style={{ display: 'flex', alignItems: 'center' }}>
                <div className="static-comment" style={{ flex: 1, padding: '0 0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
                  {line.comment || getAutoComment(line.instruction, line.argument)}
                </div>
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
