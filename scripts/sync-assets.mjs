// Refreshes the app screenshots and loops from each app's own reproducible
// capture pipeline (`make screenshots-landing OUT=<dir>` in every app repo,
// `make screenshots` for branchdam-mobile), all built on an isolated throwaway
// demo instance with synthetic data.
//
//   npm run assets:sync                 # every app
//   npm run assets:sync -- pocket runway
//
// An app marked `contract: true` below is also checked against the landing
// contract (scripts/landing-contract.mjs): names, sizes, complete loops.
//
// Repos are found next to this one (../<repo>) unless overridden, e.g.
// POCKET_REPO=/path/to/checkout. Stills land in src/assets/shots/<app>/ (Astro
// optimises them), loops in public/media/. src/data/assets.manifest.json records
// which commit of each app produced them.
import { execFileSync, spawnSync } from 'node:child_process';
import {
  copyFile,
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkDelivery, pngSize } from './landing-contract.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROJECTS = path.resolve(ROOT, '..');

// `contract: true` = the app delivers the visual-kit landing contract (see
// landing-contract.mjs) and the sync fails on a delivery that breaks it. The
// others still deliver their own names and sizes until they move onto
// visual-kit (one migration issue per repo); flip the flag as each does.
const APPS = {
  sanctuary: {
    repo: 'sanctuary',
    env: 'SANCTUARY_REPO',
    contract: true,
  },
  mullion: { repo: 'mullion-session-manager', env: 'MULLION_REPO' },
  pocket: { repo: 'pocket-portfolio-tracker', env: 'POCKET_REPO' },
  runway: { repo: 'runway-ai-usage-tracker', env: 'RUNWAY_REPO' },
  branchdam: { repo: 'branchDAM', env: 'BRANCHDAM_REPO' },
  // Native Android captures; its pipeline has no separate landing profile.
  // It boots its own branchDAM demo from BRANCHDAM_DIR (default ../branchDAM).
  'branchdam-mobile': {
    repo: 'branchdam-mobile',
    env: 'BRANCHDAM_MOBILE_REPO',
    target: 'screenshots',
  },
};
const LOOP_EXT = new Set(['.webm', '.mp4', '.jpg']);

const wanted = process.argv.slice(2);
const selected = wanted.length > 0 ? wanted : Object.keys(APPS);
for (const id of selected)
  if (!APPS[id]) throw new Error(`unknown app "${id}"`);

const manifestPath = path.join(ROOT, 'src/data/assets.manifest.json');
// Read without a separate existence check, so nothing can swap the file
// between the check and the read (CodeQL js/file-system-race).
const manifest = await readFile(manifestPath, 'utf8').then(
  JSON.parse,
  (err) => {
    if (err.code === 'ENOENT') return {};
    throw err;
  },
);

for (const id of selected) {
  const { repo, env, target = 'screenshots-landing', contract } = APPS[id];
  const dir = process.env[env] ?? path.join(PROJECTS, repo);
  if (!existsSync(path.join(dir, 'Makefile'))) {
    console.warn(`[sync] ${id}: no checkout at ${dir}; skipping`);
    continue;
  }
  const out = await mkdtemp(path.join(tmpdir(), `landing-${id}-`));
  console.log(`[sync] ${id}: capturing from ${dir}`);
  const res = spawnSync('make', [target, `OUT=${out}`], {
    cwd: dir,
    stdio: 'inherit',
  });
  if (res.status !== 0) {
    await rm(out, { recursive: true, force: true });
    throw new Error(
      `${id}: make ${target} failed` +
        (res.error ? `: ${res.error.message}` : ` (exit ${res.status})`),
    );
  }

  const files = (await readdir(out)).filter((f) => !f.startsWith('.'));
  if (contract) {
    // Any failure here (an unreadable PNG as much as a breach) must leave no temp dir behind.
    try {
      const delivered = await Promise.all(
        files.map(async (name) => {
          if (!name.endsWith('.png')) return { name };
          try {
            return {
              name,
              size: pngSize(await readFile(path.join(out, name))),
            };
          } catch (err) {
            throw new Error(`${name}: ${err.message}`);
          }
        }),
      );
      const problems = checkDelivery(delivered);
      if (problems.length)
        throw new Error(
          `the capture breaks the landing contract:\n  - ${problems.join('\n  - ')}`,
        );
    } catch (err) {
      await rm(out, { recursive: true, force: true });
      throw new Error(`${id}: ${err.message}`);
    }
  }
  const shotsDir = path.join(ROOT, 'src/assets/shots', id);
  const mediaDir = path.join(ROOT, 'public/media');
  await mkdir(shotsDir, { recursive: true });
  await mkdir(mediaDir, { recursive: true });
  for (const file of files) {
    const ext = path.extname(file);
    if (file.endsWith('.png'))
      await copyFile(path.join(out, file), path.join(shotsDir, file));
    else if (LOOP_EXT.has(ext))
      await copyFile(
        path.join(out, file),
        path.join(mediaDir, `${id}-${file}`),
      );
  }
  await rm(out, { recursive: true, force: true });

  const commit = execFileSync('git', ['rev-parse', '--short', 'HEAD'], {
    cwd: dir,
  })
    .toString()
    .trim();
  manifest[id] = {
    commit,
    capturedAt: new Date().toISOString().slice(0, 10),
    files,
  };
  // Written per app, so a later app's failure can't leave files on disk that
  // the manifest doesn't account for.
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`[sync] ${id}: ${files.length} files from ${commit}`);
}

// Match the repo's formatting so `npm run check` passes without a manual step.
execFileSync(path.join(ROOT, 'node_modules/.bin/prettier'), [
  '--write',
  manifestPath,
]);

// Keep only the stills the page actually imports; the rest of each capture set
// stays reproducible from the app repos and needn't live in this one.
const sources = execFileSync(
  'git',
  ['grep', '-h', 'assets/shots/', '--', 'src'],
  {
    cwd: ROOT,
  },
).toString();
for (const id of Object.keys(APPS)) {
  const dir = path.join(ROOT, 'src/assets/shots', id);
  if (!existsSync(dir)) continue;
  for (const file of await readdir(dir))
    if (!sources.includes(`shots/${id}/${file}`)) {
      await rm(path.join(dir, file));
      console.log(`[sync] pruned unused ${id}/${file}`);
    }
}
