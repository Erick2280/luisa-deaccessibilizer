import { Args, Command } from '@oclif/core';

import { readFile, stat, writeFile } from 'node:fs/promises';
import { resolve as resolvePath } from 'node:path';

import { Deaccessibilizer } from '../../deaccessibilizer.js';
import {
  MutationGenerationOptions,
  MutationOperator,
} from '../../mutating/mutation-operator.js';
import {
  MutantsJar,
  versionIdentifier,
} from '../../serializing/serializables.js';
import { mutationOperators } from '../flags/mutation-operators.js';
import { outputFile } from '../flags/output-file.js';
import { recursive } from '../flags/recursive.js';
import {
  customComment,
  substituteWithComment,
} from '../flags/substitute-with-comment.js';
import { createVerboseConsoleLog, verbose } from '../flags/verbose.js';
import { fileExists } from '../utils/file-exists.js';
import { getFilesToProcess } from '../utils/get-files-to-process.js';

export default class GenerateJarCommand extends Command {
  static override args = {
    target: Args.string({
      description: 'Swift file or directory to generate mutants jar',
      required: true,
    }),
  };

  static override description =
    'generates a mutants jar JSON from a given file or directory';

  static override examples = ['<%= config.bin %> <%= command.id %>'];

  static override flags = {
    rules: mutationOperators(),
    'substitute-with-comment': substituteWithComment,
    'custom-comment': customComment,
    'output-file': outputFile('mutation jar JSON file'),
    recursive: recursive,
    verbose: verbose,
  };

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(GenerateJarCommand);
    const logVerbose = createVerboseConsoleLog(flags.verbose);

    const targetPath = resolvePath(args.target);
    const targetPathStat = await stat(targetPath);

    if (!targetPathStat.isDirectory() && !targetPathStat.isFile()) {
      this.error('The path provided is not a file or a directory');
    }

    if (targetPathStat.isDirectory() && !flags.recursive) {
      this.error(
        'The path provided is a directory; use the --recursive flag to generate mutants jar from all files in the directory',
      );
    }
    const filesToProcess = await getFilesToProcess(
      targetPath,
      targetPathStat,
      logVerbose,
    );

    const mutantsJar: MutantsJar = {
      files: [],
      versionIdentifier,
    };

    const deaccessibilizer = new Deaccessibilizer();

    for (const filePath of filesToProcess) {
      logVerbose(`Processing file: ${filePath}`);
      let fileContent: string;

      try {
        fileContent = await readFile(filePath, 'utf8');
      } catch (error) {
        this.error(
          `Error reading file: ${(error as Error).message ?? 'Unknown error'}`,
        );
      }

      const callArguments: [
        string,
        string,
        MutationOperator[],
        MutationGenerationOptions,
      ] = [
        fileContent,
        filePath,
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

      try {
        const fileMutants = await deaccessibilizer.getFileMutants(
          ...callArguments,
        );
        if (fileMutants.mutants.length > 0) {
          mutantsJar.files.push(fileMutants);
        }
        logVerbose(`Found ${fileMutants.mutants.length} mutants for this file`);
      } catch (error) {
        this.warn(
          `Could not generate mutants for file: ${filePath}, reason: ${(error as Error).message ?? 'Unknown'}. Skipping...`,
        );
      }
    }

    logVerbose(`Found ${mutantsJar.files.length} files with mutants`);

    const serializedMutantsJar = JSON.stringify(mutantsJar);

    if (flags['output-file']) {
      const outputFilePath = resolvePath(flags['output-file']);

      if (await fileExists(outputFilePath)) {
        this.error('Output file already exists');
      }

      await writeFile(outputFilePath, serializedMutantsJar, 'utf8');
    } else {
      this.log(serializedMutantsJar);
    }
  }
}
