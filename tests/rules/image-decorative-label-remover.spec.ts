import { describe, it } from 'vitest';
import {
  Deaccessibilizer,
  ImageDecorativeLabelRemover,
} from '../../src/index.js';
import { SWIFT_FILE_SAMPLES_BASE_PATH } from '../utils/get-text-from-file.js';
import { getExpectIsSameFileAfterApplyingRules } from '../utils/expect-is-same-file-after-applying-rules.js';

const deaccessibilizer = new Deaccessibilizer();
const expectIsSameFileAfterApplyingRules =
  getExpectIsSameFileAfterApplyingRules(deaccessibilizer);

const rule = ImageDecorativeLabelRemover;

describe('ImageDecorativeLabelRemover', () => {
  it('runs the rule successfully for Enzo example', async () => {
    await expectIsSameFileAfterApplyingRules(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Enzo.swift`,
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Enzo_noImageDecorativeLabel.swift`,
      [rule],
    );
  });

  it('is no-op for Hildete example', async () => {
    await expectIsSameFileAfterApplyingRules(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Hildete.swift`,
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Hildete.swift`,
      [rule],
    );
  });
});
