import Parser from 'tree-sitter';
import Swift from 'tree-sitter-swift';

/**
 * Get a tree-sitter parser for Swift.
 */
export async function getParser(): Promise<Parser> {
  const parser = new Parser();
  parser.setLanguage(Swift as unknown as Parser.Language);
  return parser;
}

/**
 * The backend used for tree-sitter. Returns `web-tree-sitter` when running using WebAssembly, or `tree-sitter` when running in Node.js.
 */
export const TREE_SITTER_BACKEND: 'web-tree-sitter' | 'tree-sitter' =
  'tree-sitter';
