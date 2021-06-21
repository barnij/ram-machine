const { parse_instruction } = require('./parser');

test('empty instruction parses to object with undefined values', () => {
    parsed_instruction = parse_instruction('');
    expect(parsed_instruction.instruction).toBeUndefined();
    expect(parsed_instruction.argument).toBeUndefined();
});