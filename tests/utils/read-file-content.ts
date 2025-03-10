import { readFileSync } from 'node:fs';

/**
 * Read the content of a file.
 */
export function readFileContent(filePath: string): string {
  return readFileSync(filePath, 'utf8');
}

/**
 * The base path for the Swift file samples.
 */
export const SWIFT_FILE_SAMPLES_BASE_PATH = './misc/swift-file-samples/';
