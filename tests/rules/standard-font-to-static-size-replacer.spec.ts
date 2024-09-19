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
  it('runs the rule successfully for Elane example', async () => {
    await expectIsSameFileAfterApplyingRules(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Elane.swift`,
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Elane_staticFontSizes.swift`,
      [rule],
    );
  });
});
