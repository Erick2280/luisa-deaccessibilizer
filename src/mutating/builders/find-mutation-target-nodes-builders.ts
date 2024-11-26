import { QueryMatch, SyntaxNode } from 'web-tree-sitter';

import { getModifierArgumentsNodeFromModifierNameNode } from '../../utils.js';

/**
 * Builds a {@link MutationOperator.findMutationTargetNodes} function that returns the node
 * of the capture with the given capture name.
 *
 * @category findMutationTargetNodes Builders
 */
export function buildFromCaptureNameFMTN(
  captureName: string,
): (match: QueryMatch) => SyntaxNode[] {
  return (match) => {
    return [
      match.captures.find((capture) => capture.name === captureName)!.node,
    ];
  };
}

/**
 * Builds a {@link MutationOperator.findMutationTargetNodes} function that, given a match
 * that captures the modifier name as `@modifier-name`, returns the nodes of the modifier
 * name and its arguments.
 *
 * @category findMutationTargetNodes Builders
 */
export function buildModifierOnAnyViewFMTN(): (
  match: QueryMatch,
) => SyntaxNode[] {
  return (match) => {
    const queryCaptures = match.captures.filter(
      (capture) => capture.name === 'modifier-name',
    );

    const modifierNameNodes = queryCaptures.map((capture) => capture.node);

    const modifierArgNodes = queryCaptures.map((capture) =>
      getModifierArgumentsNodeFromModifierNameNode(capture.node),
    );

    return [...modifierNameNodes, ...modifierArgNodes];
  };
}

/**
 * Builds a {@link MutationOperator.findMutationTargetNodes} function that, given a capture name
 * and a callback that accepts a node, returns the result of the callback for the captured node.
 *
 * @category findMutationTargetNodes Builders
 */
export function buildCallbackResultFromCaptureNameFMTN(
  captureName: string,
  callback: (node: SyntaxNode) => SyntaxNode | null,
) {
  return (match: QueryMatch) => {
    const capture = match.captures.find(
      (capture) => capture.name === captureName,
    );
    const node = callback(capture!.node);

    if (node == null) {
      return [];
    }

    return [node];
  };
}
