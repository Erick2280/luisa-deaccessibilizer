import { AccessibilityElementModifierRemover } from './rules/accessibility-element-modifier-remover.js';
import { AccessibilityHiddenModifierRemover } from './rules/accessibility-hidden-modifier-remover.js';
import { AccessibilityHintModifierRemover } from './rules/accessibility-hint-modifier-remover.js';
import { AccessibilityLabelModifierRemover } from './rules/accessibility-label-modifier-remover.js';
import { AccessibilityModifierRemover } from './rules/accessibility-modifier-remover.js';
import { AccessibilityValueModifierRemover } from './rules/accessibility-value-modifier-remover.js';
import { ImageDecorativeLabelRemover } from './rules/image-decorative-label-remover.js';
import { StandardFontToStaticSizeReplacer } from './rules/standard-font-to-static-size-replacer.js';

/**
 * A dictionary of all the fault transformation rules.
 *
 * @category Transforming
 */
export const RulesDictionary = {
  AccessibilityElementModifierRemover,
  AccessibilityHiddenModifierRemover,
  AccessibilityHintModifierRemover,
  AccessibilityLabelModifierRemover,
  AccessibilityModifierRemover,
  AccessibilityValueModifierRemover,
  ImageDecorativeLabelRemover,
  StandardFontToStaticSizeReplacer,
};

/**
 * The ID of a fault transformation rule.
 *
 * @category Transforming
 */
export type RuleId = keyof typeof RulesDictionary;

export {
  AccessibilityElementModifierRemover,
  AccessibilityHiddenModifierRemover,
  AccessibilityHintModifierRemover,
  AccessibilityLabelModifierRemover,
  AccessibilityValueModifierRemover,
  AccessibilityModifierRemover,
  ImageDecorativeLabelRemover,
  StandardFontToStaticSizeReplacer,
};
