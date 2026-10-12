// Rules and glossary for this copy: src/i18n/README.md.

export const site = {
  ogLocale: 'de_DE',
  languageName: 'Deutsch',
  imageAlt:
    'Ein gelöstes 4-Bit-Raster im Binary Game: Die eingeschalteten Bits jeder Zeile und Spalte ergeben die grüne Zahl daneben oder darunter.',
  ogTagline: 'Dezimalzahlen in Binärzahlen umrechnen, Bit für Bit.',
  nav: { label: 'Hauptnavigation', play: 'Spielen', learn: 'Lernen' },
  source: 'Quellcode auf GitHub',
};

export const home = {
  title: 'Binary Game: Binärzahlen umrechnen üben',
  description:
    'Kostenloses Rätsel zu Binärzahlen im Browser. Schalte Bits ein, bis jede Zeile und Spalte ihre Dezimalzahl ergibt. In 2\u00a0Minuten gelernt, dann Raster von 3 bis 8\u00a0Bit. Ohne Anmeldung.',
  teaches: 'Zahlen zwischen Dezimal- und Binärsystem umrechnen',
  heading: 'Binärzahlen, Bit für Bit.',
  lede: 'Schalte Bits ein, bis sie die Zahl ergeben. Danach füllst du ein ganzes Raster, in dem jede Zeile und jede Spalte stimmen muss.',
  demo: 'Ausprobieren',
  notes: { tap: 'tippe ein Bit an', target: 'das Ziel', sum: 'deine Summe' },
  play: 'Spielen',
  learn: 'In 2\u00a0Minuten lernen',
  grid: {
    heading: 'Dann das Raster',
    text: 'Im Spiel ist jede Zeile und jede Spalte eine Binärzahl. Ein Bit zählt für beide.',
    notes: { rows: 'Zeilen quer lesen', cols: 'Spalten nach unten lesen' },
  },
  facts: 'Kostenlos, ohne Konto, ohne Werbung. 3 bis 8\u00a0Bit.',
};

export const play = {
  title: 'Binary Game spielen',
  sizeTitle: (n: number) => `Binary Game mit ${n}\u00a0Bit spielen`,
  description:
    'Schalte Bits ein, bis jede Zeile und Spalte des Rasters ihre Dezimalzahl ergibt. Raster von 3 bis 8\u00a0Bit, Bestzeiten bleiben in deinem Browser.',
  heading: 'Spielen',
  lede: 'Schalte Bits ein, bis jede Zeile und jede Spalte ihr Ziel trifft. Die kleine Zahl ist deine Summe.',
  puzzle: 'Rätsel',
  sizes: 'Bits',
  sizesNav: 'Rastergröße',
  size: (n: number) => `${n}\u00a0Bit`,
  bits: 'Bits',
  noscript: 'Das Rätsel braucht JavaScript.',
  noscriptLink: 'Lerne stattdessen, wie Binärzahlen funktionieren',
  noscriptAfter: '.',
  newPuzzle: 'Neues Rätsel',
  showSolution: 'Lösung zeigen',
};

export const board = {
  cell: (row: number, col: number) => `Zeile ${row}, Spalte ${col}`,
  row: (n: number) => `Zeile ${n}`,
  column: (n: number) => `Spalte ${n}`,
  // Screen readers hear a target as "Zeile 1, Ziel 13, aktuell 9, stimmt".
  target: (line: string) => `${line}, Ziel `,
  now: ', aktuell ',
  matches: ', stimmt',
  line: (line: string, now: number, target: number) =>
    now === target ? `${line} stimmt: ${target}.` : `${line}: ${now} von ${target}.`,
  bitWorth: (value: number) => `Bit mit Wert ${value}`,
};

export const game = {
  best: (time: string) => `Bestzeit ${time}`,
  newPuzzle: (size: number) => `Neues ${size}-Bit-Rätsel.`,
  solution: 'Hier ist die Lösung. Lies jede Zeile als Binärzahl.',
  solved: (time: string) => `Gelöst in ${time}.`,
  newBest: 'Neue Bestzeit!',
  yourBest: (time: string) => `Deine Bestzeit ist ${time}.`,
  next: 'Nächstes Rätsel',
  bigger: (size: number) => `Mit ${size}\u00a0Bit spielen`,
};

export const daily = {
  title: 'Tägliches Binär-Rätsel',
  description:
    'Jeden Tag ein Binär-Rätsel mit 5\u00a0Bit, für alle gleich. Schalte Bits ein, bis jede Zeile und Spalte stimmt, halte deine Serie und teile deine Zeit.',
  heading: 'Tagesrätsel',
  lede: 'Das heutige Rätsel ist für alle gleich. Schalte Bits ein, bis jede Zeile und jede Spalte ihr Ziel trifft.',
  link: 'Rätsel des Tages',
  label: 'Tagesrätsel',
  number: (n: number) => `Tagesrätsel Nr.\u00a0${n}`,
  streak: (days: number) => (days === 1 ? '1 Tag in Folge' : `${days} Tage in Folge`),
  solved: (time: string) => `Gelöst in ${time}.`,
  done: (time: string) => `Du hast das heutige Rätsel in ${time} gelöst.`,
  next: 'Um Mitternacht kommt ein neues Rätsel.',
  share: 'Teilen',
  copied: 'Kopiert. Füge es ein, wo du magst.',
  shareText: (n: number, time: string, streak: number) =>
    `Binary Game Tagesrätsel Nr.\u00a0${n} · 5\u00a0Bit · ${time} · 🔥 ${streak}`,
  more: 'Weitere Rätsel spielen',
};

export const lesson = {
  correct: 'Richtig.',
  counted: (target: number) => `Du hast binär bis ${target} gezählt.`,
  again: 'Noch einmal zählen',
  next: (target: number) => `Jetzt die ${target} bilden`,
  another: 'Andere Zahl probieren',
  stacked: 'Jede Zeile ist ihre eigene Zahl.',
  crossOff: 'Zeile und Spalte haben sich beide geändert. Schalte das Bit zurück.',
  fixWrong: 'Dieses Bit war richtig. Schalte es zurück und probiere es dort, wo sich die beiden kreuzen.',
  crossDone: 'Jedes Bit zählt doppelt: einmal quer, einmal nach unten.',
  fixed: 'Gefunden. Zeile und Spalte stimmen wieder.',
  solved: 'Gelöst. Du bist bereit für das Spiel.',
  step: (n: number, of: number) => `Schritt ${n} von ${of}`,
};

export const learn = {
  title: 'Binärzahlen Schritt für Schritt lernen',
  description:
    'Lerne mit Bits zum Ein- und Ausschalten, binär zu zählen, und lies danach ein ganzes Raster aus Binärzahlen. Mit Tabelle von 0 bis 15 und Antworten auf häufige Fragen.',
  heading: 'Binärzahlen lernen',
  lede: '9 kurze Schritte, vom ersten Bit bis zu deinem ersten Raster. Etwa 2\u00a0Minuten.',
  parts: ['Binär zählen', 'Das Raster lesen'],
  back: 'Zurück',
  next: 'Weiter',
  skip: 'Direkt zu Zeilen und Spalten',
  reset: 'Von vorn beginnen',
  replay: 'Noch einmal zeigen',
  playSmall: 'Mit 3\u00a0Bit spielen',
  playBig: 'Mit 4\u00a0Bit spielen',
  progress: 'Schritte',
  done: ', erledigt',
  steps: {
    one: {
      title: 'Ein Bit',
      text: 'Ein Bit ist ein Schalter: aus ist 0, an ist 1. Schalte es ein, damit es das Ziel rechts trifft.',
      notes: { tap: 'antippen', target: 'das Ziel' },
    },
    two: {
      title: 'Zwei Bits',
      text: 'Das linke Bit ist 2 wert, doppelt so viel wie das rechte. Addiere die Bits, die an sind: Mit zwei Bits zählst du von 0 bis\u00a03. Triff jedes Ziel.',
      notes: { place: 'doppelt so viel' },
    },
    three: {
      title: 'Drei Bits',
      text: 'Das nächste Bit ist 4 wert, also reichen drei Bits bis 7. Zähle von 4 bis 7: Die 4 bleibt an, während die anderen beiden noch einmal zählen.',
      notes: {},
    },
    four: {
      title: 'Vier Bits',
      text: '8, 4, 2 und 1: Vier Bits reichen bis 15. Fange mit dem größten Bit an, das in die Zahl passt, und bilde den Rest mit den kleineren.',
      notes: { biggest: 'das größte, das passt' },
    },
    stack: {
      title: 'Eine zweite Zeile',
      text: 'Jetzt gibt es zwei Zeilen. Die obere ist fertig. Bilde in der unteren die 9. Die kleine Zahl im Ziel ist deine Summe. Sie wird orange, wenn du darüber liegst.',
      notes: { sum: 'deine Summe' },
    },
    columns: {
      title: 'Auch Spalten sind Zahlen',
      text: 'Lies jede Spalte von oben nach unten, wie eine gedrehte Zeile. Die Stellenwerte der Spalte stehen jetzt links, ihr Ziel steht darunter.',
      notes: { down: 'oben ist 2 wert', target: 'Spaltenziel' },
    },
    twice: {
      title: 'Ein Bit, zwei Zahlen',
      text: 'Jedes Bit liegt in einer Zeile und in einer Spalte. Schalte irgendein Bit um und achte auf beide Ziele.',
      notes: {},
    },
    fix: {
      title: 'Finde das falsche Bit',
      text: 'Ein Bit ist falsch, deshalb verfehlen eine Zeile und eine Spalte ihr Ziel. Das falsche Bit liegt dort, wo sie sich kreuzen.',
      notes: { wrong: 'stimmen nicht' },
    },
    grid: {
      title: 'Dein erstes Raster',
      text: 'Die oberste Zeile ist fertig. Löse die beiden anderen. Die Spalten zeigen dir, ob es stimmt.',
      notes: {},
    },
  },

  table: {
    heading: 'Binärzahlen von 0 bis 15',
    decimal: 'Dezimal',
    binary: 'Binär',
    sum: 'Summe der Stellenwerte',
  },
  systems: {
    heading: 'Dezimal- und Binärsystem',
    intro:
      'Dezimalzahlen nutzen zehn Ziffern, und jede Stelle ist zehnmal so viel wert wie die rechts daneben. Das Binärsystem, auch Dualsystem genannt, kennt nur 0 und 1, und jede Stelle ist doppelt so viel wert wie die rechts daneben: 1, 2, 4, 8, 16 und so weiter.',
    example:
      'Um 13 binär zu schreiben, nimm den größten Stellenwert, der passt: 8, bleibt 5. Als Nächstes passt 4, bleibt 1. Die 2 passt nicht, also ist dieses Bit 0. Die 1 passt. Lies die Bits von links nach rechts:',
    back: 'Für den Rückweg addierst du die Stellenwerte aller Einsen: 1101 ist 8 + 4 + 1 = 13.',
  },
  tips: {
    heading: 'Tipps zum schnelleren Lösen',
    items: [
      'Ungerade Zahlen enden immer auf 1, gerade auf 0. Setze deshalb zuerst das letzte Bit.',
      'Das erste Bit ist an, wenn die Zahl mindestens so groß ist wie sein Stellenwert: bei vier Bits ab 8.',
      'Lerne die Zweierpotenzen auswendig: 1, 2, 4, 8, 16, 32, 64, 128.',
    ],
  },
  faqHeading: 'Häufige Fragen',
  faq: [
    {
      q: 'Wie rechnet man eine Dezimalzahl in eine Binärzahl um?',
      a: 'Beginne mit dem größten Stellenwert, der in die Zahl passt, und schalte dieses Bit ein. Ziehe ihn ab und mache mit dem Rest bei den nächstkleineren Stellenwerten weiter. Jeder genutzte Stellenwert ist eine 1, jeder übersprungene eine 0. Beispiel: 13 = 8 + 4 + 1, also ist 13 binär 1101.',
    },
    {
      q: 'Wie rechnet man eine Binärzahl in eine Dezimalzahl um?',
      a: 'Schreibe die Stellenwerte über die Bits: ganz rechts 1, nach links jeweils doppelt so viel. Addiere dann die Stellenwerte aller Bits, die 1 sind. Beispiel: 1011 ist 8 + 2 + 1 = 11.',
    },
    {
      q: 'Welche Zahl können n Bits höchstens darstellen?',
      a: 'Mit n Bits stellst du die Zahlen von 0 bis 2ⁿ − 1 dar. Vier Bits reichen bis 15, sechs bis 63 und acht Bits (ein Byte) bis 255.',
    },
    {
      q: 'Warum hat das Spiel auch Ziele für die Spalten?',
      a: 'Die Zeilenziele allein legen die Lösung schon fest, denn jede Zahl hat genau eine Binärdarstellung. Die Spaltenziele lesen dieselben Bits von oben nach unten. Ein falsches Bit verfälscht seine Zeile und seine Spalte. Du findest es also dort, wo sich beide kreuzen.',
    },
    {
      q: 'Kann ich das Binary Game im Unterricht nutzen?',
      a: 'Ja. Es ist kostenlos, braucht weder Konto noch Installation und läuft auf Handys, Tablets und Beamern. Am besten startet die Klasse mit dieser Seite, spielt dann mit 4\u00a0Bit und steigt auf, sobald die Stellenwerte sitzen.',
    },
  ],
};

export const notFound = {
  title: 'Seite nicht gefunden · Binary Game',
  description: 'Diese Seite gibt es nicht.',
  heading: 'Seite nicht gefunden',
  text: 'Unter dieser Adresse gibt es nichts.',
  play: 'Spiele das Binary Game',
  or: ' oder ',
  learn: 'lerne, wie Binärzahlen funktionieren',
};
