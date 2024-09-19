import { FaultTransformationRule } from '../fault-transformation-rule.js';
import { buildModifierOnAnyViewQuery } from '../builders/query-builders.js';
import { buildModifierOnAnyViewGTN } from '../builders/get-transformable-nodes-builders.js';
import { buildRemoveModifierGFT } from '../builders/get-fault-transformation-builders.js';

/**
 * This rule matches to a SwiftUI view with a `.accessibilityHint` modifier, which
 * is used for providing additional information about what happens after performing the view’s
 * action. The transformation removes the modifier.
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
 * @category Fault Transformation Rules
 */
export const AccessibilityHintModifierRemover: FaultTransformationRule =
  (() => {
    const id = 'AccessibilityHintModifierRemover';
    const queryText = buildModifierOnAnyViewQuery({
      modifierName: 'accessibilityHint',
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
