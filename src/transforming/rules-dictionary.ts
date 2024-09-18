import { AccessibilityHiddenModifierRemover } from './rules/accessibility-hidden-modifier-remover.js';
import { AccessibilityLabelModifierRemover } from './rules/accessibility-label-modifier-remover.js';
import { AccessibilityModifierRemover } from './rules/accessibility-modifier-remover.js';
import { ImageDecorativeLabelRemover } from './rules/image-decorative-label-remover.js';

/**
 * A dictionary of all the fault transformation rules.
 *
 * @category Transforming
 */
export const RulesDictionary = {
  AccessibilityHiddenModifierRemover,
  AccessibilityLabelModifierRemover,
  AccessibilityModifierRemover,
  ImageDecorativeLabelRemover,
};

/**
 * The ID of a fault transformation rule.
 *
 * @category Transforming
 */
export type RuleId = keyof typeof RulesDictionary;

export {
  AccessibilityHiddenModifierRemover,
  AccessibilityLabelModifierRemover,
  AccessibilityModifierRemover,
  ImageDecorativeLabelRemover,
};
