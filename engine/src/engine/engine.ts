import {State, Environment} from './environment';
import {Parser} from './parser';
import {Interpreter} from './interpreter';
import {Ok, Break} from './status';

export class Engine {
  constructor(private parser: Parser, private interpreter: Interpreter) {}

  makeStateFromString(program: string, input: (bigint | null)[]): State {
    const env = new Environment(input);
    const parsedProgram = this.parser.parseProgram(program);
    return new State(parsedProgram, env, new Set());
  }

  makeStateFromFile(path: string, input: bigint[]): State {
    const env = new Environment(input);
    const parsedProgram = this.parser.parseProgramFile(path);
    return new State(parsedProgram, env, new Set());
  }

  stepInstruction(state: State) {
    return this.interpreter.interpInstruction(state.nextInstruction, state);
  }

  complete(state: State) {
    while (!state.completed) {
      this.interpreter.interpInstruction(state.nextInstruction, state);
    }
    return new Ok();
  }

  completeTillBreak(state: State) {
    let res = this.interpreter.interpInstruction(state.nextInstruction, state);
    while (!state.completed && !(res instanceof Break)) {
      res = this.interpreter.interpInstruction(state.nextInstruction, state);
    }
    return res;
  }

  updateBreakpoints(state: State, breakpoints: Set<number>) {
    state.breakpoints = breakpoints;
  }
}
