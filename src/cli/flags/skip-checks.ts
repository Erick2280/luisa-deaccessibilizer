import { Flags } from '@oclif/core';

export const skipChecks = Flags.boolean({
  description: 'skip checks for git state and uncommitted changes',
  char: 'y',
});
