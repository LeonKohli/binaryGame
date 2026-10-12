/// <reference types="vitest/config" />
// Unit tests run with the site's own Vite and Astro settings: https://docs.astro.build/en/guides/testing/#vitest
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
});
