class InterpreterError extends Error {}
class ParserError extends Error {}
export class InputError extends InterpreterError {}
export class ParserSyntaxError extends ParserError {}
export class ParserTypeError extends ParserError {}
