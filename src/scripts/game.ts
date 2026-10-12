import type { game } from '../i18n/en';
import { colNumbers, randomGrid, rowNumbers } from './bits';

const STORAGE_KEY = 'binary-game';

/** Best times in milliseconds, by grid size. */
type Best = Record<string, unknown>;

// Storage is outside input: an old version or another tab may have written anything there, so a time
// counts only where `bestTime` reads it as a positive number.
function load(): Best {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    if (typeof data === 'object' && data && 'best' in data && typeof data.best === 'object' && data.best)
      return { ...data.best };
  } catch {
    // Unreadable storage counts as no best times.
  }
  return {};
}

function save(best: Best) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ best }));
  } catch {
    // Storage can be unavailable (private mode); the game works without it.
  }
}

export const formatTime = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

export function mountGame(root: HTMLElement, t: typeof game) {
  let board = root.querySelector('bit-board')!;
  // Each puzzle starts on a copy of the empty board the page was built with.
  const blank = board.cloneNode(true);
  const timerEl = root.querySelector<HTMLElement>('[data-timer]')!;
  const bestEl = root.querySelector<HTMLElement>('[data-best]')!;
  const statusEl = root.querySelector<HTMLElement>('[data-status]')!;
  const newButton = root.querySelector<HTMLButtonElement>('[data-new]')!;
  const solveButton = root.querySelector<HTMLButtonElement>('[data-solve]')!;
  // The link to the next size up; the biggest size has none.
  const biggerLink = root.querySelector<HTMLAnchorElement>('[data-up]');
  const progressEl = root.querySelector<HTMLElement>('[data-progress]')!;
  const newLabel = newButton.textContent;
  // Each size has its own page, built with its board.
  const size = Number(root.dataset.size);
  // The win wave crosses both sides of the board; the verdict waits until it has.
  root.style.setProperty('--wave', `${2 * size * 45}ms`);

  const best = load();
  let solution: number[][];
  let startedAt = 0;
  let finished = false;
  let tick = 0;

  function bestTime() {
    const time = best[size];
    return typeof time === 'number' && time > 0 ? time : undefined;
  }

  function showBest() {
    const time = bestTime();
    bestEl.textContent = time ? t.best(formatTime(time)) : '';
  }

  function stopTimer() {
    window.clearInterval(tick);
    tick = 0;
    root.classList.remove('running');
  }

  function startTimer() {
    if (tick || finished) return;
    startedAt = performance.now();
    root.classList.add('running');
    tick = window.setInterval(() => (timerEl.textContent = formatTime(performance.now() - startedAt)), 250);
  }

  function start(announce = false) {
    stopTimer();
    finished = false;
    solution = randomGrid(size);
    timerEl.textContent = '0:00';
    statusEl.textContent = '';
    // The status line is empty while the best time shows, so the new puzzle is announced on its own.
    progressEl.textContent = announce ? t.newPuzzle(size) : '';
    root.classList.remove('solved', 'revealed');
    board.replaceWith(blank.cloneNode(true));
    board = root.querySelector('bit-board')!;
    // A new board deals its bits in; the first switch ends that, so a target's match pop is not
    // replaced by it.
    board.classList.add('fresh');
    // Screen readers hear what each switch did to its row and its column.
    board.live = progressEl;
    newButton.textContent = newLabel;
    solveButton.hidden = false;
    if (biggerLink) biggerLink.hidden = true;
    board.setTargets(rowNumbers(solution), colNumbers(solution));
    showBest();
  }

  function finish(won: boolean) {
    finished = true;
    stopTimer();
    progressEl.textContent = '';
    board.lock();
    root.classList.add(won ? 'solved' : 'revealed');
    // The round is over, so the main button moves on, and Enter starts the next puzzle right away.
    newButton.textContent = t.next;
    solveButton.hidden = true;
    if (won && biggerLink) biggerLink.hidden = false;
    newButton.focus();
    if (!won) {
      statusEl.textContent = t.solution;
      return;
    }
    const time = performance.now() - startedAt;
    const previous = bestTime();
    const record = previous === undefined || time < previous;
    if (record) {
      best[size] = time;
      save(best);
      showBest();
    }
    statusEl.textContent = `${t.solved(formatTime(time))} ${record ? t.newBest : t.yourBest(formatTime(previous))}`;
  }

  root.addEventListener('bit-toggle', ({ detail }) => {
    board.classList.remove('fresh');
    startTimer();
    // A win is announced once, by the status line.
    if (detail.solved) finish(true);
  });

  newButton.addEventListener('click', () => start(true));

  solveButton.addEventListener('click', () => {
    solution.forEach((row, r) => row.forEach((bit, c) => board.set(r, c, bit)));
    board.update();
    finish(false);
  });

  start();
}
