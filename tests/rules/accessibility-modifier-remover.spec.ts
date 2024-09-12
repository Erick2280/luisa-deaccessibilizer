import { describe, it } from 'vitest';
import {
  Deaccessibilizer,
  AccessibilityModifierRemover,
} from '../../src/index.js';
import { SWIFT_FILE_SAMPLES_BASE_PATH } from '../utils/read-file-content.js';
import { getExpectIsSameFileAfterApplyingRules } from '../utils/expect-is-same-file-after-applying-rules.js';

const deaccessibilizer = new Deaccessibilizer();
const expectIsSameFileAfterApplyingRules =
  getExpectIsSameFileAfterApplyingRules(deaccessibilizer);

const rule = AccessibilityModifierRemover;

describe('AccessibilityModifierRemover', () => {
  it('runs the rule successfully for Hildete example', async () => {
    await expectIsSameFileAfterApplyingRules(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Hildete.swift`,
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Hildete_noAccessibilityModifier.swift`,
      [rule],
    );
  });
});