export class InterpreterError extends Error {
  constructor(public line: number, message: string) {
    super(message);
  }
}
export class ParserError extends Error {
  constructor(public line: number, message: string) {
    super(message);
  }
}
export class InputError extends InterpreterError {
  constructor(public line: number, message: string, public inputId: number) {
    super(line, message);
  }
}
export class RegisterError extends InterpreterError {
  constructor(public line: number, message: string, public regId: bigint) {
    super(line, message);
  }
}
export class BadArgumentError extends InterpreterError {}
export class LabelError extends InterpreterError {
  constructor(public line: number, message: string, public label: string) {
    super(line, message);
  }
}
export class DivByZeroError extends InterpreterError {}
export class ParserSyntaxError extends ParserError {}
export class ParserTypeError extends ParserError {}
export class ParserGeneralError extends Error {
  constructor(public errors: Map<number, ParserError>) {
    super();
  }
}
