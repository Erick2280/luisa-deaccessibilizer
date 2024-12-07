import { SyntaxNode } from 'web-tree-sitter';

import { ReplaceNodeOptions } from '../parsing/swift-file-tree.js';
import { OperatorId } from './operators-dictionary.js';

/**
 * Represents a change to a node in the code.
 *
 * @category Mutating
 */
export interface NodeChange {
  /**
   * The node to replace.
   */
  node: SyntaxNode;

  /**
   * The text to replace the node with.
   */
  replaceWith: string;

  /**
   * Options for the replacement.
   */
  replaceOptions?: ReplaceNodeOptions;
}

/**
 * Represents a mutation to the code. This should be in the order that the changes should be applied (commonly, in reverse order).
 *
 * @category Mutating
 */
export type CodeMutation = {
  operatorId: OperatorId | string;
  nodeChanges: NodeChange[];
};
