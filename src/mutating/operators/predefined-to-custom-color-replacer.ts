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
 * This operator matches a SwiftUI view that uses a standard color modifier, such as `foregroundColor(.primary)`.
 * The operator creates mutations that replace the standard color modifier with a custom white color.
 *
 * Before:
 * ```swift
 * Text("Strawberry")
 *   .foregroundColor(.red)
 * ```
 *
 * After:
 * ```swift
 * Text("Strawberry")
 *   .foregroundColor(Color(white: 1))
 * ```
 *
 * Applicable WCAG Success Criteria:
 * - [1.1.1: Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content)
 *
 * @category Mutation Operators
 */
export const PredefinedToCustomColorReplacer: MutationOperator = (() => {
  const colorCorrespondences: string[] = [
    '.black',
    '.blue',
    '.brown',
    '.clear',
    '.cyan',
    '.gray',
    '.green',
    '.indigo',
    '.mint',
    '.orange',
    '.pink',
    '.purple',
    '.red',
    '.teal',
    '.white',
    '.yellow',
    '.accentColor',
    '.primary',
    '.secondary',
    'Color.black',
    'Color.blue',
    'Color.brown',
    'Color.clear',
    'Color.cyan',
    'Color.gray',
    'Color.green',
    'Color.indigo',
    'Color.mint',
    'Color.orange',
    'Color.pink',
    'Color.purple',
    'Color.red',
    'Color.teal',
    'Color.white',
    'Color.yellow',
    'Color.accentColor',
    'Color.primary',
    'Color.secondary',
  ];
  const replaceColor = 'Color(white: 1)';
  const id = 'PredefinedToCustomColorReplacer';
  const queryText = buildModifierOnAnyViewQuery({
    modifierName: 'foregroundColor',
  });
  const findMutationTargetNodes = buildCallbackResultFromCaptureNameFMTN(
    'modifier-name',
    (node: SyntaxNode) => {
      const argumentsNode = getModifierArgumentsNodeFromModifierNameNode(node);
      const argumentsInsideBrackets = stripParentheses(argumentsNode.text);

      if (colorCorrespondences.includes(argumentsInsideBrackets)) {
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
      getReplacementTextFromNode: () => {
        return `(${replaceColor})`;
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
