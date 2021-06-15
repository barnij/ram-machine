const ERROR_CODE = null;
const EMPTY_LINE = /^\s*$/;
const SPACE = /\s+/;

function parse_instruction(instruction) {
  instruction = instruction.split(SPACE).filter((x) => {return x != ''});
  return {instruction: instruction[0], argument: instruction[1]};
}

function parse_line(line) {
  line = line.split('#')[0];
  if (line.match(EMPTY_LINE)) {
    return {instruction: "skip"};
  }
  let lines = line.split(':');
  if (lines.length > 2) {
    return ERROR_CODE;
  } else if (lines.length == 2) {
    var result = {label: lines[0]};
    var inst = lines[1];
  } else {
    result = {};
    inst = lines[0];
  }
  inst = parse_instruction(inst);
  result.instruction = inst.instruction;
  result.argument = inst.argument;
  return result;
}

function parse_string(str) {
  let lines = str.split('\n').filter((x) => {return !x.match(EMPTY_LINE)});
  lines.push('halt');
  let tree = {labels: {}};
  tree.prog = parse_line(lines[lines.length-1]);
  if (tree.prog == ERROR_CODE) {
    return ERROR_CODE;
  }
  if (tree.prog.label) {
    tree.labels[tree.prog.label] = tree.prog;
  }
  for (i=lines.length-2; i>=0; i--) {
    let inst = parse_line(lines[i]);
    if (inst == ERROR_CODE) {
      return ERROR_CODE;
    }
    tree.prog = {instruction: "combine", arg1: inst, arg2: tree.prog};
    if (inst.label) {
      tree.labels[inst.label] = tree.prog;
    }
  }
  return tree;
}

const fs = require('fs');
function parse_file(filepath) {
  var src = fs.readFileSync(filepath, 'utf-8');
  return parse_string(src);
}

module.exports = {
  parse_file,
  parse_string,
  parse_line,
  parse_instruction
}