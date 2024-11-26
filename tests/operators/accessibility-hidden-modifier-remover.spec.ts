import { describe, it } from 'vitest';
import {
  Deaccessibilizer,
  AccessibilityHiddenModifierRemover,
} from '../../src/index.js';
import { SWIFT_FILE_SAMPLES_BASE_PATH } from '../utils/read-file-content.js';
import { getExpectIsSameFileAfterApplyingOperators } from '../utils/expect-is-same-file-after-applying-operators.js';

const deaccessibilizer = new Deaccessibilizer();
const expectIsSameFileAfterApplyingOperators =
  getExpectIsSameFileAfterApplyingOperators(deaccessibilizer);

const operator = AccessibilityHiddenModifierRemover;

describe('AccessibilityHiddenModifierRemover', () => {
  it('runs the operator successfully for Enzo sample', async () => {
    await expectIsSameFileAfterApplyingOperators(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Enzo.swift`,
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Enzo_noAccessibilityHiddenModifier.swift`,
      [operator],
    );
  });
});
