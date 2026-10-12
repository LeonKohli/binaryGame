import * as de from './de';
import * as en from './en';
import { defaultLocale, isLocale, type Locale, locales } from './locales';

export { defaultLocale, isLocale, type Locale, locales };

// `satisfies` fails the type check when a translation misses a string or changes its parameters.
const translations = { en, de } satisfies Record<Locale, typeof en>;

export const useTranslations = (locale: Locale): typeof en => translations[locale];

/** Locale of the rendered page, for client scripts. */
export const pageLocale = (): Locale => {
  const lang = document.documentElement.lang;
  return isLocale(lang) ? lang : defaultLocale;
};

/** Static paths for a route under `src/pages/[...lang]/`; the default locale has no prefix. */
export const localePaths = () =>
  locales.map((locale) => ({ params: { lang: locale === defaultLocale ? undefined : locale }, props: { locale } }));

// Client scripts pick their strings from these maps, so the bundle carries only the runtime strings.
export const boardText = { en: en.board, de: de.board } satisfies Record<Locale, typeof en.board>;
export const gameText = { en: en.game, de: de.game } satisfies Record<Locale, typeof en.game>;
export const lessonText = { en: en.lesson, de: de.lesson } satisfies Record<Locale, typeof en.lesson>;
export const dailyText = { en: en.daily, de: de.daily } satisfies Record<Locale, typeof en.daily>;
