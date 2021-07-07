import * as ast from './ast';
import {ParserSyntaxError, ParserTypeError} from './errors';

const EMPTY_LINE = /^\s*$/;
const WHITESPACE = /\s+/;
const DECIMAL_BIG_INT = /^(0|(-?[1-9]\d*))$/;
const LABEL = /^[a-z0-9]+$/;
const OPERANDUM_INSTRUCTION_CODES = [
  'read',
  'write',
  'load',
  'store',
  'add',
  'sub',
  'div',
  'mult',
];
const LABEL_INSTRUCION_CODES = ['jump', 'jgtz', 'jzero'];

export function parseBigInt(string: string): BigInt | null {
  if (string.match(DECIMAL_BIG_INT)) {
    return BigInt(string);
  }
  return null;
}
function validateLabel(label: ast.Label): Boolean {
  return label.value.match(LABEL) !== null;
}

export function validateArgumentType(
  instructionCode: string,
  instructionArgument: ast.Argument
): boolean {
  if (LABEL_INSTRUCION_CODES.includes(instructionCode)) {
    return instructionArgument instanceof ast.Label;
  }
  if (OPERANDUM_INSTRUCTION_CODES.includes(instructionCode)) {
    if (instructionCode === 'store' || instructionCode === 'read') {
      return (
        instructionArgument instanceof ast.Address ||
        instructionArgument instanceof ast.Reference
      );
    } else {
      return instructionArgument instanceof ast.Operandum;
    }
  }
  return false;
}

export class Parser {
  parseOperandum(string: string): ast.Operandum {
    if (string === '') throw new ParserSyntaxError('Empty operandum.');
    const operator = string[0];
    let valueString: string;
    if (operator === '=' || operator === '^') {
      valueString = string.slice(1);
    } else {
      valueString = string;
    }
    const value = parseBigInt(valueString);
    if (value === null) {
      throw new ParserSyntaxError('Operandum value must be an integer.');
    }
    switch (operator) {
      case '=': {
        return new ast.Const(value);
      }
      case '^': {
        if (value >= BigInt(0)) {
          return new ast.Reference(value);
        }
        throw new ParserTypeError(
          'Reference operandum expects nonnegative integer.'
        );
      }
      default: {
        if (value >= BigInt(0)) {
          return new ast.Address(value);
        }
        throw new ParserTypeError(
          'Address operandum expects nonnegative integer.'
        );
      }
    }
  }
  parseLabel(string: string): ast.Label {
    if (string.match(LABEL)) {
      return new ast.Label(string);
    }
    throw new ParserSyntaxError(
      'Label can contain only alphanumeric characters.'
    );
  }
  parseInstruction(string: string): ast.Instruction {
    if (string.match(EMPTY_LINE)) {
      return new ast.Skip();
    }
    const [instructionCode, ...instructionArguments] = string.split(WHITESPACE);
    if (instructionCode === 'halt') {
      if (instructionArguments.length !== 0) {
        throw new ParserSyntaxError();
      }
      return new ast.Halt();
    }
    if (
      !OPERANDUM_INSTRUCTION_CODES.includes(instructionCode) &&
      !LABEL_INSTRUCION_CODES.includes(instructionCode)
    ) {
      throw new ParserSyntaxError(
        instructionCode + 'is not a valid instruction code.'
      );
    }
    if (instructionArguments.length !== 1) {
      throw new ParserSyntaxError(
        'Instruction ' + instructionCode + 'expects exactly one argument'
      );
    }
    const instructionArgument = instructionArguments[0];
    if (OPERANDUM_INSTRUCTION_CODES.includes(instructionCode)) {
      const operandumArgument = this.parseOperandum(instructionArgument);
      if (!validateArgumentType(instructionCode, operandumArgument)) {
        throw new ParserTypeError();
      }
      switch (instructionCode) {
        case 'load':
          return new ast.Load(operandumArgument);
        case 'store':
          return new ast.Store(operandumArgument);
        case 'add':
          return new ast.Add(operandumArgument);
        case 'sub':
          return new ast.Sub(operandumArgument);
        case 'mult':
          return new ast.Mult(operandumArgument);
        case 'div':
          return new ast.Div(operandumArgument);
        case 'read':
          return new ast.Read(operandumArgument);
        case 'write':
          return new ast.Write(operandumArgument);
        default:
          throw new ParserSyntaxError();
      }
    } else {
      const labelArgument = this.parseLabel(instructionArgument);
      if (!validateArgumentType(instructionCode, labelArgument)) {
        throw new ParserTypeError();
      }
      switch (instructionCode) {
        case 'jump':
          return new ast.Jump(labelArgument);
        case 'jgtz':
          return new ast.Jgtz(labelArgument);
        case 'jzero':
          return new ast.Jzero(labelArgument);
        default:
          throw new ParserSyntaxError();
      }
    }
  }
  parseLine(string: string): {
    label: null | ast.Label;
    instruction: ast.Instruction;
  } {
    let label: null | ast.Label;
    const commentlessString = string.split('#')[0];
    const commentEndIndex = commentlessString.indexOf(':');
    let instructionString = commentlessString.trim();
    if (commentEndIndex < 0) {
      label = null;
    } else {
      const labelString = commentlessString.slice(0, commentEndIndex);
      label = new ast.Label(labelString);
      if (!validateLabel(label))
        throw new ParserSyntaxError(
          'Label can contain only alphanumeric characters.'
        );
      instructionString = commentlessString.slice(commentEndIndex + 1).trim();
    }
    const instruction = this.parseInstruction(instructionString);
    return {label: label, instruction: instruction};
  }
  // parseProgram(string: string): ast.Program {

  // }
}
