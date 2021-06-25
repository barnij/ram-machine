function Env(input) {
  this.input = input;
  this.inputHead = 0;
  this.output = [];
  this.outputHead = 0;
  this.registers = new Map();  
}

function State(program, env) {
  this.env = env;
  this.program = program;
  this.programHead = program.programTree;
  this.completed = false;  
}

module.exports = {
  Env,
  State
}