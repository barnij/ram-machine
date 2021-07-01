import {InputError} from './errors';
import {Instruction, Program} from './ast';

export class State {
  nextInstruction: Instruction;
  completed = false;
  constructor(public program: Program, public environmet: Environment) {
    this.nextInstruction = program.programTree;
  }
}

export class Environment {
  input: InputTape;
  output = new OutputTape();
  registers: Map<BigInt, BigInt> = new Map<BigInt, BigInt>();
  constructor(inputValues: BigInt[]) {
    this.input = new InputTape(inputValues);
  }
}

class InputTape {
  private nextIndex = 0;
  constructor(private values: BigInt[]) {}

  read(): BigInt {
    /* eslint-disable-next-line eqeqeq */
    if (this.values[this.nextIndex] == null) {
      throw new InputError();
    }
    this.nextIndex++;
    return this.values[this.nextIndex - 1];
  }
}

class OutputTape {
  private values: BigInt[] = [];

  write(value: BigInt) {
    this.values.push(value);
  }
}
