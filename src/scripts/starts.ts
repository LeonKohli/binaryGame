import { colNumbers, rowNumbers } from './bits';

// The board every lesson, the home page and each size of the game start with. src/components/Board.astro
// renders it at build time and its <bit-board> element (src/scripts/board.ts) takes it over in the browser.
// This module must not touch the DOM: it runs during the build.

export interface BoardSpec {
  cols: number;
  /** One target per row, shown at the row's right end; `null` while the browser has yet to deal it. */
  rowTargets: (number | null)[];
  /** Targets under the columns; a lesson row has none. */
  colTargets?: (number | null)[];
  /** Place values down the left edge. They only mean something once columns are numbers too. */
  side?: boolean;
  /** Starting bits, row by row; all off when omitted. */
  bits?: number[][];
  /** Rows the player cannot change, such as a worked example. */
  lockedRows?: number[];
  /** Spells out the sum under a single row: one addend under each bit, the total under the target. */
  equation?: boolean;
}

/** The two rows of the stack lesson, which the column lessons go on to read downwards. */
const STACKED = [
  [0, 1, 1, 0],
  [1, 0, 0, 1],
];

/** The solved grid on the home page and in the lesson about a wrong bit. */
export const SMALL_GRID = [
  [1, 0, 1],
  [1, 1, 0],
  [0, 1, 1],
];

/** One row to count on, with its sum spelled out underneath. */
const rowStart = (cols: number, target: number, start?: number[]): BoardSpec => ({
  cols,
  rowTargets: [target],
  equation: true,
  bits: start && [start],
});

/** A grid with a target for each row and column of `grid`, showing the bits of `shown`. */
const gridStart = (grid: number[][], shown = grid, lockedRows?: number[]): BoardSpec => ({
  cols: grid[0]!.length,
  rowTargets: rowNumbers(grid),
  colTargets: colNumbers(grid),
  side: true,
  bits: shown,
  lockedRows,
});

/** An empty `size` × `size` grid whose targets the browser deals: a random puzzle can't be built
    into a static page, so its targets render empty instead of as numbers that would already match. */
export const blankGrid = (size: number): BoardSpec => {
  const unknown = Array<null>(size).fill(null);
  return { cols: size, rowTargets: unknown, colTargets: unknown, side: true };
};

/** The home page demo: 5 is lit, and 13 is one tap away, on the bit the note points at. The page is
    built with this target, so it is fixed: a random one would change in front of the reader. */
export const DEMO = { start: [0, 1, 0, 1], first: 13 };

/** Width and targets of each counting lesson; after the last target it repeats them or picks random ones. */
export const COUNTING = {
  one: { cols: 1, targets: [1] },
  two: { cols: 2, targets: [1, 2, 3] },
  three: { cols: 3, targets: [4, 5, 6, 7] },
  four: { cols: 4, targets: [11, 6] },
};

/** Row and column of the bit the fix lesson switches on by mistake. */
export const WRONG_BIT = { r: 1, c: 2 };

/** The fix lesson's grid with one bit too many. */
const WRONG = SMALL_GRID.map((row, r) => row.map((bit, c) => (r === WRONG_BIT.r && c === WRONG_BIT.c ? 1 : bit)));

export const starts = {
  demo: rowStart(4, DEMO.first, DEMO.start),
  preview: gridStart(SMALL_GRID, SMALL_GRID, [0, 1, 2]),
  one: rowStart(COUNTING.one.cols, COUNTING.one.targets[0]!),
  two: rowStart(COUNTING.two.cols, COUNTING.two.targets[0]!),
  three: rowStart(COUNTING.three.cols, COUNTING.three.targets[0]!),
  four: rowStart(COUNTING.four.cols, COUNTING.four.targets[0]!),
  stack: { cols: 4, rowTargets: [6, 9], bits: [STACKED[0]!, [0, 0, 0, 0]], lockedRows: [0] },
  columns: gridStart(STACKED, STACKED, [0, 1]),
  twice: gridStart(STACKED),
  fix: gridStart(SMALL_GRID, WRONG),
  // The grid lesson deals a random grid, its worked top row included.
  grid: { ...blankGrid(3), lockedRows: [0] },
} satisfies Record<string, BoardSpec>;
