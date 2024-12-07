import { exec } from 'node:child_process';
import { access, constants } from 'node:fs/promises';
import { promisify } from 'node:util';

export const commandExecute = async (
  command: string,
  directory?: string,
): Promise<{
  stdout: string;
  stderr: string;
}> => {
  const executionPromise = promisify(exec)(command, {
    cwd: directory,
  });

  return await executionPromise;
};

export const canExecuteFile = async (path: string): Promise<boolean> => {
  try {
    await access(path, constants.X_OK);
    return true;
  } catch {
    return false;
  }
};
