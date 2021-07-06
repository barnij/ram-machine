import {Parser, parseBigInt} from './parser';
import {ParserSyntaxError, ParserTypeError} from './errors';

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

test('Parser: parseLabel - parsing nonalphanumeric string throws ParserSyntaxError', () => {
  const parser = new Parser();
  expect(() => parser.parseLabel('nonalphanumeric_1')).toThrowError(
    ParserSyntaxError
  );
});

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
