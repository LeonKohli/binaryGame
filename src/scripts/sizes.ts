// The grid sizes of the game and the page each one lives on; the pages and the game script share them.

export const SIZES = [3, 4, 5, 6, 7, 8] as const;
export type Size = (typeof SIZES)[number];

/** The size at /play/ itself; every other size has its own page below it. */
export const DEFAULT_SIZE: Size = 3;

/** Path of a size's game page below the locale, as `getRelativeLocaleUrl` takes it. */
export const playPath = (size: number) => (size === DEFAULT_SIZE ? 'play/' : `play/${size}/`);
