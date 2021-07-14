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

export class Load {
  constructor(public argument: Operandum) {}

  interp!: (state: State) => Ok;
}

export class Store {
  constructor(public argument: Address | Reference) {}

  interp!: (state: State) => Ok;
}

export class Add {
  constructor(public argument: Operandum) {}

  interp!: (state: State) => Ok;
}

export class Sub {
  constructor(public argument: Operandum) {}

  interp!: (state: State) => Ok;
}

export class Mult {
  constructor(public argument: Operandum) {}

  interp!: (state: State) => Ok;
}

export class Div {
  constructor(public argument: Operandum) {}

  interp!: (state: State) => Ok;
}

export class Read {
  constructor(public argument: Address | Reference) {}

  interp!: (state: State) => Ok;
}

export class Write {
  constructor(public argument: Operandum) {}

  interp!: (state: State) => Ok;
}

export class Jump {
  constructor(public argument: Label) {}

  interp!: (state: State) => Ok;
}

export class Jgtz {
  constructor(public argument: Label) {}

  interp!: (state: State) => Ok;
}

export class Jzero {
  constructor(public argument: Label) {}

  interp!: (state: State) => Ok;
}

export class Halt {
  interp!: (state: State) => Ok;
}
export class Skip {
  interp!: (state: State) => Ok;
}

export class Combine {
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
