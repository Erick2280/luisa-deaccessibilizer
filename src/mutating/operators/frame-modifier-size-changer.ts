import { SyntaxNode } from 'web-tree-sitter';

import {
  getModifierArgumentsNodeFromModifierNameNode,
  stripParentheses,
} from '../../utils.js';
import { buildCallbackResultFromCaptureNameFMTN } from '../builders/find-mutation-target-nodes-builders.js';
import { buildReplaceNodeContentWithCallbackResultGCM } from '../builders/get-code-mutation-builders.js';
import { buildModifierOnAnyViewQuery } from '../builders/query-builders.js';
import { MutationOperator } from '../mutation-operator.js';

/**
 * This operator matches a SwiftUI view with a `.frame` modifier, which is used to
 * specify the view's dimensions and position within its parent. If the frame modifier
 * specifies height and width values, the operator creates mutations that change the
 * height and width values to 8.
 *
 * Before:
 * ```swift
 * Button(...)
 *   .frame(width: 100, height: 100)
 * ```
 *
 * After:
 * ```swift
 * Button(...)
 *   .frame(width: 8, height: 8)
 * ```
 *
 * Applicable WCAG Success Criteria:
 * - [2.5.8: Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)
 * - [2.5.5: Target Size (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced)
 *
 * @category Mutation Operators
 */
export const FrameModifierSizeChanger: MutationOperator = (() => {
  const targetSize = '8';
  const id = 'FrameModifierSizeChanger';
  const hasWidthAndHeight = (argumentsInsideBrackets: string) => {
    const hasWidth = /\bwidth\s*:/i.test(argumentsInsideBrackets);
    const hasHeight = /\bheight\s*:/i.test(argumentsInsideBrackets);

    return hasWidth && hasHeight;
  };
  const queryText = buildModifierOnAnyViewQuery({
    modifierName: 'frame',
  });
  const findMutationTargetNodes = buildCallbackResultFromCaptureNameFMTN(
    'modifier-name',
    (node: SyntaxNode) => {
      const argumentsNode = getModifierArgumentsNodeFromModifierNameNode(node);
      const argumentsInsideBrackets = stripParentheses(argumentsNode.text);

      if (hasWidthAndHeight(argumentsInsideBrackets)) {
        return argumentsNode;
      } else {
        return null;
      }
    },
  );
  const getCodeMutation = buildReplaceNodeContentWithCallbackResultGCM(
    findMutationTargetNodes,
    id,
    {
      getReplacementTextFromNode: (node: SyntaxNode) => {
        let argumentsInsideBrackets = stripParentheses(node.text);
        argumentsInsideBrackets = argumentsInsideBrackets.replace(
          /(\bwidth\s*:)\s*[\d.]+/gi,
          `$1 ${targetSize}`,
        );
        argumentsInsideBrackets = argumentsInsideBrackets.replace(
          /(\bheight\s*:)\s*[\d.]+/gi,
          `$1 ${targetSize}`,
        );

        return `(${argumentsInsideBrackets})`;
      },
    },
  );

  return {
    id,
    queryText,
    findMutationTargetNodes: findMutationTargetNodes,
    getCodeMutation: getCodeMutation,
  };
})();
