import { describe, it } from 'vitest';

import {
  AccessibilityModifierRemover,
  Deaccessibilizer,
} from '../../src/index.js';
import { getExpectIsSameFileAfterApplyingOperators } from '../utils/expect-is-same-file-after-applying-operators.js';
import { SWIFT_FILE_SAMPLES_BASE_PATH } from '../utils/read-file-content.js';

const deaccessibilizer = new Deaccessibilizer();
const expectIsSameFileAfterApplyingOperators =
  getExpectIsSameFileAfterApplyingOperators(deaccessibilizer);

const operator = AccessibilityModifierRemover;

describe('AccessibilityModifierRemover', () => {
  it('runs the operator successfully for Hildete sample', async () => {
    await expectIsSameFileAfterApplyingOperators(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Hildete.swift`,
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Hildete_noAccessibilityModifier.swift`,
      [operator],
    );
  });
});
