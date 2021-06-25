function Const(value) {
    this.value = value;
}
function Address(value) {
    this.value = value;
}
function Reference(value) {
    this.value = value;
}
function Label(value) {
    this.value = value;
}

function Load(argument) {
    this.argument = argument;
}
function Store(argument) {
    this.argument = argument;
}
function Add(argument) {
    this.argument = argument;
}
function Sub(argument) {
    this.argument = argument;
}
function Mult(argument) {
    this.argument = argument;
}
function Div(argument) {
    this.argument = argument;
}
function Read(argument) {
    this.argument = argument;
}
function Write(argument) {
    this.argument = argument;
}
function Jump(argument) {
    this.argument = argument;
}
function Jgtz(argument) {
    this.argument = argument;
}
function Jzero(argument) {
    this.argument = argument;
}
function Halt() {};
function Skip() {};

function Combine(instruction, nextInstruction) {
    this.instruction = instruction;
    this.nextInstruction = nextInstruction;
}
function Program(labels, programTree) {
    this.labels = labels;
    this.programTree = programTree;
}

module.exports = {
  Const, 
  Address,
  Reference,
  Label,
  Load,
  Store,
  Add,
  Sub,
  Mult,
  Div,
  Read,
  Write,
  Jump,
  Jgtz,
  Jzero,
  Halt,
  Skip,
  Combine,
  Program
}
