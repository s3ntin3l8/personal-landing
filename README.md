# personal-landing

Personal landing page for [s3ntin3l8.de](https://s3ntin3l8.de): Mullion, Pocket, Runway, branchDAM and Aerie.

Astro (static) + Tailwind v4, self-hosted fonts, no third-party requests, no cookies.

```sh
npm install
npm run dev      # http://localhost:4321
npm run check    # astro check + prettier
npm run build    # static site in dist/
node scripts/make-og.mjs   # regenerate public/og.png
```

## Deploy

CI builds and signs a container image (`ghcr.io/s3ntin3l8/personal-landing`, nginx on :8080) via the shared
`docker-publish` workflow. It is deployed behind Traefik by the Ansible playbook
`ansible/playbooks/docker/personal-landing` in the homelab repo; Watchtower picks up new `edge` images (CI publishes `edge` on every push to main).

Pull requests also get a private Vercel preview (Hobby plan, Vercel Authentication on, so only the account owner or
someone with a share link can open it). `main` is never deployed there (`git.deploymentEnabled` in `vercel.json`);
production stays on the container above. The security and cache headers exist twice, in `security-headers.conf` /
`nginx.conf` and in `vercel.json`; `npm test` fails if they drift apart.

Three settings live only in the Vercel project, not in the repo, so check them if previews misbehave:

- Deployment Protection is Vercel Authentication, Standard Protection. This is the only thing keeping previews private.
- The Vercel Toolbar (and Preview Comments) should be off for previews. Its `vercel.live` script is blocked by the CSP
  (`script-src 'self'`), so while it is on, previews inject a script that only produces a console error.
- Node is 22 or newer (`engines` in `package.json` sets the floor); an older runtime fails the build.

Every non-`main` branch gets a preview, Dependabot's included. That is harmless behind the login wall but uses Hobby build quota.

## Content

Project copy, links, crops and feature tiles live in `src/data/projects.ts`.

Screenshots and loops are never taken by hand. Each app repo has a reproducible
pipeline (`make screenshots-landing OUT=<dir>`). It boots an isolated
throwaway instance with synthetic data, captures 2x stills and a short loop, and
tears the instance down. `npm run assets:sync` runs that pipeline for every app
found next to this repo (override a path with `MULLION_REPO`, `POCKET_REPO`,
`RUNWAY_REPO`, `BRANCHDAM_REPO`, `AERIE_REPO` or `SANCTUARY_REPO`, or pass app ids to sync a subset), then:

- copies the stills into `src/assets/shots/<app>/`, keeping only the ones the
  page imports;
- copies the loops into `public/media/`;
- records the source commits in `src/data/assets.manifest.json`.

An app that has moved onto [visual-kit](https://github.com/s3ntin3l8/visual-kit) (`contract: true` in
`scripts/sync-assets.mjs`) is also checked against the landing contract
(`scripts/landing-contract.mjs`): still names and sizes, complete loops. A delivery that breaks it fails the sync.
`npm test` covers the check.

`npm run refresh-specs` updates the release versions in the parts list from GitHub.

## License

Copyright (C) 2026 Björn Hansen

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU Affero General Public License as published by the Free
Software Foundation, either version 3 of the License, or (at your option) any
later version. See [LICENSE](LICENSE).
