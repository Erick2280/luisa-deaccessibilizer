import fs from 'fs';

export function readFileContent(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

export const SWIFT_FILE_SAMPLES_BASE_PATH = './misc/swift-file-samples/';
