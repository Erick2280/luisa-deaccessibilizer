import { SyntaxNode } from 'web-tree-sitter';
import { FaultTransformationRule } from '../fault-transformation-rule.js';
import { buildModifierOnAnyViewQuery } from '../builders/query-builders.js';
import { buildCallbackResultFromCaptureNameGTN } from '../builders/get-transformable-nodes-builders.js';
import { buildReplaceNodeContentWithCallbackResultGFT } from '../builders/get-fault-transformation-builders.js';
import {
  getModifierArgumentsNodeFromModifierNameNode,
  stripParentheses,
} from '../../utils.js';

/**
 * This rule matches to a SwiftUI view that uses a standard font modifier, like `.font(.body)`.
 * The transformation replaces the standard font modifier with a static font size modifier, which
 * disables the support for Dynamic Type.
 *
 * Before:
 * ```swift
 * Text("Pineapple")
 *   .font(.body)
 * ```
 *
 * After:
 * ```swift
 * Text("Pineapple")
 *  .font(.system(size: 17))
 * ```
 *
 * Applicable WCAG Success Criteria:
 * - [1.4.4 Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text)
 *
 * Related documentation:
 * - https://developer.apple.com/documentation/swiftui/font
 * - https://developer.apple.com/design/human-interface-guidelines/typography
 *
 * @category Fault Transformation Rules
 */
export const StandardFontToStaticSizeReplacer: FaultTransformationRule =
  (() => {
    const fontCorrespondences: {
      standardFonts: string[];
      staticSize: string;
    }[] = [
      {
        standardFonts: ['.extraLargeTitle2', 'Font.extraLargeTitle2'],
        staticSize: '.system(size: 47)',
      },
      {
        standardFonts: ['.extraLargeTitle', 'Font.extraLargeTitle'],
        staticSize: '.system(size: 34)',
      },
      {
        standardFonts: ['.largeTitle', 'Font.largeTitle'],
        staticSize: '.system(size: 28)',
      },
      {
        standardFonts: ['.title', 'Font.title'],
        staticSize: '.system(size: 28)',
      },
      {
        standardFonts: ['.title2', 'Font.title2'],
        staticSize: '.system(size: 22)',
      },
      {
        standardFonts: ['.title3', 'Font.title3'],
        staticSize: '.system(size: 20)',
      },
      {
        standardFonts: ['.headline', 'Font.headline'],
        staticSize: '.system(size: 17, weight: .semibold)',
      },
      {
        standardFonts: ['.subheadline', 'Font.subheadline'],
        staticSize: '.system(size: 15)',
      },
      {
        standardFonts: ['.body', 'Font.body'],
        staticSize: '.system(size: 17)',
      },
      {
        standardFonts: ['.callout', 'Font.callout'],
        staticSize: '.system(size: 16)',
      },
      {
        standardFonts: ['.caption', 'Font.caption'],
        staticSize: '.system(size: 12)',
      },
      {
        standardFonts: ['.caption2', 'Font.caption2'],
        staticSize: '.system(size: 11)',
      },
      {
        standardFonts: ['.footnote', 'Font.footnote'],
        staticSize: '.system(size: 13)',
      },
    ];

    const id = 'StandardFontToStaticSizeReplacer';
    const queryText = buildModifierOnAnyViewQuery({
      modifierName: 'font',
    });
    const getTransformableNodes = buildCallbackResultFromCaptureNameGTN(
      'modifier-name',
      (node: SyntaxNode) => {
        const argumentsNode =
          getModifierArgumentsNodeFromModifierNameNode(node);
        const argumentsInsideBrackets = stripParentheses(argumentsNode.text);

        if (
          fontCorrespondences.some((fontCorrespondence) =>
            fontCorrespondence.standardFonts.includes(argumentsInsideBrackets),
          )
        ) {
          return argumentsNode;
        } else {
          return null;
        }
      },
    );
    const getFaultTransformation = buildReplaceNodeContentWithCallbackResultGFT(
      getTransformableNodes,
      id,
      {
        getReplacementTextFromNode: (node: SyntaxNode) => {
          const argumentsInsideBrackets = stripParentheses(node.text);
          const fontCorrespondence = fontCorrespondences.find(
            (fontCorrespondence) =>
              fontCorrespondence.standardFonts.includes(
                argumentsInsideBrackets,
              ),
          )!;

          return `(${fontCorrespondence.staticSize})`;
        },
      },
    );

    return {
      id,
      queryText,
      getTransformableNodes,
      getFaultTransformation,
    };
  })();
