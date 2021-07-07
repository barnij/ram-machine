class InterpreterError extends Error {}
export class ParserError extends Error {}
export class InputError extends InterpreterError {}
export class ParserSyntaxError extends ParserError {}
export class ParserTypeError extends ParserError {}
