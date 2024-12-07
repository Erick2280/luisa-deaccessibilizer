import { Args, Command } from '@oclif/core';

import chalk from 'chalk';
import { readFile } from 'node:fs/promises';
import { resolve as resolvePath } from 'node:path';

import { Deaccessibilizer } from '../../deaccessibilizer.js';
import { byNodePosition } from '../../utils.js';
import { mutationOperators } from '../flags/mutation-operators.js';

export default class HighlightCommand extends Command {
  static override args = {
    file: Args.string({
      description: 'Swift file to highlight mutations in',
      required: true,
    }),
  };

  static override description =
    'highlights possible places for mutation in a Swift file';

  static override examples = ['<%= config.bin %> <%= command.id %>'];

  static override flags = {
    rules: mutationOperators(),
  };

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(HighlightCommand);
    const filePath = resolvePath(args.file);
    let fileContent: string;

    try {
      fileContent = await readFile(filePath, 'utf8');
    } catch (error) {
      this.error(
        `Error reading file: ${(error as Error).message ?? 'Unknown error'}`,
      );
    }

    const deaccessibilizer = new Deaccessibilizer();
    const tree = await deaccessibilizer.createSwiftFileTree(fileContent);

    const codeMutations = await deaccessibilizer.getCodeMutations(
      tree,
      flags.rules,
    );

    const nodeChanges = codeMutations
      .flatMap((mutation) => mutation.nodeChanges)
      .sort(byNodePosition)
      .reverse();

    let highlightedContent = fileContent;

    for (const change of nodeChanges) {
      highlightedContent = `${highlightedContent.substring(
        0,
        change.node.startIndex,
      )}${chalk.bold.bgYellow(highlightedContent.substring(change.node.startIndex, change.node.endIndex))}${highlightedContent.substring(
        change.node.endIndex,
      )}`;
    }

    this.log(highlightedContent);
  }
}
