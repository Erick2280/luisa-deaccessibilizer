import { describe, it } from 'vitest';
import {
  Deaccessibilizer,
  AccessibilityHintModifierRemover,
} from '../../src/index.js';
import { SWIFT_FILE_SAMPLES_BASE_PATH } from '../utils/read-file-content.js';
import { getExpectIsSameFileAfterApplyingOperators } from '../utils/expect-is-same-file-after-applying-operators.js';

const deaccessibilizer = new Deaccessibilizer();
const expectIsSameFileAfterApplyingOperators =
  getExpectIsSameFileAfterApplyingOperators(deaccessibilizer);

const operator = AccessibilityHintModifierRemover;

describe('AccessibilityHintModifierRemover', () => {
  it('runs the operator successfully for Romilda sample', async () => {
    await expectIsSameFileAfterApplyingOperators(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Romilda.swift`,
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Romilda_noAccessibilityHintModifier.swift`,
      [operator],
    );
  });

  it('runs the operator successfully for Romilda sample when substitute with comment is enabled', async () => {
    await expectIsSameFileAfterApplyingOperators(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Romilda.swift`,
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Romilda_noAccessibilityHintModifierWithComments.swift`,
      [operator],
      { substituteWithComment: 'Code removed here' },
    );
  });
});
