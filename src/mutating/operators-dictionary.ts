import { AccessibilityElementModifierRemover } from './operators/accessibility-element-modifier-remover.js';
import { AccessibilityHiddenModifierRemover } from './operators/accessibility-hidden-modifier-remover.js';
import { AccessibilityHintModifierRemover } from './operators/accessibility-hint-modifier-remover.js';
import { AccessibilityLabelModifierRemover } from './operators/accessibility-label-modifier-remover.js';
import { AccessibilityModifierRemover } from './operators/accessibility-modifier-remover.js';
import { AccessibilityValueModifierRemover } from './operators/accessibility-value-modifier-remover.js';
import { ImageDecorativeLabelRemover } from './operators/image-decorative-label-remover.js';
import { PredefinedToCustomColorReplacer } from './operators/predefined-to-custom-color-replacer.js';
import { PredefinedToCustomStyleReplacer } from './operators/predefined-to-custom-style-replacer.js';
import { StandardFontToStaticSizeReplacer } from './operators/standard-font-to-static-size-replacer.js';

/**
 * A dictionary of all the mutation operators.
 *
 * @category Mutating
 */
export const OperatorsDictionary = {
  AccessibilityElementModifierRemover,
  AccessibilityHiddenModifierRemover,
  AccessibilityHintModifierRemover,
  AccessibilityLabelModifierRemover,
  AccessibilityModifierRemover,
  AccessibilityValueModifierRemover,
  ImageDecorativeLabelRemover,
  PredefinedToCustomColorReplacer,
  PredefinedToCustomStyleReplacer,
  StandardFontToStaticSizeReplacer,
};

/**
 * The ID of a mutation operator.
 *
 * @category Mutating
 */
export type OperatorId = keyof typeof OperatorsDictionary;

export {
  AccessibilityElementModifierRemover,
  AccessibilityHiddenModifierRemover,
  AccessibilityHintModifierRemover,
  AccessibilityLabelModifierRemover,
  AccessibilityValueModifierRemover,
  AccessibilityModifierRemover,
  ImageDecorativeLabelRemover,
  PredefinedToCustomColorReplacer,
  PredefinedToCustomStyleReplacer,
  StandardFontToStaticSizeReplacer,
};
