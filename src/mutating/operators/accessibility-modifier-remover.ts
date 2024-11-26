import { MutationOperator } from '../mutation-operator.js';
import { buildModifierOnAnyViewQuery } from '../builders/query-builders.js';
import { buildModifierOnAnyViewFMTN } from '../builders/find-mutation-target-nodes-builders.js';
import { buildRemoveModifierGCM } from '../builders/get-code-mutation-builders.js';

/**
 * This operator matches a SwiftUI view with an `.accessibility` modifier, which
 * is used to provide text alternatives and accessibility information for assistive technology users
 * when the view doesn't display text. The operator creates mutations that remove the modifier.
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
 * @category Mutation Operators
 */
export const AccessibilityModifierRemover: MutationOperator = (() => {
  const id = 'AccessibilityModifierRemover';
  const queryText = buildModifierOnAnyViewQuery({
    modifierName: 'accessibility',
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
