const ERROR_CODE = null;
const EMPTY_LINE = /^\s*$/;
const SPACE = /\s+/;

function parseInstruction(instruction) {
  instruction = instruction.split(SPACE).filter((x) => {return x != ''});
  return {instruction: instruction[0], argument: instruction[1]};
}

function parseLine(line) {
  line = line.split('#')[0];
  if (line.match(EMPTY_LINE)) {
    return {instruction: "skip", argument: null, label: null};
  }
  let lines = line.split(':');
  if (lines.length > 2) {
    return ERROR_CODE;
  } else if (lines.length == 2) {
    var result = {label: lines[0]};
    var inst = lines[1];
  } else {
    result = {label: null};
    inst = lines[0];
  }
  inst = parseInstruction(inst);
  result.instruction = inst.instruction;
  result.argument = inst.argument;
  return result;
}

function parseString(str) {
  let lines = str.split('\n').filter((x) => {return !x.match(EMPTY_LINE)});
  lines.push('halt');
  let tree = {labels: {}};
  tree.prog = parseLine(lines[lines.length-1]);
  if (tree.prog == ERROR_CODE) {
    return ERROR_CODE;
  }
  if (tree.prog.label) {
    tree.labels[tree.prog.label] = tree.prog;
  }
  for (i=lines.length-2; i>=0; i--) {
    let inst = parseLine(lines[i]);
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
function parseFile(filepath) {
  var src = fs.readFileSync(filepath, 'utf-8');
  return parseString(src);
}

module.exports = {
  parseFile,
  parseString,
  parseLine,
  parseInstruction
}