import { QueryMatch, SyntaxNode } from 'web-tree-sitter';

import { CodeMutation, NodeChange } from '../code-mutation.js';
import { MutationGenerationOptions } from '../mutation-operator.js';

/**
 * Builds a {@link MutationOperator.getCodeMutation} that removes a modifier from a view.
 *
 * @category getCodeMutation Builders
 */
export function buildRemoveModifierGCM(
  findMutationTargetNodes: (match: QueryMatch) => SyntaxNode[],
  operatorId: string,
) {
  return (
    match: QueryMatch,
    options?: MutationGenerationOptions,
  ): CodeMutation | null => {
    const nodes = findMutationTargetNodes(match);

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
      operatorId,
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
 * Builds a {@link MutationOperator.getCodeMutation} that removes the label
 * from a view argument, keeping only the argument itself.
 *
 * @category getCodeMutation Builders
 */
export function buildRemoveArgumentLabelGCM(
  findMutationTargetNodes: (match: QueryMatch) => SyntaxNode[],
  operatorId: string,
) {
  return (
    match: QueryMatch,
    options?: MutationGenerationOptions,
  ): CodeMutation | null => {
    const [node] = findMutationTargetNodes(match);

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
      operatorId,
      nodeChanges,
    };
  };
}

/**
 * Builds a {@link MutationOperator.getCodeMutation} that replaces the content
 * of the node with the result of a callback called with the node as an argument.
 * It expects {@link MutationOperator.findMutationTargetNodes} to return a single node.
 *
 * @category getCodeMutation Builders
 */
export function buildReplaceNodeContentWithCallbackResultGCM(
  findMutationTargetNodes: (match: QueryMatch) => SyntaxNode[],
  operatorId: string,
  builderParams: {
    getReplacementTextFromNode: (node: SyntaxNode) => string;
  },
) {
  return (
    match: QueryMatch,
    options?: MutationGenerationOptions,
  ): CodeMutation | null => {
    const [node] = findMutationTargetNodes(match);

    if (!node) {
      return null;
    }

    const replaceWith = builderParams.getReplacementTextFromNode(node);

    return {
      operatorId,
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
