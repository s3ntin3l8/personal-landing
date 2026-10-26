import assert from 'node:assert/strict';
import { test } from 'node:test';
import { checkDelivery, pngSize } from './landing-contract.mjs';

const still = (name, width, height) => ({ name, size: { width, height } });
const triplet = (stem) =>
  ['webm', 'mp4', 'jpg'].map((e) => ({ name: `${stem}.${e}` }));

function png(width, height) {
  const buf = Buffer.alloc(24);
  Buffer.from([0x89, 0x50, 0x4e, 0x47]).copy(buf, 0);
  buf.writeUInt32BE(width, 16);
  buf.writeUInt32BE(height, 20);
  return buf;
}

test('pngSize reads the IHDR and refuses a non-PNG', () => {
  assert.deepEqual(pngSize(png(3200, 2000)), { width: 3200, height: 2000 });
  assert.throws(() => pngSize(Buffer.alloc(30)), /not a PNG/);
});

test('a correct delivery passes, element shots may be smaller, the marker file is ignored', () => {
  const files = [
    still('graph-desktop.png', 3200, 2000),
    still('graph-mobile.png', 1170, 2531), // Chromium rounds the phone height
    still('filter-desktop.png', 576, 260),
    ...triplet('views'),
    { name: '.visual-kit' },
  ];
  assert.deepEqual(checkDelivery(files), []);
});

test('a still at the wrong device scale is caught', () => {
  const problems = checkDelivery([still('graph-desktop.png', 1600, 1000)]);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /no desktop still has the full 3200x2000 size/);
});

test('a still larger than its profile, or wrongly named, is caught', () => {
  const problems = checkDelivery([
    still('graph-desktop.png', 3200, 2000),
    still('huge-desktop.png', 3200, 4000),
    still('desktop-dashboard.png', 3200, 2000),
  ]);
  assert.equal(problems.length, 2);
  assert.match(problems.join('\n'), /huge-desktop\.png: 3200x4000 is larger/);
  assert.match(problems.join('\n'), /desktop-dashboard\.png: a still is named/);
});

test('a half-written loop and a stray file are caught', () => {
  const problems = checkDelivery([
    still('a-desktop.png', 3200, 2000),
    { name: 'views.webm' },
    { name: 'views.mp4' },
    { name: 'notes.txt' },
  ]);
  assert.match(problems.join('\n'), /loop "views" is missing \.jpg/);
  assert.match(problems.join('\n'), /notes\.txt: only \.png/);
});

test('an empty or loop-only delivery is caught, and a missing size is not mistaken for a wrong scale', () => {
  assert.match(checkDelivery([]).join('\n'), /no stills delivered/);
  assert.match(
    checkDelivery(triplet('views')).join('\n'),
    /no stills delivered/,
  );
  const unsized = checkDelivery([{ name: 'a-desktop.png' }]);
  assert.equal(unsized.length, 1);
  assert.match(unsized[0], /without a size/);
});
