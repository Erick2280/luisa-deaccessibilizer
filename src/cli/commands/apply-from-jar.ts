import { Args, Command } from '@oclif/core';

import { confirm, select } from '@inquirer/prompts';
import chalk from 'chalk';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve as resolvePath } from 'node:path';

import { Deaccessibilizer } from '../../deaccessibilizer.js';
import {
  MutantsJar,
  versionIdentifier,
} from '../../serializing/serializables.js';

export default class ApplyFromJarCommand extends Command {
  static override args = {
    jar: Args.string({
      description: 'path to the mutants jar JSON file',
      required: true,
    }),
    file: Args.string({
      description: 'Swift file to mutate',
      required: true,
    }),
  };

  static override description =
    'applies a mutation from mutants jar JSON to a Swift file; potentially destructive';

  static override examples = ['<%= config.bin %> <%= command.id %>'];

  public async run(): Promise<void> {
    const { args } = await this.parse(ApplyFromJarCommand);

    const jarPath = resolvePath(args.jar);
    const filePath = resolvePath(args.file);

    let mutantsJar: MutantsJar;

    try {
      const jarFileContent = await readFile(jarPath, 'utf8');
      const parsedJar = JSON.parse(jarFileContent);

      if (parsedJar?.versionIdentifier !== versionIdentifier) {
        throw new Error('The file provided is not a mutants jar JSON file');
      }

      mutantsJar = parsedJar as MutantsJar;
    } catch (error) {
      this.error(
        `Error reading jar file: ${(error as Error).message ?? 'Unknown error'}`,
      );
    }

    let fileContent: string;

    try {
      fileContent = await readFile(filePath, 'utf8');
    } catch (error) {
      this.error(
        `Error reading file: ${(error as Error).message ?? 'Unknown error'}`,
      );
    }

    const deaccessibilizer = new Deaccessibilizer();
    const hash = await deaccessibilizer.getFileHash(fileContent);

    const candidateFileMutants = mutantsJar.files.find(
      (file) => file.targetFileHash === hash,
    );

    if (!candidateFileMutants) {
      this.error(
        'Could not find mutations for the provided file in the mutants jar',
      );
    }

    const mutation = await select({
      message: `Select a mutation to apply to ${candidateFileMutants.targetFilePath} (hash: ${hash})`,
      choices: candidateFileMutants.mutants.map((mutant) => ({
        name: `${mutant.operatorId} at range ${mutant.codeChanges.map((change) => `${change.replaceStartIndex}-${change.replaceEndIndex}`).join(', ')}`,
        value: mutant,
        description: mutant.codeChanges
          .map((change) =>
            fileContent.substring(
              change.replaceStartIndex,
              change.replaceEndIndex,
            ),
          )
          .join(' / '),
      })),
    });

    const confirmMutation = await confirm({
      message: `Apply the ${mutation.operatorId} mutation to ${candidateFileMutants.targetFilePath}? ${chalk.red('This operation will modify the file.')}`,
    });

    if (!confirmMutation) {
      this.log('Apply for jar aborted.');
      return;
    }

    const mutatedFileContent =
      deaccessibilizer.applySerializableCodeMutationToText(
        fileContent,
        mutation,
      );

    try {
      await writeFile(filePath, mutatedFileContent, 'utf8');
      this.log('Successfully applied from jar.');
    } catch (error) {
      this.error(
        `Error writing file: ${(error as Error).message ?? 'Unknown error'}`,
      );
    }
  }
}
