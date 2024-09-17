import { QueryMatch, SyntaxNode } from 'web-tree-sitter';
import { CodeTransformation } from '../code-transformation.js';
import {
  FaultTransformationOptions,
  FaultTransformationRule,
} from '../fault-transformation-rule.js';

/**
 * This rule matches to a SwiftUI view element with a `.accessibility` modifier, which
 * is used to provide a text alternative for screen reader users to a view that doesn't
 * display text. The transformation removes the label.
 *
 * Before:
 * ```swift
 * Button(...) {...}
 *  .accessibility(label: Text("Close"))
 * ```
 *
 * After:
 * ```swift
 * Button(...) {...}
 * ```
 *
 * Applicable WCAG Success Criteria:
 * - [1.1.1: Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content)
 *
 * @category Fault Transformation Rules
 */
export const AccessibilityModifierRemover: FaultTransformationRule = {
  id: 'AccessibilityModifierRemover',

  queryText: `
    (call_expression
        (navigation_expression
            (navigation_suffix) @modifier-name
            (#eq? @modifier-name ".accessibility")
        )
    )
    `,

  getTransformableNodes(match: QueryMatch): SyntaxNode[] {
    const modifierNameNodes = match.captures.map((capture) => capture.node);

    const modifierArgNodes = match.captures.map(
      (capture) =>
        capture.node.parent!.parent!.children.find(
          (node) => node.type === 'call_suffix',
        )!,
    );

    return [...modifierNameNodes, ...modifierArgNodes];
  },

  getFaultTransformation(
    match: QueryMatch,
    options?: FaultTransformationOptions,
  ): CodeTransformation {
    const nodes = this.getTransformableNodes(match);

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
      ruleId: this.id,
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
  },
};
