const ast = require('./ast');
const inst = require('./instructions');
const status = require('./status');

function interpInstruction(instruction, state) {
  let env = state.env;
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
      success = inst.instructionJump(instruction, state);
      break;

    case ast.Jgtz:
      success = inst.instructionJgtz(instruction, state);
      break;

    case ast.Jzero:
      success = inst.instructionJzero(instruction, state);
      break;

    case ast.Halt:
      success = inst.instructionHalt(state);
      break;

    case ast.Skip:
      success = inst.instructionSkip();
      break;

    case ast.Combine:
      state.programHead = instruction.nextInstruction;
      interpInstruction(instruction.instruction, state);
      success = new status.Ok();
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