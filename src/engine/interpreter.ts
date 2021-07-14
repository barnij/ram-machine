import * as ast from './ast';
import * as inst from './instructions';
import {Ok} from './status';
import {State} from './environment';
import {RuntimeError, RegisterError, LabelError} from './errors';

const ACCUMULATOR = BigInt(0);

ast.Load.prototype.interp = function (state) {
  const arg: ast.Operandum = this.argument;
  switch (arg.constructor) {
    case ast.Const:
      state.environment.registers.set(ACCUMULATOR, arg.value);
      return new Ok();
    case ast.Address: {
      const value = state.environment.registers.get(arg.value);
      if (value == null) {
        throw new RegisterError('empty register nr ' + arg.value);
      }
      state.environment.registers.set(ACCUMULATOR, value);
      return new Ok();
    }
    case ast.Reference: {
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
};

ast.Store.prototype.interp = function (state) {
  const arg: ast.Address | ast.Reference = this.argument;
  switch (arg.constructor) {
    case ast.Address: {
      const value = state.environment.registers.get(ACCUMULATOR);
      if (value == null) {
        throw new RegisterError('empty register nr ' + ACCUMULATOR);
      }
      state.environment.registers.set(arg.value, value);
      return new Ok();
    }
    case ast.Reference: {
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
};

ast.Add.prototype.interp = function (state) {
  const accValue = state.environment.registers.get(ACCUMULATOR);
  if (accValue == null) {
    throw new RuntimeError('empty register nr ' + ACCUMULATOR);
  }
  const arg: ast.Operandum = this.argument;
  switch (arg.constructor) {
    case ast.Const:
      state.environment.registers.set(ACCUMULATOR, accValue + arg.value);
      return new Ok();
    case ast.Address: {
      const value = state.environment.registers.get(arg.value);
      if (value == null) {
        throw new RegisterError('empty register nr ' + arg.value);
      }
      state.environment.registers.set(ACCUMULATOR, accValue + value);
      return new Ok();
    }
    case ast.Reference: {
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
};

ast.Sub.prototype.interp = function (state) {
  const accValue = state.environment.registers.get(ACCUMULATOR);
  if (accValue == null) {
    throw new RuntimeError('empty register nr ' + ACCUMULATOR);
  }
  const arg: ast.Operandum = this.argument;
  switch (arg.constructor) {
    case ast.Const:
      state.environment.registers.set(ACCUMULATOR, accValue - arg.value);
      return new Ok();
    case ast.Address: {
      const value = state.environment.registers.get(arg.value);
      if (value == null) {
        throw new RegisterError('empty register nr ' + arg.value);
      }
      state.environment.registers.set(ACCUMULATOR, accValue - value);
      return new Ok();
    }
    case ast.Reference: {
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
};

ast.Mult.prototype.interp = function (state) {
  const accValue = state.environment.registers.get(ACCUMULATOR);
  if (accValue == null) {
    throw new RuntimeError('empty register nr ' + ACCUMULATOR);
  }
  const arg: ast.Operandum = this.argument;
  switch (arg.constructor) {
    case ast.Const:
      state.environment.registers.set(ACCUMULATOR, accValue * arg.value);
      return new Ok();
    case ast.Address: {
      const value = state.environment.registers.get(arg.value);
      if (value == null) {
        throw new RegisterError('empty register nr ' + arg.value);
      }
      state.environment.registers.set(ACCUMULATOR, accValue * value);
      return new Ok();
    }
    case ast.Reference: {
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
};

ast.Div.prototype.interp = function (state) {
  const accValue = state.environment.registers.get(ACCUMULATOR);
  if (accValue == null) {
    throw new RuntimeError('empty register nr ' + ACCUMULATOR);
  }
  const arg: ast.Operandum = this.argument;
  switch (arg.constructor) {
    case ast.Const:
      if (arg.value === BigInt(0)) {
        throw new RuntimeError('division by 0');
      }
      state.environment.registers.set(ACCUMULATOR, accValue / arg.value);
      return new Ok();
    case ast.Address: {
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
    case ast.Reference: {
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
};

ast.Read.prototype.interp = function (state) {
  const arg: ast.Address | ast.Reference = this.argument;
  switch (arg.constructor) {
    case ast.Address: {
      const value = state.environment.input.read();
      state.environment.registers.set(arg.value, value);
      return new Ok();
    }
    case ast.Reference: {
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
};

ast.Write.prototype.interp = function (state) {
  const arg: ast.Operandum = this.argument;
  switch (arg.constructor) {
    case ast.Const:
      state.environment.output.write(arg.value);
      return new Ok();
    case ast.Address: {
      const value = state.environment.registers.get(arg.value);
      if (value == null) {
        throw new RegisterError('empty register nr ' + arg.value);
      }
      state.environment.output.write(value);
      return new Ok();
    }
    case ast.Reference: {
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
};

ast.Jump.prototype.interp = function (state) {
  const arg: ast.Label = this.argument;
  const jumpTarget = state.program.labels.get(arg.value);
  if (jumpTarget == null) {
    throw new LabelError('unrecognized label ' + arg.value);
  } else {
    state.nextInstruction = jumpTarget;
    return new Ok();
  }
};

ast.Jgtz.prototype.interp = function (state) {
  const arg: ast.Label = this.argument;
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
};

ast.Jzero.prototype.interp = function (state) {
  const arg: ast.Label = this.argument;
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
};

ast.Halt.prototype.interp = function (state) {
  state.completed = true;
  return new Ok();
};

ast.Skip.prototype.interp = function (state) {
  return new Ok();
};

ast.Combine.prototype.interp = function (state) {
  state.nextInstruction = this.nextInstruction;
  return this.instruction.interp(state);
};

export class Interpreter {
  interpInstruction(instruction: ast.Instruction, state: State): Ok {
    return instruction.interp(state);
  }
}
