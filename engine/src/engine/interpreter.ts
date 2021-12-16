import * as ast from './ast';
import {Ok} from './status';
import {State, Environment} from './environment';
import {RegisterError, RuntimeError, LabelError} from './errors';

export class Interpreter {
  interpInstruction(instruction: ast.Instruction, state: State): Ok {
    return instruction.interp(state);
  }
}

export const ACCUMULATOR = BigInt(0);

function getRegister(registerId: bigint, env: Environment) {
  const value = env.registers.get(registerId);
  if (value == null) {
    throw new RegisterError('empty register nr ' + registerId);
  } else {
    return value;
  }
}

function setRegister(registerId: bigint, value: bigint, env: Environment) {
  env.registers.set(registerId, value);
}

ast.Load.prototype.interp = function (state) {
  const arg: ast.Operandum = this.argument;
  switch (arg.constructor) {
    case ast.Const:
      setRegister(ACCUMULATOR, arg.value, state.environment);
      return new Ok(state);
    case ast.Address: {
      const value = getRegister(arg.value, state.environment);
      setRegister(ACCUMULATOR, value, state.environment);
      return new Ok(state);
    }
    case ast.Reference: {
      let value = getRegister(arg.value, state.environment);
      value = getRegister(value, state.environment);
      setRegister(ACCUMULATOR, value, state.environment);
      return new Ok(state);
    }
    default:
      throw new RuntimeError('invalid argument in instruction load');
  }
};

ast.Store.prototype.interp = function (state) {
  const arg: ast.Address | ast.Reference = this.argument;
  switch (arg.constructor) {
    case ast.Address: {
      const value = getRegister(ACCUMULATOR, state.environment);
      setRegister(arg.value, value, state.environment);
      return new Ok(state);
    }
    case ast.Reference: {
      const accValue = getRegister(ACCUMULATOR, state.environment);
      const value = getRegister(arg.value, state.environment);
      setRegister(value, accValue, state.environment);
      return new Ok(state);
    }
    default:
      throw new RuntimeError('invalid argument in instruction load');
  }
};

ast.Add.prototype.interp = function (state) {
  const accValue = getRegister(ACCUMULATOR, state.environment);
  const arg: ast.Operandum = this.argument;
  switch (arg.constructor) {
    case ast.Const:
      setRegister(ACCUMULATOR, accValue + arg.value, state.environment);
      return new Ok(state);
    case ast.Address: {
      const value = getRegister(arg.value, state.environment);
      setRegister(ACCUMULATOR, accValue + value, state.environment);
      return new Ok(state);
    }
    case ast.Reference: {
      let value = getRegister(arg.value, state.environment);
      value = getRegister(value, state.environment);
      setRegister(ACCUMULATOR, accValue + value, state.environment);
      return new Ok(state);
    }
    default:
      throw new RuntimeError('invalid argument in instruction load');
  }
};

ast.Sub.prototype.interp = function (state) {
  const accValue = getRegister(ACCUMULATOR, state.environment);
  const arg: ast.Operandum = this.argument;
  switch (arg.constructor) {
    case ast.Const:
      setRegister(ACCUMULATOR, accValue - arg.value, state.environment);
      return new Ok(state);
    case ast.Address: {
      const value = getRegister(arg.value, state.environment);
      setRegister(ACCUMULATOR, accValue - value, state.environment);
      return new Ok(state);
    }
    case ast.Reference: {
      let value = getRegister(arg.value, state.environment);
      value = getRegister(value, state.environment);
      setRegister(ACCUMULATOR, accValue - value, state.environment);
      return new Ok(state);
    }
    default:
      throw new RuntimeError('invalid argument in instruction load');
  }
};

ast.Mult.prototype.interp = function (state) {
  const accValue = getRegister(ACCUMULATOR, state.environment);
  const arg: ast.Operandum = this.argument;
  switch (arg.constructor) {
    case ast.Const:
      setRegister(ACCUMULATOR, accValue * arg.value, state.environment);
      return new Ok(state);
    case ast.Address: {
      const value = getRegister(arg.value, state.environment);
      setRegister(ACCUMULATOR, accValue * value, state.environment);
      return new Ok(state);
    }
    case ast.Reference: {
      let value = getRegister(arg.value, state.environment);
      value = getRegister(value, state.environment);
      setRegister(ACCUMULATOR, accValue * value, state.environment);
      return new Ok(state);
    }
    default:
      throw new RuntimeError('invalid argument in instruction load');
  }
};

ast.Div.prototype.interp = function (state) {
  const accValue = getRegister(ACCUMULATOR, state.environment);
  const arg: ast.Operandum = this.argument;
  switch (arg.constructor) {
    case ast.Const:
      if (arg.value === BigInt(0)) {
        throw new RuntimeError('division by 0');
      }
      setRegister(ACCUMULATOR, accValue / arg.value, state.environment);
      return new Ok(state);
    case ast.Address: {
      const value = getRegister(arg.value, state.environment);
      if (value === BigInt(0)) {
        throw new RuntimeError('division by 0');
      }
      setRegister(ACCUMULATOR, accValue / value, state.environment);
      return new Ok(state);
    }
    case ast.Reference: {
      let value = getRegister(arg.value, state.environment);
      value = getRegister(value, state.environment);
      if (value === BigInt(0)) {
        throw new RuntimeError('division by 0');
      }
      setRegister(ACCUMULATOR, accValue / value, state.environment);
      return new Ok(state);
    }
    default:
      throw new RuntimeError('invalid argument in instruction load');
  }
};

ast.Read.prototype.interp = function (state) {
  const arg: ast.Address | ast.Reference = this.argument;
  switch (arg.constructor) {
    case ast.Address: {
      const value = state.environment.input.read();
      setRegister(arg.value, value, state.environment);
      return new Ok(state);
    }
    case ast.Reference: {
      const value = getRegister(arg.value, state.environment);
      const readValue = state.environment.input.read();
      setRegister(value, readValue, state.environment);
      return new Ok(state);
    }
    default:
      throw new RuntimeError('invalid argument in instruction load');
  }
};

ast.Write.prototype.interp = function (state) {
  const arg: ast.Operandum = this.argument;
  switch (arg.constructor) {
    case ast.Const:
      state.environment.output.write(arg.value);
      return new Ok(state);
    case ast.Address: {
      const value = getRegister(arg.value, state.environment);
      state.environment.output.write(value);
      return new Ok(state);
    }
    case ast.Reference: {
      let value = getRegister(arg.value, state.environment);
      value = getRegister(value, state.environment);
      state.environment.output.write(value);
      return new Ok(state);
    }
    default:
      throw new RuntimeError('invalid argument in instruction load');
  }
};

ast.Jump.prototype.interp = function (state) {
  const arg: ast.Label = this.argument;
  const jumpTarget = state.program.labels.get(arg.value);
  if (jumpTarget == null) {
    throw new LabelError('unrecognized label ' + arg.value);
  } else {
    state.nextInstruction = jumpTarget;
    return new Ok(state);
  }
};

ast.Jgtz.prototype.interp = function (state) {
  const arg: ast.Label = this.argument;
  const jumpTarget = state.program.labels.get(arg.value);
  if (jumpTarget == null) {
    throw new LabelError('unrecognized label ' + arg.value);
  } else {
    const value = getRegister(ACCUMULATOR, state.environment);
    if (value > BigInt(0)) {
      state.nextInstruction = jumpTarget;
    }
    return new Ok(state);
  }
};

ast.Jzero.prototype.interp = function (state) {
  const arg: ast.Label = this.argument;
  const jumpTarget = state.program.labels.get(arg.value);
  if (jumpTarget == null) {
    throw new LabelError('unrecognized label ' + arg.value);
  } else {
    const value = getRegister(ACCUMULATOR, state.environment);
    if (value === BigInt(0)) {
      state.nextInstruction = jumpTarget;
    }
    return new Ok(state);
  }
};

ast.Halt.prototype.interp = function (state) {
  state.completed = true;
  return new Ok(state);
};

ast.Skip.prototype.interp = function (state) {
  return new Ok(state);
};

ast.Combine.prototype.interp = function (state) {
  if (this.instruction instanceof ast.Skip)
    return this.nextInstruction.interp(state);
  state.nextInstruction = this.nextInstruction;
  return this.instruction.interp(state);
};
