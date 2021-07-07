import {State, Environment} from './environment';
import {Parser} from './parser';
import {Interpreter} from './interpreter';
import {Ok} from './status';

export class Engine {
  constructor(private parser: Parser, private interpreter: Interpreter) {}

  makeStateFromString(program: string, input: bigint[]): State {
    const env = new Environment(input);
    const parsedProgram = this.parser.parseProgram(program);
    return new State(parsedProgram, env);
  }

  stepInstruction(state: State): Ok {
    return this.interpreter.interpInstruction(state.nextInstruction, state);
  }

  complete(state: State) {
    while (!state.completed) {
      this.interpreter.interpInstruction(state.nextInstruction, state);
    }
    return new Ok();
  }
}
