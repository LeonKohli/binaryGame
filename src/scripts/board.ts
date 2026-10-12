import { boardText, pageLocale } from '../i18n';
import { placeValue, toNumber } from './bits';

/** Detail of the `bit-toggle` event a board fires after the player switched a bit and every sum is up to date. */
export interface Toggle {
  r: number;
  c: number;
  /** Whether every line matches now. */
  solved: boolean;
}

declare global {
  interface HTMLElementTagNameMap {
    'bit-board': BitBoard;
  }
  interface HTMLElementEventMap {
    'bit-toggle': CustomEvent<Toggle>;
  }
}

const t = boardText[pageLocale()];

/** A target as src/components/Board.astro renders it; one the browser has yet to deal has no `data-target`. */
const targetOf = (sum: HTMLElement) => Number(sum.dataset.target ?? Number.NaN);

function setTarget(sum: HTMLElement, target: number) {
  sum.dataset.target = String(target);
  sum.querySelector('[data-value]')!.textContent = String(target);
}

/** The bit an event happened on, if any. */
const bitAt = (target: EventTarget | null) =>
  target instanceof Element ? target.closest<HTMLButtonElement>('.bit') : null;

// Arrow keys move between bits so the grid is one tab stop.
const moves: Record<string, [number, number]> = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
};

/**
 * `<bit-board>`, the board src/components/Board.astro renders, made playable: a grid of bits with a
 * target at the end of every row and, optionally, under every column. The game, the lessons and the
 * demo on the home page all use it, so a lesson row looks exactly like one row of the game. Its state
 * is its markup, so a copy of the element is a copy of the board.
 */
export class BitBoard extends HTMLElement {
  /** A polite live region: after each switch it reads what the switch did to the bit's row and column. */
  live: HTMLElement | null = null;

  get rows() {
    return Number(this.dataset.rows);
  }

  get cols() {
    return Number(this.dataset.cols);
  }

  /** The bits' buttons, row by row. */
  get cells() {
    const all = [...this.querySelectorAll<HTMLButtonElement>('.bit')];
    return Array.from({ length: this.rows }, (_, r) => all.slice(r * this.cols, (r + 1) * this.cols));
  }

  get bits() {
    return this.cells.map((row) => row.map((cell) => (cell.getAttribute('aria-pressed') === 'true' ? 1 : 0)));
  }

  get rowSums() {
    return [...this.querySelectorAll<HTMLElement>('.sum.row')];
  }

  get colSums() {
    return [...this.querySelectorAll<HTMLElement>('.sum.col')];
  }

  get placesSide() {
    return [...this.querySelectorAll<HTMLElement>('.place.side')];
  }

  connectedCallback() {
    const { rows, cols } = this;
    // The win wave runs diagonally from the top-left bit on into the targets, one step past the last bit.
    this.cells.forEach((row, r) => row.forEach((cell, c) => cell.style.setProperty('--d', `${(r + c) * 45}ms`)));
    this.rowSums.forEach((sum, r) => sum.style.setProperty('--d', `${(r + cols) * 45}ms`));
    this.colSums.forEach((sum, c) => sum.style.setProperty('--d', `${(rows + c) * 45}ms`));
    this.addEventListener('click', this.#click);
    this.addEventListener('keydown', this.#keydown);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.#click);
    this.removeEventListener('keydown', this.#keydown);
  }

  rowValue(r: number) {
    return toNumber(this.bits[r]!);
  }

  colValue(c: number) {
    return toNumber(this.bits.map((row) => row[c]!));
  }

  /** Refreshes every sum; returns whether every line matches. */
  update() {
    let solved = true;
    const mark = (sum: HTMLElement, value: number) => {
      const target = targetOf(sum);
      const match = value === target;
      sum.querySelector('.current')!.textContent = String(value);
      sum.classList.toggle('over', value > target);
      if (sum.classList.contains('match') !== match) {
        sum.classList.toggle('match', match);
        sum.querySelector(':scope > .visually-hidden:last-child')!.textContent = match ? t.matches : '';
      }
      if (!match) solved = false;
    };
    this.rowSums.forEach((sum, r) => mark(sum, this.rowValue(r)));
    this.colSums.forEach((sum, c) => mark(sum, this.colValue(c)));
    const top = this.bits[0]!;
    this.querySelectorAll('.addend').forEach((addend, c) => {
      addend.textContent = top[c] ? String(placeValue(this.cols, c)) : '0';
      addend.classList.toggle('lit', top[c] === 1);
    });
    const total = this.querySelector('.total');
    if (total) {
      total.textContent = `= ${this.rowValue(0)}`;
      total.classList.toggle('match', this.rowSums[0]!.classList.contains('match'));
    }
    return solved;
  }

  set(r: number, c: number, bit: number) {
    const cell = this.cells[r]![c]!;
    cell.querySelector('.digit')!.textContent = String(bit);
    cell.setAttribute('aria-pressed', bit ? 'true' : 'false');
  }

  /** Gives the rows, and the columns if given, new targets: a new puzzle, or a lesson's next number. */
  setTargets(rowTargets: number[], colTargets: number[] = []) {
    const { rowSums, colSums } = this;
    rowTargets.forEach((target, r) => setTarget(rowSums[r]!, target));
    colTargets.forEach((target, c) => setTarget(colSums[c]!, target));
    this.update();
  }

  /** Switches every bit of row `r` off. */
  clearRow(r: number) {
    for (let c = 0; c < this.cols; c++) this.set(r, c, 0);
    this.update();
  }

  /** Stops the player from switching bits, for a solved or revealed grid. */
  lock() {
    for (const cell of this.cells.flat()) cell.setAttribute('aria-disabled', 'true');
  }

  override focus() {
    this.cells
      .flat()
      .find((cell) => cell.tabIndex === 0)
      ?.focus();
  }

  #describe(r: number, c: number) {
    const row = t.line(t.row(r + 1), this.rowValue(r), targetOf(this.rowSums[r]!));
    const colSum = this.colSums[c];
    return colSum ? `${row} ${t.line(t.column(c + 1), this.colValue(c), targetOf(colSum))}` : row;
  }

  #click = (event: MouseEvent) => {
    const cell = bitAt(event.target);
    if (!cell || cell.getAttribute('aria-disabled') === 'true') return;
    const r = Number(cell.dataset.r);
    const c = Number(cell.dataset.c);
    this.set(r, c, cell.getAttribute('aria-pressed') === 'true' ? 0 : 1);
    const solved = this.update();
    // A solved board is announced by the page's own verdict, so the region empties.
    if (this.live) this.live.textContent = solved ? '' : this.#describe(r, c);
    this.dispatchEvent(new CustomEvent('bit-toggle', { bubbles: true, detail: { r, c, solved } }));
  };

  #keydown = (event: KeyboardEvent) => {
    const cell = bitAt(event.target);
    const move = moves[event.key];
    if (!cell || !move) return;
    event.preventDefault();
    const r = (Number(cell.dataset.r) + move[0] + this.rows) % this.rows;
    const c = (Number(cell.dataset.c) + move[1] + this.cols) % this.cols;
    const next = this.cells[r]![c]!;
    cell.tabIndex = -1;
    next.tabIndex = 0;
    next.focus();
  };
}
