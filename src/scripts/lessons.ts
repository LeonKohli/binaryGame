import type { lesson } from '../i18n/en';
import { colNumbers, placeValue, randomGrid, rowNumbers } from './bits';
import type { BitBoard } from './board';
import { COUNTING, DEMO, SMALL_GRID, WRONG_BIT } from './starts';

export type LessonText = typeof lesson;

/** What a mounted lesson needs from the page around it. */
interface Context {
  /** The lesson's own element: a board, its notes and a feedback line. */
  root: HTMLElement;
  t: LessonText;
  /** Tells the page the lesson is done, so it can point at the next one. */
  done: () => void;
  /** Aborts when the lesson is left: the lesson then stops and takes back what it added outside its board. */
  signal: AbortSignal;
}

/**
 * Sets up one lesson in its element. Its board is a fresh copy each time, so whatever the lesson does
 * to the board leaves with it.
 */
type Lesson = (ctx: Context) => void;

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

const sleep = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal.aborted) return reject(signal.reason);
    const id = setTimeout(resolve, ms);
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(id);
        reject(signal.reason);
      },
      { once: true },
    );
  });

/** Parts of a lesson's markup. Every lesson has them all; a lesson that has no use for one ignores it. */
function parts(root: HTMLElement) {
  const board = root.querySelector('bit-board')!;
  // Screen readers hear what each switch did; see BitBoard.live.
  board.live = root.querySelector<HTMLElement>('[data-live]');
  return {
    stage: root.querySelector<HTMLElement>('[data-stage]')!,
    board,
    feedback: root.querySelector<HTMLElement>('[data-feedback]')!,
    action: root.querySelector<HTMLButtonElement>('[data-action]')!,
    note: (key: string) => root.querySelector<HTMLElement>(`[data-note="${key}"]`)!,
  };
}

/** Marks one row and one column, for the lesson about a bit that belongs to both. */
function cross(board: BitBoard, r?: number, c?: number) {
  board.querySelectorAll('.cross').forEach((el) => el.classList.remove('cross'));
  if (r === undefined || c === undefined) return;
  board.cells[r]!.forEach((cell) => cell.classList.add('cross'));
  board.cells.forEach((row) => row[c]!.classList.add('cross'));
  board.rowSums[r]!.classList.add('cross');
  board.colSums[c]?.classList.add('cross');
}

interface CountingOptions {
  /** Targets in order; after the last one the lesson repeats them, or picks random ones. */
  targets: number[];
  random?: boolean;
  /** Fades out the "tap a bit" note once the player has switched a bit. */
  firstTap?: boolean;
  /** Lights a hint on the biggest bit, and shows its note, while the first target is open. */
  hint?: boolean;
}

/** A target from 1 to 2^cols − 1 other than `except`. */
function randomTarget(cols: number, except: number) {
  const max = 2 ** cols - 1;
  const target = 1 + Math.floor(Math.random() * (max - 1));
  return target >= except ? target + 1 : target;
}

/** One row of bits and a target, then the next target: the counting lessons and the home page demo. */
function counting(options: CountingOptions): Lesson {
  return ({ root, t, done, signal }) => {
    const { board, feedback, action, note } = parts(root);
    const { targets, random = false } = options;
    let step = 0;
    let target = targets[0]!;

    // Notes a lesson hides on the way are in the page again when the lesson is next opened.
    let fadeTap: (() => void) | undefined;
    if (options.firstTap) {
      const tap = note('tap');
      let fading: Animation[] = [];
      fadeTap = () => {
        fadeTap = undefined;
        if (reducedMotion.matches) {
          tap.hidden = true;
          return;
        }
        const timing = { duration: 200, easing: 'ease-out', fill: 'forwards' as const };
        // The note and its arrow; the group around them has no box of its own to fade.
        fading = [...tap.children].map((el) => el.animate({ opacity: [1, 0] }, timing));
        void Promise.all(fading.map((animation) => animation.finished)).then(
          () => (tap.hidden = true),
          () => {},
        );
      };
      signal.addEventListener('abort', () => {
        fading.forEach((animation) => animation.cancel());
        tap.hidden = false;
      });
    }

    let removeHint: (() => void) | undefined;
    if (options.hint) {
      const biggest = board.cells[0]![0]!;
      const hintNote = note('biggest');
      biggest.classList.add('hint');
      removeHint = () => {
        biggest.classList.remove('hint');
        hintNote.hidden = true;
        removeHint = undefined;
      };
      signal.addEventListener('abort', () => (hintNote.hidden = false));
    }

    board.addEventListener('bit-toggle', ({ detail: { c, solved } }) => {
      fadeTap?.();
      if (c === 0 && board.bits[0]![0]) removeHint?.();
      if (!solved) {
        feedback.textContent = '';
        action.hidden = true;
        return;
      }
      const last = step >= targets.length - 1;
      feedback.textContent = last && !random && targets.length > 1 ? t.counted(target) : t.correct;
      if (last) done();
      // A sequence goes on to its next number and starts over at the end; a single number has nothing to go on to.
      const label = !last ? t.next(targets[step + 1]!) : random ? t.another : targets.length > 1 ? t.again : '';
      if (!label) return;
      action.textContent = label;
      action.hidden = false;
      // On a short screen the verdict and its button can sit under the sticky Back and Next.
      feedback.scrollIntoView({ block: 'nearest' });
    });

    action.addEventListener(
      'click',
      () => {
        step += 1;
        const previous = target;
        if (step < targets.length) target = targets[step]!;
        else if (random) target = randomTarget(board.cols, target);
        else target = targets[(step = 0)]!;
        // Counting up keeps the bits, so the player counts on from the last number (4 to 5 switches
        // one bit). Any other new number starts from zero, as "biggest bit first" assumes.
        if (target !== previous + 1) board.clearRow(0);
        board.setTargets([target]);
        feedback.textContent = '';
        action.hidden = true;
        // The button hides, so focus goes back to the bits.
        board.focus();
      },
      { signal },
    );
  };
}

/** The demo on the home page: one click from the first match, then any number. */
export const demo = counting({ targets: [DEMO.first], random: true, firstTap: true });

/** Row 1 is done; the player makes row 2. */
const stack: Lesson = ({ root, t, done }) => {
  const { board, feedback } = parts(root);
  board.addEventListener('bit-toggle', ({ detail: { solved } }) => {
    feedback.textContent = solved ? t.stacked : '';
    if (solved) done();
  });
};

/** Shows a target or place value the column lesson held back. */
function appear(el: HTMLElement) {
  el.classList.remove('pending');
  el.classList.add('arrive');
}

/** The column the column lesson turns: its bits are 1 and 0, worth 2, as the note on it says. */
const TURNED = 1;

/** The curve of the turn itself: it starts and lands softly, like a card turned by hand. */
const TURN_EASING = 'cubic-bezier(0.77, 0, 0.175, 1)';

/** A copy of `column` laid out as a row, each bit over its place value, with the column's sum after it. */
function copyColumn(board: BitBoard, column: HTMLElement[], c: number) {
  const spin = document.createElement('div');
  // The copy starts with the resting shadow of the keys it copies and lifts off from there.
  spin.className = 'spin landed';
  spin.setAttribute('aria-hidden', 'true');
  spin.style.setProperty('--cell', `${column[0]!.getBoundingClientRect().width}px`);
  // The same spacing as on the board, so the copy lies exactly over the column before it turns.
  spin.style.gap = getComputedStyle(board).rowGap;
  /** What turns back while the copy turns, so digits and place values stay upright. */
  const turning: Element[] = [];
  column.forEach((cell, r) => {
    const item = document.createElement('div');
    item.className = 'spin-item';
    const copy = cell.cloneNode(true);
    if (!(copy instanceof HTMLElement)) return;
    copy.removeAttribute('aria-label');
    copy.tabIndex = -1;
    const place = document.createElement('span');
    place.className = 'place';
    place.textContent = String(placeValue(board.rows, r));
    item.append(copy, place);
    turning.push(copy.querySelector('.digit')!, place);
    spin.append(item);
  });
  const sum = document.createElement('span');
  sum.className = 'spin-sum';
  sum.textContent = `= ${board.colValue(c)}`;
  spin.append(sum);
  return { spin, sum, turning };
}

/**
 * Lays the copy out as a row on `target`, where the column's target will appear, and returns the
 * transform that puts it on top of the column instead, turned a quarter.
 */
function placeCopy(stage: HTMLElement, spin: HTMLElement, column: HTMLElement[], target: HTMLElement) {
  const origin = stage.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  spin.style.translate = `${targetRect.left - origin.left}px ${targetRect.top - origin.top}px`;
  const spinRect = spin.getBoundingClientRect();
  const bits = spin.querySelectorAll('.bit');
  const firstRect = bits[0]!.getBoundingClientRect();
  const lastRect = bits[bits.length - 1]!.getBoundingClientRect();
  // Centre of the copied bits, relative to the centre of the whole copy, before turning.
  const vx = (firstRect.left + lastRect.right) / 2 - (spinRect.left + spinRect.width / 2);
  const vy = (firstRect.top + firstRect.bottom) / 2 - (spinRect.top + spinRect.height / 2);
  // A quarter turn clockwise maps (vx, vy) to (−vy, vx); a row turned that way reads top to bottom.
  const cellRect = column[0]!.getBoundingClientRect();
  const colX = cellRect.left + cellRect.width / 2;
  const colY = (cellRect.top + column[column.length - 1]!.getBoundingClientRect().bottom) / 2;
  const dx = colX - -vy - (spinRect.left + spinRect.width / 2);
  const dy = colY - vx - (spinRect.top + spinRect.height / 2);
  return `translate(${dx}px, ${dy}px) rotate(90deg)`;
}

/**
 * Turns column `c` into a row and back: a copy of its bits lifts off, rotates a quarter turn and
 * lands under the board as a row with its sum, where column `c`'s target goes, so a column reads like
 * every row before it. `land` runs when the copy fades, so the target can fade in in its place.
 */
async function turnColumn(stage: HTMLElement, board: BitBoard, c: number, signal: AbortSignal, land: () => void) {
  const column = board.cells.map((row) => row[c]!);
  const { spin, sum, turning } = copyColumn(board, column, c);
  stage.append(spin);
  const turned = placeCopy(stage, spin, column, board.colSums[c]!);

  // The first 15% lift the copy off the board (it grows a little and its shadow with it), the rest turn
  // it. Every animation shares the keyframe easings, so the counter-turning digits stay upright.
  const timing = { duration: 900, fill: 'both' as const };
  column.forEach((cell) => cell.classList.add('lifted'));
  const animations = [
    spin.animate(
      [
        { transform: `${turned} scale(1)`, easing: 'ease-out' },
        { transform: `${turned} scale(1.04)`, offset: 0.15, easing: TURN_EASING },
        { transform: 'translate(0, 0) rotate(0deg) scale(1)' },
      ],
      timing,
    ),
    ...turning.map((node) =>
      node.animate(
        [{ rotate: '-90deg' }, { rotate: '-90deg', offset: 0.15, easing: TURN_EASING }, { rotate: '0deg' }],
        timing,
      ),
    ),
  ];
  spin.classList.remove('landed');

  // The copy is placed in pixels; when the viewport width changes the board moves away under it, so
  // the turn ends at once and the targets show without it.
  const resized = new AbortController();
  const local = AbortSignal.any([signal, resized.signal]);
  const listeners = new AbortController();
  const width = innerWidth;
  addEventListener('resize', () => innerWidth !== width && resized.abort(), { signal: listeners.signal });
  const stop = () => {
    animations.forEach((animation) => animation.cancel());
    spin.remove();
    column.forEach((cell) => cell.classList.remove('lifted'));
  };
  local.addEventListener('abort', stop, { once: true, signal: listeners.signal });
  try {
    await Promise.all(animations.map((animation) => animation.finished));
    spin.classList.add('landed');
    sum.classList.add('shown');
    await sleep(1300, local);
    spin.classList.add('leaving');
    land();
    await sleep(250, local);
  } catch (error) {
    if (signal.aborted || !resized.signal.aborted) throw error;
    land();
  } finally {
    listeners.abort();
    stop();
  }
}

/** The column lesson: shows, without asking anything, that a column is read like a row. */
const columns: Lesson = ({ root, done, signal }) => {
  const { stage, board, action, note } = parts(root);
  // The notes explain the turned column, so they wait until it has turned.
  const notes = [note('down'), note('target')];
  const showNotes = (shown: boolean) => notes.forEach((el) => (el.hidden = !shown));
  signal.addEventListener('abort', () => showNotes(false));
  let run: AbortController | undefined;
  let running = false;

  const hide = (hidden: boolean) => {
    for (const el of [...board.placesSide, ...board.colSums]) {
      el.classList.toggle('pending', hidden);
      el.classList.remove('arrive');
    }
  };
  // The copy carried its own place values; now they stay on the left edge, and the turned column's
  // target fades in where the copy fades out.
  const land = () => {
    board.placesSide.forEach(appear);
    appear(board.colSums[TURNED]!);
  };

  async function play() {
    run?.abort();
    run = new AbortController();
    const local = AbortSignal.any([signal, run.signal]);
    running = true;
    showNotes(false);
    // While it replays, Show again stays where it is, so focus does not get lost, but does nothing.
    action.setAttribute('aria-disabled', 'true');
    hide(true);
    try {
      if (reducedMotion.matches) land();
      else {
        await sleep(500, local);
        await turnColumn(stage, board, TURNED, local, land);
      }
      // The other targets follow from left to right; the copy's fade already gave the first its pause.
      const stagger = reducedMotion.matches ? 0 : 140;
      await Promise.all(
        board.colSums.filter((_, c) => c !== TURNED).map((sum, i) => sleep(i * stagger, local).then(() => appear(sum))),
      );
      showNotes(true);
      running = false;
      action.removeAttribute('aria-disabled');
      // Without motion there is nothing to show again.
      action.hidden = reducedMotion.matches;
      done();
    } catch {
      // Leaving the lesson or replaying it aborts the running animation.
    }
  }

  reducedMotion.addEventListener(
    'change',
    () => {
      if (!running) action.hidden = reducedMotion.matches;
    },
    { signal },
  );
  action.addEventListener(
    'click',
    () => {
      if (!running) void play();
    },
    { signal },
  );
  void play();
};

/** Switching one bit changes its row and its column at once. */
const twice: Lesson = ({ root, t, done }) => {
  const { board, feedback } = parts(root);
  let changed = false;
  board.addEventListener('bit-toggle', ({ detail: { r, c, solved } }) => {
    cross(board, r, c);
    if (!solved) {
      changed = true;
      feedback.textContent = t.crossOff;
      feedback.classList.add('hint');
      return;
    }
    if (!changed) return;
    cross(board);
    feedback.textContent = t.crossDone;
    feedback.classList.remove('hint');
    done();
  });
};

/** Solving ends the same way as in the game: the bits turn green in one wave. */
function win(stage: HTMLElement, board: BitBoard) {
  board.lock();
  stage.classList.add('solved');
}

/** One wrong bit: the player finds it where the wrong row and the wrong column cross. */
const fix: Lesson = ({ root, t, done, signal }) => {
  const { stage, board, feedback, note } = parts(root);
  // Both targets the wrong bit breaks get the pencil ring; the note's one arrow points at the column
  // target, because on a phone an arrow up to the row target would have to cross the targets below it.
  const wrong = note('wrong');
  const missing = [board.rowSums[WRONG_BIT.r]!, board.colSums[WRONG_BIT.c]!];
  for (const sum of missing) sum.classList.add('cross');
  signal.addEventListener('abort', () => {
    wrong.hidden = false;
    stage.classList.remove('solved');
  });
  board.addEventListener('bit-toggle', ({ detail: { solved } }) => {
    if (!solved) {
      // Every other bit was right: while one of them is switched, say so; once they are back, stop.
      const broken = board.bits.some((row, br) =>
        row.some((bit, bc) => (br !== WRONG_BIT.r || bc !== WRONG_BIT.c) && bit !== SMALL_GRID[br]![bc]),
      );
      feedback.textContent = broken ? t.fixWrong : '';
      feedback.classList.toggle('hint', broken);
      return;
    }
    wrong.hidden = true;
    for (const sum of missing) sum.classList.remove('cross');
    win(stage, board);
    feedback.textContent = t.fixed;
    feedback.classList.remove('hint');
    done();
  });
};

/** A whole 3-bit grid, the top row worked, the rest for the player: the game without the timer. */
const grid: Lesson = ({ root, t, done, signal }) => {
  const { stage, board, feedback } = parts(root);
  const solution = randomGrid(3);
  signal.addEventListener('abort', () => stage.classList.remove('solved'));
  board.addEventListener('bit-toggle', ({ detail: { solved } }) => {
    if (!solved) return;
    win(stage, board);
    feedback.textContent = t.solved;
    done();
  });
  // The page holds a fixed grid in its place; the worked top row and the targets come from the random one.
  solution[0]!.forEach((bit, c) => board.set(0, c, bit));
  board.setTargets(rowNumbers(solution), colNumbers(solution));
};

/** Every lesson by the name its step carries in `data-lesson`. */
export const lessons: Record<string, Lesson> = {
  one: counting(COUNTING.one),
  two: counting(COUNTING.two),
  three: counting(COUNTING.three),
  four: counting({ ...COUNTING.four, random: true, hint: true }),
  stack,
  columns,
  twice,
  fix,
  grid,
};
