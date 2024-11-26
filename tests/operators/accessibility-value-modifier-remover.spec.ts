import { describe, it } from 'vitest';
import {
  Deaccessibilizer,
  AccessibilityValueModifierRemover,
} from '../../src/index.js';
import { SWIFT_FILE_SAMPLES_BASE_PATH } from '../utils/read-file-content.js';
import { getExpectIsSameFileAfterApplyingOperators } from '../utils/expect-is-same-file-after-applying-operators.js';

const deaccessibilizer = new Deaccessibilizer();
const expectIsSameFileAfterApplyingOperators =
  getExpectIsSameFileAfterApplyingOperators(deaccessibilizer);

const operator = AccessibilityValueModifierRemover;

describe('AccessibilityValueModifierRemover', () => {
  it('runs the operator successfully for Romilda sample', async () => {
    await expectIsSameFileAfterApplyingOperators(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Romilda.swift`,
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Romilda_noAccessibilityValueModifier.swift`,
      [operator],
    );
  });
});
