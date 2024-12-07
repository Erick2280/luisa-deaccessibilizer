import { Args, Command, Flags } from '@oclif/core';

import { readFile, writeFile } from 'node:fs/promises';
import { resolve as resolvePath } from 'node:path';

import { Deaccessibilizer } from '../../deaccessibilizer.js';
import {
  MutationGenerationOptions,
  MutationOperator,
} from '../../mutating/mutation-operator.js';
import { SwiftFileTree } from '../../parsing/swift-file-tree.js';
import { mutationOperators } from '../flags/mutation-operators.js';
import { outputFile } from '../flags/output-file.js';
import {
  customComment,
  substituteWithComment,
} from '../flags/substitute-with-comment.js';
import { fileExists } from '../utils/file-exists.js';

export default class MutateFromOperatorsCommand extends Command {
  static override args = {
    file: Args.string({
      description: 'Swift file to mutate',
      required: true,
    }),
  };

  static override description = 'applies mutation operators to a file';

  static override examples = ['<%= config.bin %> <%= command.id %>'];

  static override flags = {
    rules: mutationOperators(),
    'rebuild-tree': Flags.boolean({
      description:
        'rebuild syntax tree when applying mutations, which is slower but less prone to result in invalid code',
      char: 't',
      aliases: ['rebuild'],
      allowNo: true,
      default: true,
    }),
    'substitute-with-comment': substituteWithComment,
    'custom-comment': customComment,
    'output-file': outputFile('mutated Swift file'),
  };

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(MutateFromOperatorsCommand);
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
    const callArguments: [
      SwiftFileTree,
      MutationOperator[],
      MutationGenerationOptions,
    ] = [
      tree,
      flags.rules,
      {
        substituteWithComment: (() => {
          if (flags['substitute-with-comment']) {
            return (
              flags['custom-comment'] ?? 'Code modified by Deaccessibilizer'
            );
          }
          return false;
        })(),
      },
    ];

    if (flags['rebuild-tree']) {
      deaccessibilizer.applyOperatorsToTreeWithRebuild(...callArguments);
    } else {
      const faultTransformations = deaccessibilizer.getCodeMutations(
        ...callArguments,
      );
      deaccessibilizer.applyCodeMutationsToTree(tree, faultTransformations);
    }

    if (flags['output-file']) {
      const outputFilePath = resolvePath(flags['output-file']);

      if (await fileExists(outputFilePath)) {
        this.error('Output file already exists');
      }

      await writeFile(outputFilePath, tree.text, 'utf8');
    } else {
      this.log(tree.text);
    }
  }
}
