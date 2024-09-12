import { describe, expect, it } from 'vitest';
import { Deaccessibilizer } from '../src/deaccessibilizer.js';

const deaccessibilizer = new Deaccessibilizer();

describe('Deaccessibilizer', () => {
  it('successfully builds a Swift file tree', async () => {
    const tree = await deaccessibilizer.createSwiftFileTree('let x = 3');
    expect(tree).toBeDefined();
  });
});
