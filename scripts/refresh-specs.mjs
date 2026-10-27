// Refreshes the release version in src/data/projects.ts from GitHub.
// Run manually (`npm run refresh-specs`) and commit the result; the build
// itself never touches the network. Needs an authenticated `gh` CLI.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const file = new URL('../src/data/projects.ts', import.meta.url);
let src = readFileSync(file, 'utf8');

const repos = {
  sanctuary: 's3ntin3l8/sanctuary',
  mullion: 's3ntin3l8/mullion-session-manager',
  pocket: 's3ntin3l8/pocket-portfolio-tracker',
  runway: 's3ntin3l8/runway-ai-usage-tracker',
  branchdam: 's3ntin3l8/branchDAM',
  aerie: 's3ntin3l8/aerie-media-dashboard',
};

const gh = (path) => {
  try {
    return execFileSync('gh', ['api', path, '--jq', '.tag_name'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  } catch (err) {
    // Only "this repo has no release yet" is expected; auth or network
    // failures must not pass silently as "no release".
    if (String(err.stderr).includes('HTTP 404')) return '';
    throw err;
  }
};

for (const [id, repo] of Object.entries(repos)) {
  const tag = gh(`repos/${repo}/releases/latest`);
  if (!tag) {
    console.warn(`${id}: no release found, keeping current value`);
    continue;
  }
  // Some repos prefix the tag with the component name (release-please: `aerie-v1.3.0`);
  // the page shows the bare `v1.3.0`.
  const version = tag.replace(/^.*?(?=v\d)/, '');
  // Replace the first `version:` after this project's `id:`.
  const start = src.indexOf(`id: '${id}'`);
  const at = start < 0 ? -1 : src.indexOf('version:', start);
  if (at < 0) {
    console.warn(
      `${id}: no \`id: '${id}'\` / \`version:\` in ${file}; skipping`,
    );
    continue;
  }
  const end = src.indexOf('\n', at);
  src = `${src.slice(0, at)}version: '${version}',${src.slice(end)}`;
  console.log(`${id}: ${version}`);
}

writeFileSync(file, src);
