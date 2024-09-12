import { describe, it } from 'vitest';
import {
  Deaccessibilizer,
  AccessibilityHiddenModifierRemover,
} from '../../src/index.js';
import { SWIFT_FILE_SAMPLES_BASE_PATH } from '../utils/read-file-content.js';
import { getExpectIsSameFileAfterApplyingRules } from '../utils/expect-is-same-file-after-applying-rules.js';

const deaccessibilizer = new Deaccessibilizer();
const expectIsSameFileAfterApplyingRules =
  getExpectIsSameFileAfterApplyingRules(deaccessibilizer);

const rule = AccessibilityHiddenModifierRemover;

describe('AccessibilityHiddenModifierRemover', () => {
  it('runs the rule successfully for Enzo example', async () => {
    await expectIsSameFileAfterApplyingRules(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Enzo.swift`,
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Enzo_noAccessibilityHiddenModifier.swift`,
      [rule],
    );
  });
});
