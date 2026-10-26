// Renders public/og.png (1200x630) in the catalogue style with the site's own
// fonts. Run: node scripts/make-og.mjs
// Needs a Chromium: set CHROMIUM_PATH, or install one with
// `npx playwright-core install chromium-headless-shell`.
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright-core';

const font = (path) =>
  `data:font/woff2;base64,${readFileSync(new URL(`../node_modules/${path}`, import.meta.url)).toString('base64')}`;

const parts = [
  ['S3N-01', 'Mullion'],
  ['S3N-02', 'Pocket'],
  ['S3N-03', 'Runway'],
  ['S3N-04', 'branchDAM'],
  ['S3N-05', 'Aerie'],
];

const html = `<!doctype html><html><head><style>
@font-face { font-family: Archivo; src: url(${font('@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2')}) format('woff2'); font-weight: 100 900; font-stretch: 62% 125%; }
@font-face { font-family: Plex; src: url(${font('@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2')}) format('woff2'); }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; background: #0e0d0b; color: #ece6d9; font-family: Archivo; padding: 48px 64px; position: relative; }
.label { font-family: Plex; font-size: 17px; letter-spacing: .04em; text-transform: uppercase; color: #8f887a; }
.row { display: flex; justify-content: space-between; }
.rule { height: 1px; background: rgb(236 230 217 / .32); margin: 14px 0 0; }
h1 { margin-top: 48px; font-size: 150px; line-height: .86; font-stretch: 62%; font-weight: 760; text-transform: uppercase; }
h1 i { font-style: normal; color: #ff4f00; }
.bom { position: absolute; left: 64px; right: 64px; bottom: 48px; display: grid; grid-template-columns: repeat(5, 1fr); gap: 24px; }
.bom div { border-top: 1px solid rgb(236 230 217 / .32); padding-top: 12px; }
.bom b { display: block; margin-top: 6px; font-size: 30px; font-weight: 600; }
svg { position: absolute; right: 64px; top: 112px; }
</style></head><body>
<div class="row label"><span>S3N / Björn Hansen</span><span>Catalogue · s3ntin3l8.de</span></div>
<div class="rule"></div>
<svg width="72" height="72" viewBox="0 0 64 64"><circle cx="32" cy="32" r="14" fill="none" stroke="#ff4f00"/><path d="M32 6V58M6 32H58" stroke="#ff4f00"/></svg>
<h1>Software for<br/>my own rack<i>.</i></h1>
<div class="bom">${parts.map(([no, name]) => `<div><span class="label">${no}</span><b>${name}</b></div>`).join('')}</div>
</body></html>`;

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH,
});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'public/og.png' });
await browser.close();
