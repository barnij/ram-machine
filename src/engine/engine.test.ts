import * as ast from './ast';
import * as inst from './instructions';
import {Engine} from './engine';
import {Parser} from './parser';
import {Interpreter} from './interpreter';
import {Ok} from './status';
import {State, Environment} from './environment';

const ENGINE = new Engine(new Parser(), new Interpreter());

// Engine class
test('Engine: makeStateFromString', () => {
  const program = new ast.Program(
    new Map<string, ast.Instruction>(),
    new ast.Combine(new ast.Halt(), new ast.Halt())
  );
  const state = new State(program, new Environment([]));
  expect(ENGINE.makeStateFromString('halt', [])).toStrictEqual(state);
});

test('Engine: stepInstruction - step single instruction', () => {
  const program = new ast.Program(
    new Map<string, ast.Instruction>(),
    new ast.Combine(
      new ast.Load(new ast.Const(BigInt(1))),
      new ast.Combine(new ast.Add(new ast.Const(BigInt(2))), new ast.Halt())
    )
  );
  const targetState = new State(program, new Environment([]));
  const state = ENGINE.makeStateFromString('load =1\nadd =2', []);
  expect(state).toStrictEqual(targetState);
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Load);
  const actionResult = ENGINE.stepInstruction(state);
  expect(actionResult).toBeInstanceOf(Ok);
  targetState.environment.registers.set(inst.ACCUMULATOR, BigInt(1));
  const targetCombine = targetState.nextInstruction as ast.Combine;
  targetState.nextInstruction = targetCombine.nextInstruction;
  expect(state).toStrictEqual(targetState);
});

test('Engine: stepInstruction - interp 2 instructions program step by step', () => {
  const program = new ast.Program(
    new Map<string, ast.Instruction>(),
    new ast.Combine(
      new ast.Load(new ast.Const(BigInt(1))),
      new ast.Combine(new ast.Add(new ast.Const(BigInt(2))), new ast.Halt())
    )
  );
  const targetState = new State(program, new Environment([]));
  const state = ENGINE.makeStateFromString('load =1\nadd =2', []);
  expect(state).toStrictEqual(targetState);
  expect(state.nextInstruction).toBeInstanceOf(ast.Combine);
  const combine = state.nextInstruction as ast.Combine;
  expect(combine.instruction).toBeInstanceOf(ast.Load);
  let actionResult = ENGINE.stepInstruction(state);
  expect(actionResult).toBeInstanceOf(Ok);
  targetState.environment.registers.set(inst.ACCUMULATOR, BigInt(1));
  let targetCombine = targetState.nextInstruction as ast.Combine;
  targetState.nextInstruction = targetCombine.nextInstruction;
  expect(state).toStrictEqual(targetState);
  actionResult = ENGINE.stepInstruction(state);
  expect(actionResult).toBeInstanceOf(Ok);
  targetState.environment.registers.set(inst.ACCUMULATOR, BigInt(3));
  targetCombine = targetState.nextInstruction as ast.Combine;
  targetState.nextInstruction = targetCombine.nextInstruction;
  expect(state).toStrictEqual(targetState);
  actionResult = ENGINE.stepInstruction(state);
  expect(actionResult).toBeInstanceOf(Ok);
  targetState.completed = true;
  expect(state).toStrictEqual(targetState);
});

test('Engine: complete - interp 2 instructions', () => {
  const program = new ast.Program(
    new Map<string, ast.Instruction>(),
    new ast.Combine(
      new ast.Load(new ast.Const(BigInt(1))),
      new ast.Combine(new ast.Add(new ast.Const(BigInt(2))), new ast.Halt())
    )
  );
  const targetState = new State(program, new Environment([]));
  const state = ENGINE.makeStateFromString('load =1\nadd =2', []);
  expect(state).toStrictEqual(targetState);
  const actionResult = ENGINE.complete(state);
  expect(actionResult).toBeInstanceOf(Ok);
  targetState.environment.registers.set(inst.ACCUMULATOR, BigInt(3));
  targetState.completed = true;
  targetState.nextInstruction = new ast.Halt();
  expect(state).toStrictEqual(targetState);
});
