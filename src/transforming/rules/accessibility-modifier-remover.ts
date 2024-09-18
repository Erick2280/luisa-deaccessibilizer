import { FaultTransformationRule } from '../fault-transformation-rule.js';
import { buildModifierOnAnyViewQuery } from '../builders/query-builders.js';
import { buildModifierOnAnyViewGTN } from '../builders/get-transformable-nodes-builders.js';
import { buildRemoveModifierGFT } from '../builders/get-fault-transformation-builders.js';

/**
 * This rule matches to a SwiftUI view element with a `.accessibility` modifier, which
 * is used to provide a text alternative for screen reader users to a view that doesn't
 * display text. The transformation removes the label.
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
 * @category Fault Transformation Rules
 */
export const AccessibilityModifierRemover: FaultTransformationRule = (() => {
  const id = 'AccessibilityModifierRemover';
  const queryText = buildModifierOnAnyViewQuery({
    modifierName: 'accessibility',
  });
  const getTransformableNodes = buildModifierOnAnyViewGTN();
  const getFaultTransformation = buildRemoveModifierGFT(
    getTransformableNodes,
    id,
  );

  return {
    id,
    queryText,
    getTransformableNodes,
    getFaultTransformation,
  };
})();
