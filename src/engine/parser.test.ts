import {Parser, parseBigInt, validateArgumentType} from './parser';
import {ParserError, ParserSyntaxError, ParserTypeError} from './errors';
import * as ast from './ast';

//#region Helper functions
// parseBigInt
test('parseBigInt - parsing string with leading zeros returns null', () => {
  expect(parseBigInt('001')).toBeNull();
});

test('parseBigInt - parsing negative value succeeds', () => {
  expect(parseBigInt('-1')).toStrictEqual(BigInt('-1'));
  expect(parseBigInt('-100')).toStrictEqual(BigInt('-100'));
  expect(parseBigInt('-71')).toStrictEqual(BigInt('-71'));
});

test('parseBigInt - parsing positive value succeeds', () => {
  expect(parseBigInt('1')).toStrictEqual(BigInt('1'));
  expect(parseBigInt('901')).toStrictEqual(BigInt('901'));
  expect(parseBigInt('1000000000000000000000')).toStrictEqual(
    BigInt('1000000000000000000000')
  );
});

test('parseBigInt - parsing string with nonnumeric characters returns null', () => {
  expect(parseBigInt('0x10')).toBeNull();
  expect(parseBigInt('21sheep')).toBeNull();
  expect(parseBigInt(' 1')).toBeNull();
});

// validateArgument
test('validateArgumentType - validating argument for invalid instruction code returns false', () => {
  expect(validateArgumentType('substract', new ast.Const(BigInt(5)))).toBe(
    false
  );
});

test('validateArgumentType - validating Const argument for store and read instructions returns false', () => {
  expect(validateArgumentType('store', new ast.Const(BigInt(5)))).toBe(false);
  expect(validateArgumentType('read', new ast.Const(BigInt(10)))).toBe(false);
});
//#endregion

//#region Parser class
// parseLabel
test('Parser: parseLabel - parsing nonalphanumeric string throws ParserSyntaxError', () => {
  const parser = new Parser();
  expect(() => parser.parseLabel('nonalphanumeric_1')).toThrowError(
    ParserSyntaxError
  );
});

// parseOperandum
test('Parser: parseOperandum - parsing operandum with nonnumeric characters in value throws ParserSyntaxError', () => {
  const parser = new Parser();
  expect(() => parser.parseOperandum('=abc1')).toThrowError(ParserSyntaxError);
  expect(() => parser.parseOperandum('^abc1')).toThrowError(ParserSyntaxError);
  expect(() => parser.parseOperandum('abc1')).toThrowError(ParserSyntaxError);
});

test('Parser: parseOperandum - parsing ^VALUE operandum with negative VALUE throws ParserTypeError', () => {
  const parser = new Parser();
  expect(() => parser.parseOperandum('^-1')).toThrowError(ParserTypeError);
});

test('Parser: parseOperandum - parsing VALUE operandum with negative VALUE throws ParserTypeError', () => {
  const parser = new Parser();
  expect(() => parser.parseOperandum('-1')).toThrowError(ParserTypeError);
});

test('Parser: parseOperandum - parsing VALUE operandum with nonnegative VALUE returns instance of Address', () => {
  const parser = new Parser();
  const addressZero = new ast.Address(BigInt('0'));
  expect(parser.parseOperandum('0')).toStrictEqual(addressZero);

  const addressBig = new ast.Address(BigInt('179007199254740991'));
  expect(parser.parseOperandum('179007199254740991')).toStrictEqual(addressBig);
});

test('Parser: parseOperandum - parsing =VALUE with nonnegative VALUE returns instance of Const', () => {
  const parser = new Parser();
  const constZero = new ast.Const(BigInt('0'));
  expect(parser.parseOperandum('=0')).toStrictEqual(constZero);

  const constPositive = new ast.Const(BigInt('17'));
  expect(parser.parseOperandum('=17')).toStrictEqual(constPositive);

  const constNegative = new ast.Const(BigInt('-21'));
  expect(parser.parseOperandum('=-21')).toStrictEqual(constNegative);
});

test('Parser: parseOperandum - parsing ^VALUE with nonnegative VALUE   returns instance of Reference', () => {
  const parser = new Parser();
  const referenceZero = new ast.Reference(BigInt('0'));
  expect(parser.parseOperandum('^0')).toStrictEqual(referenceZero);

  const referencePostive = new ast.Reference(BigInt('189'));
  expect(parser.parseOperandum('^189')).toStrictEqual(referencePostive);
});

// parseInstruction
test('Parser: parseInstruction - parsing instruction with excessive arguments throws ParserSyntaxError', () => {
  const parser = new Parser();
  const excessiveHalt = 'halt 1';
  expect(() => parser.parseInstruction(excessiveHalt)).toThrowError(
    ParserSyntaxError
  );
  const excessiveLoad = 'load =1 1';
  expect(() => parser.parseInstruction(excessiveLoad)).toThrowError(
    ParserSyntaxError
  );
  const excessiveJump = 'jump label1 label2';
  expect(() => parser.parseInstruction(excessiveJump)).toThrowError(
    ParserSyntaxError
  );
});
test('Parser: parseInstruction - parsing instruction with insufficient arguments throws ParserSyntaxError', () => {
  const parser = new Parser();
  const insufficientStore = 'store';
  expect(() => parser.parseInstruction(insufficientStore)).toThrowError(
    ParserSyntaxError
  );
  const insufficientJgtz = 'jgtz';
  expect(() => parser.parseInstruction(insufficientJgtz)).toThrowError(
    ParserSyntaxError
  );
});

test('Parser: parseInstruction - parsing empty line return instance of Skip', () => {
  const parser = new Parser();
  const skip = new ast.Skip();
  expect(parser.parseInstruction('   ')).toStrictEqual(skip);
});
test('Parser: parseInstruction - parsing halt returns instance of Halt', () => {
  const parser = new Parser();
  const halt = new ast.Halt();
  expect(parser.parseInstruction('halt')).toStrictEqual(halt);
});
test('Parser: parseInstruction - parsing load returns instance of Load', () => {
  const parser = new Parser();
  const loadReference = new ast.Load(new ast.Reference(BigInt('0')));
  expect(parser.parseInstruction('load ^0')).toStrictEqual(loadReference);
  const loadConst = new ast.Load(new ast.Const(BigInt('-7')));
  expect(parser.parseInstruction('load =-7')).toStrictEqual(loadConst);
  const loadAddress = new ast.Load(new ast.Address(BigInt('13')));
  expect(parser.parseInstruction('load 13')).toStrictEqual(loadAddress);
});
test('Parser: parseInstruction - parsing store returns instance of Store', () => {
  const parser = new Parser();
  const loadReference = new ast.Store(new ast.Reference(BigInt('0')));
  expect(parser.parseInstruction('store ^0')).toStrictEqual(loadReference);
  const loadAddress = new ast.Store(new ast.Address(BigInt('13')));
  expect(parser.parseInstruction('store 13')).toStrictEqual(loadAddress);
});
test('Parser: parseInstruction - parsing add returns instance of Add', () => {
  const parser = new Parser();
  const loadReference = new ast.Add(new ast.Reference(BigInt('0')));
  expect(parser.parseInstruction('add ^0')).toStrictEqual(loadReference);
  const loadConst = new ast.Add(new ast.Const(BigInt('-7')));
  expect(parser.parseInstruction('add =-7')).toStrictEqual(loadConst);
  const loadAddress = new ast.Add(new ast.Address(BigInt('13')));
  expect(parser.parseInstruction('add 13')).toStrictEqual(loadAddress);
});
test('Parser: parseInstruction - parsing sub returns instance of Sub', () => {
  const parser = new Parser();
  const loadReference = new ast.Sub(new ast.Reference(BigInt('0')));
  expect(parser.parseInstruction('sub ^0')).toStrictEqual(loadReference);
  const loadConst = new ast.Sub(new ast.Const(BigInt('-7')));
  expect(parser.parseInstruction('sub =-7')).toStrictEqual(loadConst);
  const loadAddress = new ast.Sub(new ast.Address(BigInt('13')));
  expect(parser.parseInstruction('sub 13')).toStrictEqual(loadAddress);
});
test('Parser: parseInstruction - parsing mult returns instance of Mult', () => {
  const parser = new Parser();
  const loadReference = new ast.Mult(new ast.Reference(BigInt('0')));
  expect(parser.parseInstruction('mult ^0')).toStrictEqual(loadReference);
  const loadConst = new ast.Mult(new ast.Const(BigInt('-7')));
  expect(parser.parseInstruction('mult =-7')).toStrictEqual(loadConst);
  const loadAddress = new ast.Mult(new ast.Address(BigInt('13')));
  expect(parser.parseInstruction('mult 13')).toStrictEqual(loadAddress);
});
test('Parser: parseInstruction - parsing div returns instance of Div', () => {
  const parser = new Parser();
  const loadReference = new ast.Div(new ast.Reference(BigInt('0')));
  expect(parser.parseInstruction('div ^0')).toStrictEqual(loadReference);
  const loadConst = new ast.Div(new ast.Const(BigInt('-7')));
  expect(parser.parseInstruction('div =-7')).toStrictEqual(loadConst);
  const loadAddress = new ast.Div(new ast.Address(BigInt('13')));
  expect(parser.parseInstruction('div 13')).toStrictEqual(loadAddress);
});
test('Parser: parseInstruction - parsing read returns instance of Read', () => {
  const parser = new Parser();
  const loadReference = new ast.Read(new ast.Reference(BigInt('0')));
  expect(parser.parseInstruction('read ^0')).toStrictEqual(loadReference);
  const loadAddress = new ast.Read(new ast.Address(BigInt('13')));
  expect(parser.parseInstruction('read 13')).toStrictEqual(loadAddress);
});
test('Parser: parseInstruction - parsing write returns instance of Write', () => {
  const parser = new Parser();
  const loadReference = new ast.Write(new ast.Reference(BigInt('0')));
  expect(parser.parseInstruction('write ^0')).toStrictEqual(loadReference);
  const loadConst = new ast.Write(new ast.Const(BigInt('-7')));
  expect(parser.parseInstruction('write =-7')).toStrictEqual(loadConst);
  const loadAddress = new ast.Write(new ast.Address(BigInt('13')));
  expect(parser.parseInstruction('write 13')).toStrictEqual(loadAddress);
});
test('Parser: parseInstruction - parsing jump returns instance of Jump', () => {
  const parser = new Parser();
  const jump = new ast.Jump(new ast.Label('label1'));
  expect(parser.parseInstruction('jump label1')).toStrictEqual(jump);
});
test('Parser: parseInstruction - parsing jgtz returns instance of Jgtz', () => {
  const parser = new Parser();
  const jump = new ast.Jgtz(new ast.Label('label1'));
  expect(parser.parseInstruction('jgtz label1')).toStrictEqual(jump);
});
test('Parser: parseInstruction - parsing jzero returns instance of Jzero', () => {
  const parser = new Parser();
  const jump = new ast.Jzero(new ast.Label('label1'));
  expect(parser.parseInstruction('jzero label1')).toStrictEqual(jump);
});

// parseLine
test('Parser: parseLine - parsing line with invalid label throws ParserSyntaxError', () => {
  const parser = new Parser();
  const invalidLabelLine = 'label_1: read ^0 #comment';
  expect(() => parser.parseLine(invalidLabelLine)).toThrowError(
    ParserSyntaxError
  );
});

test('Parser: parseLine - parsing line with proper label returns object with it', () => {
  const parser = new Parser();
  const invalidLabelLine = 'label1: read ^0 #comment';
  const labeledInstruction = {
    label: new ast.Label('label1'),
    instruction: new ast.Read(new ast.Reference(BigInt('0'))),
  };
  expect(parser.parseLine(invalidLabelLine)).toStrictEqual(labeledInstruction);
});

test('Parser: parseLine - parsing line without label returns object with null member', () => {
  const parser = new Parser();
  const invalidLabelLine = 'read ^0 #comment';
  const labeledInstruction = {
    label: null,
    instruction: new ast.Read(new ast.Reference(BigInt('0'))),
  };
  expect(parser.parseLine(invalidLabelLine)).toStrictEqual(labeledInstruction);
});

// parseProgram
test('Parser: parseProgram - empty program', () => {
  const parser = new Parser();
  const emptyProgramString = '';
  const parsedProgram = new ast.Program(
    new Map<string, ast.Instruction>(),
    new ast.Halt()
  );
  expect(parser.parseProgram(emptyProgramString)).toStrictEqual(parsedProgram);
});
test('Parser: parseProgram - repeated label throws Error', () => {
  const parser = new Parser();
  const programString = 'here: load =1\nhere: read 0\n';
  expect(() => parser.parseProgram(programString)).toThrowError(ParserError);
});
test('Parser: parseProgram - jump with argument not coresponding to any label throws error', () => {
  const parser = new Parser();
  const programString = 'here: load =1\njump there\n';
  expect(() => parser.parseProgram(programString)).toThrowError(ParserError);
});
test('Parser: parseProgram - program with jumps', () => {
  const parser = new Parser();
  const programString =
    'jump1: jump jump2\n' +
    'jump2: jump jump3\n' +
    'jump3: jump jump4\n' +
    'jump4: jump jump1\n';
  const line1 = new ast.Jump(new ast.Label('jump2'));
  const line2 = new ast.Jump(new ast.Label('jump3'));
  const line3 = new ast.Jump(new ast.Label('jump4'));
  const line4 = new ast.Jump(new ast.Label('jump1'));
  const parsedProgram = new ast.Program(
    new Map<string, ast.Instruction>([
      ['jump1', line1],
      ['jump2', line2],
      ['jump3', line3],
      ['jump4', line4],
    ]),
    new ast.Combine(
      line1,
      new ast.Combine(
        line2,
        new ast.Combine(line3, new ast.Combine(line4, new ast.Halt()))
      )
    )
  );
  expect(parser.parseProgram(programString)).toStrictEqual(parsedProgram);
});
//#endregion
