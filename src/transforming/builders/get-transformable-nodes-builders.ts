import { QueryMatch, SyntaxNode } from 'web-tree-sitter';

/**
 * Builds a {@link FaultTransformationRule.getTransformableNodes} function that returns the nodes of the captures with the given capture names.
 *
 * @category getTransformableNodes Builders
 */
export function buildFromCaptureNameGTN(
  captureName: string,
): (match: QueryMatch) => SyntaxNode[] {
  return (match) => {
    return [
      match.captures.find((capture) => capture.name === captureName)!.node,
    ];
  };
}

/**
 * Builds a {@link FaultTransformationRule.getTransformableNodes} function that, given a match
 * from {@link buildModifierOnAnyViewQuery}, returns the nodes of the modifier name and its arguments.
 *
 * @category getTransformableNodes Builders
 */
export function buildModifierOnAnyViewGTN(): (
  match: QueryMatch,
) => SyntaxNode[] {
  return (match) => {
    const modifierNameNodes = match.captures.map((capture) => capture.node);

    const modifierArgNodes = match.captures.map(
      (capture) =>
        capture.node.parent!.parent!.children.find(
          (node) => node.type === 'call_suffix',
        )!,
    );

    return [...modifierNameNodes, ...modifierArgNodes];
  };
}
