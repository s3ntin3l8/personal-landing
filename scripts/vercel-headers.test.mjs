import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const read = (file) =>
  readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const vercel = JSON.parse(read('vercel.json'));

// `add_header Name "value" always;` -> { Name: value }
function nginxHeaders(text) {
  const out = {};
  for (const m of text.matchAll(/add_header\s+(\S+)\s+"([^"]*)"/g))
    out[m[1]] = m[2];
  return out;
}

function vercelHeaders(source) {
  const rule = vercel.headers.find((h) => h.source === source);
  assert.ok(rule, `vercel.json has no headers rule for ${source}`);
  return Object.fromEntries(rule.headers.map((h) => [h.key, h.value]));
}

test('vercel.json sets the same security headers as security-headers.conf', () => {
  assert.deepEqual(
    vercelHeaders('/(.*)'),
    nginxHeaders(read('security-headers.conf')),
  );
});

test('vercel.json caches /_astro/ and /media/ like nginx.conf', () => {
  const conf = read('nginx.conf');
  for (const [path, source] of [
    ['/_astro/', '/_astro/(.*)'],
    ['/media/', '/media/(.*)'],
  ]) {
    const block = conf.match(new RegExp(`location ${path} \\{([^}]*)\\}`))?.[1];
    assert.ok(block, `nginx.conf has no location ${path}`);
    assert.equal(
      vercelHeaders(source)['Cache-Control'],
      nginxHeaders(block)['Cache-Control'],
    );
  }
});

test('vercel.json never deploys main, previews only', () => {
  assert.equal(vercel.git.deploymentEnabled.main, false);
});
