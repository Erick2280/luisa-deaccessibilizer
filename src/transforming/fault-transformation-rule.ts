import { QueryMatch, SyntaxNode } from 'web-tree-sitter';
import { CodeTransformation } from './code-transformation.js';

/**
 * Represents a rule that defines how to find and transform a specific part of the code to introduce a fault.
 *
 * @category Transforming
 */
export interface FaultTransformationRule {
  /**
   * A unique identifier for this rule.
   */
  id: string;

  /**
   * The query text, in [tree-sitter query syntax](https://tree-sitter.github.io/tree-sitter/syntax-highlighting#queries),
   * used to find the code snippet that can be transformed.
   */
  queryText: string;

  /**
   * Get the nodes that can be transformed, based on the matches of the query.
   *
   * Not every query match will be transformable, since the query may be optimized
   * for performance and return more nodes than necessary, or the transformation may not be
   * applicable to all matches.
   */
  getTransformableNodes(match: QueryMatch): SyntaxNode[];

  /**
   * Get a code transformation that introduces a fault in the given match. Returns `null`
   * if the match is not transformable.
   */
  getFaultTransformation(
    match: QueryMatch,
    options?: FaultTransformationOptions,
  ): CodeTransformation | null;
}

/**
 * Options for fault transformations.
 *
 * @category Transforming
 */
export interface FaultTransformationOptions {
  /**
   * A comment to substitute the node with. If this is provided, the node will be replaced with a comment.
   * If multiple nodes are being transformed, this comment will be added to the one deemed most appropriate.
   */
  substituteWithComment?: string | false;
}
