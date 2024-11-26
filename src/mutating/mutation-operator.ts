import { QueryMatch, SyntaxNode } from 'web-tree-sitter';
import { CodeMutation } from './code-mutation.js';

/**
 * Represents a operator that defines how to find and modify a specific part of the code to introduce a mutation.
 *
 * @category Mutating
 */
export interface MutationOperator {
  /**
   * A unique identifier for this operator.
   */
  id: string;

  /**
   * The query text, in [tree-sitter query syntax](https://tree-sitter.github.io/tree-sitter/syntax-highlighting#queries),
   * used to find the code snippets that can be mutated.
   */
  queryText: string;

  /**
   * Get the nodes that can potentially be mutated, based on the matches of the query.
   *
   * Not every query match will be mutable, since the query may be optimized
   * for performance and return more nodes than needed, or the mutation may not be
   * applicable to all matches.
   */
  findMutationTargetNodes(match: QueryMatch): SyntaxNode[];

  /**
   * Get a code mutation that introduces an issue in the given match. Returns `null`
   * if the match is not mutable.
   */
  getCodeMutation(
    match: QueryMatch,
    options?: MutationGenerationOptions,
  ): CodeMutation | null;
}

/**
 * Options for mutation generation.
 *
 * @category Mutating
 */
export interface MutationGenerationOptions {
  /**
   * A comment to substitute the node with. If this is provided, the node will be replaced with a comment.
   * If multiple nodes are being mutated, this comment will be added to the one deemed most appropriate.
   */
  substituteWithComment?: string | false;
}
