import * as ast from './ast';
import * as inst from './instructions';
import {Ok} from './status';
import {State} from './environment';
import {RuntimeError} from './errors';

export class Interpreter {
  interpInstruction(instruction: ast.Instruction, state: State): Ok {
    let actionResult: RuntimeError | Ok = new RuntimeError(
      'unrecognized instruction'
    );
    if (instruction instanceof ast.Combine) {
      state.nextInstruction = instruction.nextInstruction;
      actionResult = this.interpInstruction(instruction.instruction, state);
    } else if (instruction instanceof ast.Load) {
      actionResult = inst.instructionLoad(instruction, state);
    } else if (instruction instanceof ast.Store) {
      actionResult = inst.instructionStore(instruction, state);
    } else if (instruction instanceof ast.Add) {
      actionResult = inst.instructionAdd(instruction, state);
    } else if (instruction instanceof ast.Sub) {
      actionResult = inst.instructionSub(instruction, state);
    } else if (instruction instanceof ast.Mult) {
      actionResult = inst.instructionMult(instruction, state);
    } else if (instruction instanceof ast.Div) {
      actionResult = inst.instructionDiv(instruction, state);
    } else if (instruction instanceof ast.Read) {
      actionResult = inst.instructionRead(instruction, state);
    } else if (instruction instanceof ast.Write) {
      actionResult = inst.instructionWrite(instruction, state);
    } else if (instruction instanceof ast.Jump) {
      actionResult = inst.instructionJump(instruction, state);
    } else if (instruction instanceof ast.Jgtz) {
      actionResult = inst.instructionJgtz(instruction, state);
    } else if (instruction instanceof ast.Jzero) {
      actionResult = inst.instructionJzero(instruction, state);
    } else if (instruction instanceof ast.Halt) {
      actionResult = inst.instructionHalt(state);
    } else if (instruction instanceof ast.Skip) {
      actionResult = inst.instructionSkip();
    }

    if (actionResult instanceof Ok) {
      return actionResult;
    } else {
      throw actionResult;
    }
  }
}
