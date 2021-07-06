import {Parser, parseBigInt, validateArgument} from './parser';
import {ParserSyntaxError, ParserTypeError} from './errors';
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
test('validateArgument - validating argument for invalid instruction code returns false', () => {
  expect(validateArgument('SUBSTRACT', new ast.Const(BigInt(5)))).toBe(false);
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
//#endregion
