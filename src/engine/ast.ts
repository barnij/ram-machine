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
}

export class Store {
  constructor(public argument: Address | Reference) {}
}

export class Add {
  constructor(public argument: Operandum) {}
}

export class Sub {
  constructor(public argument: Operandum) {}
}

export class Mult {
  constructor(public argument: Operandum) {}
}

export class Div {
  constructor(public argument: Operandum) {}
}

export class Read {
  constructor(public argument: Address | Reference) {}
}

export class Write {
  constructor(public argument: Operandum) {}
}

export class Jump {
  constructor(public argument: Label) {}
}

export class Jgtz {
  constructor(public argument: Label) {}
}

export class Jzero {
  constructor(public argument: Label) {}
}

export class Halt {}
export class Skip {}

export class Combine {
  constructor(
    public instruction: Instruction,
    public nextInstruction: Instruction
  ) {}
}

export class Program {
  constructor(
    public labels: Map<string, Instruction>,
    public programTree: Instruction
  ) {}
}
