import { SyntaxNode } from 'web-tree-sitter';

import { NodeChange } from './mutating/code-mutation.js';

/**
 * Compare two node changes by their position in the code.
 */
export function byNodePosition(a: NodeChange, b: NodeChange): number {
  return a.node.endIndex - b.node.endIndex;
}

/**
 * Given a modifier name node (for example, the part `.modifierName` from
 * `.modifierName(modifierArgs)`), return the remaining arguments node with
 * parentheses (i.e. `(modifierArgs)`).
 */
export function getModifierArgumentsNodeFromModifierNameNode(
  node: SyntaxNode,
): SyntaxNode {
  return node.parent!.parent!.children.find(
    (node) => node?.type === 'call_suffix',
  )!;
}

/**
 * Return the text without the outermost parentheses and any leading or trailing whitespace.
 */
export function stripParentheses(text: string): string {
  if (text.startsWith('(') && text.endsWith(')')) {
    return text.slice(1, -1).trim();
  } else {
    return text.trim();
  }
}
