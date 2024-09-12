import { describe, expect, it } from 'vitest';
import { Deaccessibilizer } from '../src/deaccessibilizer.js';
import { getExpectIsSameFileAfterApplyingRules } from './utils/expect-is-same-file-after-applying-rules.js';
import {
  AccessibilityHiddenModifierRemover,
  ImageDecorativeLabelRemover,
} from '../src/index.js';
import {
  readFileContent,
  SWIFT_FILE_SAMPLES_BASE_PATH,
} from './utils/read-file-content.js';

const deaccessibilizer = new Deaccessibilizer();
const expectIsSameFileAfterApplyingRules =
  getExpectIsSameFileAfterApplyingRules(deaccessibilizer);

describe('Deaccessibilizer', () => {
  it('successfully builds a Swift file tree', async () => {
    const tree = await deaccessibilizer.createSwiftFileTree('let x = 3');
    expect(tree).toBeDefined();
  });

  it('successfully runs multiple rules', async () => {
    const baseCode = readFileContent(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Enzo.swift`,
    );
    const expectedCode = readFileContent(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Enzo_noImageDecorativeLabelAndAccessibilityHiddenModifier.swift`,
    );

    const tree = await deaccessibilizer.createSwiftFileTree(baseCode);
    const codeTransformations = deaccessibilizer.getFaultTransformations(tree, [
      AccessibilityHiddenModifierRemover,
      ImageDecorativeLabelRemover,
    ]);
    deaccessibilizer.applyCodeTransformationsToTree(tree, codeTransformations);

    expect(tree.text).toBe(expectedCode);
  });

  it('successfully runs multiple rules using rebuild', async () => {
    await expectIsSameFileAfterApplyingRules(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Enzo.swift`,
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Enzo_noImageDecorativeLabelAndAccessibilityHiddenModifier.swift`,
      [AccessibilityHiddenModifierRemover, ImageDecorativeLabelRemover],
    );
  });
});
