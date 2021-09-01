import { interpret } from './interpreter';
import { readdir, readFile } from 'fs/promises';
import * as path from 'path';

async function delay(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}

const WHITESPACE = /\s+/;
const ALOTOFSPACES = '                                         ';
const exluded: string[] = process.argv[4] === '--' ? [] : process.argv.slice(4);

async function main() {
  const programsPath = process.argv[2];
  const tasksPath = process.argv[3];
  let tasks = await readdir(tasksPath, 'utf-8');
  if (process.argv[4] === '--') {
    tasks = tasks.filter(x => process.argv.slice(5).includes(x));
  }

  for (const task of tasks) {
    console.info(`task: ${task}`);

    if (exluded.includes(task)) {
      console.info('\\___ skipped');
      continue;
    }

    const tests = (await readdir(path.join(tasksPath, task), 'utf-8'))
      .filter(x => x.endsWith('in'))
      .map(x => path.join(tasksPath, task, x.substring(0, x.length - 3)));

    const programs = (
      await readdir(path.join(programsPath, task), 'utf-8')
    ).map(x => path.join(programsPath, task, x));

    for (const test of tests) {
      const correctOutput = (await readFile(test + '.out', 'utf-8'))
        .trim()
        .split(WHITESPACE)
        .join(' ');

      for (const program of programs) {
        process.stdout.write(`\r ${program} (${test}) ${ALOTOFSPACES}`);
        let output = 'no output';
        let error = false;
        try {
          output = await interpret(program, test + '.in');
        } catch (err: unknown) {
          console.error(err);
          error = true;
        }

        if (output !== correctOutput || error) {
          console.error(
            `\nIncorrect output in task ${program} and test ${test}`
          );
          console.error('Correct output: ' + correctOutput);
          console.error('Output: ' + output);
          await delay(5000);
        }
      }
    }
    process.stdout.write(`\r\\___ OK ${ALOTOFSPACES}${ALOTOFSPACES}\n`);
  }
}

main();
