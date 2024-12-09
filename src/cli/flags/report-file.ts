import { Flags } from '@oclif/core';

export const reportFile = Flags.string({
  description: `path to test report file generated in target directory after each test, in JUnit XML format;  defaults to './report.xml'`,
  char: 'j',
  default: './report.xml',
  aliases: ['output'],
});
