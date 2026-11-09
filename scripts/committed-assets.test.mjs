import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { APPS } from './landing-apps.mjs';
import {
  checkDelivery,
  pngSize,
  STILL,
  TOLERANCE,
} from './landing-contract.mjs';

// `npm run assets:sync` checks a delivery when it is captured. This holds what is
// *committed* to the same contract, so a still that was copied in by hand, or a loop
// that was half reverted, cannot ship with green CI for an app marked `contract: true`.
//
// `checkDelivery` only needs one full-size still per viewport (a capture may include
// element shots), so on its own it lets a wrongly sized still hide behind a good one.
// Here every committed still must therefore be exactly its viewport's profile size
// (within the contract's 1px), unless the app lists it in `elementShots`
// (landing-apps.mjs); a listed shot must exist and may not exceed the profile.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(
  readFileSync(path.join(ROOT, 'src/data/assets.manifest.json'), 'utf8'),
);
const LOOP_EXT = ['.webm', '.mp4', '.jpg'];

for (const [id, app] of Object.entries(APPS)) {
  if (!app.contract) continue;
  test(`${id}: the committed stills and loops meet the landing contract`, () => {
    const stills = path.join(ROOT, 'src/assets/shots', id);
    assert.ok(existsSync(stills), `${id} has no stills in src/assets/shots`);
    // Every still the page does not import is pruned by the sync, so the folder holds
    // only what ships; each of them is checked.
    const files = readdirSync(stills)
      .filter((name) => name.endsWith('.png'))
      .map((name) => ({
        name,
        size: pngSize(readFileSync(path.join(stills, name))),
      }));
    // A loop is delivered as <stem>.webm + .mp4 + .jpg and lands in public/media as
    // <app>-<stem>.*. The manifest names what was delivered, so a missing member is
    // found even when none of its three files is left.
    const delivered = manifest[id]?.files ?? [];
    assert.ok(delivered.length > 0, `${id} is not in assets.manifest.json`);
    for (const name of delivered.filter((f) =>
      LOOP_EXT.includes(path.extname(f)),
    )) {
      const onDisk = path.join(ROOT, 'public/media', `${id}-${name}`);
      assert.ok(
        existsSync(onDisk),
        `${id}: ${name} is in the manifest but missing from public/media`,
      );
      files.push({ name });
    }
    assert.deepEqual(checkDelivery(files), []);

    const element = new Set(app.elementShots ?? []);
    for (const name of element)
      assert.ok(
        files.some((f) => f.name === name),
        `${id}: elementShots lists ${name}, which is not committed`,
      );
    for (const { name, size } of files.filter((f) => f.size)) {
      const profile =
        STILL[name.endsWith('-mobile.png') ? 'mobile' : 'desktop'];
      if (element.has(name))
        assert.ok(
          size.width <= profile.width + TOLERANCE &&
            size.height <= profile.height + TOLERANCE,
          `${id}: ${name} is an element shot but is larger than the profile`,
        );
      else
        assert.ok(
          Math.abs(size.width - profile.width) <= TOLERANCE &&
            Math.abs(size.height - profile.height) <= TOLERANCE,
          `${id}: ${name} is ${size.width}x${size.height}, expected ${profile.width}x${profile.height} (list it in elementShots if it is smaller by design)`,
        );
    }
  });
}
