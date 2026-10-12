import { randomGrid } from './bits';

// The daily puzzle is the same for every player on the same calendar day. It is worked out in the
// browser from the date, so no server or rebuild is needed.

export const DAILY_SIZE = 5;

// Every player must get the same grid for a day, also on an older cached build. Changing the size,
// the generator or the seed changes past and future puzzles, so do it only together with VERSION.
const VERSION = 1;

/** Days since 1970 on the player's calendar, so the puzzle changes at local midnight, as Wordle's does.
    Built from the date's fields, so the 23- and 25-hour days around a clock change count as one day. */
export const today = (now = new Date()) => Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 864e5;

/** The puzzle's number for sharing; 12 October 2026 was number 1. */
export const puzzleNumber = (day: number) => day - Date.UTC(2026, 9, 12) / 864e5 + 1;

/** SplitMix32 from https://github.com/bryc/code/blob/master/jshash/PRNGs.md (public domain): a seeded
    stand-in for Math.random that gives the same numbers in every browser. */
function splitmix32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x9e3779b9) | 0;
    let t = a ^ (a >>> 16);
    t = Math.imul(t, 0x21f0aaad);
    t ^= t >>> 15;
    t = Math.imul(t, 0x735a2d97);
    return ((t ^ (t >>> 15)) >>> 0) / 4294967296;
  };
}

export const dailyGrid = (day: number) => randomGrid(DAILY_SIZE, splitmix32((VERSION << 20) ^ day));

export interface Streak {
  /** The last day solved, as returned by `today`. */
  last: number;
  current: number;
  best: number;
}

/** The streak after solving `day`: it goes on from yesterday, and starts again after a missed day. */
export function solve(streak: Streak | undefined, day: number): Streak {
  if (streak?.last === day) return streak;
  const current = streak?.last === day - 1 ? streak.current + 1 : 1;
  return { last: day, current, best: Math.max(current, streak?.best ?? 0) };
}

/** The streak shown on `day`: still running if the last solve was today or yesterday. */
export const currentStreak = (streak: Streak | undefined, day: number) =>
  streak && streak.last >= day - 1 ? streak.current : 0;
