// Refreshes the release version in src/data/projects.ts from GitHub.
// Run manually (`npm run refresh-specs`) and commit the result; the build
// itself never touches the network. Needs an authenticated `gh` CLI.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const file = new URL('../src/data/projects.ts', import.meta.url);
let src = readFileSync(file, 'utf8');

const repos = {
  mullion: 's3ntin3l8/mullion-session-manager',
  pocket: 's3ntin3l8/pocket-portfolio-tracker',
  runway: 's3ntin3l8/runway-ai-usage-tracker',
  branchdam: 's3ntin3l8/branchDAM',
};

const gh = (path) => {
  try {
    return execFileSync('gh', ['api', path, '--jq', '.tag_name'], {
      encoding: 'utf8',
    }).trim();
  } catch {
    return '';
  }
};

for (const [id, repo] of Object.entries(repos)) {
  const tag = gh(`repos/${repo}/releases/latest`);
  if (!tag) {
    console.warn(`${id}: no release found, keeping current value`);
    continue;
  }
  // Replace the first `version:` after this project's `id:`.
  const start = src.indexOf(`id: '${id}'`);
  const at = src.indexOf('version:', start);
  const end = src.indexOf('\n', at);
  src = `${src.slice(0, at)}version: '${tag}',${src.slice(end)}`;
  console.log(`${id}: ${tag}`);
}

writeFileSync(file, src);
