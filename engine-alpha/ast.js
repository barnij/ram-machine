function Operandum(value) {
    this.value = value;
}

function Const(value) {
    Operandum.call(this, value);    
}
Const.prototype = Object.create(Operandum.prototype);
Object.defineProperty(Const.prototype, 'constructor', {
    value: Const,
    enumerable: false,
    writable: true
});

function Address(value) {
    Operandum.call(this, value);    
}
Address.prototype = Object.create(Operandum.prototype);
Object.defineProperty(Address.prototype, 'constructor', {
    value: Address,
    enumerable: false, 
    writable: true
});

function Reference(value) {
    Operandum.call(this, value);    
}
Reference.prototype = Object.create(Operandum.prototype);
Object.defineProperty(Reference.prototype, 'constructor', {
    value: Reference,
    enumerable: false, 
    writable: true
});

function Label(value) {
    this.value = value;
}

function Load(argument) {
    this.argument = argument;
}
Load.prototype.validateArgument = function () {
    return this.argument instanceof Operandum && !(this.argument instanceof Const);
    // alternativly
    // return this.argument instanceof Reference || this.argument instanceof Address;
}
function Store(argument) {
    this.argument = argument;
}
Store.prototype.validateArgument = function () {
    return this.argument instanceof Operandum && !(this.argument instanceof Const);
}

function Add(argument) {
    this.argument = argument;
}
Add.prototype.validateArgument = function () {
    return this.argument instanceof Operandum;
}

function Sub(argument) {
    this.argument = argument;
}
Sub.prototype.validateArgument = function () {
    return this.argument instanceof Operandum;
}

function Mult(argument) {
    this.argument = argument;
}
Mult.prototype.validateArgument = function () {
    return this.argument instanceof Operandum;
}

function Div(argument) {
    this.argument = argument;
}
Div.prototype.validateArgument = function () {
    return this.argument instanceof Operandum;
}

function Read(argument) {
    this.argument = argument;
}
Read.prototype.validateArgument = function () {
    return this.argument instanceof Operandum && !(this.argument instanceof Const);
}

function Write(argument) {
    this.argument = argument;
}
Write.prototype.validateArgument = function () {
    return this.argument instanceof Operandum && !(this.argument instanceof Const);
}

function Jump(argument) {
    this.argument = argument;
}
Jump.prototype.validateArgument = function () {
    return this.argument instanceof Label;
}
function Jgtz(argument) {
    this.argument = argument;
}
Jgtz.prototype.validateArgument = function () {
    return this.argument instanceof Label;
}
function Jzero(argument) {
    this.argument = argument;
}
Jzero.prototype.validateArgument = function () {
    return this.argument instanceof Label;
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
