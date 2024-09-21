import { QueryMatch, SyntaxNode } from 'web-tree-sitter';
import { CodeTransformation, NodeChange } from '../code-transformation.js';
import { FaultTransformationOptions } from '../fault-transformation-rule.js';

/**
 * Builds a {@link FaultTransformationRule.getFaultTransformation} that removes a modifier from a view.
 *
 * @category getFaultTransformation Builders
 */
export function buildRemoveModifierGFT(
  getTransformableNodes: (match: QueryMatch) => SyntaxNode[],
  ruleId: string,
) {
  return (
    match: QueryMatch,
    options?: FaultTransformationOptions,
  ): CodeTransformation | null => {
    const nodes = getTransformableNodes(match);

    if (nodes.length === 0) {
      return null;
    }

    const getReplaceWith = (node: SyntaxNode) => {
      if (node.type === 'navigation_suffix' && options?.substituteWithComment) {
        return `/* ${options.substituteWithComment} */`;
      }

      return '';
    };

    const shouldClearLeadingTrivia = (node: SyntaxNode) => {
      return (
        // We should keep the leading trivia if there's no space between the previous sibling and the node.
        (!node.previousSibling ||
          node.previousSibling.endIndex !== node.startIndex) &&
        // We should keep the leading trivia (i.e. the line and indentation before the node) if we want to substitute the node with a comment.
        node.type === 'navigation_suffix' &&
        !options?.substituteWithComment
      );
    };

    return {
      ruleId,
      nodeChanges: nodes
        .map((node) => ({
          node,
          replaceWith: getReplaceWith(node),
          replaceOptions: {
            clearLeadingTrivia: shouldClearLeadingTrivia(node),
            clearTrailingTrivia: false,
          },
        }))
        .reverse(),
    };
  };
}

/**
 * Builds a {@link FaultTransformationRule.getFaultTransformation} that removes the label
 * from a view argument, keeping only the argument itself.
 *
 * @category getFaultTransformation Builders
 */
export function buildRemoveArgumentLabelGFT(
  getTransformableNodes: (match: QueryMatch) => SyntaxNode[],
  ruleId: string,
) {
  return (
    match: QueryMatch,
    options?: FaultTransformationOptions,
  ): CodeTransformation | null => {
    const [node] = getTransformableNodes(match);

    if (!node) {
      return null;
    }

    const nodeChanges: NodeChange[] = [
      {
        node: node.children[0]!,
        replaceWith: options?.substituteWithComment
          ? `/* ${options.substituteWithComment} */ `
          : '',
        replaceOptions: {
          clearLeadingTrivia: true,
          clearTrailingTrivia: true,
        },
      },
      {
        node: node.children[1]!,
        replaceWith: '',
        replaceOptions: {
          clearLeadingTrivia: true,
          clearTrailingTrivia: true,
        },
      },
    ].reverse();

    return {
      ruleId,
      nodeChanges,
    };
  };
}

/**
 * Builds a {@link FaultTransformationRule.getFaultTransformation} that replaces the content
 * of the node with the result of a callback called with the node as an argument.
 * It expects {@link FaultTransformationRule.getTransformableNodes} to return a single node.
 */
export function buildReplaceNodeContentWithCallbackResultGFT(
  getTransformableNodes: (match: QueryMatch) => SyntaxNode[],
  ruleId: string,
  builderParams: {
    getReplacementTextFromNode: (node: SyntaxNode) => string;
  },
) {
  return (
    match: QueryMatch,
    options?: FaultTransformationOptions,
  ): CodeTransformation | null => {
    const [node] = getTransformableNodes(match);

    if (!node) {
      return null;
    }

    const replaceWith = builderParams.getReplacementTextFromNode(node);

    return {
      ruleId,
      nodeChanges: [node]
        .map((node) => ({
          node,
          replaceWith: options?.substituteWithComment
            ? `${replaceWith} /* ${options.substituteWithComment} */`
            : replaceWith,
          replaceOptions: {
            clearLeadingTrivia: true,
            clearTrailingTrivia: true,
          },
        }))
        .reverse(),
    };
  };
}
