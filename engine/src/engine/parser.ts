import * as ast from './ast';
import {
  ParserSyntaxError,
  ParserTypeError,
  ParserError,
  ParserGeneralError,
} from './errors';

const EMPTY_LINE = /^\s*$/;
const WHITESPACE = /\s+/;
const DECIMAL_BIG_INT = /^(0|(-?[1-9]\d*))$/;
const LABEL = /^[a-z0-9_]+$/i;
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

export function parseBigInt(string: string): bigint | null {
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
    if (string === '') throw new ParserSyntaxError(-1, 'Empty operandum');
    const operator = string[0];
    let valueString: string;
    if (operator === '=' || operator === '^') {
      valueString = string.slice(1);
    } else {
      valueString = string;
    }
    const value = parseBigInt(valueString);
    if (value === null) {
      throw new ParserSyntaxError(-1, 'Operandum value must be an integer');
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
          -1,
          'Reference operandum expects nonnegative integer'
        );
      }
      default: {
        if (value >= BigInt(0)) {
          return new ast.Address(value);
        }
        throw new ParserTypeError(
          -1,
          'Address operandum expects nonnegative integer'
        );
      }
    }
  }
  parseLabel(string: string): ast.Label {
    if (string.match(LABEL)) {
      return new ast.Label(string.toLowerCase());
    }
    throw new ParserSyntaxError(
      -1,
      'Label can contain only alphanumeric characters'
    );
  }
  parseInstruction(string: string): ast.Instruction {
    if (string.match(EMPTY_LINE)) {
      return new ast.Skip();
    }
    const [instructionCode, ...instructionArguments] = string.split(WHITESPACE);
    if (instructionCode === 'halt') {
      if (instructionArguments.length !== 0) {
        throw new ParserSyntaxError(
          -1,
          'Instruction halt does not take any argument'
        );
      }
      return new ast.Halt();
    }
    if (
      !OPERANDUM_INSTRUCTION_CODES.includes(instructionCode) &&
      !LABEL_INSTRUCION_CODES.includes(instructionCode)
    ) {
      throw new ParserSyntaxError(
        -1,
        instructionCode + ' is not a valid instruction code'
      );
    }
    if (instructionArguments.length !== 1) {
      throw new ParserSyntaxError(
        -1,
        'Instruction ' + instructionCode + ' expects exactly one argument'
      );
    }
    const instructionArgument = instructionArguments[0];
    if (OPERANDUM_INSTRUCTION_CODES.includes(instructionCode)) {
      const operandumArgument = this.parseOperandum(instructionArgument);
      if (!validateArgumentType(instructionCode, operandumArgument)) {
        throw new ParserTypeError(
          -1,
          operandumArgument +
            ' is not a valid argument for instruction ' +
            instructionCode
        );
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
          throw new ParserSyntaxError(
            -1,
            'unrecognized instruction ' + instructionCode
          );
      }
    } else {
      const labelArgument = this.parseLabel(instructionArgument);
      if (!validateArgumentType(instructionCode, labelArgument)) {
        throw new ParserTypeError(
          -1,
          labelArgument +
            ' is not a valid argument for instruction ' +
            instructionCode
        );
      }
      switch (instructionCode) {
        case 'jump':
          return new ast.Jump(labelArgument);
        case 'jgtz':
          return new ast.Jgtz(labelArgument);
        case 'jzero':
          return new ast.Jzero(labelArgument);
        default:
          throw new ParserSyntaxError(
            -1,
            'unrecognized instruction ' + instructionCode
          );
      }
    }
  }
  parseLine(string: string): {
    label: null | ast.Label;
    instruction: ast.Instruction;
  } {
    let label: null | ast.Label;
    string = string.toLowerCase();
    const commentlessString = string.split('#')[0];
    const commentEndIndex = commentlessString.indexOf(':');
    let instructionString = commentlessString.trim();
    if (commentEndIndex < 0) {
      label = null;
    } else {
      const labelString = commentlessString
        .slice(0, commentEndIndex)
        .toLowerCase();
      label = new ast.Label(labelString);
      if (!validateLabel(label))
        throw new ParserSyntaxError(
          -1,
          'Label can contain only alphanumeric characters'
        );
      instructionString = commentlessString.slice(commentEndIndex + 1).trim();
    }
    const instruction = this.parseInstruction(instructionString);
    return {label: label, instruction: instruction};
  }
  parseProgram(string: string): ast.Program {
    const lines = string.split(/\r\n|\n\r|\n|\r/);
    const labels = new Map<string, ast.Instruction>();
    let programTree = new ast.Halt();
    let errorCaught = false;
    const instructions: {
      label: ast.Label | null;
      instruction: ast.Instruction;
    }[] = [];
    const parserErrors = new Map<number, ParserError>();

    if (string === '') return new ast.Program(labels, programTree);

    for (let i = 0; i < lines.length; i++) {
      let parsedLine: {
        label: ast.Label | null;
        instruction: ast.Instruction;
      } | null;
      parsedLine = null;
      try {
        parsedLine = this.parseLine(lines[i]);
      } catch (error: unknown) {
        if (error instanceof ParserError) {
          errorCaught = true;
          error.line = i;
          parserErrors.set(i, error);
        } else {
          console.error(error);
          throw new ParserError(i, 'parser encountered unknown problem');
        }
      }
      if (parsedLine !== null) {
        parsedLine.instruction.line = i;
        instructions.push(parsedLine);
        if (parsedLine.label !== null) {
          if (labels.get(parsedLine.label.value) !== undefined) {
            errorCaught = true;
            parserErrors.set(i, new ParserSyntaxError(i, 'Repeated label'));
          } else {
            labels.set(parsedLine.label.value, parsedLine.instruction);
          }
        }
      }
    }

    for (let i = instructions.length - 1; i >= 0; i--) {
      const parsedLine: {
        label: ast.Label | null;
        instruction: ast.Instruction;
      } = instructions[i];
      const instruction = parsedLine.instruction;
      if (instruction !== null) {
        if (
          instruction instanceof ast.Jump ||
          instruction instanceof ast.Jgtz ||
          instruction instanceof ast.Jzero
        ) {
          if (![...labels.keys()].includes(instruction.argument.value)) {
            errorCaught = true;
            parserErrors.set(i, new ParserSyntaxError(i, 'No matching label'));
          }
        }
        if (!errorCaught) {
          programTree = new ast.Combine(instruction, programTree);
          if (parsedLine.label !== null) {
            labels.set(parsedLine.label.value, programTree);
          }
        }
      }
    }
    if (errorCaught) throw new ParserGeneralError(parserErrors);
    return new ast.Program(labels, programTree);
  }
}
