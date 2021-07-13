import {interpret} from './interpreter';
import {readdir, readFile} from 'fs/promises';
import * as path from 'path';

async function delay(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}

const exluded: string[] = [];

async function main() {
  const programsPath = process.argv[2];
  const tasksPath = process.argv[3];
  const tasks = await readdir(tasksPath, 'utf-8');

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
      const correctOutput = (await readFile(test + '.out', 'utf-8')).trim();

      for (const program of programs) {
        let output = 'no output';
        let error: Error | null = null;
        try {
          output = await interpret(program, test + '.in');
        } catch (err) {
          console.error(err);
          error = err;
        }

        if (output !== correctOutput || error != null) {
          console.error(`Incorrect output in task ${program} and test ${test}`);
          console.error('Correct output: ' + correctOutput);
          console.error('Output: ' + output);
          await delay(5000);
        }
      }
    }
    console.info('\\___ OK');
  }
}

main();
