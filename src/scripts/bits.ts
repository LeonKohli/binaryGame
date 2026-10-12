/** Value of the bit at `index` in a number that is `size` bits wide, most significant first. */
export const placeValue = (size: number, index: number) => 2 ** (size - 1 - index);

export const toNumber = (bits: number[]) => bits.reduce((sum, bit, i) => sum + bit * placeValue(bits.length, i), 0);

/** A random square grid of bits in which every row and every column has at least one bit on. `random`
    replaces Math.random for the daily puzzle, which must be the same for everyone. */
export function randomGrid(size: number, random = Math.random) {
  let grid: number[][];
  // An all-zero row or column has nothing to toggle; re-roll so every line needs at least one bit.
  do {
    grid = Array.from({ length: size }, () => Array.from({ length: size }, () => (random() < 0.5 ? 1 : 0)));
  } while (grid.some((row) => !row.includes(1)) || grid.some((_, c) => grid.every((row) => !row[c])));
  return grid;
}

/** The number each row of `grid` makes, read left to right. */
export const rowNumbers = (grid: number[][]) => grid.map(toNumber);

/** The number each column of `grid` makes, read top to bottom. */
export const colNumbers = (grid: number[][]) => grid[0]!.map((_, c) => toNumber(grid.map((row) => row[c]!)));
