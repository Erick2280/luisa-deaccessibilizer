import { buildModifierOnAnyViewFMTN } from '../builders/find-mutation-target-nodes-builders.js';
import { buildRemoveModifierGCM } from '../builders/get-code-mutation-builders.js';
import { buildModifierOnAnyViewQuery } from '../builders/query-builders.js';
import { MutationOperator } from '../mutation-operator.js';

/**
 * This operator matches a SwiftUI view with an `.accessibilityHint` modifier, which
 * is used to provide additional information about what happens after performing the view's
 * action. The operator creates mutations that remove the modifier.
 *
 * Before:
 * ```swift
 * Button(...)
 *  .accessibilityHint("Adds item to cart")
 * ```
 *
 * After:
 * ```swift
 * Button(...)
 * ```
 *
 * Applicable WCAG Success Criteria:
 * - [1.3.1: Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships)
 *
 * @category Mutation Operators
 */
export const AccessibilityHintModifierRemover: MutationOperator = (() => {
  const id = 'AccessibilityHintModifierRemover';
  const queryText = buildModifierOnAnyViewQuery({
    modifierName: 'accessibilityHint',
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
