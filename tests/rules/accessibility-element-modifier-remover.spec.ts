import { describe, it } from 'vitest';
import {
  Deaccessibilizer,
  AccessibilityElementModifierRemover,
} from '../../src/index.js';
import { SWIFT_FILE_SAMPLES_BASE_PATH } from '../utils/read-file-content.js';
import { getExpectIsSameFileAfterApplyingRules } from '../utils/expect-is-same-file-after-applying-rules.js';

const deaccessibilizer = new Deaccessibilizer();
const expectIsSameFileAfterApplyingRules =
  getExpectIsSameFileAfterApplyingRules(deaccessibilizer);

const rule = AccessibilityElementModifierRemover;

describe('AccessibilityElementModifierRemover', () => {
  it('runs the rule successfully for Enzo example', async () => {
    await expectIsSameFileAfterApplyingRules(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Elane.swift`,
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Elane_noAccessibilityElementModifier.swift`,
      [rule],
    );
  });

  it('runs the rule successfully for Enzo example when `substitute with comment` is enabled', async () => {
    await expectIsSameFileAfterApplyingRules(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Elane.swift`,
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Elane_noAccessibilityElementModifierWithComments.swift`,
      [rule],
      { substituteWithComment: 'Code removed here' },
    );
  });
});
