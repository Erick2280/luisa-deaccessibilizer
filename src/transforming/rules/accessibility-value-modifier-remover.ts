import { FaultTransformationRule } from '../fault-transformation-rule.js';
import { buildModifierOnAnyViewQuery } from '../builders/query-builders.js';
import { buildModifierOnAnyViewGTN } from '../builders/get-transformable-nodes-builders.js';
import { buildRemoveModifierGFT } from '../builders/get-fault-transformation-builders.js';

/**
 * This rule matches to a SwiftUI view with a `.accessibilityValue` modifier, which
 * is used for providing a textual description of the value represented by the view
 * for screen reader users. The transformation removes the modifier.
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
 * @category Fault Transformation Rules
 */
export const AccessibilityValueModifierRemover: FaultTransformationRule =
  (() => {
    const id = 'AccessibilityValueModifierRemover';
    const queryText = buildModifierOnAnyViewQuery({
      modifierName: 'accessibilityValue',
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
