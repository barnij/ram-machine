import {State} from './environment';
import {Ok} from './status';

export type Argument = Operandum | Label;

export class Operandum {
  constructor(public value: bigint) {}
  prettyPrint() {
    return '';
  }
}

export class Const extends Operandum {
  prettyPrint() {
    return '=' + this.value.toString();
  }
}
export class Address extends Operandum {
  prettyPrint() {
    return this.value.toString();
  }
}
export class Reference extends Operandum {
  prettyPrint() {
    return '^' + this.value.toString();
  }
}

export class Label {
  constructor(public value: string) {}
  prettyPrint() {
    return this.value;
  }
}

export type Instruction =
  | Load
  | Store
  | Add
  | Sub
  | Mult
  | Div
  | Read
  | Write
  | Jump
  | Jgtz
  | Jzero
  | Halt
  | Skip
  | Combine;

interface Interpreter {
  interp: (state: State) => Ok;
  prettyPrint: () => {name: string; argument: string};
  getLineNumber: () => number;
}

export class Load implements Interpreter {
  constructor(public argument: Operandum) {}
  line = -1;

  interp!: (state: State) => Ok;
  prettyPrint(): {name: string; argument: string} {
    return {name: 'load', argument: this.argument.prettyPrint()};
  }
  getLineNumber(): number {
    return this.line;
  }
}

export class Store implements Interpreter {
  constructor(public argument: Address | Reference) {}
  line = -1;

  interp!: (state: State) => Ok;
  prettyPrint(): {name: string; argument: string} {
    return {name: 'store', argument: this.argument.prettyPrint()};
  }
  getLineNumber(): number {
    return this.line;
  }
}

export class Add implements Interpreter {
  constructor(public argument: Operandum) {}
  line = -1;

  interp!: (state: State) => Ok;
  prettyPrint(): {name: string; argument: string} {
    return {name: 'add', argument: this.argument.prettyPrint()};
  }
  getLineNumber(): number {
    return this.line;
  }
}

export class Sub implements Interpreter {
  constructor(public argument: Operandum) {}
  line = -1;

  interp!: (state: State) => Ok;
  prettyPrint(): {name: string; argument: string} {
    return {name: 'sub', argument: this.argument.prettyPrint()};
  }
  getLineNumber(): number {
    return this.line;
  }
}

export class Mult implements Interpreter {
  constructor(public argument: Operandum) {}
  line = -1;

  interp!: (state: State) => Ok;
  prettyPrint(): {name: string; argument: string} {
    return {name: 'mult', argument: this.argument.prettyPrint()};
  }
  getLineNumber(): number {
    return this.line;
  }
}

export class Div implements Interpreter {
  constructor(public argument: Operandum) {}
  line = -1;

  interp!: (state: State) => Ok;
  prettyPrint(): {name: string; argument: string} {
    return {name: 'div', argument: this.argument.prettyPrint()};
  }
  getLineNumber(): number {
    return this.line;
  }
}

export class Read implements Interpreter {
  constructor(public argument: Address | Reference) {}
  line = -1;

  interp!: (state: State) => Ok;
  prettyPrint(): {name: string; argument: string} {
    return {name: 'read', argument: this.argument.prettyPrint()};
  }
  getLineNumber(): number {
    return this.line;
  }
}

export class Write implements Interpreter {
  constructor(public argument: Operandum) {}
  line = -1;

  interp!: (state: State) => Ok;
  prettyPrint(): {name: string; argument: string} {
    return {name: 'write', argument: this.argument.prettyPrint()};
  }
  getLineNumber(): number {
    return this.line;
  }
}

export class Jump implements Interpreter {
  constructor(public argument: Label) {}
  line = -1;

  interp!: (state: State) => Ok;
  prettyPrint(): {name: string; argument: string} {
    return {name: 'jump', argument: this.argument.prettyPrint()};
  }
  getLineNumber(): number {
    return this.line;
  }
}

export class Jgtz implements Interpreter {
  constructor(public argument: Label) {}
  line = -1;

  interp!: (state: State) => Ok;
  prettyPrint(): {name: string; argument: string} {
    return {name: 'jgtz', argument: this.argument.prettyPrint()};
  }
  getLineNumber(): number {
    return this.line;
  }
}

export class Jzero implements Interpreter {
  constructor(public argument: Label) {}
  line = -1;

  interp!: (state: State) => Ok;
  prettyPrint(): {name: string; argument: string} {
    return {name: 'jzero', argument: this.argument.prettyPrint()};
  }
  getLineNumber(): number {
    return this.line;
  }
}

export class Halt implements Interpreter {
  line = -1;

  interp!: (state: State) => Ok;
  prettyPrint(): {name: string; argument: string} {
    return {name: 'halt', argument: ''};
  }
  getLineNumber(): number {
    return this.line;
  }
}
export class Skip implements Interpreter {
  line = -1;

  interp!: (state: State) => Ok;
  prettyPrint(): {name: string; argument: string} {
    return {name: '', argument: ''};
  }
  getLineNumber(): number {
    return this.line;
  }
}

export class Combine implements Interpreter {
  constructor(
    public instruction: Instruction,
    public nextInstruction: Instruction
  ) {}
  line = -1;

  interp!: (state: State) => Ok;
  prettyPrint(): {name: string; argument: string} {
    return this.instruction.prettyPrint();
  }
  getLineNumber(): number {
    return this.instruction.line;
  }
}

export class Program {
  constructor(
    public labels: Map<string, Instruction>,
    public programTree: Instruction
  ) {}
}
