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
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Load);
  const instruction = combine.instruction as ast.Load;
  const actionResult = inst.instructionLoad(instruction, state);
  expect(actionResult).toBeInstanceOf(Ok);
  expect(state.environmet.registers.get(inst.ACCUMULATOR)).toStrictEqual(
    BigInt(17)
  );
});

test('instructionLoad - load value from register', () => {
  const program = 'load 17';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(BigInt(17), BigInt(24));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Load);
  const instruction = combine.instruction as ast.Load;
  const actionResult = inst.instructionLoad(instruction, state);
  expect(actionResult).toBeInstanceOf(Ok);
  expect(state.environmet.registers.get(inst.ACCUMULATOR)).toStrictEqual(
    BigInt(24)
  );
});

test('instructionLoad - load value from reference', () => {
  const program = 'load ^17';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(BigInt(17), BigInt(24));
  state.environmet.registers.set(BigInt(24), BigInt(78123));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Load);
  const instruction = combine.instruction as ast.Load;
  const actionResult = inst.instructionLoad(instruction, state);
  expect(actionResult).toBeInstanceOf(Ok);
  expect(state.environmet.registers.get(inst.ACCUMULATOR)).toStrictEqual(
    BigInt(78123)
  );
});

test('instructionLoad - load value from empty register throws RegisterError', () => {
  const program = 'load 17';
  const state = ENGINE.makeStateFromString(program, []);
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Load);
  const instruction = combine.instruction as ast.Load;
  expect(() => inst.instructionLoad(instruction, state)).toThrowError(
    RegisterError
  );
});

test('instructionLoad - load value from empty reference throws RegisterError', () => {
  const program = 'load ^24';
  const state = ENGINE.makeStateFromString(program, []);
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Load);
  const instruction = combine.instruction as ast.Load;
  expect(() => inst.instructionLoad(instruction, state)).toThrowError(
    RegisterError
  );
});

test('instructionLoad - load value from reference to empty register throws RegisterError', () => {
  const program = 'load ^24';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(BigInt(24), BigInt(78123));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Load);
  const instruction = combine.instruction as ast.Load;
  expect(() => inst.instructionLoad(instruction, state)).toThrowError(
    RegisterError
  );
});

// instructionStore
test('instructionStore - store value in register', () => {
  const program = 'store 177';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(inst.ACCUMULATOR, BigInt(1234));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Store);
  const instruction = combine.instruction as ast.Store;
  const actionResult = inst.instructionStore(instruction, state);
  expect(actionResult).toBeInstanceOf(Ok);
  expect(state.environmet.registers.get(BigInt(177))).toStrictEqual(
    BigInt(1234)
  );
});

test('instructionStore - store value in reference', () => {
  const program = 'store ^177';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(inst.ACCUMULATOR, BigInt(1234));
  state.environmet.registers.set(BigInt(177), BigInt(1235));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Store);
  const instruction = combine.instruction as ast.Store;
  const actionResult = inst.instructionStore(instruction, state);
  expect(actionResult).toBeInstanceOf(Ok);
  expect(state.environmet.registers.get(BigInt(1235))).toStrictEqual(
    BigInt(1234)
  );
});

test('instructionStore - store empty accumulator in register throws RegisterError', () => {
  const program = 'store 177';
  const state = ENGINE.makeStateFromString(program, []);
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Store);
  const instruction = combine.instruction as ast.Store;
  expect(() => inst.instructionStore(instruction, state)).toThrowError(
    RegisterError
  );
});

test('instructionStore - store empty accumulator in empty reference throws RegisterError', () => {
  const program = 'store ^177';
  const state = ENGINE.makeStateFromString(program, []);
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Store);
  const instruction = combine.instruction as ast.Store;
  expect(() => inst.instructionStore(instruction, state)).toThrowError(
    RegisterError
  );
});

// instructionAdd
test('instructionAdd - add constant value', () => {
  const program = 'add =23';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(inst.ACCUMULATOR, BigInt(8));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Add);
  const instruction = combine.instruction as ast.Add;
  const actionResult = inst.instructionAdd(instruction, state);
  expect(actionResult).toBeInstanceOf(Ok);
  expect(state.environmet.registers.get(inst.ACCUMULATOR)).toStrictEqual(
    BigInt(31)
  );
});

test('instructionAdd - add value from register', () => {
  const program = 'add 24';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(inst.ACCUMULATOR, BigInt(8));
  state.environmet.registers.set(BigInt(24), BigInt(23));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Add);
  const instruction = combine.instruction as ast.Add;
  const actionResult = inst.instructionAdd(instruction, state);
  expect(actionResult).toBeInstanceOf(Ok);
  expect(state.environmet.registers.get(inst.ACCUMULATOR)).toStrictEqual(
    BigInt(31)
  );
});

test('instructionAdd - add value from refrerence', () => {
  const program = 'add ^25';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(inst.ACCUMULATOR, BigInt(8));
  state.environmet.registers.set(BigInt(25), BigInt(30));
  state.environmet.registers.set(BigInt(30), BigInt(23));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Add);
  const instruction = combine.instruction as ast.Add;
  const actionResult = inst.instructionAdd(instruction, state);
  expect(actionResult).toBeInstanceOf(Ok);
  expect(state.environmet.registers.get(inst.ACCUMULATOR)).toStrictEqual(
    BigInt(31)
  );
});

test('instructionAdd - add constant value to empty accumulator throws RegisterError', () => {
  const program = 'add =23';
  const state = ENGINE.makeStateFromString(program, []);
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Add);
  const instruction = combine.instruction as ast.Add;
  expect(() => inst.instructionAdd(instruction, state)).toThrowError(
    RegisterError
  );
});

test('instructionAdd - add value from register to empty accumulator throws RegisterError', () => {
  const program = 'add 23';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(BigInt(23), BigInt(17));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Add);
  const instruction = combine.instruction as ast.Add;
  expect(() => inst.instructionAdd(instruction, state)).toThrowError(
    RegisterError
  );
});

test('instructionAdd - add empty register throws RegisterError', () => {
  const program = 'add 23';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(inst.ACCUMULATOR, BigInt(17));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Add);
  const instruction = combine.instruction as ast.Add;
  expect(() => inst.instructionAdd(instruction, state)).toThrowError(
    RegisterError
  );
});

test('instructionAdd - add empty register to empty accumulator throws RegisterError', () => {
  const program = 'add 23';
  const state = ENGINE.makeStateFromString(program, []);
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Add);
  const instruction = combine.instruction as ast.Add;
  expect(() => inst.instructionAdd(instruction, state)).toThrowError(
    RegisterError
  );
});

test('instructionAdd - add value from empty reference to accumulator throws RegisterError', () => {
  const program = 'add ^23';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(inst.ACCUMULATOR, BigInt(12));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Add);
  const instruction = combine.instruction as ast.Add;
  expect(() => inst.instructionAdd(instruction, state)).toThrowError(
    RegisterError
  );
});

test('instructionAdd - add value from reference to empty register to accumulator throws RegisterError', () => {
  const program = 'add ^23';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(inst.ACCUMULATOR, BigInt(12));
  state.environmet.registers.set(BigInt(23), BigInt(16));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Add);
  const instruction = combine.instruction as ast.Add;
  expect(() => inst.instructionAdd(instruction, state)).toThrowError(
    RegisterError
  );
});

test('instructionAdd - add value from empty reference to empty accumulator throws RegisterError', () => {
  const program = 'add ^23';
  const state = ENGINE.makeStateFromString(program, []);
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Add);
  const instruction = combine.instruction as ast.Add;
  expect(() => inst.instructionAdd(instruction, state)).toThrowError(
    RegisterError
  );
});

test('instructionAdd - add value from reference to empty register to empty accumulator throws RegisterError', () => {
  const program = 'add ^23';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(BigInt(23), BigInt(16));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Add);
  const instruction = combine.instruction as ast.Add;
  expect(() => inst.instructionAdd(instruction, state)).toThrowError(
    RegisterError
  );
});
