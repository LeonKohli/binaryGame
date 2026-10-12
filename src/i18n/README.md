# Languages and copy

The site is in English and German. All copy lives in this folder, and `en.ts` is the source that
every other language must match.

## Change or add text

1. Add the string to `en.ts`, then to `de.ts`. `bun run check` fails if a language misses a key.
2. Put text that contains a number or a name in a function, such as `solved: (time) => …`, so each
   language can order its words. Never join sentence fragments in a component.
3. For a count, write both forms in the function. A language with more plural forms can use
   `Intl.PluralRules`:

   ```ts
   streak: (days: number) => (days === 1 ? '1 day in a row' : `${days} days in a row`), // en.ts
   streak: (days: number) => (days === 1 ? '1 Tag in Folge' : `${days} Tage in Folge`), // de.ts
   ```

4. Client scripts get their strings as an argument: `mountGame(root, gameText[pageLocale()])`.
   If a script needs a new group, add the group to `en.ts` as its own export and add a map for it in
   `index.ts`. The page then loads only that group, not the whole dictionary.

## Add a page

Create it in `src/pages/[...lang]/` and export `getStaticPaths = localePaths`. Astro then builds it
once per language. Pass `locale` and `path` (the URL below the language prefix, such as
`'learn/'`) to `Base`, so the page gets its `lang`, canonical and `hreflang` links.

## Add a language

1. Copy `en.ts` to `xx.ts` and translate it. Set `ogLocale` (`xx_XX`) and `languageName`, the
   language's name in that language.
2. Add `'xx'` to `locales` in `locales.ts`.
3. Run `bun run check`. The type check lists the lines in `index.ts` that need the new language.

The routes, the sitemap, the `hreflang` links, the share image, the language link in the header and
the 404 page all take the new language from that list.

## Voice

Both languages: short sentences, one idea each. Write what to do, not how the interface works.
Use digits for numbers (`4 bits`, `0 to 15`). Use the same term for the same thing everywhere, as
the glossary lists it.

### English

- Address the reader as "you". Use sentence case for headings and buttons.
- Buttons and links start with a verb: "Show solution", "Play with 4 bits".

### German

- Address the reader as "du", in lowercase. The site is a game and a learning page for school
  students, and German games and learning apps use "du".
- Write buttons and links without addressing anyone, in the infinitive: "Lösung zeigen",
  "Mit 4 Bit spielen", "Noch einmal zählen". Use the imperative only in running text.
- Write the imperative with `-e` ("Stelle", "Setze", "Fange … an"). Verbs that change their stem
  vowel have no `-e`: "Lies", "Nimm".
- After a numeral, "Bit" is a unit and stays singular: "4 Bit", "8-Bit-Raster". In running text
  without a numeral, the plural is "Bits": "vier Bits", "Mit n Bits".
- Put a non-breaking space (`\u00a0` in the string) between a number and its unit, so "4 Bit" never wraps.
- Translate the meaning, not the words. "New to binary?" becomes "Binärzahlen sind neu für dich?",
  not "Neu bei Binärzahlen?".

## Glossary

| English         | German                    | Note                                             |
| --------------- | ------------------------- | ------------------------------------------------ |
| Binary Game     | Binary Game               | Name, never translated. "das Binary Game".       |
| bit             | Bit, pl. Bits             | "4 Bit" after a numeral.                         |
| switch on / off | einschalten / ausschalten | The state is "an" / "aus".                       |
| place value     | Stellenwert               |                                                  |
| binary number   | Binärzahl                 | "Dualsystem" once on the learn page, for search. |
| decimal number  | Dezimalzahl               |                                                  |
| target          | Ziel                      | "Zeilenziel", "Spaltenziel".                     |
| row / column    | Zeile / Spalte            |                                                  |
| grid            | Raster                    | The board.                                       |
| puzzle          | Rätsel                    | One round in the game.                           |
| game            | Spiel                     | The whole app.                                   |
| solution        | Lösung                    |                                                  |
| best time       | Bestzeit                  |                                                  |
| daily puzzle    | Tagesrätsel               | "Tagesrätsel Nr. 12".                            |
| in a row        | in Folge                  | The streak: "3 Tage in Folge".                   |
| powers of two   | Zweierpotenzen            |                                                  |
