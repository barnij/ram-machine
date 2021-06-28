const ast = require('./ast');
const { parseInstruction, parseOperandum, parseLabel } = require('./parser');

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


// test('NUMBER argument string parses to Address', () => {
//     let argumentString = '127';
//     expect(parseArgument(argumentString)).toEqual(new ast.Address(BigInt(127)));
//     expect(parseArgument(argumentString)).toBeInstanceOf(ast.Address);

//     argumentString = '-13';
//     expect(parseArgument(argumentString)).toEqual(new ast.Address(BigInt(-13)));
//     expect(parseArgument(argumentString)).toBeInstanceOf(ast.Address);
// });

// test('^POSITIVE_NUMBER argument string parses to Reference', () => {
//     let argumentString = '^7819';
//     expect(parseArgument(argumentString)).toEqual(new ast.Reference(BigInt(7819)));
//     expect(parseArgument(argumentString)).toBeInstanceOf(ast.Reference);
// });

test('empty instruction parses to skip', () => {
    let skipInstruction = new ast.Skip();
    let emptyInstruction = '';
    expect(parseInstruction(emptyInstruction)).toEqual(skipInstruction);
    expect(parseInstruction(emptyInstruction)).toBeInstanceOf(ast.Skip);

    let emptyWhitespaceInstruction = '     ';
    expect(parseInstruction(emptyWhitespaceInstruction)).toEqual(skipInstruction);
    expect(parseInstruction(emptyWhitespaceInstruction)).toBeInstanceOf(ast.Skip);
})