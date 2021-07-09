import * as ast from './ast';
import * as inst from './instructions';
import {RegisterError, RuntimeError, LabelError} from './errors';
import {Engine} from './engine';
import {Parser} from './parser';
import {Interpreter} from './interpreter';
import {Ok} from './status';

const ENGINE = new Engine(new Parser(), new Interpreter());

// instructionLoad
test('instructionLoad - load constant value', () => {
  const program = 'load =17';
  const state = ENGINE.makeStateFromString(program, []);
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  if (state.nextInstruction instanceof ast.Combine) {
    expect(state.nextInstruction.instruction).toBeInstanceOf(ast.Load);
    const instruction = state.nextInstruction.instruction;
    if (instruction instanceof ast.Load) {
      const actionResult = inst.instructionLoad(instruction, state);
      expect(actionResult).toBeInstanceOf(Ok);
      expect(state.environmet.registers.get(inst.ACCUMULATOR)).toStrictEqual(
        BigInt(17)
      );
    }
  }
});

test('instructionLoad - load value from register', () => {
  const program = 'load 17';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(BigInt(17), BigInt(24));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  if (state.nextInstruction instanceof ast.Combine) {
    expect(state.nextInstruction.instruction).toBeInstanceOf(ast.Load);
    const instruction = state.nextInstruction.instruction;
    if (instruction instanceof ast.Load) {
      const actionResult = inst.instructionLoad(instruction, state);
      expect(actionResult).toBeInstanceOf(Ok);
      expect(state.environmet.registers.get(inst.ACCUMULATOR)).toStrictEqual(
        BigInt(24)
      );
    }
  }
});

test('instructionLoad - load value from reference', () => {
  const program = 'load ^17';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(BigInt(17), BigInt(24));
  state.environmet.registers.set(BigInt(24), BigInt(78123));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  if (state.nextInstruction instanceof ast.Combine) {
    expect(state.nextInstruction.instruction).toBeInstanceOf(ast.Load);
    const instruction = state.nextInstruction.instruction;
    if (instruction instanceof ast.Load) {
      const actionResult = inst.instructionLoad(instruction, state);
      expect(actionResult).toBeInstanceOf(Ok);
      expect(state.environmet.registers.get(inst.ACCUMULATOR)).toStrictEqual(
        BigInt(78123)
      );
    }
  }
});

test('instructionLoad - load value from empty register throws RegisterError', () => {
  const program = 'load 17';
  const state = ENGINE.makeStateFromString(program, []);
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  if (state.nextInstruction instanceof ast.Combine) {
    expect(state.nextInstruction.instruction).toBeInstanceOf(ast.Load);
    const instruction = state.nextInstruction.instruction;
    if (instruction instanceof ast.Load) {
      expect(() => {
        inst.instructionLoad(instruction, state);
      }).toThrowError(RegisterError);
    }
  }
});

test('instructionLoad - load value from empty reference throws RegisterError', () => {
  const program = 'load ^24';
  const state = ENGINE.makeStateFromString(program, []);
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  if (state.nextInstruction instanceof ast.Combine) {
    expect(state.nextInstruction.instruction).toBeInstanceOf(ast.Load);
    const instruction = state.nextInstruction.instruction;
    if (instruction instanceof ast.Load) {
      expect(() => {
        inst.instructionLoad(instruction, state);
      }).toThrowError(RegisterError);
    }
  }
});

test('instructionLoad - load value from reference to empty register throws RegisterError', () => {
  const program = 'load ^24';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(BigInt(24), BigInt(78123));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  if (state.nextInstruction instanceof ast.Combine) {
    expect(state.nextInstruction.instruction).toBeInstanceOf(ast.Load);
    const instruction = state.nextInstruction.instruction;
    if (instruction instanceof ast.Load) {
      expect(() => {
        inst.instructionLoad(instruction, state);
      }).toThrowError(RegisterError);
    }
  }
});
