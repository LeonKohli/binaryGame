// The one list of site languages. astro.config.ts reads it too, so adding a language starts here.
export const locales = ['en', 'de'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const isLocale = (value: unknown): value is Locale => locales.some((locale) => locale === value);
