import { Flags } from '@oclif/core';

export const outputFile = (fileDescription: string) =>
  Flags.string({
    description: `output file to write the ${fileDescription} to; if not provided, the file content will be printed to stdout`,
    char: 'o',
    aliases: ['output'],
  });
