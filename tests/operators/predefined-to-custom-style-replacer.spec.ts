import { describe, it } from 'vitest';

import {
  Deaccessibilizer,
  PredefinedToCustomStyleReplacer,
} from '../../src/index.js';
import { getExpectIsSameFileAfterApplyingOperators } from '../utils/expect-is-same-file-after-applying-operators.js';
import { SWIFT_FILE_SAMPLES_BASE_PATH } from '../utils/read-file-content.js';

const deaccessibilizer = new Deaccessibilizer();
const expectIsSameFileAfterApplyingOperators =
  getExpectIsSameFileAfterApplyingOperators(deaccessibilizer);

const operator = PredefinedToCustomStyleReplacer;

describe('PredefinedToCustomStyleReplacer', () => {
  it('runs the operator successfully for Gildete sample', async () => {
    await expectIsSameFileAfterApplyingOperators(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Gildete.swift`,
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Gildete_customStyles.swift`,
      [operator],
    );
  });

  it('runs the operator successfully for Gildete sample when substitute with comment is enabled', async () => {
    await expectIsSameFileAfterApplyingOperators(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Gildete.swift`,
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Gildete_customStylesWithComments.swift`,
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
