import { expect } from 'vitest';
import {
  Deaccessibilizer,
  MutationGenerationOptions,
  MutationOperator,
} from '../../src/index.js';
import { readFileContent } from './read-file-content.js';

/**
 * Returns a function that expects the file content of a file to be the same of
 * another one after applying the given mutation operators.
 */
export function getExpectIsSameFileAfterApplyingOperators(
  deaccessibilizer: Deaccessibilizer,
) {
  return async (
    baseFilePath: string,
    expectedFilePath: string,
    operators: MutationOperator[],
    options?: MutationGenerationOptions,
  ) => {
    const baseCode = readFileContent(baseFilePath);
    const expectedCode = readFileContent(expectedFilePath);
    const tree = await deaccessibilizer.createSwiftFileTree(baseCode);

    deaccessibilizer.applyOperatorsToTreeWithRebuild(tree, operators, options);

    expect(tree.text).toBe(expectedCode);
  };
}
