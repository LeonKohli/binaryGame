// English is the source language: src/i18n/index.ts checks every other locale against these shapes.

export const site = {
  ogLocale: 'en_US',
  languageName: 'English',
  // Describes the image drawn in src/pages/[...lang]/og.png.ts.
  imageAlt:
    'A solved 4-bit Binary Game grid: the bits that are on in each row and column add up to the green number beside or below it.',
  ogTagline: 'Practice converting decimal to binary, one bit at a time.',
  nav: { label: 'Main', play: 'Play', learn: 'Learn' },
  source: 'Source code on GitHub',
};

/** The home page: what the game is, a row to try, and the way in. */
export const home = {
  title: 'Binary Game: practice converting decimal to binary',
  description:
    'Free binary puzzle in your browser. Switch bits on until every row and column matches its decimal number. Learn it in 2\u00a0minutes, then play 3-bit to 8-bit grids. No sign-up.',
  teaches: 'Converting numbers between decimal and binary',
  heading: 'Binary, one bit at a time.',
  lede: 'Switch bits on until they add up to the number. Then do it on a whole grid, where every row and every column has to match.',
  demo: 'Try it',
  notes: { tap: 'tap a bit', target: 'the target', sum: 'your sum' },
  play: 'Play',
  learn: 'Learn it in 2\u00a0minutes',
  grid: {
    heading: 'Then the grid',
    text: 'In the game, every row and every column is a binary number. One bit counts for both.',
    notes: { rows: 'read rows across', cols: 'read columns down' },
  },
  facts: 'Free, no account, no ads. 3 to 8\u00a0bits.',
};

/** The game page. */
export const play = {
  title: 'Play the Binary Game',
  sizeTitle: (n: number) => `Play the Binary Game with ${n}\u00a0bits`,
  description:
    'Switch bits on until every row and column of the grid matches its decimal number. 3-bit to 8-bit grids, best times saved in your browser.',
  heading: 'Play',
  lede: 'Switch bits on until every row and column matches its target. The small number is your sum.',
  puzzle: 'Puzzle',
  sizes: 'Bits',
  // Names the size picker for screen readers; the visible label is `sizes`.
  sizesNav: 'Grid size',
  size: (n: number) => `${n}\u00a0bits`,
  bits: 'Bits',
  noscript: 'The puzzle needs JavaScript.',
  noscriptLink: 'Learn how binary works',
  noscriptAfter: ' instead.',
  newPuzzle: 'New puzzle',
  showSolution: 'Show solution',
};

/** Labels the board script writes for screen readers, in the game and in every lesson. */
export const board = {
  cell: (row: number, col: number) => `Row ${row}, column ${col}`,
  row: (n: number) => `Row ${n}`,
  column: (n: number) => `Column ${n}`,
  // Screen readers hear a target as "Row 1 target 13, now 9, matches".
  target: (line: string) => `${line} target `,
  now: ', now ',
  matches: ', matches',
  // Read out after every switch, for the row and the column of that bit.
  line: (line: string, now: number, target: number) =>
    now === target ? `${line} matches ${target}.` : `${line}: ${now} of ${target}.`,
  bitWorth: (value: number) => `Bit worth ${value}`,
};

/** Strings the game script writes at runtime. */
export const game = {
  best: (time: string) => `Best ${time}`,
  newPuzzle: (size: number) => `New ${size}-bit puzzle.`,
  solution: 'Here is the solution. Read each row as a binary number.',
  solved: (time: string) => `Solved in ${time}.`,
  newBest: 'New best time!',
  yourBest: (time: string) => `Your best is ${time}.`,
  next: 'Next puzzle',
  bigger: (size: number) => `Play with ${size}\u00a0bits`,
};

/** The daily puzzle: the page and the strings its script writes. */
export const daily = {
  title: 'Daily binary puzzle',
  description:
    'One 5-bit binary puzzle a day, the same for everyone. Switch bits on until every row and column matches, keep your streak going and share your time.',
  heading: 'Daily puzzle',
  lede: 'Today’s puzzle is the same for everyone. Switch bits on until every row and column matches its target.',
  link: 'Today’s puzzle',
  // The page is built before the day is known; the script fills in the number.
  label: 'Daily',
  number: (n: number) => `Daily #${n}`,
  streak: (days: number) => (days === 1 ? '1 day in a row' : `${days} days in a row`),
  solved: (time: string) => `Solved in ${time}.`,
  done: (time: string) => `You solved today’s puzzle in ${time}.`,
  next: 'A new puzzle comes at midnight.',
  share: 'Share',
  copied: 'Copied. Paste it anywhere.',
  shareText: (n: number, time: string, streak: number) =>
    `Binary Game daily #${n} · 5\u00a0bits · ${time} · 🔥 ${streak}`,
  more: 'Play more puzzles',
};

/** Strings the lessons and the home page demo write at runtime. */
export const lesson = {
  correct: 'That’s it.',
  counted: (target: number) => `You counted to ${target} in binary.`,
  again: 'Count again',
  next: (target: number) => `Now make ${target}`,
  another: 'Try another number',
  stacked: 'Each row is its own number.',
  crossOff: 'Its row and its column both changed. Switch it back.',
  fixWrong: 'That bit was right. Switch it back and try where the two cross.',
  crossDone: 'Every bit counts twice: once across, once down.',
  fixed: 'Found it. Its row and its column match again.',
  solved: 'Solved. You’re ready for the game.',
  step: (n: number, of: number) => `Step ${n} of ${of}`,
};

export const learn = {
  title: 'Learn binary numbers step by step',
  description:
    'Learn to count in binary with bits you can switch on and off, then read a whole grid of binary numbers. Includes a 0–15 table and answers to common questions.',
  heading: 'Learn binary',
  lede: '9 short steps, from one bit to your first grid. About 2\u00a0minutes.',
  parts: ['Count in binary', 'Read the grid'],
  back: 'Back',
  next: 'Next',
  skip: 'Skip to rows and columns',
  // Clears the finished steps and goes back to step 1.
  reset: 'Start over',
  replay: 'Show again',
  playSmall: 'Play with 3\u00a0bits',
  playBig: 'Play with 4\u00a0bits',
  progress: 'Steps',
  // Visually hidden after a finished step in the progress bar.
  done: ', done',
  // One entry per lesson in src/scripts/lessons.ts, in the order the page shows them.
  steps: {
    one: {
      title: 'One bit',
      text: 'A bit is a switch: off is 0, on is 1. Switch it on to match the target on the right.',
      notes: { tap: 'tap to switch', target: 'the target' },
    },
    two: {
      title: 'Two bits',
      text: 'The left bit is worth 2, twice the right one. Add up the bits that are on: two bits count from 0 to\u00a03. Make each target.',
      notes: { place: 'worth double' },
    },
    three: {
      title: 'Three bits',
      text: 'The next bit is worth 4, so three bits reach 7. Count from 4 to 7: the 4 stays on while the other two bits count again.',
      notes: {},
    },
    four: {
      title: 'Four bits',
      text: '8, 4, 2 and 1: four bits reach 15. Start with the biggest bit that fits into the number, then make the rest with the smaller ones.',
      notes: { biggest: 'biggest that fits' },
    },
    stack: {
      title: 'A second row',
      text: 'Now there are two rows. The top one is done. Make 9 in the bottom one. The small number in the target is your sum. It turns orange when you go over.',
      notes: { sum: 'your sum' },
    },
    columns: {
      title: 'Columns are numbers too',
      text: 'Read each column from top to bottom, like a row turned on its side. Its place values now run down the left side, and its target is underneath.',
      notes: { down: 'the top bit is worth 2', target: 'column target' },
    },
    twice: {
      title: 'One bit, two numbers',
      text: 'Every bit sits in one row and one column. Switch any bit and watch both of its targets.',
      notes: {},
    },
    fix: {
      title: 'Find the wrong bit',
      text: 'One bit is wrong, so one row and one column miss their targets. The wrong bit is where they cross.',
      notes: { wrong: 'these two miss' },
    },
    grid: {
      title: 'Your first grid',
      text: 'The top row is done. Finish the other two, and the columns check your work.',
      notes: {},
    },
  },

  table: {
    heading: 'Binary numbers from 0 to 15',
    decimal: 'Decimal',
    binary: 'Binary',
    sum: 'Sum of place values',
  },
  systems: {
    heading: 'Decimal and binary',
    intro:
      'Decimal numbers use ten digits, and every place is worth ten times the one to its right. Binary uses only 0 and 1, and every place is worth twice the one to its right: 1, 2, 4, 8, 16 and so on.',
    // The page appends the result, 1101, in bold.
    example:
      'To write 13 in binary, take the largest place value that fits: 8, which leaves 5. Next, 4 fits, which leaves 1. The 2 does not fit, so that bit is 0. The 1 fits. Read the bits from left to right:',
    back: 'To go back, add up the place values of every 1: 1101 is 8 + 4 + 1 = 13.',
  },
  tips: {
    heading: 'Tips for faster solving',
    items: [
      'Odd numbers always end in 1, even numbers in 0. Set the last bit first.',
      'The first bit is on when the number is at least its place value: 8 or more with four bits.',
      'Learn the powers of two by heart: 1, 2, 4, 8, 16, 32, 64, 128.',
    ],
  },
  faqHeading: 'Questions',
  faq: [
    {
      q: 'How do you convert a decimal number to binary?',
      a: 'Start with the largest place value that fits into the number and switch that bit on. Subtract it, then repeat with the remainder for the next smaller place values. Every place value you used is a 1, every one you skipped is a 0. For example, 13 = 8 + 4 + 1, so 13 in binary is 1101.',
    },
    {
      q: 'How do you convert binary to decimal?',
      a: 'Write the place values over the bits, from 1 on the right and doubling to the left. Add up the place values of every bit that is 1. For example, 1011 is 8 + 2 + 1 = 11.',
    },
    {
      q: 'What is the largest number n bits can show?',
      a: 'With n bits you can show numbers from 0 to 2ⁿ − 1. Four bits go up to 15, six bits to 63 and eight bits (one byte) to 255.',
    },
    {
      q: 'Why does the game have column targets as well?',
      a: 'The row targets alone decide the answer, because every number has exactly one binary form. The column targets read the same bits from top to bottom. One wrong bit breaks both its row and its column, so you find it where the two cross.',
    },
    {
      q: 'Can I use the Binary Game in class?',
      a: 'Yes. It is free, needs no account or installation and works on phones, tablets and projectors. Start with this page, then play with 4\u00a0bits and move up once the place values feel familiar.',
    },
  ],
};

export const notFound = {
  title: 'Page not found · Binary Game',
  description: 'This page does not exist.',
  heading: 'Page not found',
  text: 'There is nothing at this address.',
  play: 'Play the Binary Game',
  or: ' or ',
  learn: 'learn how binary works',
};
