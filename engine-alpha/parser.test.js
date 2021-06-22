const { parse_instruction, parse_line } = require('./parser');

// #region Instructionless lines
test('empty line parses to skip', () => {
    expect(parse_line('')).toEqual(
        {
            label: null,
            instruction: 'skip',
            argument: null
        }
    )
});
test('empty line with whitespaces parses equivalently to one without', () => {
    expect(parse_line('     '), () => {
        expect(parse_line('').toEqual(
            {
                label: null,
                instruction: 'skip',
                argument: null
            }
        ))
    })
});
test('labeled only line parses to labeled skip', () => {
    expect(parse_line('labelonly:')).toEqual(
        {
            label: 'labelonly',
            instruction: 'skip',
            argument: null
        }
    )
});
test('commented only line parses to skip', () => {
    expect(parse_line('# this is a comment:')).toEqual(
        {
            label: null,
            instruction: 'skip',
            argument: null
        }
    )
});

test('commented and labeled line parses to labeled skip', () => {
    expect(parse_line('label: #and comment:')).toEqual(
        {
            label: null,
            instruction: 'skip',
            argument: null
        }
    )
});
// #endregion