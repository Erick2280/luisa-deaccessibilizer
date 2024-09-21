import { describe, it } from 'vitest';
import {
  Deaccessibilizer,
  AccessibilityValueModifierRemover,
} from '../../src/index.js';
import { SWIFT_FILE_SAMPLES_BASE_PATH } from '../utils/read-file-content.js';
import { getExpectIsSameFileAfterApplyingRules } from '../utils/expect-is-same-file-after-applying-rules.js';

const deaccessibilizer = new Deaccessibilizer();
const expectIsSameFileAfterApplyingRules =
  getExpectIsSameFileAfterApplyingRules(deaccessibilizer);

const rule = AccessibilityValueModifierRemover;

describe('AccessibilityValueModifierRemover', () => {
  it('runs the rule successfully for Romilda sample', async () => {
    await expectIsSameFileAfterApplyingRules(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Romilda.swift`,
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Romilda_noAccessibilityValueModifier.swift`,
      [rule],
    );
  });
});
