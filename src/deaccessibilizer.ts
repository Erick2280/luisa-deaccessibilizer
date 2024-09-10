import Parser, { QueryMatch } from 'web-tree-sitter';
import { SwiftFileTree } from './parsing/swift-file-tree.js';
import { getParser } from './configuring/get-parser.js';
import { FaultTransformationRule } from './transforming/fault-transformation-rule.js';

/**
 * The main class of the library, responsible for handling Swift files, creating syntax trees, performing queries, and transforming code.
 *
 * @category Main
 */
export class Deaccessibilizer {
  private parser: Promise<Parser>;

  constructor() {
    this.parser = getParser() as unknown as Promise<Parser>;
  }

  async createSwiftFileTree(fileText: string): Promise<SwiftFileTree> {
    const parser = await this.parser;
    return new SwiftFileTree(fileText, parser);
  }

  async queryFromRule(tree: SwiftFileTree, rule: FaultTransformationRule) {
    const matches: QueryMatch[] = [];

    for (const view of tree.swiftUIViews) {
      matches.push(...tree.queryNode(view, rule.queryText));
    }

    return matches;
  }
}
