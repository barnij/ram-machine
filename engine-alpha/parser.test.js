const ast = require('./ast');
const { parseInstruction } = require('./parser');

test('empty instruction parses to skip', () => {
    let skipInstruction = new ast.Skip();
    let emptyInstruction = '';
    expect(parseInstruction(emptyInstruction)).toEqual(skipInstruction);
    expect(parseInstruction(emptyInstruction)).toBeInstanceOf(ast.Skip);

    let emptyWhitespaceInstruction = '     ';
    expect(parseInstruction(emptyWhitespaceInstruction)).toEqual(skipInstruction);
    expect(parseInstruction(emptyWhitespaceInstruction)).toBeInstanceOf(ast.Skip);
})