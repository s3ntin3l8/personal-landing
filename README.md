# personal-landing

Personal landing page for [s3ntin3l8.de](https://s3ntin3l8.de): Mullion, Pocket, Runway and branchDAM.

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

## Content

Project copy, links and screenshots live in `src/data/projects.ts` and `src/assets/`. Screenshots come from each
project's own demo data. Legal pages (`/impressum`, `/datenschutz`) contain `[TODO: ...]` placeholders to fill in.
