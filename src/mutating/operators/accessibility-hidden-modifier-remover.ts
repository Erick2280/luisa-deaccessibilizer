import { buildModifierOnAnyViewFMTN } from '../builders/find-mutation-target-nodes-builders.js';
import { buildRemoveModifierGCM } from '../builders/get-code-mutation-builders.js';
import { buildModifierOnAnyViewQuery } from '../builders/query-builders.js';
import { MutationOperator } from '../mutation-operator.js';

/**
 * This operator matches a SwiftUI view with an `.accessibilityHidden` modifier, which is
 * used to hide views with decorative or repetitive content from screen readers.
 * The operator creates mutations that remove the modifier.
 *
 * Before:
 * ```swift
 * SomeView(...)
 *  .accessibilityHidden(true)
 * ```
 *
 * After:
 * ```swift
 * SomeView(...)
 * ```
 *
 * Applicable WCAG Success Criteria:
 * - [1.3.2 Meaningful Sequence](https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence)
 * - [4.1.2: Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value)
 *
 * @category Mutation Operators
 */
export const AccessibilityHiddenModifierRemover: MutationOperator = (() => {
  const id = 'AccessibilityHiddenModifierRemover';
  const queryText = buildModifierOnAnyViewQuery({
    modifierName: 'accessibilityHidden',
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
