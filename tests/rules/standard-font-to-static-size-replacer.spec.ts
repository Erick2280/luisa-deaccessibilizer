import { describe, it } from 'vitest';
import {
  Deaccessibilizer,
  StandardFontToStaticSizeReplacer,
} from '../../src/index.js';
import { SWIFT_FILE_SAMPLES_BASE_PATH } from '../utils/read-file-content.js';
import { getExpectIsSameFileAfterApplyingRules } from '../utils/expect-is-same-file-after-applying-rules.js';

const deaccessibilizer = new Deaccessibilizer();
const expectIsSameFileAfterApplyingRules =
  getExpectIsSameFileAfterApplyingRules(deaccessibilizer);

const rule = StandardFontToStaticSizeReplacer;

describe('StandardFontToStaticSizeReplacer', () => {
  it('runs the rule successfully for Elane sample', async () => {
    await expectIsSameFileAfterApplyingRules(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Elane.swift`,
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Elane_staticFontSizes.swift`,
      [rule],
    );
  });

  it('runs the rule successfully for Elane sample when substitute with comment is enabled', async () => {
    await expectIsSameFileAfterApplyingRules(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Elane.swift`,
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Elane_staticFontSizesWithComments.swift`,
      [rule],
      { substituteWithComment: 'Modified code' },
    );
  });

  it('is no-op for Hildete sample', async () => {
    await expectIsSameFileAfterApplyingRules(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Hildete.swift`,
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Hildete.swift`,
      [rule],
    );
  });
});
