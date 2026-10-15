// Refreshes the app screenshots and loops from each app's own reproducible
// capture pipeline (`make screenshots-landing OUT=<dir>` in every app repo, all
// built on an isolated throwaway demo instance with synthetic data).
//
//   npm run assets:sync                 # every app
//   npm run assets:sync -- pocket runway
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

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROJECTS = path.resolve(ROOT, '..');

const APPS = {
  mullion: { repo: 'mullion-session-manager', env: 'MULLION_REPO' },
  pocket: { repo: 'pocket-portfolio-tracker', env: 'POCKET_REPO' },
  runway: { repo: 'runway-ai-usage-tracker', env: 'RUNWAY_REPO' },
  branchdam: { repo: 'branchDAM', env: 'BRANCHDAM_REPO' },
};
const LOOP_EXT = new Set(['.webm', '.mp4', '.jpg']);

const wanted = process.argv.slice(2);
const selected = wanted.length > 0 ? wanted : Object.keys(APPS);
for (const id of selected)
  if (!APPS[id]) throw new Error(`unknown app "${id}"`);

const manifestPath = path.join(ROOT, 'src/data/assets.manifest.json');
const manifest = existsSync(manifestPath)
  ? JSON.parse(await readFile(manifestPath, 'utf8'))
  : {};

for (const id of selected) {
  const { repo, env } = APPS[id];
  const dir = process.env[env] ?? path.join(PROJECTS, repo);
  if (!existsSync(path.join(dir, 'Makefile'))) {
    console.warn(`[sync] ${id}: no checkout at ${dir}; skipping`);
    continue;
  }
  const out = await mkdtemp(path.join(tmpdir(), `landing-${id}-`));
  console.log(`[sync] ${id}: capturing from ${dir}`);
  const res = spawnSync('make', ['screenshots-landing', `OUT=${out}`], {
    cwd: dir,
    stdio: 'inherit',
  });
  if (res.status !== 0) {
    await rm(out, { recursive: true, force: true });
    throw new Error(`${id}: make screenshots-landing failed`);
  }

  const files = await readdir(out);
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
  console.log(`[sync] ${id}: ${files.length} files from ${commit}`);
}

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

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
