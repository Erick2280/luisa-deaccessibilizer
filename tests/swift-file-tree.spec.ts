import { describe, expect, it } from 'vitest';

import { Deaccessibilizer } from '../src/index.js';
import {
  SWIFT_FILE_SAMPLES_BASE_PATH,
  readFileContent,
} from './utils/read-file-content.js';

const deaccessibilizer = new Deaccessibilizer();

describe('SwiftFileTree', () => {
  it('finds SwiftUI components when they exist', async () => {
    const code = readFileContent(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Hildete.swift`,
    );
    const tree = await deaccessibilizer.createSwiftFileTree(code);
    expect(tree.swiftUIViews).toHaveLength(2);
  });

  it("doesn't find SwiftUI components when they doesn't exist", async () => {
    const code = readFileContent(
      `${SWIFT_FILE_SAMPLES_BASE_PATH}/Helena.swift`,
    );
    const tree = await deaccessibilizer.createSwiftFileTree(code);
    expect(tree.swiftUIViews).toHaveLength(0);
  });

  it('replaces text', async () => {
    const tree = await deaccessibilizer.createSwiftFileTree('let x = 3');

    tree.replaceText({ row: 0, column: 4 }, { row: 0, column: 5 }, 4, 5, 'y');

    expect(tree.text).toBe('let y = 3');
  });

  it('replaces node with text', async () => {
    const tree = await deaccessibilizer.createSwiftFileTree('let x = 3');

    const integerLiteral = tree.tree.rootNode.children[0].children[3];
    tree.replaceNode(integerLiteral, '500');

    expect(tree.text).toBe('let x = 500');
  });
});
