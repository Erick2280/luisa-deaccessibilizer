import Parser, { QueryMatch } from 'web-tree-sitter';
import { SwiftFileTree } from './parsing/swift-file-tree.js';
import { getParser } from './configuring/get-parser.js';
import {
  FaultTransformationOptions,
  FaultTransformationRule,
} from './transforming/fault-transformation-rule.js';
import { RulesDictionary } from './transforming/rules-dictionary.js';
import { CodeTransformation } from './transforming/code-transformation.js';
import { byNodePosition } from './utils.js';

const allRules = Object.values(RulesDictionary);

/**
 * The main class of the library, responsible for handling Swift files, creating syntax trees,
 * performing queries, and transforming code.
 *
 * @category Main
 */
export class Deaccessibilizer {
  private parser: Promise<Parser>;

  /**
   * Create a new instance of the Deaccessibilizer. Gets the tree-sitter parser for Swift,
   * considering whether it is running in Node.js or WebAssembly.
   */
  constructor() {
    this.parser = getParser() as unknown as Promise<Parser>;
  }

  /**
   * Create a Swift file tree from the given file text.
   */
  async createSwiftFileTree(fileText: string): Promise<SwiftFileTree> {
    const parser = await this.parser;
    return new SwiftFileTree(fileText, parser);
  }

  /**
   * Query a Swift file tree with a [query in tree-sitter syntax](https://tree-sitter.github.io/tree-sitter/syntax-highlighting#queries).
   */
  queryEntireTree(tree: SwiftFileTree, query: string): QueryMatch[] {
    return tree.queryNode(tree.tree.rootNode, query);
  }

  /**
   * Query the SwiftUI views in the file tree with a [query in tree-sitter syntax](https://tree-sitter.github.io/tree-sitter/syntax-highlighting#queries).
   */
  querySwiftUIViews(tree: SwiftFileTree, query: string): QueryMatch[] {
    return tree.swiftUIViews.flatMap((view) => tree.queryNode(view, query));
  }

  /**
   * Get the code transformations introducing a fault that can be applied to the given tree,
   * based on the given rules. If no rules are provided, all rules are considered.
   */
  getFaultTransformations(
    tree: SwiftFileTree,
    rules: FaultTransformationRule[] = allRules,
    options: FaultTransformationOptions = {
      substituteWithComment: false,
    },
  ): CodeTransformation[] {
    return rules.flatMap(
      (rule) =>
        this.querySwiftUIViews(tree, rule.queryText)
          .map((match) => rule.getFaultTransformation(match, options))
          .filter(
            (transformation) => transformation !== null,
          ) as CodeTransformation[],
    );
  }

  /**
   * Apply the given code transformations to the tree.
   *
   * This method is faster than {@link applyFaultTransformationsToTreeWithRebuild},
   * but it is less safe, since it sorts and applies all transformations at once.
   *
   * This is recommended for small batches of code transformations.
   */
  applyCodeTransformationsToTree(
    tree: SwiftFileTree,
    codeTransformations: CodeTransformation[],
  ) {
    const nodeChanges = codeTransformations
      .flatMap((transformation) => transformation.nodeChanges)
      .sort(byNodePosition)
      .reverse();

    for (const nodeChange of nodeChanges) {
      tree.replaceNode(
        nodeChange.node,
        nodeChange.replaceWith,
        nodeChange.replaceOptions,
      );
    }
  }

  /**
   * Get the fault transformations from the given rules and apply them directly to the tree.
   * If no rules are provided, all rules are considered.
   *
   * This method is safer than {@link applyCodeTransformationsToTree}, since it applies
   * one rule at a time and rebuilds the tree after each transformation.
   *
   * This is reccomended for large batches of code transformations.
   */
  applyFaultTransformationsToTreeWithRebuild(
    tree: SwiftFileTree,
    rules: FaultTransformationRule[] = allRules,
    options: FaultTransformationOptions = {
      substituteWithComment: false,
    },
  ) {
    for (const rule of rules) {
      const transformation = this.getFaultTransformations(
        tree,
        [rule],
        options,
      );
      this.applyCodeTransformationsToTree(tree, transformation);
      tree.remountTree();
    }
  }
}
