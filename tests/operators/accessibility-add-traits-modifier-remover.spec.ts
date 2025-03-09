import { describe, it } from 'vitest';

import {
  AccessibilityAddTraitsModifierRemover,
  Deaccessibilizer,
} from '../../src/index.js';
import { getExpectIsSameFileAfterApplyingOperators } from '../utils/expect-is-same-file-after-applying-operators.js';
import { SWIFT_FILE_SAMPLES_BASE_PATH } from '../utils/read-file-content.js';

const deaccessibilizer = new Deaccessibilizer();
const expectIsSameFileAfterApplyingOperators =
  getExpectIsSameFileAfterApplyingOperators(deaccessibilizer);

const operator = AccessibilityAddTraitsModifierRemover;

describe('AccessibilityAddTraitsModifierRemover', () => {
  it('runs the operator successfully for Mayre sample', async () => {
    await expectIsSameFileAfterApplyingOperators(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Mayre.swift`,
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Mayre_noAccessibilityAddTraitsModifier.swift`,
      [operator],
    );
  });
});
