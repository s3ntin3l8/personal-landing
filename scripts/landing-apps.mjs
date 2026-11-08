// The apps whose captures this repo ships, and where each comes from. Read by
// sync-assets.mjs and by committed-assets.test.mjs (which holds the committed
// files of every `contract: true` app to the landing contract).
//
// `contract: true` = the app delivers the visual-kit landing contract (see
// landing-contract.mjs) and the sync fails on a delivery that breaks it. The
// others still deliver their own names and sizes until they move onto
// visual-kit (one migration issue per repo); flip the flag as each does.
export const APPS = {
  sanctuary: {
    repo: 'sanctuary',
    env: 'SANCTUARY_REPO',
    contract: true,
  },
  mullion: { repo: 'mullion-session-manager', env: 'MULLION_REPO' },
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
  branchdam: { repo: 'branchDAM', env: 'BRANCHDAM_REPO' },
  aerie: { repo: 'aerie-media-dashboard', env: 'AERIE_REPO' },
  // Native Android captures; its pipeline has no separate landing profile.
  // It boots its own branchDAM demo from BRANCHDAM_DIR (default ../branchDAM).
  'branchdam-mobile': {
    repo: 'branchdam-mobile',
    env: 'BRANCHDAM_MOBILE_REPO',
    target: 'screenshots',
  },
};
