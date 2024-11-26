import { describe, expect, it } from 'vitest';
import { Deaccessibilizer } from '../src/deaccessibilizer.js';
import { getExpectIsSameFileAfterApplyingOperators } from './utils/expect-is-same-file-after-applying-operators.js';
import {
  AccessibilityHiddenModifierRemover,
  AccessibilityModifierRemover,
  ImageDecorativeLabelRemover,
} from '../src/index.js';
import {
  readFileContent,
  SWIFT_FILE_SAMPLES_BASE_PATH,
} from './utils/read-file-content.js';

const deaccessibilizer = new Deaccessibilizer();
const expectIsSameFileAfterApplyingOperators =
  getExpectIsSameFileAfterApplyingOperators(deaccessibilizer);

describe('Deaccessibilizer', () => {
  it('builds a Swift file tree', async () => {
    const tree = await deaccessibilizer.createSwiftFileTree('let x = 3');
    expect(tree).toBeDefined();
  });

  it('runs multiple operators', async () => {
    const baseCode = readFileContent(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Enzo.swift`,
    );
    const expectedCode = readFileContent(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Enzo_noImageDecorativeLabelAndAccessibilityHiddenModifier.swift`,
    );

    const tree = await deaccessibilizer.createSwiftFileTree(baseCode);
    const codeMutations = deaccessibilizer.getCodeMutations(tree, [
      AccessibilityHiddenModifierRemover,
      ImageDecorativeLabelRemover,
    ]);
    deaccessibilizer.applyCodeMutationsToTree(tree, codeMutations);

    expect(tree.text).toBe(expectedCode);
  });

  it('runs multiple operators using rebuild', async () => {
    await expectIsSameFileAfterApplyingOperators(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Enzo.swift`,
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Enzo_noImageDecorativeLabelAndAccessibilityHiddenModifier.swift`,
      [AccessibilityHiddenModifierRemover, ImageDecorativeLabelRemover],
    );
  });

  it('generates serializable code mutations', async () => {
    const baseCode = readFileContent(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Hildete.swift`,
    );
    const tree = await deaccessibilizer.createSwiftFileTree(baseCode);
    const codeMutations = deaccessibilizer.getCodeMutations(tree, [
      AccessibilityModifierRemover,
    ]);
    const serializableCodeMutations =
      deaccessibilizer.getSerializableCodeMutations(tree, codeMutations);

    expect(serializableCodeMutations).toHaveLength(1);
  });

  it('generates serializable code mutations from operators', async () => {
    const baseCode = readFileContent(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Hildete.swift`,
    );
    const tree = await deaccessibilizer.createSwiftFileTree(baseCode);
    const serializableCodeMutations =
      deaccessibilizer.getSerializableCodeMutationsFromOperators(tree, [
        AccessibilityModifierRemover,
      ]);

    expect(serializableCodeMutations).toHaveLength(1);
  });

  it('applies serializable code mutation to file text', async () => {
    const baseCode = readFileContent(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Hildete.swift`,
    );
    const tree = await deaccessibilizer.createSwiftFileTree(baseCode);
    const codeMutations = deaccessibilizer.getCodeMutations(tree, [
      AccessibilityModifierRemover,
    ]);
    const serializableCodeMutations =
      deaccessibilizer.getSerializableCodeMutations(tree, codeMutations);
    expect(serializableCodeMutations).toHaveLength(1);
    const mutatedCode = deaccessibilizer.applySerializableCodeMutationToText(
      baseCode,
      serializableCodeMutations[0],
    );

    const expectedCode = readFileContent(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Hildete_noAccessibilityModifier.swift`,
    );
    expect(mutatedCode).toBe(expectedCode);
  });
});
