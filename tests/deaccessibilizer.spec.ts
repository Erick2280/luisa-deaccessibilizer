import { describe, expect, it } from 'vitest';
import { Deaccessibilizer } from '../src/deaccessibilizer.js';
import { getExpectIsSameFileAfterApplyingOperators } from './utils/expect-is-same-file-after-applying-operators.js';
import {
  AccessibilityHiddenModifierRemover,
  ImageDecorativeLabelRemover,
} from '../src/index.js';
import {
  readFileContent,
  SWIFT_FILE_SAMPLES_BASE_PATH,
} from './utils/read-file-content.js';

const deaccessibilizer = new Deaccessibilizer();
const expectIsSameFileAfterApplyingOperators =
  getExpectIsSameFileAfterApplyingOperators(deaccessibilizer);

describe('Deaccessibilizer', () => {
  it('successfully builds a Swift file tree', async () => {
    const tree = await deaccessibilizer.createSwiftFileTree('let x = 3');
    expect(tree).toBeDefined();
  });

  it('successfully runs multiple operators', async () => {
    const baseCode = readFileContent(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Enzo.swift`,
    );
    const expectedCode = readFileContent(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Enzo_noImageDecorativeLabelAndAccessibilityHiddenModifier.swift`,
    );

    const tree = await deaccessibilizer.createSwiftFileTree(baseCode);
    const codeMutations = deaccessibilizer.getCodeMutations(tree, [
      AccessibilityHiddenModifierRemover,
      ImageDecorativeLabelRemover,
    ]);
    deaccessibilizer.applyCodeMutationsToTree(tree, codeMutations);

    expect(tree.text).toBe(expectedCode);
  });

  it('successfully runs multiple operators using rebuild', async () => {
    await expectIsSameFileAfterApplyingOperators(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Enzo.swift`,
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Enzo_noImageDecorativeLabelAndAccessibilityHiddenModifier.swift`,
      [AccessibilityHiddenModifierRemover, ImageDecorativeLabelRemover],
    );
  });
});
