import {Interpreter} from '../engine/interpreter';
import {Parser} from '../engine/parser';
import {Engine} from '../engine/engine';
import {readFile} from 'fs/promises';
import * as path from 'path';
import * as fs from 'fs';

// to get input from stdin:
// import {ReadStream} from 'tty';
// async function read(stream: ReadStream & {fd: 0}): Promise<string> {
//   const chunks = [];
//   for await (const chunk of stream) chunks.push(chunk);
//   return Buffer.concat(chunks).toString('utf-8');
// }

const WHITESPACE = /\s+/;

export async function interpret(
  programPath: string,
  inputPath: string
): Promise<string> {
  const input = await readFile(path.resolve(process.cwd(), inputPath), 'utf-8');

  const engine = new Engine(new Parser(), new Interpreter());
  const data = fs.readFileSync(
    path.resolve(process.cwd(), programPath),
    'utf-8'
  );
  const state = engine.makeStateFromString(
    data,
    input.split(WHITESPACE).map(x => BigInt(x))
  );
  engine.complete(state);

  return state.environment.output.values.join(' ');
}
