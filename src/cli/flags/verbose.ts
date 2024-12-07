import { Flags } from '@oclif/core';

export const verbose = Flags.boolean({
  description: 'output verbose logs',
  char: 'v',
});

export const createVerboseConsoleLog = (verbose: boolean) => {
  return verbose ? console.log : () => {};
};
