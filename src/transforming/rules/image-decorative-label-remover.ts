import { FaultTransformationRule } from '../fault-transformation-rule.js';
import { buildViewWithArgumentLabelQuery } from '../builders/query-builders.js';
import { buildFromCaptureNameGTN } from '../builders/get-transformable-nodes-builders.js';
import { buildRemoveArgumentLabelGFT } from '../builders/get-fault-transformation-builders.js';

/**
 * This rule matches to a SwiftUI Image element with a `decorative: ` label, which
 * is used to indicate that the image is purely decorative and should be ignored by screen readers.
 * The transformation removes the label.
 *
 * Before:
 * ```swift
 * Image(decorative: "icon")
 * ```
 *
 * After:
 * ```swift
 * Image("icon")
 * ```
 *
 * Applicable WCAG Success Criteria:
 * - [1.1.1: Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content)
 *
 * @category Fault Transformation Rules
 */
export const ImageDecorativeLabelRemover: FaultTransformationRule = (() => {
  const id = 'ImageDecorativeLabelRemover';
  const queryText = buildViewWithArgumentLabelQuery({
    viewName: 'Image',
    argumentLabel: 'decorative',
  });
  const getTransformableNodes = buildFromCaptureNameGTN('argument');
  const getFaultTransformation = buildRemoveArgumentLabelGFT(
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
