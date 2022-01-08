import * as ast from './ast';
import {Break, Ok} from './status';
import {State, Environment} from './environment';
import {
  RegisterError,
  BadArgumentError,
  DivByZeroError,
  LabelError,
} from './errors';

export class Interpreter {
  interpInstruction(instruction: ast.Instruction, state: State): Ok | Break {
    return instruction.interp(state);
  }
}

export const ACCUMULATOR = BigInt(0);

function getRegister(registerId: bigint, env: Environment, line: number) {
  const value = env.registers.get(registerId);
  if (value == null) {
    throw new RegisterError(line, 'empty register', registerId);
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
      return new Ok(ACCUMULATOR);
    case ast.Address: {
      const value = getRegister(
        arg.value,
        state.environment,
        this.getLineNumber()
      );
      setRegister(ACCUMULATOR, value, state.environment);
      return new Ok(ACCUMULATOR);
    }
    case ast.Reference: {
      let value = getRegister(
        arg.value,
        state.environment,
        this.getLineNumber()
      );
      value = getRegister(value, state.environment, this.getLineNumber());
      setRegister(ACCUMULATOR, value, state.environment);
      return new Ok(ACCUMULATOR);
    }
    default:
      throw new BadArgumentError(
        this.getLineNumber(),
        'invalid argument in instruction load'
      );
  }
};

ast.Store.prototype.interp = function (state) {
  const arg: ast.Address | ast.Reference = this.argument;
  switch (arg.constructor) {
    case ast.Address: {
      const value = getRegister(
        ACCUMULATOR,
        state.environment,
        this.getLineNumber()
      );
      setRegister(arg.value, value, state.environment);
      return new Ok(arg.value);
    }
    case ast.Reference: {
      const accValue = getRegister(
        ACCUMULATOR,
        state.environment,
        this.getLineNumber()
      );
      const value = getRegister(
        arg.value,
        state.environment,
        this.getLineNumber()
      );
      setRegister(value, accValue, state.environment);
      return new Ok(value);
    }
    default:
      throw new BadArgumentError(
        this.getLineNumber(),
        'invalid argument in instruction store'
      );
  }
};

ast.Add.prototype.interp = function (state) {
  const accValue = getRegister(
    ACCUMULATOR,
    state.environment,
    this.getLineNumber()
  );
  const arg: ast.Operandum = this.argument;
  switch (arg.constructor) {
    case ast.Const:
      setRegister(ACCUMULATOR, accValue + arg.value, state.environment);
      return new Ok(ACCUMULATOR);
    case ast.Address: {
      const value = getRegister(
        arg.value,
        state.environment,
        this.getLineNumber()
      );
      setRegister(ACCUMULATOR, accValue + value, state.environment);
      return new Ok(ACCUMULATOR);
    }
    case ast.Reference: {
      let value = getRegister(
        arg.value,
        state.environment,
        this.getLineNumber()
      );
      value = getRegister(value, state.environment, this.getLineNumber());
      setRegister(ACCUMULATOR, accValue + value, state.environment);
      return new Ok(ACCUMULATOR);
    }
    default:
      throw new BadArgumentError(
        this.getLineNumber(),
        'invalid argument in instruction add'
      );
  }
};

ast.Sub.prototype.interp = function (state) {
  const accValue = getRegister(
    ACCUMULATOR,
    state.environment,
    this.getLineNumber()
  );
  const arg: ast.Operandum = this.argument;
  switch (arg.constructor) {
    case ast.Const:
      setRegister(ACCUMULATOR, accValue - arg.value, state.environment);
      return new Ok(ACCUMULATOR);
    case ast.Address: {
      const value = getRegister(
        arg.value,
        state.environment,
        this.getLineNumber()
      );
      setRegister(ACCUMULATOR, accValue - value, state.environment);
      return new Ok(ACCUMULATOR);
    }
    case ast.Reference: {
      let value = getRegister(
        arg.value,
        state.environment,
        this.getLineNumber()
      );
      value = getRegister(value, state.environment, this.getLineNumber());
      setRegister(ACCUMULATOR, accValue - value, state.environment);
      return new Ok(ACCUMULATOR);
    }
    default:
      throw new BadArgumentError(
        this.getLineNumber(),
        'invalid argument in instruction sub'
      );
  }
};

ast.Mult.prototype.interp = function (state) {
  const accValue = getRegister(
    ACCUMULATOR,
    state.environment,
    this.getLineNumber()
  );
  const arg: ast.Operandum = this.argument;
  switch (arg.constructor) {
    case ast.Const:
      setRegister(ACCUMULATOR, accValue * arg.value, state.environment);
      return new Ok(ACCUMULATOR);
    case ast.Address: {
      const value = getRegister(
        arg.value,
        state.environment,
        this.getLineNumber()
      );
      setRegister(ACCUMULATOR, accValue * value, state.environment);
      return new Ok(ACCUMULATOR);
    }
    case ast.Reference: {
      let value = getRegister(
        arg.value,
        state.environment,
        this.getLineNumber()
      );
      value = getRegister(value, state.environment, this.getLineNumber());
      setRegister(ACCUMULATOR, accValue * value, state.environment);
      return new Ok(ACCUMULATOR);
    }
    default:
      throw new BadArgumentError(
        this.getLineNumber(),
        'invalid argument in instruction mult'
      );
  }
};

ast.Div.prototype.interp = function (state) {
  const accValue = getRegister(
    ACCUMULATOR,
    state.environment,
    this.getLineNumber()
  );
  const arg: ast.Operandum = this.argument;
  switch (arg.constructor) {
    case ast.Const:
      if (arg.value === BigInt(0)) {
        throw new DivByZeroError(this.getLineNumber(), 'division by 0');
      }
      setRegister(ACCUMULATOR, accValue / arg.value, state.environment);
      return new Ok(ACCUMULATOR);
    case ast.Address: {
      const value = getRegister(
        arg.value,
        state.environment,
        this.getLineNumber()
      );
      if (value === BigInt(0)) {
        throw new DivByZeroError(this.getLineNumber(), 'division by 0');
      }
      setRegister(ACCUMULATOR, accValue / value, state.environment);
      return new Ok(ACCUMULATOR);
    }
    case ast.Reference: {
      let value = getRegister(
        arg.value,
        state.environment,
        this.getLineNumber()
      );
      value = getRegister(value, state.environment, this.getLineNumber());
      if (value === BigInt(0)) {
        throw new DivByZeroError(this.getLineNumber(), 'division by 0');
      }
      setRegister(ACCUMULATOR, accValue / value, state.environment);
      return new Ok(ACCUMULATOR);
    }
    default:
      throw new BadArgumentError(
        this.getLineNumber(),
        'invalid argument in instruction div'
      );
  }
};

ast.Read.prototype.interp = function (state) {
  const arg: ast.Address | ast.Reference = this.argument;
  switch (arg.constructor) {
    case ast.Address: {
      const value = state.environment.input.read(this.getLineNumber());
      setRegister(arg.value, value, state.environment);
      return new Ok(arg.value);
    }
    case ast.Reference: {
      const value = getRegister(
        arg.value,
        state.environment,
        this.getLineNumber()
      );
      const readValue = state.environment.input.read(this.getLineNumber());
      setRegister(value, readValue, state.environment);
      return new Ok(value);
    }
    default:
      throw new BadArgumentError(
        this.getLineNumber(),
        'invalid argument in instruction read'
      );
  }
};

ast.Write.prototype.interp = function (state) {
  const arg: ast.Operandum = this.argument;
  switch (arg.constructor) {
    case ast.Const:
      state.environment.output.write(arg.value);
      return new Ok();
    case ast.Address: {
      const value = getRegister(
        arg.value,
        state.environment,
        this.getLineNumber()
      );
      state.environment.output.write(value);
      return new Ok(arg.value);
    }
    case ast.Reference: {
      const ref = getRegister(
        arg.value,
        state.environment,
        this.getLineNumber()
      );
      const value = getRegister(ref, state.environment, this.getLineNumber());
      state.environment.output.write(value);
      return new Ok(ref);
    }
    default:
      throw new BadArgumentError(
        this.getLineNumber(),
        'invalid argument in instruction write'
      );
  }
};

ast.Jump.prototype.interp = function (state) {
  const arg: ast.Label = this.argument;
  const jumpTarget = state.program.labels.get(arg.value);
  if (jumpTarget == null) {
    throw new LabelError(this.getLineNumber(), 'unrecognized label', arg.value);
  } else {
    state.nextInstruction = jumpTarget;
    return new Ok();
  }
};

ast.Jgtz.prototype.interp = function (state) {
  const arg: ast.Label = this.argument;
  const jumpTarget = state.program.labels.get(arg.value);
  if (jumpTarget == null) {
    throw new LabelError(this.getLineNumber(), 'unrecognized label', arg.value);
  } else {
    const value = getRegister(
      ACCUMULATOR,
      state.environment,
      this.getLineNumber()
    );
    if (value > BigInt(0)) {
      state.nextInstruction = jumpTarget;
    }
    return new Ok();
  }
};

ast.Jzero.prototype.interp = function (state) {
  const arg: ast.Label = this.argument;
  const jumpTarget = state.program.labels.get(arg.value);
  if (jumpTarget == null) {
    throw new LabelError(this.getLineNumber(), 'unrecognized label', arg.value);
  } else {
    const value = getRegister(
      ACCUMULATOR,
      state.environment,
      this.getLineNumber()
    );
    if (value === BigInt(0)) {
      state.nextInstruction = jumpTarget;
    }
    return new Ok();
  }
};

ast.Halt.prototype.interp = function (state) {
  state.completed = true;
  return new Ok();
};

ast.Skip.prototype.interp = function () {
  return new Ok();
};

ast.Combine.prototype.interp = function (state) {
  state.nextInstruction = this.nextInstruction;
  const res = this.instruction.interp(state);
  while (
    state.nextInstruction instanceof ast.Combine &&
    state.nextInstruction.instruction instanceof ast.Skip &&
    !state.breakpoints.has(state.nextInstruction.getLineNumber())
  ) {
    state.nextInstruction = state.nextInstruction.nextInstruction;
  }

  if (
    state.nextInstruction instanceof ast.Halt &&
    state.nextInstruction.getLineNumber() === ast.NODE_GENERATED
  )
    state.completed = true;

  if (state.breakpoints.has(state.nextInstruction.getLineNumber()))
    return new Break(res.modifiedRegister);
  else return res;
};
