import { Args, Command } from '@oclif/core';

import { confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import { readFile, stat, unlink, writeFile } from 'node:fs/promises';
import { resolve as resolvePath } from 'node:path';

import { Deaccessibilizer } from '../../deaccessibilizer.js';
import {
  MutantsJar,
  versionIdentifier,
} from '../../serializing/serializables.js';
import { MutantData, Oracle } from '../../testing/oracle.js';
import { outputFile } from '../flags/output-file.js';
import { reportFile } from '../flags/report-file.js';
import { skipChecks } from '../flags/skip-checks.js';
import { createVerboseConsoleLog, verbose } from '../flags/verbose.js';
import { canExecuteFile, commandExecute } from '../utils/command-execute.js';
import { fileExists } from '../utils/file-exists.js';
import { getFilesToProcess } from '../utils/get-files-to-process.js';

export default class PerformMutationTestingCommand extends Command {
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
    'test-script': Args.string({
      description:
        'test script file to run after applying mutations; should create a JUnit XML report in project directory',
      required: true,
    }),
  };

  static override description =
    'performs a mutation testing run on a Swift project, given a mutants jar JSON and a script that runs a test suite';

  static override examples = ['<%= config.bin %> <%= command.id %>'];

  static override flags = {
    verbose: verbose,
    'skip-checks': skipChecks,
    'output-file': outputFile('mutation test results JSON file'),
    'report-file': reportFile,
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

  async runTestsAndConsumeResults(
    testScript: string,
    reportFilePath: string,
    directory: string,
    log: typeof console.log,
  ) {
    const { stdout, stderr } = await commandExecute(testScript, directory);

    if (stderr.trim() !== '') {
      log(`Error running test script. Printing stderr below.`);
      log(stderr);
    }

    log(`Finished running test script. Output below.`);
    log(stdout);

    const reportFileContent = await readFile(reportFilePath, 'utf8');

    await unlink(reportFilePath);

    return reportFileContent;
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(PerformMutationTestingCommand);
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
    const testScriptPath = resolvePath(args['test-script']);
    const reportFilePath = resolvePath(targetPath, flags['report-file']);

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

    const testScriptPathStat = await stat(testScriptPath);
    let testScriptFileContent: string;

    try {
      if (!testScriptPathStat.isFile()) {
        throw new Error('The test script provided is not a file');
      }

      if (!(await canExecuteFile(testScriptPath))) {
        throw new Error('The test script provided is not executable');
      }
      testScriptFileContent = await readFile(testScriptPath, 'utf8');
    } catch (error) {
      this.error(
        `Error reading test script file: ${(error as Error).message ?? 'Unknown error'}`,
      );
    }

    const targetPathStat = await stat(targetPath);

    if (!targetPathStat.isDirectory()) {
      this.error('The target path provided is not a directory');
    }

    const filesToProcess = await getFilesToProcess(
      targetPath,
      targetPathStat,
      logVerbose,
    );

    if (!flags['skip-checks']) {
      logVerbose('Checking git state on target directory...');
      await this.checkGitStateOnDirectory(targetPath);
    }

    logVerbose(`Will look for report files at: ${reportFilePath}`);

    const deaccessibilizer = new Deaccessibilizer();
    const oracle = new Oracle();

    try {
      logVerbose('Running base test script...');
      const baseTestResult = await this.runTestsAndConsumeResults(
        testScriptFileContent,
        reportFilePath,
        targetPath,
        logVerbose,
      );
      await oracle.addBaseTestResult(baseTestResult);
    } catch (error) {
      this.error(
        `Error running base test script: ${(error as Error).message ?? 'Unknown error'}`,
      );
    }

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

      for (const mutant of candidateFileMutants.mutants) {
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

        const mutantData: MutantData = {
          targetFilePath: filePath,
          targetFileHash: hash,
          operatorId: mutant.operatorId,
        };

        try {
          logVerbose(
            `Running mutant test script for operator ${mutant.operatorId}...`,
          );
          const mutantTestResult = await this.runTestsAndConsumeResults(
            testScriptFileContent,
            reportFilePath,
            targetPath,
            logVerbose,
          );
          await oracle.addMutantTestResult(mutantTestResult, mutantData);
        } catch (error) {
          this.log(
            `Error running mutant test script: ${(error as Error).message ?? 'Unknown error'}, considering mutant killed.`,
          );
          await oracle.addEmptyMutantTestResult(mutantData);
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

    const mutationTestResults = await oracle.getMutationTestResults();
    const serializedMutationTestResults = JSON.stringify(mutationTestResults);

    if (flags['output-file']) {
      const outputFilePath = resolvePath(flags['output-file']);

      if (await fileExists(outputFilePath)) {
        this.error('Output file already exists');
      }

      await writeFile(outputFilePath, serializedMutationTestResults, 'utf8');
    } else {
      this.log(serializedMutationTestResults);
    }
  }
}
