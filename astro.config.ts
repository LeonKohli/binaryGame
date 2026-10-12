import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { defaultLocale, locales } from './src/i18n/locales';

export default defineConfig({
  site: 'https://binary.leonkohli.dev',
  // Pages build to /path/index.html and Cloudflare redirects /path to /path/ (wrangler.jsonc); the dev server matches that.
  trailingSlash: 'always',
  // English stays at the root so existing links keep working; German lives under /de/.
  i18n: { locales: [...locales], defaultLocale },
  // Lists each page's translations in the sitemap, matching the hreflang links in the page head.
  integrations: [sitemap({ i18n: { defaultLocale, locales: Object.fromEntries(locales.map((l) => [l, l])) } })],
  // Loads the other screen when a link is hovered or tapped, so switching between Play and Learn is instant.
  prefetch: { prefetchAll: true },
  // Astro 7 defaults to JSX whitespace rules, which drop the space before a link or <strong>
  // that follows a line break in prose. HTML-aware compression keeps those spaces.
  compressHTML: true,
  // Each page is small: a separate stylesheet would only add a render-blocking request.
  build: { inlineStylesheets: 'always' },
  // Every page is prerendered, so Astro emits the policy as a <meta> tag with hashes for its own scripts and styles.
  security: {
    csp: {
      directives: ["default-src 'self'", "object-src 'none'", "base-uri 'self'"],
    },
  },
  // The site has no Markdown; without this, every build warns that Shiki conflicts with the CSP.
  markdown: { syntaxHighlight: false },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Atkinson Hyperlegible Next',
      cssVariable: '--font-atkinson',
      weights: ['200 800'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    // Numbers are the game's pieces. Atkinson slashes its zero and has no feature to turn that off,
    // so every digit on the board, the timer and the headings use Rubik, whose rounded shapes match the keys.
    {
      provider: fontProviders.fontsource(),
      name: 'Rubik',
      cssVariable: '--font-rubik',
      weights: ['400 800'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    // The handwritten notes and arrows that explain the board on the home page and in the lessons.
    {
      provider: fontProviders.fontsource(),
      name: 'Caveat',
      cssVariable: '--font-caveat',
      weights: ['400 700'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['cursive'],
      // Astro has no metrics to match `cursive`, so a late swap would resize the notes and move them off their arrows.
      display: 'block',
    },
  ],
});
