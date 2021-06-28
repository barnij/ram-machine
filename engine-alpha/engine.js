const environment = require('./environment');
const parser = require('./parser');
const interpreter = require('./interpreter');
const status = require('./status');

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
  let success = interpreter.interpInstruction(state);
  return success;
}

function complete(state) {
  while (!state.completed) {
    let success = interpreter.interpInstruction(state);
    if (success.constructor == status.Ok) {
      continue;
    }
    return success;
  }
  return new status.Ok();
}

function getOutput(state) {
  return state.env.output;
}

function getRegisters(state) {
  return state.env.registers;
}

module.exports = {
  makeStateFromFile,
  makeStateFromString,
  getOutput,
  getRegisters,
  stepInstruction,
  complete
}