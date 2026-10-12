import type { daily } from '../i18n/en';
import { colNumbers, rowNumbers } from './bits';
import { formatTime } from './game';
import { currentStreak, dailyGrid, puzzleNumber, solve, type Streak, today } from './daily';

// Its own key: the game stores its best times under `binary-game` and rewrites that key whole.
const STORAGE_KEY = 'binary-game-daily';

interface Saved {
  streak?: Streak;
  /** Solve times in milliseconds, by day. */
  times: Record<number, number>;
}

const isNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

const isStreak = (value: unknown): value is Streak =>
  typeof value === 'object' &&
  value !== null &&
  'last' in value &&
  'current' in value &&
  'best' in value &&
  isNumber(value.last) &&
  isNumber(value.current) &&
  isNumber(value.best);

// Storage is outside input: an old version or another tab may have written anything there.
function load(): Saved {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    if (typeof data !== 'object' || !data) return { times: {} };
    const times = 'times' in data && typeof data.times === 'object' && data.times ? data.times : {};
    return {
      times: Object.fromEntries(Object.entries(times).filter(([, time]) => isNumber(time) && time > 0)),
      streak: 'streak' in data && isStreak(data.streak) ? data.streak : undefined,
    };
  } catch {
    return { times: {} };
  }
}

function save(saved: Saved) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  } catch {
    // Storage can be unavailable (private mode); the puzzle works without it.
  }
}

/** Deals today's puzzle into the page's board, times the solve and keeps the streak. */
export function mountDaily(root: HTMLElement, t: typeof daily) {
  const board = root.querySelector('bit-board')!;
  const numberEl = root.querySelector<HTMLElement>('[data-number]')!;
  const streakEl = root.querySelector<HTMLElement>('[data-streak]')!;
  const timerEl = root.querySelector<HTMLElement>('[data-timer]')!;
  const statusEl = root.querySelector<HTMLElement>('[data-status]')!;
  const progressEl = root.querySelector<HTMLElement>('[data-progress]')!;
  const shareButton = root.querySelector<HTMLButtonElement>('[data-share]')!;
  const size = Number(root.dataset.size);
  // The win wave crosses both sides of the board; the verdict waits until it has.
  root.style.setProperty('--wave', `${2 * size * 45}ms`);

  const day = today();
  const number = puzzleNumber(day);
  const solution = dailyGrid(day);
  const saved = load();
  let startedAt = 0;
  let tick = 0;

  numberEl.textContent = t.number(number);
  const showStreak = () => {
    const days = currentStreak(saved.streak, day);
    streakEl.textContent = days ? t.streak(days) : '';
  };
  showStreak();
  board.live = progressEl;
  board.setTargets(rowNumbers(solution), colNumbers(solution));

  function done(time: number) {
    board.lock();
    root.classList.add('solved');
    timerEl.textContent = formatTime(time);
    shareButton.hidden = false;
  }

  const solvedTime = saved.times[day];
  if (solvedTime) {
    // Solved earlier today: the board shows the answer and stays locked until midnight.
    solution.forEach((row, r) => row.forEach((bit, c) => board.set(r, c, bit)));
    board.update();
    done(solvedTime);
    statusEl.textContent = `${t.done(formatTime(solvedTime))} ${t.next}`;
  } else {
    board.classList.add('fresh');
  }

  root.addEventListener('bit-toggle', ({ detail }) => {
    board.classList.remove('fresh');
    if (!tick) {
      startedAt = performance.now();
      root.classList.add('running');
      tick = window.setInterval(() => (timerEl.textContent = formatTime(performance.now() - startedAt)), 250);
    }
    if (!detail.solved) return;
    window.clearInterval(tick);
    root.classList.remove('running');
    const time = performance.now() - startedAt;
    saved.times[day] = time;
    saved.streak = solve(saved.streak, day);
    save(saved);
    progressEl.textContent = '';
    done(time);
    showStreak();
    statusEl.textContent = `${t.solved(formatTime(time))} ${t.next}`;
    shareButton.focus();
  });

  // Web Share where the browser has it (desktop Firefox has not), the clipboard otherwise:
  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
  shareButton.addEventListener('click', async () => {
    const time = saved.times[day];
    if (!time) return;
    const text = `${t.shareText(number, formatTime(time), currentStreak(saved.streak, day))}\n${location.href}`;
    if ('share' in navigator) {
      try {
        await navigator.share({ text });
        return;
      } catch (error) {
        // The reader closed the share sheet; that is not a reason to copy instead.
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }
    await navigator.clipboard.writeText(text);
    statusEl.textContent = t.copied;
  });
}
