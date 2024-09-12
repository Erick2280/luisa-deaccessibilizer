import { QueryMatch, SyntaxNode } from 'web-tree-sitter';
import { CodeTransformation, NodeChange } from '../code-transformation.js';
import {
  FaultTransformationOptions,
  FaultTransformationRule,
} from '../fault-transformation-rule.js';

/**
 * This rule matches to a SwiftUI Image element with a `decorative: ` label, which
 * is used to indicate that the image is purely decorative and should be ignored by screen readers.
 * The transformation removes the label.
 *
 * Before:
 * ```swift
 * Image(decorative: "icon")
 * ```
 *
 * After:
 * ```swift
 * Image("icon")
 * ```
 *
 * Applicable WCAG Success Criteria:
 * - [1.1.1: Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content)
 *
 * @category Fault Transformation Rules
 */
export const ImageDecorativeLabelRemover: FaultTransformationRule = {
  id: 'ImageDecorativeLabelRemover',

  queryText: `
    (call_expression
      (simple_identifier) @component-name
      (#eq? @component-name "Image")
      (call_suffix
        (value_arguments
          (value_argument
            (value_argument_label
              (simple_identifier) @argument-label
              (#eq? @argument-label "decorative")
            )
          ) @decorative-argument
        )
      )
    )
    `,

  getTransformableNodes(match: QueryMatch): SyntaxNode[] {
    const decorativeArgumentNode = match.captures.find(
      (capture) => capture.name === 'decorative-argument',
    )!.node;
    return [decorativeArgumentNode];
  },

  getFaultTransformation(
    match: QueryMatch,
    options?: FaultTransformationOptions,
  ): CodeTransformation {
    const [node] = this.getTransformableNodes(match);

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
      ruleId: this.id,
      nodeChanges,
    };
  },
};
