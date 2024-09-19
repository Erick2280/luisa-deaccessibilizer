export { Deaccessibilizer } from './deaccessibilizer.js';
export {
  SwiftFileTree,
  ReplaceNodeOptions,
} from './parsing/swift-file-tree.js';
export {
  NodeChange,
  CodeTransformation,
} from './transforming/code-transformation.js';
export {
  FaultTransformationRule,
  FaultTransformationOptions,
} from './transforming/fault-transformation-rule.js';
export {
  RulesDictionary,
  RuleId,
  AccessibilityElementModifierRemover,
  AccessibilityHiddenModifierRemover,
  AccessibilityHintModifierRemover,
  AccessibilityLabelModifierRemover,
  AccessibilityModifierRemover,
  AccessibilityValueModifierRemover,
  ImageDecorativeLabelRemover,
  StandardFontToStaticSizeReplacer,
} from './transforming/rules-dictionary.js';
export {
  buildModifierOnAnyViewQuery,
  buildViewWithArgumentLabelQuery,
} from './transforming/builders/query-builders.js';
export {
  buildModifierOnAnyViewGTN as buildModifierGTN,
  buildFromCaptureNameGTN,
} from './transforming/builders/get-transformable-nodes-builders.js';
export {
  buildRemoveModifierGFT,
  buildRemoveArgumentLabelGFT,
} from './transforming/builders/get-fault-transformation-builders.js';
export { TREE_SITTER_BACKEND } from './configuring/get-parser.js';

// TODO: CLI
