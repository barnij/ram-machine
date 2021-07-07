class InterpreterError extends Error {}
export class ParserError extends Error {}
export class InputError extends InterpreterError {}
export class RegisterError extends InterpreterError {}
export class RuntimeError extends InterpreterError {}
export class LabelError extends InterpreterError {}
export class ParserSyntaxError extends ParserError {}
export class ParserTypeError extends ParserError {}
