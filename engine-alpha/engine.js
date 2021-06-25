const environment = require('./environment');
const parser = require('./parser');
const interpreter = require('./interpreter');

function makeStateFromFile(filepath, input=[]) {
  let env = new environment.Env(input);
  let program = parser.parseFile(filepath);
  let state = new environment.State(program, env);
  return state;
}

function makeStateFromString(str, input=[]) {
  let env = new environment.Env(input);
  let program = parser.parseString(str);
  let state = new environment.State(program, env);
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