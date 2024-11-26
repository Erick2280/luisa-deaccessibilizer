import { describe, it } from 'vitest';
import {
  Deaccessibilizer,
  AccessibilityElementModifierRemover,
} from '../../src/index.js';
import { SWIFT_FILE_SAMPLES_BASE_PATH } from '../utils/read-file-content.js';
import { getExpectIsSameFileAfterApplyingOperators } from '../utils/expect-is-same-file-after-applying-operators.js';

const deaccessibilizer = new Deaccessibilizer();
const expectIsSameFileAfterApplyingOperators =
  getExpectIsSameFileAfterApplyingOperators(deaccessibilizer);

const operator = AccessibilityElementModifierRemover;

describe('AccessibilityElementModifierRemover', () => {
  it('runs the operator successfully for Elane sample', async () => {
    await expectIsSameFileAfterApplyingOperators(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Elane.swift`,
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Elane_noAccessibilityElementModifier.swift`,
      [operator],
    );
  });

  it('runs the operator successfully for Elane sample when substitute with comment is enabled', async () => {
    await expectIsSameFileAfterApplyingOperators(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Elane.swift`,
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Elane_noAccessibilityElementModifierWithComments.swift`,
      [operator],
      { substituteWithComment: 'Code removed here' },
    );
  });
});
