# Binary Game

A browser puzzle for practicing decimal to binary conversion. Switch bits on until every row and column of the grid adds up to its decimal target.

Play it at [binary.leonkohli.dev](https://binary.leonkohli.dev), in English or German.

## What it has

- A short tutorial that goes from one bit to a whole grid, plus a 0–15 table and answers to common questions.
- Grids from 3 bits (0–7) to 8 bits (0–255), with your best time for each size.
- A daily puzzle that is the same for every player, with a streak you can share.
- Keyboard play: the arrow keys move between bits, and Space switches one.

It needs no account, shows no ads, and loads nothing from other sites. Best times and the streak stay in your browser.

## Run it locally

The site is a static [Astro](https://astro.build) site. You need [Bun](https://bun.sh).

```sh
bun install
bun run dev      # http://localhost:4321
```

Before you open a pull request, run the checks:

```sh
bun run check    # type-check, lint and check formatting
bun run test     # unit tests
bun run build    # build the static site to dist/
```

`bun run fix` applies lint fixes and formats the code. The rules for copy and translations are in [Languages and copy](src/i18n/README.md).

## Deployment

Pushing to `main` deploys the site to Cloudflare Workers through Workers Builds. `wrangler.jsonc` serves `dist/` as static files on `binary.leonkohli.dev`.

## Feedback

Found a bug or have an idea? [Open an issue](https://github.com/LeonKohli/binaryGame/issues).

## License

[MIT](LICENSE)
