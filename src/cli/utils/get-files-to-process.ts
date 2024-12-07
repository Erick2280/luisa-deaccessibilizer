import { Stats } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { resolve as resolvePath } from 'node:path';

export const getFilesToProcess = async (
  path: string,
  pathStat: Stats,
  logVerbose: typeof console.log,
) => {
  const filesToProcess = [];

  if (pathStat.isDirectory()) {
    logVerbose(
      `Path is directory; generating mutants jar from directory: ${path}`,
    );
    const files = await readdir(path, {
      recursive: true,
      withFileTypes: true,
    });
    filesToProcess.push(
      ...files
        .filter((file) => file.isFile())
        .filter((file) => file.name.endsWith('.swift'))
        .map((file) => resolvePath(file.parentPath, file.name)),
    );
    logVerbose(`Found ${filesToProcess.length} files to process`);
  } else {
    logVerbose(`Path is file; generating mutants jar from file: ${path}`);
    filesToProcess.push(path);
  }

  return filesToProcess;
};
