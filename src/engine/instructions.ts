import * as ast from './ast';
import {Ok} from './status';
import {RegisterError, RuntimeError, LabelError} from './errors';
import {State, Environment} from './environment';

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

export function instructionLoad(instruction: ast.Load, state: State): Ok {
  let arg: ast.Operandum | bigint = instruction.argument;
  let actionResult: RuntimeError | Ok = new RuntimeError('undefined behaviour');
  switch (arg.constructor) {
    case ast.Const:
      setRegister(ACCUMULATOR, arg.value, state.environmet);
      actionResult = new Ok();
      break;
    case ast.Address:
      arg = getRegister(arg.value, state.environmet);
      setRegister(ACCUMULATOR, arg, state.environmet);
      actionResult = new Ok();
      break;
    case ast.Reference:
      arg = getRegister(arg.value, state.environmet);
      actionResult = instructionLoad(new ast.Load(new ast.Address(arg)), state);
      break;
    default:
      actionResult = new RuntimeError('invalid argumetn in instruction load');
      break;
  }
  if (actionResult instanceof Ok) {
    return actionResult;
  } else {
    throw actionResult;
  }
}

export function instructionStore(instruction: ast.Store, state: State): Ok {
  let arg: ast.Operandum | bigint = instruction.argument;
  let actionResult: RuntimeError | Ok = new RuntimeError('undefined behaviour');
  switch (arg.constructor) {
    case ast.Address:
      setRegister(
        arg.value,
        getRegister(ACCUMULATOR, state.environmet),
        state.environmet
      );
      break;
    case ast.Reference:
      arg = getRegister(arg.value, state.environmet);
      actionResult = instructionStore(
        new ast.Store(new ast.Address(arg)),
        state
      );
      break;
    default:
      actionResult = new RuntimeError('invalid argumetn in instruction store');
      break;
  }
  if (actionResult instanceof Ok) {
    return actionResult;
  } else {
    throw actionResult;
  }
}

export function instructionAdd(instruction: ast.Add, state: State): Ok {
  let arg: ast.Operandum | bigint = instruction.argument;
  let actionResult: RuntimeError | Ok = new RuntimeError('undefined behaviour');
  const accValue = getRegister(ACCUMULATOR, state.environmet);
  switch (arg.constructor) {
    case ast.Const:
      setRegister(ACCUMULATOR, accValue + arg.value, state.environmet);
      actionResult = new Ok();
      break;
    case ast.Address:
      arg = getRegister(arg.value, state.environmet);
      setRegister(ACCUMULATOR, accValue + arg, state.environmet);
      actionResult = new Ok();
      break;
    case ast.Reference:
      arg = getRegister(arg.value, state.environmet);
      actionResult = instructionAdd(new ast.Add(new ast.Address(arg)), state);
      break;
    default:
      actionResult = new RuntimeError('invalid argumetn in instruction add');
      break;
  }
  if (actionResult instanceof Ok) {
    return actionResult;
  } else {
    throw actionResult;
  }
}

export function instructionSub(instruction: ast.Sub, state: State): Ok {
  let arg: ast.Operandum | bigint = instruction.argument;
  let actionResult: RuntimeError | Ok = new RuntimeError('undefined behaviour');
  const accValue = getRegister(ACCUMULATOR, state.environmet);
  switch (arg.constructor) {
    case ast.Const:
      setRegister(ACCUMULATOR, accValue - arg.value, state.environmet);
      actionResult = new Ok();
      break;
    case ast.Address:
      arg = getRegister(arg.value, state.environmet);
      setRegister(ACCUMULATOR, accValue - arg, state.environmet);
      actionResult = new Ok();
      break;
    case ast.Reference:
      arg = getRegister(arg.value, state.environmet);
      actionResult = instructionSub(new ast.Sub(new ast.Address(arg)), state);
      break;
    default:
      actionResult = new RuntimeError('invalid argumetn in instruction sub');
      break;
  }
  if (actionResult instanceof Ok) {
    return actionResult;
  } else {
    throw actionResult;
  }
}

export function instructionMult(instruction: ast.Mult, state: State): Ok {
  let arg: ast.Operandum | bigint = instruction.argument;
  let actionResult: RuntimeError | Ok = new RuntimeError('undefined behaviour');
  const accValue = getRegister(ACCUMULATOR, state.environmet);
  switch (arg.constructor) {
    case ast.Const:
      setRegister(ACCUMULATOR, accValue * arg.value, state.environmet);
      actionResult = new Ok();
      break;
    case ast.Address:
      arg = getRegister(arg.value, state.environmet);
      setRegister(ACCUMULATOR, accValue * arg, state.environmet);
      actionResult = new Ok();
      break;
    case ast.Reference:
      arg = getRegister(arg.value, state.environmet);
      actionResult = instructionMult(new ast.Mult(new ast.Address(arg)), state);
      break;
    default:
      actionResult = new RuntimeError('invalid argumetn in instruction mult');
      break;
  }
  if (actionResult instanceof Ok) {
    return actionResult;
  } else {
    throw actionResult;
  }
}

export function instructionDiv(instruction: ast.Div, state: State): Ok {
  let arg: ast.Operandum | bigint = instruction.argument;
  let actionResult: RuntimeError | Ok = new RuntimeError('undefined behaviour');
  const accValue = getRegister(ACCUMULATOR, state.environmet);
  switch (arg.constructor) {
    case ast.Const:
      if (arg.value === BigInt(0)) {
        throw new RuntimeError('division by 0');
      }
      setRegister(ACCUMULATOR, accValue / arg.value, state.environmet);
      actionResult = new Ok();
      break;
    case ast.Address:
      arg = getRegister(arg.value, state.environmet);
      if (arg === BigInt(0)) {
        throw new RuntimeError('division by 0');
      }
      setRegister(ACCUMULATOR, accValue / arg, state.environmet);
      actionResult = new Ok();
      break;
    case ast.Reference:
      arg = getRegister(arg.value, state.environmet);
      actionResult = instructionDiv(new ast.Div(new ast.Address(arg)), state);
      break;
    default:
      actionResult = new RuntimeError('invalid argumetn in instruction div');
      break;
  }
  if (actionResult instanceof Ok) {
    return actionResult;
  } else {
    throw actionResult;
  }
}

export function instructionRead(instruction: ast.Read, state: State): Ok {
  let arg: ast.Operandum | bigint = instruction.argument;
  let actionResult: RuntimeError | Ok = new RuntimeError('undefined behaviour');
  switch (arg.constructor) {
    case ast.Address:
      setRegister(arg.value, state.environmet.input.read(), state.environmet);
      actionResult = new Ok();
      break;
    case ast.Reference:
      arg = getRegister(arg.value, state.environmet);
      actionResult = instructionRead(new ast.Read(new ast.Address(arg)), state);
      break;
    default:
      actionResult = new RuntimeError('invalid argumetn in instruction read');
      break;
  }
  if (actionResult instanceof Ok) {
    return actionResult;
  } else {
    throw actionResult;
  }
}

export function instructionWrite(instruction: ast.Write, state: State): Ok {
  let arg: ast.Operandum | bigint = instruction.argument;
  let actionResult: RuntimeError | Ok = new RuntimeError('undefined behaviour');
  switch (arg.constructor) {
    case ast.Const:
      state.environmet.output.write(arg.value);
      actionResult = new Ok();
      break;
    case ast.Address:
      arg = getRegister(arg.value, state.environmet);
      state.environmet.output.write(arg);
      actionResult = new Ok();
      break;
    case ast.Reference:
      arg = getRegister(arg.value, state.environmet);
      actionResult = instructionWrite(
        new ast.Write(new ast.Address(arg)),
        state
      );
      break;
    default:
      actionResult = new RuntimeError('invalid argumetn in instruction write');
      break;
  }
  if (actionResult instanceof Ok) {
    return actionResult;
  } else {
    throw actionResult;
  }
}

export function instructionJump(instruction: ast.Jump, state: State): Ok {
  const arg: ast.Label = instruction.argument;
  let actionResult: RuntimeError | Ok = new RuntimeError('undefined behaviour');
  switch (arg.constructor) {
    case ast.Label: {
      const jumpTarget = state.program.labels.get(arg.value);
      if (jumpTarget == null) {
        throw new LabelError('unrecognized label ' + arg.value);
      } else {
        state.nextInstruction = jumpTarget;
      }
      break;
    }
    default:
      actionResult = new RuntimeError('invalid argumetn in instruction jump');
      break;
  }
  if (actionResult instanceof Ok) {
    return actionResult;
  } else {
    throw actionResult;
  }
}

export function instructionJgtz(instruction: ast.Jgtz, state: State): Ok {
  const arg: ast.Label = instruction.argument;
  let actionResult: RuntimeError | Ok = new RuntimeError('undefined behaviour');
  switch (arg.constructor) {
    case ast.Label: {
      const jumpTarget = state.program.labels.get(arg.value);
      if (jumpTarget == null) {
        throw new LabelError('unrecognized label ' + arg.value);
      } else {
        if (getRegister(ACCUMULATOR, state.environmet) > BigInt(0)) {
          state.nextInstruction = jumpTarget;
        }
      }
      break;
    }
    default:
      actionResult = new RuntimeError('invalid argumetn in instruction jgtz');
      break;
  }
  if (actionResult instanceof Ok) {
    return actionResult;
  } else {
    throw actionResult;
  }
}

export function instructionJzero(instruction: ast.Jzero, state: State): Ok {
  const arg: ast.Label = instruction.argument;
  let actionResult: RuntimeError | Ok = new RuntimeError('undefined behaviour');
  switch (arg.constructor) {
    case ast.Label: {
      const jumpTarget = state.program.labels.get(arg.value);
      if (jumpTarget == null) {
        throw new LabelError('unrecognized label ' + arg.value);
      } else {
        if (getRegister(ACCUMULATOR, state.environmet) === BigInt(0)) {
          state.nextInstruction = jumpTarget;
        }
      }
      break;
    }
    default:
      actionResult = new RuntimeError('invalid argumetn in instruction jzero');
      break;
  }
  if (actionResult instanceof Ok) {
    return actionResult;
  } else {
    throw actionResult;
  }
}

export function instructionHalt(state: State): Ok {
  state.completed = true;
  return new Ok();
}

export function instructionSkip(): Ok {
  return new Ok();
}
