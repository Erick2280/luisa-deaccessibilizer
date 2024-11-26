import Parser, { QueryMatch } from 'web-tree-sitter';

import { getParser } from './configuring/get-parser.js';
import { CodeMutation } from './mutating/code-mutation.js';
import {
  MutationGenerationOptions,
  MutationOperator,
} from './mutating/mutation-operator.js';
import { OperatorsDictionary } from './mutating/operators-dictionary.js';
import { SwiftFileTree } from './parsing/swift-file-tree.js';
import { SerializableCodeMutation } from './serializing/serializables.js';
import { byNodePosition } from './utils.js';

const allOperators = Object.values(OperatorsDictionary);

/**
 * The main class of the library, responsible for handling Swift files, creating syntax trees,
 * performing queries, and mutating code.
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
   * Get the possible mutations that can be applied to the given tree,
   * based on the given operators. If no operators are provided, all of them are considered.
   */
  getCodeMutations(
    tree: SwiftFileTree,
    operators: MutationOperator[] = allOperators,
    options: MutationGenerationOptions = {
      substituteWithComment: false,
    },
  ): CodeMutation[] {
    return operators.flatMap(
      (operator) =>
        this.querySwiftUIViews(tree, operator.queryText)
          .map((match) => operator.getCodeMutation(match, options))
          .filter((mutation) => mutation !== null) as CodeMutation[],
    );
  }

  /**
   * Apply the given mutations to the tree.
   *
   * This method is faster than {@link applyOperatorsToTreeWithRebuild},
   * but it is less safe, since it sorts and applies all mutations at once.
   *
   * This is recommended for small batches of mutations.
   */
  applyCodeMutationsToTree(tree: SwiftFileTree, codeMutations: CodeMutation[]) {
    const nodeChanges = codeMutations
      .flatMap((mutation) => mutation.nodeChanges)
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
   * Get the mutations from the given operators and apply them directly to the tree.
   * If no operators are provided, all of them are considered.
   *
   * This method is safer than {@link applyCodeMutationsToTree}, since it applies
   * one operator at a time and rebuilds the tree after each mutation.
   *
   * This is recommended for large batches of mutations.
   */
  applyOperatorsToTreeWithRebuild(
    tree: SwiftFileTree,
    operators: MutationOperator[] = allOperators,
    options: MutationGenerationOptions = {
      substituteWithComment: false,
    },
  ) {
    for (const operator of operators) {
      const mutation = this.getCodeMutations(tree, [operator], options);
      this.applyCodeMutationsToTree(tree, mutation);
      tree.remountTree();
    }
  }

  /**
   * Converts mutations into a serializable format.
   */
  getSerializableCodeMutations(
    tree: SwiftFileTree,
    codeMutations: CodeMutation[],
  ): SerializableCodeMutation[] {
    return codeMutations.map((mutation) => {
      return {
        operatorId: mutation.operatorId,
        codeChanges: mutation.nodeChanges.flatMap((nodeChange) =>
          tree.getNodeReplacementChanges(
            nodeChange.node,
            nodeChange.replaceWith,
            nodeChange.replaceOptions,
          ),
        ),
      };
    });
  }

  /**
   * Get mutations in a serializable format from the given operators.
   */
  getSerializableCodeMutationsFromOperators(
    tree: SwiftFileTree,
    operators: MutationOperator[],
  ) {
    const codeMutations = this.getCodeMutations(tree, operators);
    return this.getSerializableCodeMutations(tree, codeMutations);
  }

  /**
   * Apply the given serializable mutation to the file text.
   *
   * This can apply mutations previously returned by {@link getSerializableCodeMutations}
   * and {@link getSerializableCodeMutationsFromOperators}.
   */
  applySerializableCodeMutationToText(
    fileText: string,
    mutation: SerializableCodeMutation,
  ) {
    let changedFileText = fileText;
    for (const change of mutation.codeChanges) {
      changedFileText =
        changedFileText.slice(0, change.replaceStartIndex) +
        change.replaceWith +
        changedFileText.slice(change.replaceEndIndex);
    }
    return changedFileText;
  }
}
