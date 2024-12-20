import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        ...configDefaults.exclude,
        'commitlint.config.js',
        'src/configuring/web-get-parser.ts',
        'src/cli',
      ],
      reporter: ['json-summary', 'json', 'text'],
    },
  },
});
