import { describe, expect, it } from 'vitest';
import { Deaccessibilizer } from '../src/deaccessibilizer.js';
import {
  readFileContent,
  SWIFT_FILE_SAMPLES_BASE_PATH,
} from './utils/get-text-from-file.js';

const deaccessibilizer = new Deaccessibilizer();

describe('SwiftFileTree', () => {
  it('successfully builds a Swift file tree', async () => {
    const tree = await deaccessibilizer.createSwiftFileTree('let x = 3');
    expect(tree).toBeDefined();
  });

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
});
