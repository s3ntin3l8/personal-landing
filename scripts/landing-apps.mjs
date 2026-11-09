// The apps whose captures this repo ships, and where each comes from. Read by
// sync-assets.mjs and by committed-assets.test.mjs (which holds the committed
// files of every `contract: true` app to the landing contract).
//
// `contract: true` = the app delivers the visual-kit landing contract (see
// landing-contract.mjs) and the sync fails on a delivery that breaks it. The
// others still deliver their own names and sizes until they move onto
// visual-kit (one migration issue per repo); flip the flag as each does.
//
// `elementShots` maps the stills of a contract app that are smaller than their
// viewport's profile by design (a captured element, not a whole page) to the exact
// size they have. Every other committed still must be exactly the profile size
// (committed-assets.test.mjs).
export const APPS = {
  sanctuary: {
    repo: 'sanctuary',
    env: 'SANCTUARY_REPO',
    contract: true,
    elementShots: { 'triage-filter-desktop.png': { width: 768, height: 348 } },
  },
  mullion: {
    repo: 'mullion-session-manager',
    env: 'MULLION_REPO',
    contract: true,
  },
  pocket: {
    repo: 'pocket-portfolio-tracker',
    env: 'POCKET_REPO',
    contract: true,
  },
  runway: {
    repo: 'runway-ai-usage-tracker',
    env: 'RUNWAY_REPO',
    contract: true,
  },
  branchdam: {
    repo: 'branchDAM',
    env: 'BRANCHDAM_REPO',
    contract: true,
    elementShots: { 'asset-graph-desktop.png': { width: 2752, height: 936 } },
  },
  aerie: { repo: 'aerie-media-dashboard', env: 'AERIE_REPO' },
  // Native Android captures on an emulator (no visual-kit runner), delivered as
  // <scene>-mobile.png at the landing phone size. It boots its own branchDAM
  // demo from BRANCHDAM_DIR (default ../branchDAM).
  'branchdam-mobile': {
    repo: 'branchdam-mobile',
    env: 'BRANCHDAM_MOBILE_REPO',
    contract: true,
  },
};
