const ast = require('./ast');
const status = require('./status');
const acc = BigInt(0);

function getRegister(registerId, env) {
  let value = env.registers[registerId];
  if (value != undefined) {
    return value;
  } else {
    return new ReferenceError("register " + registerId + " is empty");
  }
}

function instructionLoad(instruction, env) {
  let arg = instruction.argument;
  switch (arg.constructor) {
    case ast.Const:
      env.registers[acc] = arg.value;
      return new status.Ok();
      break;

    case ast.Address:
      arg = getRegister(arg, env);
      if (arg.constructor == ReferenceError) {
        return arg;
      }
      env.registers[acc] = arg;
      return new status.Ok();
      break;

    case ast.Reference:
      arg = getRegister(arg, env);
      if (arg.constructor == ReferenceError) {
        return arg;
      }
      let success = instructionLoad(new ast.Load(new ast.Address(arg)), env);
      return success;
      break;

    default:
      return new TypeError("invalid argument in instruction load");
      break;
  }
}

function instructionStore(instruction, env) {
  let arg = instruction.argument;
  if (env.registers[acc] == undefined) {
    return new ReferenceError("register " + acc + " is empty");
  }
  switch (arg.constructor) {
    case ast.Address:
      env.registers[arg.value] = getRegister(acc, env);
      return new status.Ok();
      break;

    case ast.Reference:
      arg = getRegister(arg, env);
      if (arg.constructor == ReferenceError) {
        return arg;
      }
      let success = instructionStore(new ast.Store(new ast.Address(arg)), env);
      return success;
      break;

    default:
      return new TypeError("invalid argument in instruction store");
      break;
  }
}

function instructionAdd(instruction, env) {
  let arg = instruction.argument;
  switch (arg.constructor) {
    case ast.Const:
      if (env.registers[acc] == undefined) {
        return new ReferenceError("register " + acc + " is empty");
      }
      env.registers[acc] += arg.value;
      return new status.Ok();
      break;

    case ast.Address:
      arg = getRegister(arg, env);
      if (arg.constructor == ReferenceError) {
        return arg;
      }
      if (env.registers[acc] == undefined) {
        return new ReferenceError("register " + acc + " is empty");
      }
      env.registers[acc] += arg;
      return new status.Ok();
      break;

    case ast.Reference:
      arg = getRegister(arg, env);
      if (arg.constructor == ReferenceError) {
        return arg;
      }
      let success = instructionAdd(new ast.Add(new ast.Address(arg)), env);
      return success;
      break;

    default:
      return new TypeError("invalid argument in instruction add");
      break;
  }
}

function instructionSub(instruction, env) {
  let arg = instruction.argument;
  switch (arg.constructor) {
    case ast.Const:
      if (env.registers[acc] == undefined) {
        return new ReferenceError("register " + acc + " is empty");
      }
      env.registers[acc] -= arg.value;
      return new status.Ok();
      break;

    case ast.Address:
      arg = getRegister(arg, env);
      if (arg.constructor == ReferenceError) {
        return arg;
      }
      if (env.registers[acc] == undefined) {
        return new ReferenceError("register " + acc + " is empty");
      }
      env.registers[acc] -= arg;
      return new status.Ok();
      break;

    case ast.Reference:
      arg = getRegister(arg, env);
      if (arg.constructor == ReferenceError) {
        return arg;
      }
      let success = instructionSub(new ast.Sub(new ast.Address(arg)), env);
      return success;
      break;

    default:
      return new TypeError("invalid argument in instruction sub");
      break;
  }
}

function instructionMult(instruction, env) {
  let arg = instruction.argument;
  switch (arg.constructor) {
    case ast.Const:
      if (env.registers[acc] == undefined) {
        return new ReferenceError("register " + acc + " is empty");
      }
      env.registers[acc] *= arg.value;
      return new status.Ok();
      break;

    case ast.Address:
      arg = getRegister(arg, env);
      if (arg.constructor == ReferenceError) {
        return arg;
      }
      if (env.registers[acc] == undefined) {
        return new ReferenceError("register " + acc + " is empty");
      }
      env.registers[acc] *= arg;
      return new status.Ok();
      break;

    case ast.Reference:
      arg = getRegister(arg, env);
      if (arg.constructor == ReferenceError) {
        return arg;
      }
      let success = instructionMult(new ast.Mult(new ast.Address(arg)), env);
      return success;
      break;

    default:
      return new TypeError("invalid argument in instruction mult");
      break;
  }
}

function instructionDiv(instruction, env) {
  let arg = instruction.argument;
  switch (arg.constructor) {
    case ast.Const:
      if (env.registers[acc] == undefined) {
        return new ReferenceError("register " + acc + " is empty");
      }
      if (arg.value == 0) {
        return new Error("division by 0");
      }
      env.registers[acc] /= arg.value;
      return new status.Ok();
      break;

    case ast.Address:
      arg = getRegister(arg, env);
      if (arg.constructor == ReferenceError) {
        return arg;
      }
      if (env.registers[acc] == undefined) {
        return new ReferenceError("register " + acc + " is empty");
      }
      if (arg == 0) {
        return Error("division by 0");
      }
      env.registers[acc] /= arg;
      return new status.Ok();
      break;

    case ast.Reference:
      arg = getRegister(arg, env);
      if (arg.constructor == ReferenceError) {
        return arg;
      }
      let success = instructionDiv(new ast.Div(new ast.Address(arg)), env);
      return success;
      break;

    default:
      return new TypeError("invalid argument in instruction div");
      break;
  }
}

module.exports = {
  instructionLoad,
  instructionStore,
  instructionAdd,
  instructionSub,
  instructionMult,
  instructionDiv
}