import Parser, {
  Language,
  SyntaxNode,
  Tree,
  QueryCapture,
  Point,
  QueryMatch,
} from 'web-tree-sitter';

import { Query as NTSQuery, SyntaxNode as NTSSyntaxNode } from 'tree-sitter';

/**
 * A syntax tree representation of a Swift file, focused in finding SwiftUI views.
 *
 * @category Parsing
 */
export class SwiftFileTree {
  private readonly parser: Parser;
  text: string;
  tree: Tree;
  language: Language;
  swiftUIViews: SyntaxNode[];

  /**
   * Create a new tree from the given Swift file text.
   */
  constructor(fileText: string, parser: Parser) {
    this.parser = parser;
    this.text = fileText;
    this.tree = parser.parse(this.text);
    this.language = this.getLanguage(parser);
    this.swiftUIViews = this.findSwiftUIViews(this.tree.rootNode);
  }

  /**
   * Remount the tree from the current text.
   */
  remountTree() {
    this.tree = this.parser.parse(this.text);
    this.swiftUIViews = this.findSwiftUIViews(this.tree.rootNode);
  }

  /**
   * Get the language of the parser, considering the different APIs of `tree-sitter` for Node.js and `web-tree-sitter`.
   */
  private getLanguage(parser: unknown): Language {
    if ((parser as unknown as { language: Language }).language) {
      return (parser as unknown as { language: Language }).language;
    } else {
      return (parser as Parser).getLanguage();
    }
  }

  /**
   * Perform a query in the tree with the given query text, considering the different APIs of `tree-sitter` for Node.js and `web-tree-sitter`.
   */
  queryNode(node: SyntaxNode, queryText: string): QueryMatch[] {
    if (this.language?.query) {
      const query = this.language.query(queryText);
      return query.matches(node);
    } else {
      const query = new NTSQuery(this.language, queryText);
      return query.matches(
        node as unknown as NTSSyntaxNode,
      ) as unknown as QueryMatch[];
    }
  }

  /**
   * Check if the file imports SwiftUI.
   */
  private hasSwiftUIImportedOnTree(): boolean {
    const swiftUIImportQueryText = `
    (import_declaration
      (identifier) @import-name
      (#eq? @import-name "SwiftUI")
    )
    `;

    const swiftUIImportMatches = this.queryNode(
      this.tree.rootNode,
      swiftUIImportQueryText,
    );

    return swiftUIImportMatches.length > 0;
  }

  /**
   * Find all SwiftUI views in the tree.
   */
  private findSwiftUIViews(rootNode: SyntaxNode): SyntaxNode[] {
    // Check if it imports SwiftUI. If it doesn't, it doesn't have SwiftUI views.
    if (!this.hasSwiftUIImportedOnTree()) {
      return [];
    }

    // A SwiftUI view is a property declaration with an opaque type annotation that matches "some View".
    const swiftUIViewQueryText = `
      (
        (property_declaration
          (type_annotation
            (opaque_type) @type-name
            (#eq? @type-name "some View")
          )
        ) @swift-ui-view
      )
      `;
    const matches = this.queryNode(rootNode, swiftUIViewQueryText);

    return matches.map(
      (match) =>
        match.captures.find(
          (capture: QueryCapture) => capture.name === 'swift-ui-view',
        )!.node,
    );
  }

  // Replacement operations are based in the example in https://github.com/tree-sitter/tree-sitter/discussions/2553#discussioncomment-9976343.

  /**
   * Replace the text in the tree with the given replacement text.
   * Prefer using `replaceNode` instead of this method, which uses this one under the hood.
   */
  replaceText(
    originalStart: Point,
    originalEnd: Point,
    originalStartIndex: number,
    originalEndIndex: number,
    replacementText: string,
  ) {
    // Compute what the new row-column will be
    const newNumberOfLines = replacementText.match(/\n/g)?.length || 0;
    let newEndRow = originalStart.row;
    if (newNumberOfLines == 0) {
      newEndRow = originalStart.row + replacementText.length;
    } else {
      newEndRow = replacementText.split('\n').slice(-1)[0].length;
    }

    // Updates all the indices of all the nodes
    this.tree.edit({
      startIndex: originalStartIndex,
      oldEndIndex: originalEndIndex,
      newEndIndex: originalStartIndex + replacementText.length,
      startPosition: originalStart,
      oldEndPosition: originalEnd,
      newEndPosition: {
        row: newEndRow,
        column: originalStart.column + newNumberOfLines,
      },
    });

    // Splice the new string
    this.text =
      this.text.slice(0, originalStartIndex) +
      replacementText +
      this.text.slice(originalEndIndex);
  }

  /**
   * Replace a node in the tree with the given replacement text.
   * This doesn't update the tree itself, only updates the indices of the nodes of the existing one.
   */
  replaceNode(
    node: SyntaxNode,
    replacementText: string,
    options: ReplaceNodeOptions = {
      clearLeadingTrivia: false,
      clearTrailingTrivia: false,
    },
  ) {
    // Get the node position info
    const {
      startPosition: originalStart,
      endPosition: originalEnd,
      startIndex: originalStartIndex,
      endIndex: originalEndIndex,
    } = node;

    if (options.clearTrailingTrivia) {
      // Replace from after the end of the current node to the start of the next node with whitespace
      const nextNode = node.nextNamedSibling;
      if (nextNode) {
        this.replaceTriviaBetweenNodes(node, nextNode, '');
      }
    }

    this.replaceText(
      originalStart,
      originalEnd,
      originalStartIndex,
      originalEndIndex,
      replacementText,
    );

    if (options.clearLeadingTrivia) {
      // Replace from after the end of the previous node to the start of the current node with whitespace
      const previousNode = node.previousNamedSibling;
      if (previousNode) {
        this.replaceTriviaBetweenNodes(previousNode, node, '');
      }
    }
  }

  /**
   * Replace the trivia between two nodes with the given replacement text.
   * Prefer using {@link replaceNode} with the `clearLeadingTrivia` or `clearTrailingTrivia` options instead of this method.
   */
  replaceTriviaBetweenNodes(
    previousNode: SyntaxNode,
    nextNode: SyntaxNode,
    replacementText: string,
  ) {
    // Get the node position info
    const originalStart = previousNode.endPosition;
    const originalEnd = nextNode.startPosition;
    const originalStartIndex = previousNode.endIndex;
    const originalEndIndex = nextNode.startIndex;

    this.replaceText(
      originalStart,
      originalEnd,
      originalStartIndex,
      originalEndIndex,
      replacementText,
    );
  }
}

/**
 * Options for replacing a node in the tree.
 *
 * @category Parsing
 */
export interface ReplaceNodeOptions {
  clearLeadingTrivia: boolean;
  clearTrailingTrivia: boolean;
}
