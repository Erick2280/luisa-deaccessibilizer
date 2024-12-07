import { Flags } from '@oclif/core';

export const recursive = Flags.boolean({
  description: 'if a directory is provided, run recursively on all files in it',
  char: 'r',
});
