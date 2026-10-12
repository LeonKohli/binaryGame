// ESLint runs what oxlint cannot: Astro templates, eslint-plugin-astro's rules and its jsx-a11y port.
// Frontmatter and <script> logic stay with oxlint (.oxlintrc.json), so no core rules are enabled here.
import { defineConfig } from 'eslint/config';
import { configs } from 'eslint-plugin-astro';

export default defineConfig([
  { ignores: ['dist/**', '.astro/**'] },
  { linterOptions: { reportUnusedDisableDirectives: 'error' } },
  ...configs.recommended,
  ...configs['jsx-a11y-strict'],
  {
    files: ['**/*.astro'],
    rules: {
      'astro/no-set-html-directive': 'error',
      'astro/no-set-text-directive': 'error',
      'astro/no-unused-css-selector': 'error',
      'astro/prefer-class-list-directive': 'error',
      'astro/prefer-object-class-list': 'error',
      'astro/prefer-split-class-list': 'error',
    },
  },
]);
