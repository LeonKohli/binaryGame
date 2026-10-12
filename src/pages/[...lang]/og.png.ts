import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import type { APIRoute } from 'astro';
import satori from 'satori';
import sharp from 'sharp';
import { type Locale, localePaths, useTranslations } from '../../i18n';
import { dark } from '../../theme';

// The share image is drawn from code so it stays in step with the game.
// Each row is a binary number read left to right, each column one read top to bottom.
const bits = [
  [1, 1, 0, 1],
  [0, 1, 1, 0],
  [1, 0, 0, 1],
  [0, 1, 1, 1],
];
const places = bits.map((_, i) => 2 ** (bits.length - 1 - i));
const value = (line: number[]) => line.reduce((sum, bit, i) => sum + bit * places[i]!, 0);
const rowTargets = bits.map(value);
const colTargets = places.map((_, c) => value(bits.map((row) => row[c]!)));

const cell = 80;
const gap = 12;
const label = 40;

type Style = Record<string, string | number>;
type Node = { type: string; props: { style?: Style; children?: Child } };
type Child = Node | string | number | Child[];

const h = (style: Style, children?: Child): Node => ({
  type: 'div',
  props: { style: { display: 'flex', ...style }, children },
});

const placeLabel = (n: number, style: Style = {}) =>
  h({ color: dark.muted, fontSize: 24, justifyContent: 'center', alignItems: 'center', ...style }, n);

// Every bit and target is a tile of the same shape.
const tile = (style: Style, n: number) =>
  h(
    {
      width: cell,
      height: cell,
      borderRadius: cell * 0.2,
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Rubik',
      ...style,
    },
    n,
  );

const bit = (on: number) =>
  tile(
    {
      fontSize: on ? cell * 0.4 : cell * 0.36,
      fontWeight: on ? 700 : 400,
      background: on ? dark.on : dark.key,
      color: on ? dark.onInk : dark.keyInk,
      boxShadow: on
        ? `0 0 0 1px ${dark.onEdge}, 0 3px 0 ${dark.onEdge}, 0 0 24px ${dark.onGlow}`
        : `0 0 0 1px ${dark.keyLine}, 0 3px 0 ${dark.keyEdge}`,
    },
    on,
  );

// Like the game: a matched target is a solid green tile.
const target = (n: number) =>
  tile(
    {
      fontSize: cell * 0.34,
      fontWeight: 700,
      background: dark.match,
      color: dark.matchInk,
      boxShadow: `0 3px 0 ${dark.matchEdge}`,
    },
    n,
  );

const row = (children: Child[], style: Style = {}) => h({ gap, alignItems: 'center', ...style }, children);
const spacer = (width: number) => h({ width });

const board = h({ flexDirection: 'column', gap }, [
  row([spacer(label), ...places.map((p) => placeLabel(p, { width: cell }))]),
  ...bits.map((line, r) =>
    row([
      placeLabel(places[r]!, { width: label, justifyContent: 'flex-end' }),
      ...line.map(bit),
      h({ marginLeft: 8 }, target(rowTargets[r]!)),
    ]),
  ),
  row([spacer(label), ...colTargets.map(target)], { marginTop: 8 }),
]);

const image = (tagline: string) =>
  h(
    {
      width: 1200,
      height: 630,
      padding: '0 80px',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: dark.bg,
      color: dark.ink,
      fontFamily: 'Atkinson Hyperlegible Next',
    },
    [
      h({ flexDirection: 'column', width: 520 }, [
        h(
          {
            fontFamily: 'Rubik',
            fontSize: 112,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: '-0.025em',
            flexDirection: 'column',
          },
          [h({}, 'Binary'), h({}, 'Game')],
        ),
        h({ marginTop: 32, fontSize: 36, lineHeight: 1.3, color: dark.muted }, tagline),
        h({ marginTop: 48, fontSize: 26, color: dark.muted }, 'binary.leonkohli.dev'),
      ]),
      board,
    ],
  );

// Satori cannot read woff2 or variable fonts, which is what the Fonts API serves the page,
// so the image uses the static woff files of the same families.
const require = createRequire(import.meta.url);
const font = (name: string, file: string, weight: 400 | 700) =>
  readFile(require.resolve(`@fontsource/${file}-latin-${weight}-normal.woff`)).then((data) => ({
    name,
    data,
    weight,
    style: 'normal' as const,
  }));
const atkinson = (weight: 400 | 700) =>
  font('Atkinson Hyperlegible Next', 'atkinson-hyperlegible-next/files/atkinson-hyperlegible-next', weight);
const rubik = (weight: 400 | 700) => font('Rubik', 'rubik/files/rubik', weight);

export const getStaticPaths = localePaths;

export const GET: APIRoute<{ locale: Locale }> = async ({ props }) => {
  const svg = await satori(image(useTranslations(props.locale).site.ogTagline), {
    width: 1200,
    height: 630,
    fonts: await Promise.all([atkinson(400), rubik(400), rubik(700)]),
  });
  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true }).toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
