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
  constructor(inputValues: (bigint | null)[]) {
    this.input = new InputTape(inputValues);
  }
}

class InputTape {
  private nextIndex = 0;
  constructor(private values: (bigint | null)[]) {}

  nextInput() {
    return this.nextIndex;
  }

  read(line: number): bigint {
    const ret = this.values[this.nextIndex];
    this.nextIndex++;
    if (ret != null) {
      return ret;
    } else {
      throw new InputError(line, 'empty input', this.nextIndex);
    }
  }
}

class OutputTape {
  values: bigint[] = [];

  nextOutput() {
    return this.values.length;
  }

  write(value: bigint) {
    this.values.push(value);
  }
}
