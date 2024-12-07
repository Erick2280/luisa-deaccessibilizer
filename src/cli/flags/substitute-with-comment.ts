import { Flags } from '@oclif/core';

export const substituteWithComment = Flags.boolean({
  description: 'substitute mutated nodes with a comment',
  char: 'c',
  aliases: ['comment'],
});

export const customComment = Flags.string({
  description: 'custom comment to substitute mutated nodes with',
  char: 'C',
  aliases: ['custom'],
  dependsOn: ['substitute-with-comment'],
});
