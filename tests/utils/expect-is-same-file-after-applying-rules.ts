import { expect } from 'vitest';
import {
  Deaccessibilizer,
  FaultTransformationOptions,
  FaultTransformationRule,
} from '../../src/index.js';
import { readFileContent } from './get-text-from-file.js';

/**
 * Returns a function that expects the file content of a file to be the same of
 * another one after applying the given fault transformation rules.
 */
export function getExpectIsSameFileAfterApplyingRules(
  deaccessibilizer: Deaccessibilizer,
) {
  return async (
    baseFilePath: string,
    expectedFilePath: string,
    rules: FaultTransformationRule[],
    options?: FaultTransformationOptions,
  ) => {
    const baseCode = readFileContent(baseFilePath);
    const expectedCode = readFileContent(expectedFilePath);
    const tree = await deaccessibilizer.createSwiftFileTree(baseCode);

    deaccessibilizer.applyFaultTransformationsToTreeWithRebuild(
      tree,
      rules,
      options,
    );

    expect(tree.text).toBe(expectedCode);
  };
}
