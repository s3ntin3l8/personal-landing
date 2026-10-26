// The landing-page delivery contract (s3ntin3l8/visual-kit, CONTRACT.md): what
// `make screenshots-landing OUT=<dir>` must leave in <dir>. `npm run assets:sync`
// checks it for every app that has moved onto visual-kit, so a wrong size or a
// half-written loop fails loudly here instead of shipping.
//
//   stills  <scene>-desktop.png / <scene>-mobile.png, dark, a viewport-sized
//           scene is exactly 1600x1000 @2x / 390x844 @3x; an element shot is
//           smaller. Chromium may round the phone height by a pixel.
//   loops   <name>.webm + <name>.mp4 + <name>.jpg, all three or none
export const STILL = {
  desktop: { width: 3200, height: 2000 },
  mobile: { width: 1170, height: 2532 },
};
const TOLERANCE = 1;
const LOOP_EXT = ['.webm', '.mp4', '.jpg'];
const STILL_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*-(desktop|mobile)\.png$/;

/** Width and height from a PNG's IHDR chunk, without decoding it. */
export function pngSize(buf) {
  if (buf.length < 24 || buf.toString('ascii', 1, 4) !== 'PNG')
    throw new Error('not a PNG');
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

const near = (a, b) => Math.abs(a - b) <= TOLERANCE;

/**
 * @param {{ name: string, size?: { width: number, height: number } }[]} files
 *   what the capture left in its output folder (`size` for the PNGs)
 * @returns {string[]} one message per problem; empty when the delivery is fine
 */
export function checkDelivery(files) {
  const problems = [];
  const exact = new Set();
  const seen = new Set();
  const loops = new Map();

  for (const { name, size } of files) {
    if (name.startsWith('.')) continue; // visual-kit's marker file
    const dot = name.lastIndexOf('.');
    const ext = name.slice(dot);
    const stem = name.slice(0, dot);
    if (ext === '.png') {
      const m = STILL_NAME.exec(name);
      if (!m) {
        problems.push(`${name}: a still is named <scene>-<desktop|mobile>.png`);
        continue;
      }
      const spec = STILL[m[1]];
      seen.add(m[1]);
      if (!size) continue;
      if (
        size.width > spec.width + TOLERANCE ||
        size.height > spec.height + TOLERANCE
      )
        problems.push(
          `${name}: ${size.width}x${size.height} is larger than the ${m[1]} profile (${spec.width}x${spec.height})`,
        );
      else if (near(size.width, spec.width) && near(size.height, spec.height))
        exact.add(m[1]);
    } else if (LOOP_EXT.includes(ext)) {
      loops.set(stem, (loops.get(stem) ?? new Set()).add(ext));
    } else {
      problems.push(`${name}: only .png, .webm, .mp4 and .jpg are delivered`);
    }
  }

  for (const vp of seen)
    if (!exact.has(vp))
      problems.push(
        `no ${vp} still has the full ${STILL[vp].width}x${STILL[vp].height} size (wrong device scale?)`,
      );
  for (const [stem, exts] of loops) {
    const missing = LOOP_EXT.filter((e) => !exts.has(e));
    if (missing.length)
      problems.push(`loop "${stem}" is missing ${missing.join(', ')}`);
  }
  return problems;
}
