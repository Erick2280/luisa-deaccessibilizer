import { NodeChange } from './transforming/code-transformation.js';

/**
 * Compare two node changes by their position in the code.
 */
export function byNodePosition(a: NodeChange, b: NodeChange) {
  return a.node.endIndex - b.node.endIndex;
}
