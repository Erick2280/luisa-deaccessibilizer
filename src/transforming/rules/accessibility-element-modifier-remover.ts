import { FaultTransformationRule } from '../fault-transformation-rule.js';
import { buildModifierOnAnyViewQuery } from '../builders/query-builders.js';
import { buildModifierOnAnyViewGTN } from '../builders/get-transformable-nodes-builders.js';
import { buildRemoveModifierGFT } from '../builders/get-fault-transformation-builders.js';

/**
 * This rule matches to a SwiftUI view with the `.accessibilityElement(...)` modifier,
 * which is used to define behavior for child elements of the view (for example, to combine
 * the child views into a single element focused by VoiceOver). The transformation
 * removes the modifier.
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
 * @category Fault Transformation Rules
 */
export const AccessibilityElementModifierRemover: FaultTransformationRule =
  (() => {
    const id = 'AccessibilityElementModifierRemover';
    const queryText = buildModifierOnAnyViewQuery({
      modifierName: 'accessibilityElement',
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
