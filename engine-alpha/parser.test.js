const ast = require('./ast');
const { parseInstruction, parseOperandum, parseLabel } = require('./parser');

//#region parsing argument: operandum | label
test('parsing empty operandum argument throws Error', () => {
    let operandumString = '';
    expect(() => parseOperandum(operandumString)).toThrowError('No argument was given');
});

test('=INTEGER operandum string parses to Const', () => {
    let operandumString = '=540';
    expect(parseOperandum(operandumString)).toEqual(new ast.Const(BigInt(540)));
    expect(parseOperandum(operandumString)).toBeInstanceOf(ast.Const);
    
    operandumString = '=-1';
    expect(parseOperandum(operandumString)).toEqual(new ast.Const(BigInt(-1)));
    expect(parseOperandum(operandumString)).toBeInstanceOf(ast.Const);

    operandumString = '=0';
    expect(parseOperandum(operandumString)).toEqual(new ast.Const(BigInt(0)));
    expect(parseOperandum(operandumString)).toBeInstanceOf(ast.Const);
});
test('parsing =NOT_INTEGER operandum string throws Error', () => {
    let operandumString = '=abc';
    expect( () => parseOperandum(operandumString) ).toThrowError('Argument starting with = must be followed by integer.');

    operandumString = '=';
    expect( () => parseOperandum(operandumString) ).toThrowError('Argument starting with = must be followed by integer.');

    operandumString = '=01';
    expect( () => parseOperandum(operandumString) ).toThrowError('Argument starting with = must be followed by integer.');

    operandumString = '=-01';
    expect( () => parseOperandum(operandumString) ).toThrowError('Argument starting with = must be followed by integer.');

    operandumString = '=1a2';
    expect( () => parseOperandum(operandumString) ).toThrowError('Argument starting with = must be followed by integer.');
});

test('^NONNEGATIVE_INTEGER operandum string parses to Reference', () => {
    let operandumString = '^540';
    expect(parseOperandum(operandumString)).toEqual(new ast.Reference(BigInt(540)));
    expect(parseOperandum(operandumString)).toBeInstanceOf(ast.Reference);

    operandumString = '^0';
    expect(parseOperandum(operandumString)).toEqual(new ast.Reference(BigInt(0)));
    expect(parseOperandum(operandumString)).toBeInstanceOf(ast.Reference);
});
test('parsing ^NEGATIVE_INTEGER operandum string throws Error', () => {
    let operandumString = '^-540';
    expect( () => parseOperandum(operandumString) ).toThrowError('Argument starting with ^ must be followed by nonnegative integer.');
    operandumString = '^-1';
    expect( () => parseOperandum(operandumString) ).toThrowError('Argument starting with ^ must be followed by nonnegative integer.');
});
test('parsing ^NOT_INTEGER operandum string throws Error', () => {
    let operandumString = '^abc';
    expect( () => parseOperandum(operandumString) ).toThrowError('Argument starting with ^ must be followed by nonnegative integer.');

    operandumString = '^';
    expect( () => parseOperandum(operandumString) ).toThrowError('Argument starting with ^ must be followed by nonnegative integer.');

    operandumString = '^01';
    expect( () => parseOperandum(operandumString) ).toThrowError('Argument starting with ^ must be followed by nonnegative integer.');

    operandumString = '^-01';
    expect( () => parseOperandum(operandumString) ).toThrowError('Argument starting with ^ must be followed by nonnegative integer.');

    operandumString = '^1a2';
    expect( () => parseOperandum(operandumString) ).toThrowError('Argument starting with ^ must be followed by nonnegative integer.');
});

test('NONNEGATIVE_INTEGER operandum parses to Addres', () => {
    let operandumString = '321';
    expect(parseOperandum(operandumString)).toEqual(new ast.Address(BigInt(321)));
    expect(parseOperandum(operandumString)).toBeInstanceOf(ast.Address);

    operandumString = '0';
    expect(parseOperandum(operandumString)).toEqual(new ast.Address(BigInt(0)));
    expect(parseOperandum(operandumString)).toBeInstanceOf(ast.Address);
});

test('parsing NEGATIVE_INTEGER operandum throws Error', () => {
    let operandumString = '-1';
    expect( () => parseOperandum(operandumString) ).toThrowError('Argument has to be one of NONNEGATIVE_INTEGER, =INTEGER, ^NONNEGATIVE_INTEGER.');

    operandumString = '-781';
    expect( () => parseOperandum(operandumString) ).toThrowError('Argument has to be one of NONNEGATIVE_INTEGER, =INTEGER, ^NONNEGATIVE_INTEGER.');
});

test('parsing NOT_INTEGER operandum throws Error', () => {
    let operandumString = 'abc';
    expect( () => parseOperandum(operandumString) ).toThrowError('Argument has to be one of NONNEGATIVE_INTEGER, =INTEGER, ^NONNEGATIVE_INTEGER.');

    operandumString = '01';
    expect( () => parseOperandum(operandumString) ).toThrowError('Argument has to be one of NONNEGATIVE_INTEGER, =INTEGER, ^NONNEGATIVE_INTEGER.');

    operandumString = '-01';
    expect( () => parseOperandum(operandumString) ).toThrowError('Argument has to be one of NONNEGATIVE_INTEGER, =INTEGER, ^NONNEGATIVE_INTEGER.');

    operandumString = '1a2';
    expect( () => parseOperandum(operandumString) ).toThrowError('Argument has to be one of NONNEGATIVE_INTEGER, =INTEGER, ^NONNEGATIVE_INTEGER.');
});


test('parsing label string containing nonalphanumeric characters throws Error', () => {
    let nonalphanumericLabel = 'label1!';
    expect( () => parseLabel(nonalphanumericLabel) ).toThrowError('Label can contain only alphanumeric characters.');

    nonalphanumericLabel = 'my label';
    expect( () => parseLabel(nonalphanumericLabel) ).toThrowError('Label can contain only alphanumeric characters.');

    nonalphanumericLabel = 'my_label';
    expect( () => parseLabel(nonalphanumericLabel) ).toThrowError('Label can contain only alphanumeric characters.');
});

test('alphanumeric only label string parses to Label', () => {
    let alphanumericLabel = 'Label1';
    expect(parseLabel(alphanumericLabel)).toEqual(new ast.Label(alphanumericLabel));
    expect(parseLabel(alphanumericLabel)).toBeInstanceOf(ast.Label);

    alphanumericLabel = '1';
    expect(parseLabel(alphanumericLabel)).toEqual(new ast.Label(alphanumericLabel));
    expect(parseLabel(alphanumericLabel)).toBeInstanceOf(ast.Label);

    alphanumericLabel = 'JumpHere';
    expect(parseLabel(alphanumericLabel)).toEqual(new ast.Label(alphanumericLabel));
    expect(parseLabel(alphanumericLabel)).toBeInstanceOf(ast.Label);
});
//#endregion

test('empty instruction string parses to skip', () => {
    let skipInstruction = new ast.Skip();
    let emptyInstruction = '';
    expect(parseInstruction(emptyInstruction)).toEqual(skipInstruction);
    expect(parseInstruction(emptyInstruction)).toBeInstanceOf(ast.Skip);

    let emptyWhitespaceInstruction = '     ';
    expect(parseInstruction(emptyWhitespaceInstruction)).toEqual(skipInstruction);
    expect(parseInstruction(emptyWhitespaceInstruction)).toBeInstanceOf(ast.Skip);
});

test('parsing instruction string with invalid instruction code throws Error', () => {
    let invalidCodeInstruction = 'SUBSTRACT';
    expect(() => parseInstruction(invalidCodeInstruction)).toThrowError('Invalid instruction code.');
});

test('halt instruction string parses to Halt', () => {
    let haltInstruction = 'halt';
    expect(parseInstruction(haltInstruction)).toEqual(new ast.Halt());
    expect(parseInstruction(haltInstruction)).toBeInstanceOf(ast.Halt);
});

test('parsing instruction string with insufficient arguments throws Error', () => {
    let argumentInsufficientInstruction = 'add';
    expect(() => parseInstruction(argumentInsufficientInstruction)).toThrowError('Insufficient arguments for instruction.');
});

test('parsing instruction with excessive content throws error', () => {
    let excessiveInstruction = 'add ^1 2';
    expect(()=>parseInstruction(excessiveInstruction)).toThrowError('Unexpected data after instruction.');
    excessiveInstruction = 'halt 0';
    expect(()=>parseInstruction(excessiveInstruction)).toThrowError('Unexpected data after instruction.');
});

test('parsing instruction with invalid argument syntax throws error', () => {
    let invalidOperandumArgument = 'read 5a';
    expect(() => parseInstruction(invalidOperandumArgument)).toThrowError('Operandum syntax error');

    let invalidLabelArgument = 'jump label+';
    expect(() => parseInstruction(invalidLabelArgument)).toThrowError('Label syntax error.');
});

test('parsing instruction with invalid argument type throws error', () => {
    let invalidReadArgument = 'read =5';
    expect(() => parseInstruction(invalidReadArgument)).toThrowError('Argument type error.');
});

// test('proper instruction string parses to corresponding instruction object', () => {
//     let readInstructionString = 'read 1';
//     expect(parseInstruction(readInstructionString)).toEqual(
//         new ast.Read(new ast.Address(BigInt(1)))
//     );
//     readInstructionString = 'read ^1';
//     expect(parseInstruction(readInstructionString)).toEqual(
//         new ast.Read(new ast.Address(BigInt(1)))
//     );

//     let storeInstructionString = 'store 0';
//     expect(parseInstruction(readInstructionString)).toEqual(
//         new ast.Read(new ast.Address(BigInt(1)))
//     );
//     storeInstructionString = 'store ^10';
//     expect(parseInstruction(readInstructionString)).toEqual(
//         new ast.Read(new ast.Address(BigInt(1)))
//     );
// })