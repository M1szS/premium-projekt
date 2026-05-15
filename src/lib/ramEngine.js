// Plik: src/lib/ramEngine.js
// Implementacja prostego silnika RAM: pamięć, akumulator (ACC),
// wskaźnik instrukcji (IP), taśmy wejścia/wyjścia oraz wykonanie instrukcji.
export class RAMEngine {
  constructor() {
    // Inicjalizacja silnika
    this.reset();
  }

  // Przywraca stan początkowy silnika
  reset() {
    this.memory = Array(64).fill(0); // Domyślny rozmiar pamięci, można rozszerzać
    this.acc = 0;
    this.ip = 0;
    this.inputTape = [];
    this.outputTape = [];
    this.program = []; // Tablica linii programu { ln, label, instruction, argument, comment }
    this.labels = {}; // Mapa etykiet -> numer linii
    this.halted = false;
    this.error = null;
  }

  // Ładuje program i opcjonalną taśmę wejściową; parsuje etykiety
  loadProgram(programData, inputData = []) {
    this.reset();
    this.program = programData;
    this.inputTape = [...inputData];
    
    // Parsowanie etykiet w programie
    this.program.forEach((line, index) => {
      if (line.label && line.label.trim() !== '') {
        this.labels[line.label.trim()] = index;
      }
    });
  }

  // Pobiera wartość z argumentu: stała (=x), bezpośrednio z pamięci (n),
  // lub pośrednio przez wskaźnik (*n lub ^n).
  getValue(arg) {
    if (!arg) return 0;
    arg = arg.trim();
    if (arg.startsWith('=')) {
      return parseInt(arg.substring(1), 10);
    } else if (arg.startsWith('*') || arg.startsWith('^')) {
      const addr = parseInt(arg.substring(1), 10);
      if (addr < 0) throw new Error(`Invalid address: ${addr}`);
      const pointerAddr = this.memory[addr] || 0;
      if (pointerAddr < 0) throw new Error(`Invalid indirect address: ${pointerAddr}`);
      return this.memory[pointerAddr] || 0;
    } else {
      const addr = parseInt(arg, 10);
      if (addr < 0) throw new Error(`Invalid address: ${addr}`);
      return this.memory[addr] || 0;
    }
  }

  // Zwraca adres docelowy do zapisu: obsługuje bezpośredni i pośredni zapis
  getAddress(arg) {
    if (!arg) throw new Error("Missing argument");
    arg = arg.trim();
    if (arg.startsWith('=')) {
      throw new Error("Cannot store to constant");
    } else if (arg.startsWith('*') || arg.startsWith('^')) {
      const addr = parseInt(arg.substring(1), 10);
      if (addr < 0) throw new Error(`Invalid address: ${addr}`);
      const pointerAddr = this.memory[addr] || 0;
      if (pointerAddr < 0) throw new Error(`Invalid indirect address: ${pointerAddr}`);
      return pointerAddr;
    } else {
      const addr = parseInt(arg, 10);
      if (addr < 0) throw new Error(`Invalid address: ${addr}`);
      return addr;
    }
  }

  // Ustawia wartość w pamięci pod adresem `addr`, rozszerzając pamięć jeśli potrzeba
  setMemory(addr, val) {
    if (addr >= this.memory.length) {
      // Rozszerz pamięć w razie potrzeby
      const newMem = Array(Math.max(addr + 1, this.memory.length * 2)).fill(0);
      for (let i = 0; i < this.memory.length; i++) {
        newMem[i] = this.memory[i];
      }
      this.memory = newMem;
    }
    this.memory[addr] = val;
  }

  // Wykonuje jedną instrukcję programu. Zwraca true jeśli wykonanie przebiegło (lub zakończyło się błędem).
  step() {
    if (this.halted || this.error) return false;
    if (this.ip < 0 || this.ip >= this.program.length) {
      this.halted = true;
      return false;
    }

    const currentLine = this.program[this.ip];
    const inst = (currentLine.instruction || '').toUpperCase().trim();
    const arg = currentLine.argument;

    try {
      switch (inst) {
          case 'READ': {
           const addr = this.getAddress(arg);
           if (this.inputTape.length === 0) {
             // Jeśli brak danych na taśmie wejściowej: zapisujemy 0 (łatwiejsze w testach)
             this.setMemory(addr, 0);
           } else {
             const val = this.inputTape.shift();
             this.setMemory(addr, val);
           }
           this.ip++;
           break;
          }
        case 'WRITE': {
          const val = this.getValue(arg);
          this.outputTape.push(val);
          this.ip++;
          break;
        }
        case 'LOAD': {
          this.acc = this.getValue(arg);
          this.ip++;
          break;
        }
        case 'STORE': {
          const addr = this.getAddress(arg);
          this.setMemory(addr, this.acc);
          this.ip++;
          break;
        }
        case 'ADD': {
          this.acc += this.getValue(arg);
          this.ip++;
          break;
        }
        case 'SUB': {
          this.acc -= this.getValue(arg);
          this.ip++;
          break;
        }
        case 'MULT': {
          this.acc *= this.getValue(arg);
          this.ip++;
          break;
        }
        case 'DIV': {
          const val = this.getValue(arg);
          if (val === 0) throw new Error("Division by zero");
          this.acc = Math.floor(this.acc / val); // Integer division
          this.ip++;
          break;
        }
        case 'JUMP': {
          if (this.labels[arg] === undefined) throw new Error(`Label not found: ${arg}`);
          this.ip = this.labels[arg];
          break;
        }
        case 'JGTZ': {
          if (this.acc > 0) {
            if (this.labels[arg] === undefined) throw new Error(`Label not found: ${arg}`);
            this.ip = this.labels[arg];
          } else {
            this.ip++;
          }
          break;
        }
        case 'JZERO': {
          if (this.acc === 0) {
            if (this.labels[arg] === undefined) throw new Error(`Label not found: ${arg}`);
            this.ip = this.labels[arg];
          } else {
            this.ip++;
          }
          break;
        }
        case 'HALT': {
          // Zatrzymanie programu
          this.halted = true;
          break;
        }
        case '': // Empty instruction
        case 'NOP': {
          this.ip++;
          break;
        }
        default:
          throw new Error(`Unknown instruction: ${inst}`);
      }
    } catch (e) {
      this.error = e.message;
      this.halted = true;
    }
    
    // Auto halt if reached end
    if (this.ip >= this.program.length && !this.halted) {
      this.halted = true;
    }
    
    return true;
  }
}
