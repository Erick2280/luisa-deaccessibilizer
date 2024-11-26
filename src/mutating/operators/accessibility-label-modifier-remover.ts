import { buildModifierOnAnyViewFMTN } from '../builders/find-mutation-target-nodes-builders.js';
import { buildRemoveModifierGCM } from '../builders/get-code-mutation-builders.js';
import { buildModifierOnAnyViewQuery } from '../builders/query-builders.js';
import { MutationOperator } from '../mutation-operator.js';

/**
 * This operator matches a SwiftUI view with an `.accessibilityLabel` modifier, which is
 * used to provide a text alternative for screen reader users. The operator creates mutations
 * that remove the label.
 *
 * Before:
 * ```swift
 * Image(...)
 *  .accessibilityLabel("Pineapple")
 * ```
 *
 * After:
 * ```swift
 * Image(...)
 * ```
 *
 * Applicable WCAG Success Criteria:
 * - [1.1.1: Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content)
 *
 * @category Mutation Operators
 */
export const AccessibilityLabelModifierRemover: MutationOperator = (() => {
  const id = 'AccessibilityLabelModifierRemover';
  const queryText = buildModifierOnAnyViewQuery({
    modifierName: 'accessibilityLabel',
  });
  const findMutationTargetNodes = buildModifierOnAnyViewFMTN();
  const getCodeMutation = buildRemoveModifierGCM(findMutationTargetNodes, id);

  return {
    id,
    queryText,
    findMutationTargetNodes: findMutationTargetNodes,
    getCodeMutation: getCodeMutation,
  };
})();
