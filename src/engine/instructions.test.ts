import * as ast from './ast';
import * as inst from './instructions';
import {RegisterError, InputError} from './errors';
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

test('instructionAdd - add empty reference to accumulator throws RegisterError', () => {
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

test('instructionAdd - add empty reference to empty accumulator throws RegisterError', () => {
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

test('instructionAdd - add reference to empty register to empty accumulator throws RegisterError', () => {
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

// instructionSub
test('instructionSub - sub constant value', () => {
  const program = 'sub =23';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(inst.ACCUMULATOR, BigInt(8));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Sub);
  const instruction = combine.instruction as ast.Sub;
  const actionResult = inst.instructionSub(instruction, state);
  expect(actionResult).toBeInstanceOf(Ok);
  expect(state.environmet.registers.get(inst.ACCUMULATOR)).toStrictEqual(
    BigInt(-15)
  );
});

test('instructionSub - sub value from register', () => {
  const program = 'sub 24';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(inst.ACCUMULATOR, BigInt(8));
  state.environmet.registers.set(BigInt(24), BigInt(23));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Sub);
  const instruction = combine.instruction as ast.Sub;
  const actionResult = inst.instructionSub(instruction, state);
  expect(actionResult).toBeInstanceOf(Ok);
  expect(state.environmet.registers.get(inst.ACCUMULATOR)).toStrictEqual(
    BigInt(-15)
  );
});

test('instructionSub - sub value from refrerence', () => {
  const program = 'sub ^25';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(inst.ACCUMULATOR, BigInt(8));
  state.environmet.registers.set(BigInt(25), BigInt(30));
  state.environmet.registers.set(BigInt(30), BigInt(23));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Sub);
  const instruction = combine.instruction as ast.Sub;
  const actionResult = inst.instructionSub(instruction, state);
  expect(actionResult).toBeInstanceOf(Ok);
  expect(state.environmet.registers.get(inst.ACCUMULATOR)).toStrictEqual(
    BigInt(-15)
  );
});

test('instructionSub - sub constant value from empty accumulator throws RegisterError', () => {
  const program = 'sub =23';
  const state = ENGINE.makeStateFromString(program, []);
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Sub);
  const instruction = combine.instruction as ast.Sub;
  expect(() => inst.instructionSub(instruction, state)).toThrowError(
    RegisterError
  );
});

test('instructionSub - sub value from register from empty accumulator throws RegisterError', () => {
  const program = 'sub 23';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(BigInt(23), BigInt(17));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Sub);
  const instruction = combine.instruction as ast.Sub;
  expect(() => inst.instructionSub(instruction, state)).toThrowError(
    RegisterError
  );
});

test('instructionSub - sub empty register throws RegisterError', () => {
  const program = 'sub 23';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(inst.ACCUMULATOR, BigInt(17));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Sub);
  const instruction = combine.instruction as ast.Sub;
  expect(() => inst.instructionSub(instruction, state)).toThrowError(
    RegisterError
  );
});

test('instructionSub - sub empty register from empty accumulator throws RegisterError', () => {
  const program = 'sub 23';
  const state = ENGINE.makeStateFromString(program, []);
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Sub);
  const instruction = combine.instruction as ast.Sub;
  expect(() => inst.instructionSub(instruction, state)).toThrowError(
    RegisterError
  );
});

test('instructionSub - sub empty reference from accumulator throws RegisterError', () => {
  const program = 'sub ^23';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(inst.ACCUMULATOR, BigInt(12));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Sub);
  const instruction = combine.instruction as ast.Sub;
  expect(() => inst.instructionSub(instruction, state)).toThrowError(
    RegisterError
  );
});

test('instructionSub - sub reference to empty register to accumulator throws RegisterError', () => {
  const program = 'sub ^23';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(inst.ACCUMULATOR, BigInt(12));
  state.environmet.registers.set(BigInt(23), BigInt(16));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Sub);
  const instruction = combine.instruction as ast.Sub;
  expect(() => inst.instructionSub(instruction, state)).toThrowError(
    RegisterError
  );
});

test('instructionSub - sub empty reference from empty accumulator throws RegisterError', () => {
  const program = 'sub ^23';
  const state = ENGINE.makeStateFromString(program, []);
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Sub);
  const instruction = combine.instruction as ast.Sub;
  expect(() => inst.instructionSub(instruction, state)).toThrowError(
    RegisterError
  );
});

test('instructionSub - sub reference to empty register from empty accumulator throws RegisterError', () => {
  const program = 'sub ^23';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(BigInt(23), BigInt(16));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Sub);
  const instruction = combine.instruction as ast.Sub;
  expect(() => inst.instructionSub(instruction, state)).toThrowError(
    RegisterError
  );
});

// instructionMult
test('instructionMult - mult constant value', () => {
  const program = 'mult =23';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(inst.ACCUMULATOR, BigInt(8));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Mult);
  const instruction = combine.instruction as ast.Mult;
  const actionResult = inst.instructionMult(instruction, state);
  expect(actionResult).toBeInstanceOf(Ok);
  expect(state.environmet.registers.get(inst.ACCUMULATOR)).toStrictEqual(
    BigInt(184)
  );
});

test('instructionMult - mult value from register', () => {
  const program = 'mult 24';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(inst.ACCUMULATOR, BigInt(8));
  state.environmet.registers.set(BigInt(24), BigInt(23));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Mult);
  const instruction = combine.instruction as ast.Mult;
  const actionResult = inst.instructionMult(instruction, state);
  expect(actionResult).toBeInstanceOf(Ok);
  expect(state.environmet.registers.get(inst.ACCUMULATOR)).toStrictEqual(
    BigInt(184)
  );
});

test('instructionMult - mult value from refrerence', () => {
  const program = 'mult ^25';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(inst.ACCUMULATOR, BigInt(8));
  state.environmet.registers.set(BigInt(25), BigInt(30));
  state.environmet.registers.set(BigInt(30), BigInt(23));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Mult);
  const instruction = combine.instruction as ast.Mult;
  const actionResult = inst.instructionMult(instruction, state);
  expect(actionResult).toBeInstanceOf(Ok);
  expect(state.environmet.registers.get(inst.ACCUMULATOR)).toStrictEqual(
    BigInt(184)
  );
});

test('instructionMult - mult constant value by empty accumulator throws RegisterError', () => {
  const program = 'mult =23';
  const state = ENGINE.makeStateFromString(program, []);
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Mult);
  const instruction = combine.instruction as ast.Mult;
  expect(() => inst.instructionMult(instruction, state)).toThrowError(
    RegisterError
  );
});

test('instructionMult - mult value from register by empty accumulator throws RegisterError', () => {
  const program = 'mult 23';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(BigInt(23), BigInt(17));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Mult);
  const instruction = combine.instruction as ast.Mult;
  expect(() => inst.instructionMult(instruction, state)).toThrowError(
    RegisterError
  );
});

test('instructionMult - mult empty register throws RegisterError', () => {
  const program = 'mult 23';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(inst.ACCUMULATOR, BigInt(17));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Mult);
  const instruction = combine.instruction as ast.Mult;
  expect(() => inst.instructionMult(instruction, state)).toThrowError(
    RegisterError
  );
});

test('instructionMult - mult empty register by empty accumulator throws RegisterError', () => {
  const program = 'mult 23';
  const state = ENGINE.makeStateFromString(program, []);
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Mult);
  const instruction = combine.instruction as ast.Mult;
  expect(() => inst.instructionMult(instruction, state)).toThrowError(
    RegisterError
  );
});

test('instructionMult - mult empty reference by accumulator throws RegisterError', () => {
  const program = 'mult ^23';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(inst.ACCUMULATOR, BigInt(12));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Mult);
  const instruction = combine.instruction as ast.Mult;
  expect(() => inst.instructionMult(instruction, state)).toThrowError(
    RegisterError
  );
});

test('instructionMult - mult reference to empty register by accumulator throws RegisterError', () => {
  const program = 'mult ^23';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(inst.ACCUMULATOR, BigInt(12));
  state.environmet.registers.set(BigInt(23), BigInt(16));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Mult);
  const instruction = combine.instruction as ast.Mult;
  expect(() => inst.instructionMult(instruction, state)).toThrowError(
    RegisterError
  );
});

test('instructionMult - mult empty reference by empty accumulator throws RegisterError', () => {
  const program = 'mult ^23';
  const state = ENGINE.makeStateFromString(program, []);
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Mult);
  const instruction = combine.instruction as ast.Mult;
  expect(() => inst.instructionMult(instruction, state)).toThrowError(
    RegisterError
  );
});

test('instructionMult - mult reference to empty register by empty accumulator throws RegisterError', () => {
  const program = 'mult ^23';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(BigInt(23), BigInt(16));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Mult);
  const instruction = combine.instruction as ast.Mult;
  expect(() => inst.instructionMult(instruction, state)).toThrowError(
    RegisterError
  );
});

// instructionDiv
test('instructionDiv - div constant value', () => {
  const program = 'div =8';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(inst.ACCUMULATOR, BigInt(23));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Div);
  const instruction = combine.instruction as ast.Div;
  const actionResult = inst.instructionDiv(instruction, state);
  expect(actionResult).toBeInstanceOf(Ok);
  expect(state.environmet.registers.get(inst.ACCUMULATOR)).toStrictEqual(
    BigInt(2)
  );
});

test('instructionDiv - div value from register', () => {
  const program = 'div 24';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(inst.ACCUMULATOR, BigInt(23));
  state.environmet.registers.set(BigInt(24), BigInt(8));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Div);
  const instruction = combine.instruction as ast.Div;
  const actionResult = inst.instructionDiv(instruction, state);
  expect(actionResult).toBeInstanceOf(Ok);
  expect(state.environmet.registers.get(inst.ACCUMULATOR)).toStrictEqual(
    BigInt(2)
  );
});

test('instructionDiv - div value from refrerence', () => {
  const program = 'div ^25';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(inst.ACCUMULATOR, BigInt(23));
  state.environmet.registers.set(BigInt(25), BigInt(30));
  state.environmet.registers.set(BigInt(30), BigInt(8));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Div);
  const instruction = combine.instruction as ast.Div;
  const actionResult = inst.instructionDiv(instruction, state);
  expect(actionResult).toBeInstanceOf(Ok);
  expect(state.environmet.registers.get(inst.ACCUMULATOR)).toStrictEqual(
    BigInt(2)
  );
});

test('instructionDiv - div empty accumulator by constant value throws RegisterError', () => {
  const program = 'div =23';
  const state = ENGINE.makeStateFromString(program, []);
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Div);
  const instruction = combine.instruction as ast.Div;
  expect(() => inst.instructionDiv(instruction, state)).toThrowError(
    RegisterError
  );
});

test('instructionDiv - div empty accumulator by value from register throws RegisterError', () => {
  const program = 'div 23';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(BigInt(23), BigInt(17));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Div);
  const instruction = combine.instruction as ast.Div;
  expect(() => inst.instructionDiv(instruction, state)).toThrowError(
    RegisterError
  );
});

test('instructionDiv - div empty register throws RegisterError', () => {
  const program = 'div 23';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(inst.ACCUMULATOR, BigInt(17));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Div);
  const instruction = combine.instruction as ast.Div;
  expect(() => inst.instructionDiv(instruction, state)).toThrowError(
    RegisterError
  );
});

test('instructionDiv - div empty accumulator by empty register throws RegisterError', () => {
  const program = 'div 23';
  const state = ENGINE.makeStateFromString(program, []);
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Div);
  const instruction = combine.instruction as ast.Div;
  expect(() => inst.instructionDiv(instruction, state)).toThrowError(
    RegisterError
  );
});

test('instructionDiv - div accumulator by empty reference throws RegisterError', () => {
  const program = 'div ^23';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(inst.ACCUMULATOR, BigInt(12));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Div);
  const instruction = combine.instruction as ast.Div;
  expect(() => inst.instructionDiv(instruction, state)).toThrowError(
    RegisterError
  );
});

test('instructionDiv - div accumulator by reference to empty register throws RegisterError', () => {
  const program = 'div ^23';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(inst.ACCUMULATOR, BigInt(12));
  state.environmet.registers.set(BigInt(23), BigInt(16));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Div);
  const instruction = combine.instruction as ast.Div;
  expect(() => inst.instructionDiv(instruction, state)).toThrowError(
    RegisterError
  );
});

test('instructionDiv - div empty accumulator by empty reference throws RegisterError', () => {
  const program = 'div ^23';
  const state = ENGINE.makeStateFromString(program, []);
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Div);
  const instruction = combine.instruction as ast.Div;
  expect(() => inst.instructionDiv(instruction, state)).toThrowError(
    RegisterError
  );
});

test('instructionDiv - div empty accumulator by reference to empty register throws RegisterError', () => {
  const program = 'div ^23';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(BigInt(23), BigInt(16));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Div);
  const instruction = combine.instruction as ast.Div;
  expect(() => inst.instructionDiv(instruction, state)).toThrowError(
    RegisterError
  );
});

// instructionRead
test('instructionRead - read to register', () => {
  const program = 'read 8';
  const state = ENGINE.makeStateFromString(program, [BigInt(23)]);
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Read);
  const instruction = combine.instruction as ast.Read;
  const actionResult = inst.instructionRead(instruction, state);
  expect(actionResult).toBeInstanceOf(Ok);
  expect(state.environmet.registers.get(BigInt(8))).toStrictEqual(BigInt(23));
});

test('instructionRead - read to reference', () => {
  const program = 'read ^8';
  const state = ENGINE.makeStateFromString(program, [BigInt(23)]);
  state.environmet.registers.set(BigInt(8), BigInt(15));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Read);
  const instruction = combine.instruction as ast.Read;
  const actionResult = inst.instructionRead(instruction, state);
  expect(actionResult).toBeInstanceOf(Ok);
  expect(state.environmet.registers.get(BigInt(15))).toStrictEqual(BigInt(23));
});

test('instructionRead - read to empty reference throws RegisterError', () => {
  const program = 'read ^8';
  const state = ENGINE.makeStateFromString(program, [BigInt(23)]);
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Read);
  const instruction = combine.instruction as ast.Read;
  expect(() => inst.instructionRead(instruction, state)).toThrowError(
    RegisterError
  );
});

test('instructionRead - read to register from empty inputTape throws InputError', () => {
  const program = 'read 8';
  const state = ENGINE.makeStateFromString(program, []);
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Read);
  const instruction = combine.instruction as ast.Read;
  expect(() => inst.instructionRead(instruction, state)).toThrowError(
    InputError
  );
});

test('instructionRead - read to reference from empty inputTape throws InputError', () => {
  const program = 'read ^10';
  const state = ENGINE.makeStateFromString(program, []);
  state.environmet.registers.set(BigInt(10), BigInt(15));
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Read);
  const instruction = combine.instruction as ast.Read;
  expect(() => inst.instructionRead(instruction, state)).toThrowError(
    InputError
  );
});

test('instructionRead - read to empty reference from empty inputTape throws RegisterError', () => {
  const program = 'read ^10';
  const state = ENGINE.makeStateFromString(program, []);
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Read);
  const instruction = combine.instruction as ast.Read;
  expect(() => inst.instructionRead(instruction, state)).toThrowError(
    RegisterError
  );
});
