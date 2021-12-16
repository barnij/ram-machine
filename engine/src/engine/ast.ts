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

interface Interpreter {
  interp: (state: State) => Ok;
  prettyPrint: () => {name: string; argument: string};
  getLineNumber: () => number;
}

export const NODE_GENERATED = -1;
export abstract class Instruction implements Interpreter {
  interp!: (state: State) => Ok;
  abstract prettyPrint(): {name: string; argument: string};

  line = NODE_GENERATED;
  getLineNumber(): number {
    return this.line;
  }
}

export class Load extends Instruction {
  constructor(public argument: Operandum) {
    super();
  }

  prettyPrint(): {name: string; argument: string} {
    return {name: 'load', argument: this.argument.prettyPrint()};
  }
}

export class Store extends Instruction {
  constructor(public argument: Address | Reference) {
    super();
  }

  prettyPrint(): {name: string; argument: string} {
    return {name: 'store', argument: this.argument.prettyPrint()};
  }
}

export class Add extends Instruction {
  constructor(public argument: Operandum) {
    super();
  }

  prettyPrint(): {name: string; argument: string} {
    return {name: 'add', argument: this.argument.prettyPrint()};
  }
}

export class Sub extends Instruction {
  constructor(public argument: Operandum) {
    super();
  }

  prettyPrint(): {name: string; argument: string} {
    return {name: 'sub', argument: this.argument.prettyPrint()};
  }
}

export class Mult extends Instruction {
  constructor(public argument: Operandum) {
    super();
  }

  prettyPrint(): {name: string; argument: string} {
    return {name: 'mult', argument: this.argument.prettyPrint()};
  }
}

export class Div extends Instruction {
  constructor(public argument: Operandum) {
    super();
  }

  prettyPrint(): {name: string; argument: string} {
    return {name: 'div', argument: this.argument.prettyPrint()};
  }
}

export class Read extends Instruction {
  constructor(public argument: Address | Reference) {
    super();
  }

  prettyPrint(): {name: string; argument: string} {
    return {name: 'read', argument: this.argument.prettyPrint()};
  }
}

export class Write extends Instruction {
  constructor(public argument: Operandum) {
    super();
  }

  prettyPrint(): {name: string; argument: string} {
    return {name: 'write', argument: this.argument.prettyPrint()};
  }
}

export class Jump extends Instruction {
  constructor(public argument: Label) {
    super();
  }

  prettyPrint(): {name: string; argument: string} {
    return {name: 'jump', argument: this.argument.prettyPrint()};
  }
}

export class Jgtz extends Instruction {
  constructor(public argument: Label) {
    super();
  }

  prettyPrint(): {name: string; argument: string} {
    return {name: 'jgtz', argument: this.argument.prettyPrint()};
  }
}

export class Jzero extends Instruction {
  constructor(public argument: Label) {
    super();
  }

  prettyPrint(): {name: string; argument: string} {
    return {name: 'jzero', argument: this.argument.prettyPrint()};
  }
}

export class Halt extends Instruction {
  prettyPrint(): {name: string; argument: string} {
    return {name: 'halt', argument: ''};
  }
}
export class Skip extends Instruction {
  prettyPrint(): {name: string; argument: string} {
    return {name: '', argument: ''};
  }
}

export class Combine extends Instruction {
  constructor(
    public instruction: Instruction,
    public nextInstruction: Instruction
  ) {
    super();
  }
  prettyPrint(): {name: string; argument: string} {
    if (this.instruction instanceof Skip)
      return this.nextInstruction.prettyPrint();
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
