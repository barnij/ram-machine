const ast = require('./ast');
const inst = require('./instructions');

function interpInstruction(state) {
  let env = state.env;
  let instruction = state.programHead;
  switch (instruction.constructor) {
    case ast.Load:
      let success = inst.instructionLoad(instruction, env);
      return success;
      break;

    case ast.Store:
      let success = inst.instructionStore(instruction, env);
      return success;
      break;

    case ast.Add:
      let success = inst.instructionAdd(instruction, env);
      return success;
      break;

    case ast.Sub:
      let success = inst.instructionSub(instruction, env);
      return success;
      break;

    case ast.Mult:
      let success = inst.instructionMult(instruction, env);
      return success;
      break;

    case ast.Div:
      let success = inst.instructionDiv(instruction, env);
      return success;
      break;

    case ast.Read:
      break;

    case ast.Write:
      break;

    case ast.Jump:
      break;

    case ast.Jgtz:
      break;

    case ast.Jzero:
      break;

    case ast.Halt:
      break;

    case ast.Skip:
      break;

    case ast.Combine:
      break;

    default:
      // runtime error
      break;
  }
}

module.exports = {
  interpInstruction
}