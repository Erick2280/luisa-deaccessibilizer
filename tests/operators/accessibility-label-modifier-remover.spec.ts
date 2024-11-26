import { describe, it } from 'vitest';
import {
  Deaccessibilizer,
  AccessibilityLabelModifierRemover,
} from '../../src/index.js';
import { SWIFT_FILE_SAMPLES_BASE_PATH } from '../utils/read-file-content.js';
import { getExpectIsSameFileAfterApplyingOperators } from '../utils/expect-is-same-file-after-applying-operators.js';

const deaccessibilizer = new Deaccessibilizer();
const expectIsSameFileAfterApplyingOperators =
  getExpectIsSameFileAfterApplyingOperators(deaccessibilizer);

const operator = AccessibilityLabelModifierRemover;

describe('AccessibilityLabelModifierRemover', () => {
  it('runs the operator successfully for Raislan sample', async () => {
    await expectIsSameFileAfterApplyingOperators(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Raislan.swift`,
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Raislan_noAccessibilityLabelModifier.swift`,
      [operator],
    );
  });
});
