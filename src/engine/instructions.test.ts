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

// instructionStore
test('instructionStore - store value in register', () => {
  const program = 'store 177';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(inst.ACCUMULATOR, BigInt(1234));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  if (state.nextInstruction instanceof ast.Combine) {
    expect(state.nextInstruction.instruction).toBeInstanceOf(ast.Store);
    const instruction = state.nextInstruction.instruction;
    if (instruction instanceof ast.Store) {
      const actionResult = inst.instructionStore(instruction, state);
      expect(actionResult).toBeInstanceOf(Ok);
      expect(state.environmet.registers.get(BigInt(177))).toStrictEqual(
        BigInt(1234)
      );
    }
  }
});

test('instructionStore - store value in reference', () => {
  const program = 'store ^177';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(inst.ACCUMULATOR, BigInt(1234));
  state.environmet.registers.set(BigInt(177), BigInt(1235));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  if (state.nextInstruction instanceof ast.Combine) {
    expect(state.nextInstruction.instruction).toBeInstanceOf(ast.Store);
    const instruction = state.nextInstruction.instruction;
    if (instruction instanceof ast.Store) {
      const actionResult = inst.instructionStore(instruction, state);
      expect(actionResult).toBeInstanceOf(Ok);
      expect(state.environmet.registers.get(BigInt(1235))).toStrictEqual(
        BigInt(1234)
      );
    }
  }
});

test('instructionStore - store empty accumulator in register throws RegisterError', () => {
  const program = 'store 177';
  const state = ENGINE.makeStateFromString(program, []);
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  if (state.nextInstruction instanceof ast.Combine) {
    expect(state.nextInstruction.instruction).toBeInstanceOf(ast.Store);
    const instruction = state.nextInstruction.instruction;
    if (instruction instanceof ast.Store) {
      expect(() => inst.instructionStore(instruction, state)).toThrowError(
        RegisterError
      );
    }
  }
});

test('instructionStore - store empty accumulator in empty reference throws RegisterError', () => {
  const program = 'store ^177';
  const state = ENGINE.makeStateFromString(program, []);
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  if (state.nextInstruction instanceof ast.Combine) {
    expect(state.nextInstruction.instruction).toBeInstanceOf(ast.Store);
    const instruction = state.nextInstruction.instruction;
    if (instruction instanceof ast.Store) {
      expect(() => inst.instructionStore(instruction, state)).toThrowError(
        RegisterError
      );
    }
  }
});
