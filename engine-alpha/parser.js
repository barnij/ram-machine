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
    const legalInstructionCodes = [ 'load', 'store', 'add', 'sub', 'mult', 'div', 'read', 'write', 'jump', 'jgtz', 'jzero', 'halt' ];
    const operandumInstructionCodes = [ 'load', 'store', 'add', 'sub', 'mult', 'div', 'read', 'write' ];
    const labelInstructionCodes = [ 'jump', 'jzero', 'jgtz' ];

    const splitInstructionString = instructionString.split(SPACE);
    const instructionCode = splitInstructionString[0];

    const instructionConstructors = {
        'read': ast.Read,
        'store': ast.Store,
        'add': ast.Add,
        'sub': ast.Sub,
        'mult': ast.Mult,
        'div': ast.Div,
        'read': ast.Read,
        'write': ast.Write,
        'jump': ast.Jump,
        'jgtz': ast.Jgtz,
        'jzero': ast.Jzero
    }

    if(!legalInstructionCodes.includes(instructionCode)) {
        throw Error('Invalid instruction code.');
    }
    if (instructionCode == 'halt') {
        if (splitInstructionString.length > 1) {
            throw Error('Unexpected data after instruction.');
        }
        return new ast.Halt();
    }
    if(splitInstructionString.length < 2) {
        throw Error('Insufficient arguments for instruction.');
    }
    if(splitInstructionString.length > 2) {
        throw Error('Unexpected data after instruction.');
    }
    const argumentString = splitInstructionString[1];
    let argument;
    if(operandumInstructionCodes.includes(instructionCode)) {
        try {
            argument = parseOperandum(argumentString);
        } catch (error) {
            throw new Error('Operandum syntax error.');
        }
    } else {
        try {
            argument = parseLabel(argumentString);
        } catch (error) {
            throw new Error('Label syntax error.');
        }
    }
    let instruction = new instructionConstructors[instructionCode](argument);
    if(!instruction.validateArgument()) {
        throw new Error('Argument type error.');
    }
    return instruction;
}

function parseLine(lineString) {
    const commentlessLineString = lineString.split('#')[0];
    const labelEndIndex = commentlessLineString.indexOf(':');
    let parsedLine = {
        label: null,
        instruction: null
    };
    let instructionString;
    if(labelEndIndex > 0) {
        parsedLine.label = commentlessLineString.slice(0, labelEndIndex);
        if(!parsedLine.label.match(/^[0-9a-z]+$/i)) {
            throw Error('Label can contain only alphanumeric characters.');
        }
        instructionString = commentlessLineString.slice(labelEndIndex + 1);
    } else {
        instructionString = commentlessLineString;
    }
    try {
        parsedLine.instruction = parseInstruction(instructionString.trim());
    } catch (error) {
        throw error;
    }
    return parsedLine;
}

function parseCode(codeString) {
    let lines = codeString.split(/\r\n|\n\r|\n|\r/);
    let labeledInstructions = {}
    let nextInstruction = new ast.Halt();
    let codeTree = null;
    for(let i = lines.length - 1; i >= 0; i--){
        let parsedLine;
        try {
            parsedLine = parseLine(lines[i]);
        } catch (error) {
            throw error;
        }
        if (parsedLine.label !== null) {
            labeledInstructions[parsedLine.label]= parsedLine.instruction;
        }
        codeTree = new ast.Combine(parsedLine.instruction, nextInstruction);
        nextInstruction = codeTree;
        
    }
    return { labeledInstructions: labeledInstructions, codeTree: codeTree }

}

module.exports = {
    parseCode,
    parseLine,
    parseInstruction,
    parseOperandum,
    parseLabel
}