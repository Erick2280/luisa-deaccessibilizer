import { Args, Command } from '@oclif/core';

import { confirm, select } from '@inquirer/prompts';
import chalk from 'chalk';
import { readFile, stat, writeFile } from 'node:fs/promises';
import { resolve as resolvePath } from 'node:path';

import { Deaccessibilizer } from '../../deaccessibilizer.js';
import {
  MutantsJar,
  versionIdentifier,
} from '../../serializing/serializables.js';
import { recursive } from '../flags/recursive.js';
import { skipChecks } from '../flags/skip-checks.js';
import { createVerboseConsoleLog, verbose } from '../flags/verbose.js';
import { commandExecute } from '../utils/command-execute.js';
import { getFilesToProcess } from '../utils/get-files-to-process.js';

export default class InteractiveMutateFromJarCommand extends Command {
  static override args = {
    jar: Args.string({
      description: 'path to the mutants jar JSON file',
      required: true,
    }),
    target: Args.string({
      description:
        'Swift file or directory to interactively apply mutations to',
      required: true,
    }),
  };

  static override description =
    'interactively mutates from mutants jar JSON to a Swift file or directory; potentially destructive';

  static override examples = ['<%= config.bin %> <%= command.id %>'];

  static override flags = {
    recursive: recursive,
    verbose: verbose,
    'skip-checks': skipChecks,
  };

  async checkGitStateOnDirectory(targetPath: string) {
    try {
      await commandExecute('git rev-parse --is-inside-work-tree', targetPath);
    } catch {
      const gitCheckConfirmation = await confirm({
        message: `The target path is not inside a git repository; continue? ${chalk.red('This operation is potentially destructive.')}`,
      });

      if (!gitCheckConfirmation) {
        this.log('Aborting.');
        this.exit();
      }
    }

    const gitDiffResult = await commandExecute('git diff --stat', targetPath);

    if (gitDiffResult.stdout.trim() !== '') {
      const gitDiffConfirmation = await confirm({
        message: `The target path has uncommitted changes; continue? ${chalk.red('This operation is potentially destructive.')}`,
        default: false,
      });

      if (!gitDiffConfirmation) {
        this.log('Aborting.');
        this.exit();
      }
    }
  }

  async restoreFileIfChanged(
    currentModifiedFilePath: string | null,
    currentModifiedFileContent: string | null,
    log: typeof console.log,
  ) {
    if (currentModifiedFilePath && currentModifiedFileContent) {
      try {
        log(`Restoring file: ${currentModifiedFilePath}...`);
        await writeFile(
          currentModifiedFilePath,
          currentModifiedFileContent,
          'utf8',
        );
        log('File restoring complete.');
      } catch (error) {
        this.error(
          `Error writing file: ${(error as Error).message ?? 'Unknown error'}`,
        );
      }
    }
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(InteractiveMutateFromJarCommand);
    const logVerbose = createVerboseConsoleLog(flags.verbose);

    let currentModifiedFilePath: string | null = null;
    let currentModifiedFileContent: string | null = null;

    process.on('SIGINT', async () => {
      this.log('Aborting on SIGINT.');
      await this.restoreFileIfChanged(
        currentModifiedFilePath,
        currentModifiedFileContent,
        this.log,
      );
      process.exit();
    });

    const jarPath = resolvePath(args.jar);
    const targetPath = resolvePath(args.target);

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

    const targetPathStat = await stat(targetPath);

    if (!targetPathStat.isDirectory() && !targetPathStat.isFile()) {
      this.error('The target path provided is not a file or a directory');
    }

    if (targetPathStat.isDirectory() && !flags.recursive) {
      this.error(
        'The path provided is a directory; use the --recursive flag to check for mutations to apply in all files in the directory',
      );
    }
    const filesToProcess = await getFilesToProcess(
      targetPath,
      targetPathStat,
      logVerbose,
    );

    if (targetPathStat.isDirectory() && !flags['skip-checks']) {
      logVerbose('Checking git state on target directory...');
      await this.checkGitStateOnDirectory(targetPath);
    }

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

      const hash = await deaccessibilizer.getFileHash(fileContent);
      const candidateFileMutants = mutantsJar.files.find(
        (file) => file.targetFileHash === hash,
      );

      if (!candidateFileMutants) {
        logVerbose(`No mutations found for file.`);
        continue;
      }

      logVerbose(
        `${candidateFileMutants.mutants.length} mutations found for file.`,
      );

      for (const [index, mutant] of candidateFileMutants.mutants.entries()) {
        const applyMutantQuestion = await select({
          message: `Apply on file ${filePath} (hash: ${hash}) ${mutant.operatorId} at range ${mutant.codeChanges.map((change) => `${change.replaceStartIndex}-${change.replaceEndIndex}`).join(', ')}? (${index + 1} of ${candidateFileMutants.mutants.length} in file)`,
          default: 'a',
          choices: [
            {
              name: 'Apply',
              value: 'apply',
            },
            {
              name: 'Skip this mutant',
              value: 'skip_mutant',
            },
            {
              name: 'Skip this file',
              value: 'skip_file',
            },
            {
              name: 'Abort',
              value: 'abort',
            },
          ],
        });

        if (applyMutantQuestion === 'skip_mutant') {
          continue;
        }

        if (applyMutantQuestion === 'skip_file') {
          break;
        }

        if (applyMutantQuestion === 'abort') {
          await this.restoreFileIfChanged(
            currentModifiedFilePath,
            currentModifiedFileContent,
            logVerbose,
          );
          currentModifiedFileContent = null;
          currentModifiedFilePath = null;

          this.log('Aborting.');
          this.exit();
        }

        if (applyMutantQuestion === 'apply') {
          await this.restoreFileIfChanged(
            currentModifiedFilePath,
            currentModifiedFileContent,
            logVerbose,
          );
          currentModifiedFileContent = null;
          currentModifiedFilePath = null;

          const mutatedFileContent =
            deaccessibilizer.applySerializableCodeMutationToText(
              fileContent,
              mutant,
            );

          try {
            await writeFile(filePath, mutatedFileContent, 'utf8');
            logVerbose('Successfully applied from jar.');

            currentModifiedFileContent = fileContent;
            currentModifiedFilePath = filePath;
          } catch (error) {
            this.error(
              `Error writing file: ${(error as Error).message ?? 'Unknown error'}`,
            );
          }
        }
      }
      await this.restoreFileIfChanged(
        currentModifiedFilePath,
        currentModifiedFileContent,
        logVerbose,
      );
      currentModifiedFileContent = null;
      currentModifiedFilePath = null;
    }
  }
}
