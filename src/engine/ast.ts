import {State} from './environment';
import {Ok} from './status';

export type Argument = Operandum | Label;

export class Operandum {
  constructor(public value: bigint) {}
}

export class Const extends Operandum {}
export class Address extends Operandum {}
export class Reference extends Operandum {}

export class Label {
  constructor(public value: string) {}
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
}

export class Load implements Interpreter {
  constructor(public argument: Operandum) {}

  interp!: (state: State) => Ok;
}

export class Store implements Interpreter {
  constructor(public argument: Address | Reference) {}

  interp!: (state: State) => Ok;
}

export class Add implements Interpreter {
  constructor(public argument: Operandum) {}

  interp!: (state: State) => Ok;
}

export class Sub implements Interpreter {
  constructor(public argument: Operandum) {}

  interp!: (state: State) => Ok;
}

export class Mult implements Interpreter {
  constructor(public argument: Operandum) {}

  interp!: (state: State) => Ok;
}

export class Div implements Interpreter {
  constructor(public argument: Operandum) {}

  interp!: (state: State) => Ok;
}

export class Read implements Interpreter {
  constructor(public argument: Address | Reference) {}

  interp!: (state: State) => Ok;
}

export class Write implements Interpreter {
  constructor(public argument: Operandum) {}

  interp!: (state: State) => Ok;
}

export class Jump implements Interpreter {
  constructor(public argument: Label) {}

  interp!: (state: State) => Ok;
}

export class Jgtz implements Interpreter {
  constructor(public argument: Label) {}

  interp!: (state: State) => Ok;
}

export class Jzero implements Interpreter {
  constructor(public argument: Label) {}

  interp!: (state: State) => Ok;
}

export class Halt implements Interpreter {
  interp!: (state: State) => Ok;
}
export class Skip implements Interpreter {
  interp!: (state: State) => Ok;
}

export class Combine implements Interpreter {
  constructor(
    public instruction: Instruction,
    public nextInstruction: Instruction
  ) {}

  interp!: (state: State) => Ok;
}

export class Program {
  constructor(
    public labels: Map<string, Instruction>,
    public programTree: Instruction
  ) {}
}
