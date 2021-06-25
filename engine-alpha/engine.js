const parser = require('./parser');
const interpreter = require('./interpreter');

function makeEmptyEnv(input) {
  let result = {};
  result.input = input;
  result.inputHead = 0;
  result.output = [];
  result.outputHead = 0;
  result.registers = new Map();
  return result;
}

function makeStateFromFile(filepath, input=[]) {
  let result = {};
  result = makeEmptyEnv(input);
  result.program = parser.parseFile(filepath);
  result.programHead = result.program.prog;
  result.completed = false;
  return result;
}

function makeStateFromString(str, input=[]) {
  let result = {};
  result = makeEmptyEnv(input);
  result.program = parser.parseString(str);
  result.programHead = result.program.prog;
  result.completed = false;
  return result;
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