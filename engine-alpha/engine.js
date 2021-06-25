const parser = require('./parser');
const interpreter = require('./interpreter');

function makeEmptyEnv(input) {
  let env = {};
  env.input = input;
  env.inputHead = 0;
  env.output = [];
  env.outputHead = 0;
  env.registers = new Map();
  return env;
}

function makeStateFromFile(filepath, input=[]) {
  let state = {};
  state.env = makeEmptyEnv(input);
  state.program = parser.parseFile(filepath);
  state.programHead = result.program.prog;
  state.completed = false;
  return state;
}

function makeStateFromString(str, input=[]) {
  let state = {};
  state.env = makeEmptyEnv(input);
  state.program = parser.parseString(str);
  state.programHead = result.program.prog;
  state.completed = false;
  return state;
}

function stepInstruction(state) {
  // TODO
}

function complete(state) {
  // TODO
}

function getOutput(state) {
  return state.output;
}

function getRegisters(state) {
  return state.registers;
}


module.exports = {
  makeStateFromFile,
  makeStateFromString,
  getOutput,
  getRegisters,
  stepInstruction,
  complete
}