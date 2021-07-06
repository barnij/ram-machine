import * as ast from './ast';
import {ParserSyntaxError, ParserTypeError} from './errors';

const EMPTY_LINE = /^\s*$/;
const DECIMAL_BIG_INT = /^(0|(-?[1-9]\d*))$/;
const LABEL = /^[a-z0-9]+$/;
export function parseBigInt(string: string): BigInt | null {
  if (string.match(DECIMAL_BIG_INT)) {
    return BigInt(string);
  }
  return null;
}
function validateLabel(label: ast.Label): Boolean {
  return label.value.match(LABEL) !== null;
}

export class Parser {
  public parseOperandum(string: string): ast.Operandum {
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
  public parseLabel(string: String): ast.Label {
    if (string.match(LABEL)) {
      return new ast.Label(string);
    }
    throw new ParserSyntaxError(
      'Label can contain only alphanumeric characters.'
    );
  }
}
