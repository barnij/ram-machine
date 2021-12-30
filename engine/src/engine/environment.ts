import {InputError} from './errors';
import {Instruction, Program} from './ast';

export class State {
  nextInstruction: Instruction;
  completed = false;
  constructor(
    public program: Program,
    public environment: Environment,
    public breakpoints: Set<number>
  ) {
    this.nextInstruction = program.programTree;
  }
}

export class Environment {
  input: InputTape;
  output = new OutputTape();
  registers: Map<bigint, bigint> = new Map<bigint, bigint>();
  constructor(inputValues: bigint[]) {
    this.input = new InputTape(inputValues);
  }
}

class InputTape {
  private nextIndex = 0;
  constructor(private values: bigint[]) {}

  read(): bigint {
    if (this.values[this.nextIndex] == null) {
      throw new InputError();
    }
    this.nextIndex++;
    return this.values[this.nextIndex - 1];
  }
}

class OutputTape {
  values: bigint[] = [];

  write(value: bigint) {
    this.values.push(value);
  }
}
