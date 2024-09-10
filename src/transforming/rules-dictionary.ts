import { FaultTransformationRule } from './fault-transformation-rule.js';
import { AccessibilityModifierRemover } from './rules/accessibility-modifier-remover.js';
import { ImageDecorativeLabelRemover } from './rules/image-decorative-label-remover.js';

/**
 * A dictionary of all the fault transformation rules.
 *
 * @category Transforming
 */
export const RulesDictionary: Record<string, FaultTransformationRule> = {
  AccessibilityModifierRemover,
  ImageDecorativeLabelRemover,
};

export { AccessibilityModifierRemover, ImageDecorativeLabelRemover };
