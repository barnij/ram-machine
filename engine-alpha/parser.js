const ast = require('./ast');

const ERROR_CODE = null;
const EMPTY_LINE = /^\s*$/;
const SPACE = /\s+/;

function parseOperandum(argumentString) {
    if ( argumentString == '' ) {
        throw Error('No argument was given.');
    }
    let operator = argumentString[0];
    let valueString;
    let value;
    if ( operator == '=' ) {
        valueString = argumentString.slice(1);
        if ( valueString.match(/^-?(0|([1-9]\d*))$/) ) {
            value = BigInt(valueString);
            return new ast.Const(value);
        } else {
            throw Error('Argument starting with = must be followed by integer.');
        }
    }
    if ( operator == '^' ) {
        valueString = argumentString.slice(1);
        if ( valueString.match(/^((-?0)|([1-9]\d*))$/) ) {
            value = BigInt(valueString);
            return new ast.Reference(value);
        } else {
            throw Error('Argument starting with ^ must be followed by nonnegative integer.');
        }
    }

    valueString = argumentString;
    if ( valueString.match(/^((-?0)|([1-9]\d*))$/) ) {
        value = BigInt(valueString);
        return new ast.Address(value);
    } else {
        throw Error('Argument has to be one of NONNEGATIVE_INTEGER, =INTEGER, ^NONNEGATIVE_INTEGER.');
    }
}

function parseLabel(argumentString) {
    if(argumentString == '') {
        throw Error('No argument was given.');
    }
    if(argumentString.match(/^[0-9a-z]+$/i)) {
        return new ast.Label(argumentString);
    }
    throw Error('Label can contain only alphanumeric characters.');
}

function parseInstruction(instructionString) {
    if(instructionString.match(EMPTY_LINE)) {
        return new ast.Skip();
    }
}

module.exports = {
    parseInstruction,
    parseOperandum,
    parseLabel
}