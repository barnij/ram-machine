import {RegisterError, RuntimeError, LabelError} from './errors';
import {State, Environment} from './environment';
import {Ok} from './status';
export const ACCUMULATOR = BigInt(0);

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

  interp(state: State): Ok {
    const arg: Operandum = this.argument;
    switch (arg.constructor) {
      case Const:
        state.environment.registers.set(ACCUMULATOR, arg.value);
        return new Ok();
      case Address: {
        const value = state.environment.registers.get(arg.value);
        if (value == null) {
          throw new RegisterError('empty register nr ' + arg.value);
        }
        state.environment.registers.set(ACCUMULATOR, value);
        return new Ok();
      }
      case Reference: {
        let value = state.environment.registers.get(arg.value);
        if (value == null) {
          throw new RegisterError('empty register nr ' + arg.value);
        }
        value = state.environment.registers.get(value);
        if (value == null) {
          throw new RegisterError('empty register nr ' + value);
        }
        state.environment.registers.set(ACCUMULATOR, value);
        return new Ok();
      }
      default:
        return new RuntimeError('invalid argumetn in instruction load');
    }
  }
}

export class Store {
  constructor(public argument: Address | Reference) {}

  interp(state: State): Ok {
    const arg: Address | Reference = this.argument;
    switch (arg.constructor) {
      case Address: {
        const value = state.environment.registers.get(ACCUMULATOR);
        if (value == null) {
          throw new RegisterError('empty register nr ' + ACCUMULATOR);
        }
        state.environment.registers.set(arg.value, value);
        return new Ok();
      }
      case Reference: {
        const accValue = state.environment.registers.get(ACCUMULATOR);
        if (accValue == null) {
          throw new RegisterError('empty register nr ' + ACCUMULATOR);
        }
        let value = state.environment.registers.get(arg.value);
        if (value == null) {
          throw new RegisterError('empty register nr ' + arg.value);
        }
        value = state.environment.registers.get(value);
        if (value == null) {
          throw new RegisterError('empty register nr ' + value);
        }
        state.environment.registers.set(value, accValue);
        return new Ok();
      }
      default:
        return new RuntimeError('invalid argumetn in instruction load');
    }
  }
}

export class Add {
  constructor(public argument: Operandum) {}

  interp(state: State): Ok {
    const accValue = state.environment.registers.get(ACCUMULATOR);
    if (accValue == null) {
      throw new RuntimeError('empty register nr ' + ACCUMULATOR);
    }
    const arg: Operandum = this.argument;
    switch (arg.constructor) {
      case Const:
        state.environment.registers.set(ACCUMULATOR, accValue + arg.value);
        return new Ok();
      case Address: {
        const value = state.environment.registers.get(arg.value);
        if (value == null) {
          throw new RegisterError('empty register nr ' + arg.value);
        }
        state.environment.registers.set(ACCUMULATOR, accValue + value);
        return new Ok();
      }
      case Reference: {
        let value = state.environment.registers.get(arg.value);
        if (value == null) {
          throw new RegisterError('empty register nr ' + arg.value);
        }
        value = state.environment.registers.get(value);
        if (value == null) {
          throw new RegisterError('empty register nr ' + value);
        }
        state.environment.registers.set(ACCUMULATOR, accValue + value);
        return new Ok();
      }
      default:
        return new RuntimeError('invalid argumetn in instruction load');
    }
  }
}

export class Sub {
  constructor(public argument: Operandum) {}

  interp(state: State): Ok {
    const accValue = state.environment.registers.get(ACCUMULATOR);
    if (accValue == null) {
      throw new RuntimeError('empty register nr ' + ACCUMULATOR);
    }
    const arg: Operandum = this.argument;
    switch (arg.constructor) {
      case Const:
        state.environment.registers.set(ACCUMULATOR, accValue - arg.value);
        return new Ok();
      case Address: {
        const value = state.environment.registers.get(arg.value);
        if (value == null) {
          throw new RegisterError('empty register nr ' + arg.value);
        }
        state.environment.registers.set(ACCUMULATOR, accValue - value);
        return new Ok();
      }
      case Reference: {
        let value = state.environment.registers.get(arg.value);
        if (value == null) {
          throw new RegisterError('empty register nr ' + arg.value);
        }
        value = state.environment.registers.get(value);
        if (value == null) {
          throw new RegisterError('empty register nr ' + value);
        }
        state.environment.registers.set(ACCUMULATOR, accValue - value);
        return new Ok();
      }
      default:
        return new RuntimeError('invalid argumetn in instruction load');
    }
  }
}

export class Mult {
  constructor(public argument: Operandum) {}

  interp(state: State): Ok {
    const accValue = state.environment.registers.get(ACCUMULATOR);
    if (accValue == null) {
      throw new RuntimeError('empty register nr ' + ACCUMULATOR);
    }
    const arg: Operandum = this.argument;
    switch (arg.constructor) {
      case Const:
        state.environment.registers.set(ACCUMULATOR, accValue * arg.value);
        return new Ok();
      case Address: {
        const value = state.environment.registers.get(arg.value);
        if (value == null) {
          throw new RegisterError('empty register nr ' + arg.value);
        }
        state.environment.registers.set(ACCUMULATOR, accValue * value);
        return new Ok();
      }
      case Reference: {
        let value = state.environment.registers.get(arg.value);
        if (value == null) {
          throw new RegisterError('empty register nr ' + arg.value);
        }
        value = state.environment.registers.get(value);
        if (value == null) {
          throw new RegisterError('empty register nr ' + value);
        }
        state.environment.registers.set(ACCUMULATOR, accValue * value);
        return new Ok();
      }
      default:
        return new RuntimeError('invalid argumetn in instruction load');
    }
  }
}

export class Div {
  constructor(public argument: Operandum) {}

  interp(state: State): Ok {
    const accValue = state.environment.registers.get(ACCUMULATOR);
    if (accValue == null) {
      throw new RuntimeError('empty register nr ' + ACCUMULATOR);
    }
    const arg: Operandum = this.argument;
    switch (arg.constructor) {
      case Const:
        if (arg.value === BigInt(0)) {
          throw new RuntimeError('division by 0');
        }
        state.environment.registers.set(ACCUMULATOR, accValue / arg.value);
        return new Ok();
      case Address: {
        const value = state.environment.registers.get(arg.value);
        if (value == null) {
          throw new RegisterError('empty register nr ' + arg.value);
        }
        if (value === BigInt(0)) {
          throw new RuntimeError('division by 0');
        }
        state.environment.registers.set(ACCUMULATOR, accValue / value);
        return new Ok();
      }
      case Reference: {
        let value = state.environment.registers.get(arg.value);
        if (value == null) {
          throw new RegisterError('empty register nr ' + arg.value);
        }
        value = state.environment.registers.get(value);
        if (value == null) {
          throw new RegisterError('empty register nr ' + value);
        }
        if (value === BigInt(0)) {
          throw new RuntimeError('division by 0');
        }
        state.environment.registers.set(ACCUMULATOR, accValue / value);
        return new Ok();
      }
      default:
        return new RuntimeError('invalid argumetn in instruction load');
    }
  }
}

export class Read {
  constructor(public argument: Address | Reference) {}

  interp(state: State): Ok {
    const arg: Address | Reference = this.argument;
    switch (arg.constructor) {
      case Address: {
        const value = state.environment.input.read();
        state.environment.registers.set(arg.value, value);
        return new Ok();
      }
      case Reference: {
        const readValue = state.environment.input.read();
        let value = state.environment.registers.get(arg.value);
        if (value == null) {
          throw new RegisterError('empty register nr ' + arg.value);
        }
        value = state.environment.registers.get(value);
        if (value == null) {
          throw new RegisterError('empty register nr ' + value);
        }
        state.environment.registers.set(value, readValue);
        return new Ok();
      }
      default:
        return new RuntimeError('invalid argumetn in instruction load');
    }
  }
}

export class Write {
  constructor(public argument: Operandum) {}

  interp(state: State): Ok {
    const arg: Operandum = this.argument;
    switch (arg.constructor) {
      case Const:
        state.environment.output.write(arg.value);
        return new Ok();
      case Address: {
        const value = state.environment.registers.get(arg.value);
        if (value == null) {
          throw new RegisterError('empty register nr ' + arg.value);
        }
        state.environment.output.write(value);
        return new Ok();
      }
      case Reference: {
        let value = state.environment.registers.get(arg.value);
        if (value == null) {
          throw new RegisterError('empty register nr ' + arg.value);
        }
        value = state.environment.registers.get(value);
        if (value == null) {
          throw new RegisterError('empty register nr ' + value);
        }
        state.environment.output.write(value);
        return new Ok();
      }
      default:
        return new RuntimeError('invalid argumetn in instruction load');
    }
  }
}

export class Jump {
  constructor(public argument: Label) {}

  interp(state: State): Ok {
    const arg: Label = this.argument;
    const jumpTarget = state.program.labels.get(arg.value);
    if (jumpTarget == null) {
      throw new LabelError('unrecognized label ' + arg.value);
    } else {
      state.nextInstruction = jumpTarget;
      return new Ok();
    }
  }
}

export class Jgtz {
  constructor(public argument: Label) {}

  interp(state: State): Ok {
    const arg: Label = this.argument;
    const jumpTarget = state.program.labels.get(arg.value);
    if (jumpTarget == null) {
      throw new LabelError('unrecognized label ' + arg.value);
    } else {
      const value = state.environment.registers.get(ACCUMULATOR);
      if (value == null) {
        throw new RegisterError('empty register nr ' + arg.value);
      } else if (value > BigInt(0)) {
        state.nextInstruction = jumpTarget;
      }
      return new Ok();
    }
  }
}

export class Jzero {
  constructor(public argument: Label) {}

  interp(state: State): Ok {
    const arg: Label = this.argument;
    const jumpTarget = state.program.labels.get(arg.value);
    if (jumpTarget == null) {
      throw new LabelError('unrecognized label ' + arg.value);
    } else {
      const value = state.environment.registers.get(ACCUMULATOR);
      if (value == null) {
        throw new RegisterError('empty register nr ' + arg.value);
      } else if (value === BigInt(0)) {
        state.nextInstruction = jumpTarget;
      }
      return new Ok();
    }
  }
}

export class Halt {
  interp(state: State): Ok {
    state.completed = true;
    return new Ok();
  }
}
export class Skip {
  interp(state: State) {
    return new Ok();
  }
}

export class Combine {
  constructor(
    public instruction: Instruction,
    public nextInstruction: Instruction
  ) {}

  interp(state: State): Ok {
    state.nextInstruction = this.nextInstruction;
    return this.instruction.interp(state);
  }
}

export class Program {
  constructor(
    public labels: Map<string, Instruction>,
    public programTree: Instruction
  ) {}
}
