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
  AccessibilityModifierRemover,
  ImageDecorativeLabelRemover,
} from './transforming/rules-dictionary.js';
export { TREE_SITTER_BACKEND } from './configuring/get-parser.js';
