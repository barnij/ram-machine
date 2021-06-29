const ast = require('./ast');
const inst = require('./instructions');
const status = require('./status');

function interpInstruction(state) {
  let env = state.env;
  let instruction = state.programHead;
  switch (instruction.constructor) {
    case ast.Load:
      success = inst.instructionLoad(instruction, env);
      break;

    case ast.Store:
      success = inst.instructionStore(instruction, env);
      break;

    case ast.Add:
      success = inst.instructionAdd(instruction, env);
      break;

    case ast.Sub:
      success = inst.instructionSub(instruction, env);
      break;

    case ast.Mult:
      success = inst.instructionMult(instruction, env);
      break;

    case ast.Div:
      success = inst.instructionDiv(instruction, env);
      break;

    case ast.Read:
      success = inst.instructionRead(instruction, env);
      break;

    case ast.Write:
      success = inst.instructionWrite(instruction, env);
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
      var success = new Error("Unrecognized instruction");
      break;
  }
  return success;
}

module.exports = {
  interpInstruction
}