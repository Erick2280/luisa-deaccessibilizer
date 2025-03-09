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
 * This operator matches a SwiftUI view that uses a standard style modifier, such as `foregroundStyle(.primary)`.
 * The operator creates mutations that replace the standard style modifier with a custom white color.
 *
 * Before:
 * ```swift
 * Text("Strawberry")
 *   .foregroundStyle(.red)
 * ```
 *
 * After:
 * ```swift
 * Text("Strawberry")
 *   .foregroundStyle(Color(white: 1))
 * ```
 *
 * Applicable WCAG Success Criteria:
 * - [1.4.3: Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum)
 * - [1.4.6: Contrast (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced)
 *
 * @category Mutation Operators
 */
export const PredefinedToCustomStyleReplacer: MutationOperator = (() => {
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
  const id = 'PredefinedToCustomStyleReplacer';
  const queryText = buildModifierOnAnyViewQuery({
    modifierName: 'foregroundStyle',
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
