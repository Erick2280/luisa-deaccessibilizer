import { MutationOperator } from '../mutation-operator.js';
import { buildViewWithArgumentLabelQuery } from '../builders/query-builders.js';
import { buildFromCaptureNameFMTN } from '../builders/find-mutation-target-nodes-builders.js';
import { buildRemoveArgumentLabelGCM } from '../builders/get-code-mutation-builders.js';

/**
 * This operator matches a SwiftUI Image element with a `decorative:` argument label, which
 * is used to indicate that the image is purely decorative and should be ignored by screen readers.
 * The operator creates mutations that remove the argument label.
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
 * @category Mutation Operators
 */
export const ImageDecorativeLabelRemover: MutationOperator = (() => {
  const id = 'ImageDecorativeLabelRemover';
  const queryText = buildViewWithArgumentLabelQuery({
    viewName: 'Image',
    argumentLabel: 'decorative',
  });
  const findMutationTargetNodes = buildFromCaptureNameFMTN('argument');
  const getCodeMutation = buildRemoveArgumentLabelGCM(
    findMutationTargetNodes,
    id,
  );

  return {
    id,
    queryText,
    findMutationTargetNodes: findMutationTargetNodes,
    getCodeMutation: getCodeMutation,
  };
})();
