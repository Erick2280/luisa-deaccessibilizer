import { describe, it } from 'vitest';
import {
  Deaccessibilizer,
  AccessibilityLabelModifierRemover,
} from '../../src/index.js';
import { SWIFT_FILE_SAMPLES_BASE_PATH } from '../utils/read-file-content.js';
import { getExpectIsSameFileAfterApplyingRules } from '../utils/expect-is-same-file-after-applying-rules.js';

const deaccessibilizer = new Deaccessibilizer();
const expectIsSameFileAfterApplyingRules =
  getExpectIsSameFileAfterApplyingRules(deaccessibilizer);

const rule = AccessibilityLabelModifierRemover;

describe('AccessibilityLabelModifierRemover', () => {
  it('runs the rule successfully for Raislan example', async () => {
    await expectIsSameFileAfterApplyingRules(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Raislan.swift`,
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Raislan_noAccessibilityLabelModifier.swift`,
      [rule],
    );
  });
});
