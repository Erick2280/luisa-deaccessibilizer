// This file replaces get-parser.ts when the project is running in the browser.
import Parser from 'web-tree-sitter';

/**
 * Get a tree-sitter parser for Swift.
 */
export async function getParser(): Promise<Parser> {
  await Parser.init({
    locateFile(scriptName: string) {
      return '/' + scriptName;
    },
  });
  const Swift = await Parser.Language.load('/tree-sitter-swift.wasm');
  const parser = new Parser();
  parser.setLanguage(Swift);
  return parser;
}

/**
 * The backend used for tree-sitter. Returns `web-tree-sitter` when running using WebAssembly, or `tree-sitter` when running in Node.js.
 */
export const TREE_SITTER_BACKEND: 'web-tree-sitter' | 'tree-sitter' =
  'web-tree-sitter';
