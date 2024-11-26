import { buildModifierOnAnyViewFMTN } from '../builders/find-mutation-target-nodes-builders.js';
import { buildRemoveModifierGCM } from '../builders/get-code-mutation-builders.js';
import { buildModifierOnAnyViewQuery } from '../builders/query-builders.js';
import { MutationOperator } from '../mutation-operator.js';

/**
 * This operator matches a SwiftUI view with an `.accessibilityValue` modifier, which
 * is used to provide a textual description of the value represented by the view
 * for screen reader users. The operator creates mutations that remove the modifier.
 *
 * Before:
 * ```swift
 * Toggle(...)
 *  .accessibilityValue(isChecked ? "Checked" : "Unchecked")
 * ```
 *
 * After:
 * ```swift
 * Toggle(...)
 * ```
 *
 * Applicable WCAG Success Criteria:
 * - [4.1.2: Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html)
 *
 * @category Mutation Operators
 */
export const AccessibilityValueModifierRemover: MutationOperator = (() => {
  const id = 'AccessibilityValueModifierRemover';
  const queryText = buildModifierOnAnyViewQuery({
    modifierName: 'accessibilityValue',
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
