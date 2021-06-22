const { make_empty_env } = require('./engine');

test('make_empty_env initializes proper empty environment', () => {
    input = [1, 2, 3];
    empty_environment = {
        input: input,
        input_it: 0,
        output: [],
        output_it: 0,
        registers: Map()
    };
    // output seems unnecessary
    expect(make_empty_env(input, output)).toEqual(empty_environment);

});