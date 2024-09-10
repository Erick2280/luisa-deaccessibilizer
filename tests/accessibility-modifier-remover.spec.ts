import { describe, expect, it } from 'vitest';
import { Deaccessibilizer } from '../src/deaccessibilizer.js';
import {
  readFileContent,
  SWIFT_FILE_SAMPLES_BASE_PATH,
} from './utils/get-text-from-file.js';
import { AccessibilityModifierRemover } from '../src/index.js';

const deaccessibilizer = new Deaccessibilizer();
const rule = AccessibilityModifierRemover;

describe('AccessibilityModifierRemover', () => {
  it('runs the rule successfully for Hildete example', async () => {
    const code = readFileContent(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Hildete.swift`,
    );
    const tree = await deaccessibilizer.createSwiftFileTree(code);

    const query = tree.queryNode(tree.swiftUIViews[0], rule.queryText);
    query.reverse().forEach((match) => {
      const transformation = rule.getFaultTransformation(match, {
        substituteWithComment: false,
      });
      transformation.forEach((change) => {
        tree.replaceNode(
          change.node,
          change.replaceWith,
          change.replaceOptions,
        );
      });
    });

    const expectedCode = readFileContent(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Hildete_noAccessibilityModifier.swift`,
    );
    expect(tree.text).toBe(expectedCode);
  });
});
