import { FaultTransformationRule } from '../fault-transformation-rule.js';
import { buildModifierOnAnyViewQuery } from '../builders/query-builders.js';
import { buildModifierOnAnyViewGTN } from '../builders/get-transformable-nodes-builders.js';
import { buildRemoveModifierGFT } from '../builders/get-fault-transformation-builders.js';

/**
 * This rule matches to a SwiftUI view element with a `.accessibilityHidden` modifier, which
 * is used to hide views with decorative or repetitive content from screen readers. The transformation
 * removes the modifier.
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
 * @category Fault Transformation Rules
 */
export const AccessibilityHiddenModifierRemover: FaultTransformationRule =
  (() => {
    const id = 'AccessibilityHiddenModifierRemover';
    const queryText = buildModifierOnAnyViewQuery({
      modifierName: 'accessibilityHidden',
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
