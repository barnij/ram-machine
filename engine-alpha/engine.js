const parser = require('./parser');
const interpreter = require('./interpreter');

function make_empty_env(input, output) {
  let result = {};
  result.input = input;
  result.input_it = 0;
  result.output = output;
  result.output_it = 0;
  result.env = [];
  return result;
}

function make_state_from_file(filepath, input=[], output=[]) {
  let result = {};
  result = make_empty_env(input, output);
  result.program = parser.parse_file(filepath);
  result.prog_it = result.program.prog;
  return result;
}

function make_state_from_string(str, input=[], output=[]) {
  let result = {};
  result = make_empty_env(input, output);
  result.program = parser.parse_string(str);
  result.prog_it = result.program.prog;
  return result;
}

function step_instruction(state) {
  // TODO
}

function complete(state) {
  // TODO
}

function get_output(state) {
  return state.output;
}

function get_env(state) {
  return state.env;
}


module.exports = {
  make_state_from_file,
  make_state_from_string,
  get_output,
  get_env,
  step_instruction,
  complete
}

console.log(make_state_from_file("../../example.ramcode"));