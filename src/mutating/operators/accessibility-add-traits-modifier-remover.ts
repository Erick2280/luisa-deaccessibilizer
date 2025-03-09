import { buildModifierOnAnyViewFMTN } from '../builders/find-mutation-target-nodes-builders.js';
import { buildRemoveModifierGCM } from '../builders/get-code-mutation-builders.js';
import { buildModifierOnAnyViewQuery } from '../builders/query-builders.js';
import { MutationOperator } from '../mutation-operator.js';

/**
 * This operator matches a SwiftUI view with an `.accessibilityAddTraits` modifier, which
 * is used to provide information about how the element should be treated by the system and
 * assistive technologies. The operator creates mutations that remove the modifier.
 *
 * Before:
 * ```swift
 * Text("Good Example")
 *   .accessibilityAddTraits(.isButton)
 * ```
 *
 * After:
 * ```swift
 * Text("Good Example")
 * ```
 *
 * Applicable WCAG Success Criteria:
 * - [1.3.1: Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships)
 *
 * @category Mutation Operators
 */
export const AccessibilityAddTraitsModifierRemover: MutationOperator = (() => {
  const id = 'AccessibilityAddTraitsModifierRemover';
  const queryText = buildModifierOnAnyViewQuery({
    modifierName: 'accessibilityAddTraits',
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
