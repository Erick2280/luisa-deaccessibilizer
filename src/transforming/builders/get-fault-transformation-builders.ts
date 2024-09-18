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
  ): CodeTransformation => {
    const nodes = getTransformableNodes(match);

    const getReplaceWith = (node: SyntaxNode) => {
      if (node.type === 'navigation_suffix' && options?.substituteWithComment) {
        return `/* ${options.substituteWithComment} */`;
      }

      return '';
    };

    const shouldClearLeadingTrivia = (node: SyntaxNode) => {
      // We should keep the leading trivia (i.e. the line and indentation before the node) if we want to substitute the node with a comment.
      return (
        node.type === 'navigation_suffix' && !options?.substituteWithComment
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
 * Builds a {@link FaultTransformationRule.getFaultTransformation} that removes the label from a view argument, keeping only the argument itself.
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
  ): CodeTransformation => {
    const [node] = getTransformableNodes(match);

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
