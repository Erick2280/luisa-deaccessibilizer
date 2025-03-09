import { describe, it } from 'vitest';

import {
  Deaccessibilizer,
  PredefinedToCustomColorReplacer,
} from '../../src/index.js';
import { getExpectIsSameFileAfterApplyingOperators } from '../utils/expect-is-same-file-after-applying-operators.js';
import { SWIFT_FILE_SAMPLES_BASE_PATH } from '../utils/read-file-content.js';

const deaccessibilizer = new Deaccessibilizer();
const expectIsSameFileAfterApplyingOperators =
  getExpectIsSameFileAfterApplyingOperators(deaccessibilizer);

const operator = PredefinedToCustomColorReplacer;

describe('PredefinedToCustomColorReplacer', () => {
  it('runs the operator successfully for Ivanice sample', async () => {
    await expectIsSameFileAfterApplyingOperators(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Ivanice.swift`,
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Ivanice_customColors.swift`,
      [operator],
    );
  });

  it('runs the operator successfully for Ivanice sample when substitute with comment is enabled', async () => {
    await expectIsSameFileAfterApplyingOperators(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Ivanice.swift`,
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Ivanice_customColorsWithComments.swift`,
      [operator],
      { substituteWithComment: 'Modified code' },
    );
  });

  it('is no-op for Hildete sample', async () => {
    await expectIsSameFileAfterApplyingOperators(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Hildete.swift`,
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Hildete.swift`,
      [operator],
    );
  });
});
