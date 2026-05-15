// Plik: src/components/ProgramEditor.jsx
// Komponent edytora programu RAM: pozwala przeglądać i modyfikować
// listę instrukcji (etykieta, instrukcja, argument, komentarz).
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
      target = `wartość ${cleanArg.substring(1)}`;
    } else if (cleanArg.startsWith('*') || cleanArg.startsWith('^')) {
      target = `adresu wskazywanego przez adres ${cleanArg.substring(1)}`;
    } else if (cleanArg) {
      target = `adresu ${cleanArg}`;
    }

    switch (instruction) {
      case 'READ': return `// wczytaj dane do ${target || 'adresu'}`;
      case 'WRITE': return `// wypisz ${target || 'wartość'} na wyjście`;
      case 'LOAD': return `// ładuj ${target || 'wartość'} do ACC`;
      case 'STORE': return `// zapisz ACC do ${target || 'adresu'}`;
      case 'ADD': return `// dodaj ${target || 'wartość'} do ACC`;
      case 'SUB': return `// odejmij ${target || 'wartość'} od ACC`;
      case 'MULT': return `// pomnóż ACC przez ${target || 'wartość'}`;
      case 'DIV': return `// podziel ACC przez ${target || 'wartość'}`;
      case 'JUMP': return `// skocz do etykiety/linii ${cleanArg}`;
      case 'JGTZ': return `// skocz do ${cleanArg} jeśli ACC > 0`;
      case 'JZERO': return `// skocz do ${cleanArg} jeśli ACC == 0`;
      case 'HALT': return `// zatrzymaj program`;
      case 'NOP': return `// brak operacji`;
      default: return '';
    }
  };

  const handleChange = (index, field, value) => {
    const newProgram = [...program];
    const updatedLine = { ...newProgram[index], [field]: value };
    
    // Aktualizuje komentarz linii automatycznie po zmianie instrukcji/argumentu
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
            <div className="grid-header">Etykieta</div>
            <div className="grid-header">Instr</div>
            <div className="grid-header">Arg</div>
            <div className="grid-header">Komentarz</div>
          </div>
          
          {/* Rows */}
          {program.map((line, index) => (
            <div key={index} className={`grid-row ${activeLine === index ? 'active' : ''}`}>
              <div className="grid-cell ln">{index}</div>
              <div className="grid-cell">
                <input 
                  type="text" 
                  value={line.label || ''} 
                  onChange={(e) => handleChange(index, 'label', e.target.value)}
                  placeholder="ETYKIETA"
                />
              </div>
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
          <button onClick={onAddLine}><Plus size={14} /> Dodaj linię</button>
        </div>
      </div>
    </div>
  );
}
