import * as ast from './ast';
import {Ok} from './status';
import {RegisterError, RuntimeError, LabelError} from './errors';
import {State, Environment} from './environment';
import * as instructions from './instructions';

function testState(): State {
  return new State(
    new ast.Program(new Map<string, ast.Instruction>(), new ast.Halt()),
    new Environment([])
  );
}

test('instructionLoad - loading from empty register throws RuntimeError', () => {
  const state = testState();
  const load = new ast.Load(new ast.Address(BigInt('1')));
  expect(() => instructions.instructionLoad(load, state)).toThrowError(
    RegisterError
  );
});
