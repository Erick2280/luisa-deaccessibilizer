import { FaultTransformationRule } from '../fault-transformation-rule.js';
import { buildModifierOnAnyViewQuery } from '../builders/query-builders.js';
import { buildModifierOnAnyViewGTN } from '../builders/get-transformable-nodes-builders.js';
import { buildRemoveModifierGFT } from '../builders/get-fault-transformation-builders.js';

/**
 * This rule matches to a SwiftUI view with a `.accessibilityLabel` modifier, which is
 * used to provide a text alternative to screen reader users. The transformation
 * removes the label.
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
 * @category Fault Transformation Rules
 */
export const AccessibilityLabelModifierRemover: FaultTransformationRule =
  (() => {
    const id = 'AccessibilityLabelModifierRemover';
    const queryText = buildModifierOnAnyViewQuery({
      modifierName: 'accessibilityLabel',
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
