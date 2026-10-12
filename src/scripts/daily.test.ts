import { describe, expect, test } from 'vitest';
import { currentStreak, dailyGrid, puzzleNumber, solve, today } from './daily';

describe('daily puzzle', () => {
  // Players on every build must see the same grid for a day. If this fails, the generator, the size
  // or the seed changed: bump VERSION in daily.ts on purpose, then update these grids.
  test('a day always gives the same grid', () => {
    expect(dailyGrid(today(new Date(2026, 9, 12)))).toEqual([
      [1, 1, 1, 0, 1],
      [0, 0, 1, 0, 1],
      [0, 1, 0, 0, 0],
      [0, 1, 1, 0, 1],
      [1, 1, 1, 1, 1],
    ]);
    expect(dailyGrid(today(new Date(2026, 9, 13)))).toEqual([
      [1, 1, 0, 1, 0],
      [0, 0, 1, 1, 1],
      [1, 0, 0, 1, 0],
      [1, 1, 1, 0, 0],
      [1, 1, 0, 1, 0],
    ]);
  });

  test('the day changes at local midnight, also around a clock change', () => {
    // The clock change only shows in a zone that has one, whatever zone the tests run in.
    // 29 March 2026 has 23 hours in Central Europe.
    process.env.TZ = 'Europe/Berlin';
    expect(today(new Date(2026, 2, 29, 23, 59))).toBe(today(new Date(2026, 2, 29, 0, 1)));
    expect(today(new Date(2026, 2, 30, 0, 1))).toBe(today(new Date(2026, 2, 29, 23, 59)) + 1);
    expect(puzzleNumber(today(new Date(2026, 9, 12, 8)))).toBe(1);
    expect(puzzleNumber(today(new Date(2026, 10, 1)))).toBe(21);
  });

  test('a streak goes on from yesterday and starts again after a missed day', () => {
    const first = solve(undefined, 100);
    expect(first).toEqual({ last: 100, current: 1, best: 1 });
    const second = solve(first, 101);
    expect(second).toEqual({ last: 101, current: 2, best: 2 });
    expect(solve(second, 101)).toEqual(second);
    expect(solve(second, 103)).toEqual({ last: 103, current: 1, best: 2 });
    expect(currentStreak(second, 102)).toBe(2);
    expect(currentStreak(second, 103)).toBe(0);
  });
});
