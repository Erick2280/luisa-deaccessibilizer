export { Deaccessibilizer } from './deaccessibilizer.js';
export {
  SwiftFileTree,
  ReplaceNodeOptions,
} from './parsing/swift-file-tree.js';
export { NodeChange, CodeMutation } from './mutating/code-mutation.js';
export {
  MutationOperator,
  MutationGenerationOptions,
} from './mutating/mutation-operator.js';
export {
  OperatorsDictionary,
  OperatorId,
  AccessibilityAddTraitsModifierRemover,
  AccessibilityElementModifierRemover,
  AccessibilityHiddenModifierRemover,
  AccessibilityHintModifierRemover,
  AccessibilityLabelModifierRemover,
  AccessibilityModifierRemover,
  AccessibilityValueModifierRemover,
  FrameModifierSizeChanger,
  ImageDecorativeLabelRemover,
  PredefinedToCustomColorReplacer,
  PredefinedToCustomStyleReplacer,
  StandardFontToStaticSizeReplacer,
} from './mutating/operators-dictionary.js';
export {
  buildModifierOnAnyViewQuery,
  buildViewWithArgumentLabelQuery,
} from './mutating/builders/query-builders.js';
export {
  buildModifierOnAnyViewFMTN,
  buildFromCaptureNameFMTN,
  buildCallbackResultFromCaptureNameFMTN,
} from './mutating/builders/find-mutation-target-nodes-builders.js';
export {
  buildRemoveModifierGCM,
  buildRemoveArgumentLabelGCM,
  buildReplaceNodeContentWithCallbackResultGCM,
} from './mutating/builders/get-code-mutation-builders.js';
export {
  versionIdentifier,
  MutantsJar,
  FileMutants,
  SerializableCodeMutation,
  SerializableCodeChange,
} from './serializing/serializables.js';
export {
  Oracle,
  BaseTestResult,
  MutantTestResult,
  MutantData,
} from './testing/oracle.js';
export { TREE_SITTER_BACKEND } from './configuring/get-parser.js';
