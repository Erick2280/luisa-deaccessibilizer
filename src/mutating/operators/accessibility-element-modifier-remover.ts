import { buildModifierOnAnyViewFMTN } from '../builders/find-mutation-target-nodes-builders.js';
import { buildRemoveModifierGCM } from '../builders/get-code-mutation-builders.js';
import { buildModifierOnAnyViewQuery } from '../builders/query-builders.js';
import { MutationOperator } from '../mutation-operator.js';

/**
 * This operator matches a SwiftUI view with an `.accessibilityElement(...)` modifier,
 * which is used to define behavior for child elements of the view (for example, to combine
 * child views into a single element focused by VoiceOver). The operator creates mutations
 * that remove the modifier.
 *
 * Before:
 * ```swift
 * VStack(...) {
 * ...
 * }
 * .accessibilityElement(children: .combine)
 * ```
 *
 * After:
 * ```swift
 * VStack(...) {
 * ...
 * }
 * ```
 *
 * Applicable WCAG Success Criteria:
 * - [1.3.2 Meaningful Sequence](https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence)
 * - [4.1.2: Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value)
 *
 * @category Mutation Operators
 */
export const AccessibilityElementModifierRemover: MutationOperator = (() => {
  const id = 'AccessibilityElementModifierRemover';
  const queryText = buildModifierOnAnyViewQuery({
    modifierName: 'accessibilityElement',
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
