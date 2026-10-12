import { type LessonText, lessons } from './lessons';

const STORAGE_KEY = 'binary-game-learn';

// Storage is outside input: another tab, an old version or a person may have written anything there.
function loadDone(count: number): Set<number> {
  let data: unknown;
  try {
    data = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return new Set();
  }
  if (!Array.isArray(data)) return new Set();
  return new Set(data.filter((i): i is number => Number.isInteger(i) && i >= 0 && i < count));
}

/** How the URL has to change to show step `index`: any other spelling of the step is corrected. */
const urlFix = (index: number | undefined) =>
  location.hash && location.hash !== `#step-${(index ?? 0) + 1}` ? 'replace' : 'keep';

function saveDone(done: Set<number>) {
  try {
    if (done.size) localStorage.setItem(STORAGE_KEY, JSON.stringify([...done]));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be unavailable (private mode); the lessons work without it.
  }
}

/**
 * Shows the lessons one at a time, with a progress bar and Back and Next. Without JavaScript every
 * step stays visible, one under the other. The step is in the URL (`#step-3`), so a teacher can link to
 * it and the browser's Back button goes to the previous step. The sections themselves have other ids
 * (`lesson-3`), so opening such a link does not scroll past the page's heading.
 */
export function mountTutorial(root: HTMLElement, t: LessonText) {
  const steps = [...root.querySelectorAll<HTMLElement>('[data-lesson]')];
  const segments = [...root.querySelectorAll<HTMLAnchorElement>('[data-segment]')];
  const back = root.querySelector<HTMLButtonElement>('[data-back]')!;
  const next = root.querySelector<HTMLButtonElement>('[data-next]')!;
  const counter = root.querySelector<HTMLElement>('[data-counter]')!;
  const handoff = root.querySelector<HTMLElement>('[data-handoff]')!;
  const skip = root.querySelector<HTMLElement>('[data-skip]')!;
  const reset = root.querySelector<HTMLButtonElement>('[data-reset]')!;
  const firstGrid = steps.findIndex((step) => step.dataset.lesson === 'stack');
  const done = loadDone(steps.length);
  // Each lesson starts on its board as the page built it, so leaving a step puts a fresh copy back.
  const boards = steps.map((step) => step.querySelector('bit-board')!.cloneNode(true));
  let current = -1;
  let controller: AbortController | undefined;

  root.classList.add('stepped');

  /**
   * `push` adds a history entry, `replace` corrects the URL, `keep` leaves it as it is. `again` starts
   * the step over even when it is already showing.
   */
  function show(index: number, moveFocus: boolean, history: 'push' | 'replace' | 'keep' = 'push', again = false) {
    if (history === 'replace') window.history.replaceState(null, '', `#step-${index + 1}`);
    if (index === current && !again) return;
    controller?.abort();
    steps[current]?.querySelector('bit-board')!.replaceWith(boards[current]!.cloneNode(true));
    current = index;
    steps.forEach((step, i) => (step.hidden = i !== index));
    segments.forEach((segment, i) => {
      markDone(i, done.has(i));
      if (i === index) segment.setAttribute('aria-current', 'step');
      else segment.removeAttribute('aria-current');
    });
    counter.textContent = t.step(index + 1, steps.length);
    back.disabled = index === 0;
    next.hidden = index === steps.length - 1;
    handoff.hidden = !next.hidden;
    // Once at the grid, there is nothing left to skip.
    skip.hidden = index >= firstGrid;
    ready(done.has(index));
    reset.hidden = done.size === 0;
    if (history === 'push') window.history.pushState(null, '', `#step-${index + 1}`);

    const step = steps[index]!;
    // A lesson starts fresh every time it is shown: no verdict and no button left from the last visit.
    const feedback = step.querySelector<HTMLElement>('[data-feedback]')!;
    feedback.textContent = '';
    feedback.classList.remove('hint');
    step.querySelector<HTMLElement>('[data-action]')!.hidden = true;
    step.querySelector<HTMLElement>('[data-live]')!.textContent = '';
    controller = new AbortController();
    lessons[step.dataset.lesson!]?.({
      root: step,
      t,
      signal: controller.signal,
      done: () => {
        done.add(index);
        saveDone(done);
        markDone(index, true);
        ready(true);
        reset.hidden = false;
        // On a short screen the verdict can end up under the sticky Back and Next; the page's
        // scroll-padding keeps it clear of them. The column lesson has no verdict, so it does not scroll.
        if (feedback.textContent) feedback.scrollIntoView({ block: 'nearest' });
      },
    });
    if (moveFocus) arrive();
  }

  /** Puts the reader at the current step's heading, as a page change would. */
  function arrive() {
    steps[current]?.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
    if (root.getBoundingClientRect().top < 0) root.scrollIntoView({ block: 'start' });
  }

  /** Colours a finished step's segment and adds "done" to its name. */
  function markDone(i: number, isDone: boolean) {
    const segment = segments[i]!;
    segment.classList.toggle('done', isDone);
    segment.querySelector<HTMLElement>('[data-done]')!.hidden = !isDone;
  }

  // Next stays quiet until the lesson is done, then becomes the main button; it is never locked.
  function ready(isReady: boolean) {
    next.classList.toggle('ready', isReady);
    next.classList.toggle('primary', isReady);
    next.classList.toggle('secondary', !isReady);
  }

  // `#step-3` is the step's address; `#lesson-3`, the section's id, works too, as in a link copied
  // from the progress bar.
  const fromHash = () => {
    const n = Number(/^#(?:step|lesson)-(\d+)$/.exec(location.hash)?.[1]);
    return n >= 1 && n <= steps.length ? n - 1 : undefined;
  };

  back.addEventListener('click', () => show(Math.max(current - 1, 0), true));
  next.addEventListener('click', () => show(Math.min(current + 1, steps.length - 1), true));
  segments.forEach((segment, i) =>
    segment.addEventListener('click', (event) => {
      event.preventDefault();
      show(i, true);
    }),
  );
  // Forgets every finished step and starts the first lesson over.
  reset.addEventListener('click', () => {
    done.clear();
    saveDone(done);
    show(0, true, current === 0 ? 'keep' : 'push', true);
  });
  skip.addEventListener('click', (event) => {
    event.preventDefault();
    show(firstGrid, true);
  });
  // Back and Forward in the browser, and links to a step from elsewhere on the page.
  const followUrl = () => {
    const index = fromHash();
    const change = urlFix(index);
    show(index ?? 0, true, change);
    // For a link to a section (`#lesson-3`) the browser scrolls to it and moves focus away after this
    // runs, so the reader is put back once it has.
    if (change === 'replace') requestAnimationFrame(arrive);
  };
  window.addEventListener('popstate', followUrl);
  window.addEventListener('hashchange', followUrl);

  // A link to a step opens that step. Otherwise the reader goes on where they left off: at the first
  // step not finished yet, or the last step once all are. The first step needs no hash; a hash that
  // names no step is corrected.
  const initial = fromHash();
  if (initial !== undefined || !done.size) show(initial ?? 0, false, urlFix(initial));
  else {
    const open = steps.findIndex((_, i) => !done.has(i));
    show(open === -1 ? steps.length - 1 : open, false, 'replace');
  }
}
