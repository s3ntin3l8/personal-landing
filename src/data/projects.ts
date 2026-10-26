import type { ImageMetadata } from 'astro';

import mullionLogo from '../assets/logos/mullion.svg';
import pocketLogo from '../assets/logos/pocket.svg';
import runwayLogo from '../assets/logos/runway.svg';
import branchdamLogo from '../assets/logos/branchdam.svg';
import sanctuaryLogo from '../assets/logos/sanctuary.svg';

// Every capture below comes from the app's own reproducible demo pipeline
// (`make screenshots-landing` in each repo, synthetic data only), synced by
// `npm run assets:sync`; src/data/assets.manifest.json records the commits.
import mullionDashboard from '../assets/shots/mullion/desktop-dashboard.png';
import mullionGit from '../assets/shots/mullion/desktop-git-panel.png';
import mullionKanban from '../assets/shots/mullion/desktop-kanban.png';
import mullionMobileTerminal from '../assets/shots/mullion/mobile-terminal.png';
import mullionMobileList from '../assets/shots/mullion/mobile-session-list.png';

import pocketHoldings from '../assets/shots/pocket/holdings-desktop.png';
import pocketInsights from '../assets/shots/pocket/insights-desktop.png';
import pocketTax from '../assets/shots/pocket/tax-desktop.png';
import pocketHoldingsMobile from '../assets/shots/pocket/holdings-mobile.png';
import pocketInsightsMobile from '../assets/shots/pocket/insights-mobile.png';

import runwayDashboard from '../assets/shots/runway/dashboard-desktop.png';
import runwayProvider from '../assets/shots/runway/provider-desktop.png';
import runwayDashboardMobile from '../assets/shots/runway/dashboard-mobile.png';

import branchdamGraph from '../assets/shots/branchdam/asset-graph-desktop.png';
import branchdamAssets from '../assets/shots/branchdam/assets-desktop.png';
import branchdamAudit from '../assets/shots/branchdam/audit-queue-desktop.png';
import branchdamAuditPhone from '../assets/shots/branchdam-mobile/audit-queue.png';
import branchdamSyncPhone from '../assets/shots/branchdam-mobile/sync-status.png';

import sanctuaryGraph from '../assets/shots/sanctuary/case-graph-desktop.png';
import sanctuaryTruth from '../assets/shots/sanctuary/case-truth-desktop.png';
import sanctuaryFilter from '../assets/shots/sanctuary/triage-filter-desktop.png';
import sanctuaryDocument from '../assets/shots/sanctuary/document-desktop.png';
import sanctuaryTriageMobile from '../assets/shots/sanctuary/triage-mobile.png';
import sanctuaryDocumentMobile from '../assets/shots/sanctuary/document-mobile.png';

export interface Shot {
  image: ImageMetadata;
  alt: string;
  caption: string;
}

/** A short silent screen recording in public/media (see Loop.astro). */
export interface LoopShot {
  /** Path without extension, e.g. "/media/mullion-terminal-stream". */
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
}

/** A rectangle in percent of the source image. */
export interface Crop {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * One bento tile. `lg` spans 4 of 6 columns and two rows, `half` 3, `sm` 2,
 * `full` 6. A tile shows either a zoomed crop of a screenshot or a big stat.
 */
export interface Feature {
  title: string;
  body: string;
  size: 'lg' | 'half' | 'sm' | 'full';
  shot?: { image: ImageMetadata; crop: Crop; alt: string };
  stat?: string;
}

export interface Project {
  id: string;
  /** Catalogue part number, like a line on a bill of materials. */
  part: string;
  name: string;
  /** One line: what the part does. */
  fn: string;
  summary: string;
  accent: string;
  logo: ImageMetadata;
  github: string;
  stack: string[];
  runsOn: string;
  auth: string;
  // Refreshed by `npm run refresh-specs`; static so the build needs no network.
  version: string;
  license: string;
  since: string;
  status: string;
  /** Fig. N.1. */
  hero: Shot | LoopShot;
  /** Bento tiles, in grid order. */
  features: Feature[];
  /** Secondary figures: a loop and/or phones. */
  loop?: LoopShot;
  phones?: Shot[];
}

export const isLoop = (s: Shot | LoopShot): s is LoopShot => 'src' in s;

export const projects: Project[] = [
  {
    id: 'mullion',
    part: 'S3N-01',
    name: 'Mullion',
    fn: 'Mission control for AI coding CLIs.',
    summary:
      'Run Claude Code, Codex, opencode and friends on your own host, then drive every session from one persistent browser dashboard, on the desktop or the phone.',
    accent: '#0e9f6e',
    logo: mullionLogo,
    github: 'https://github.com/s3ntin3l8/mullion-session-manager',
    stack: ['TypeScript', 'Fastify', 'React', 'xterm.js', 'SQLite'],
    runsOn: 'systemd + dtach, PWA',
    auth: 'Token or OIDC',
    version: 'v0.3.42',
    license: 'AGPL-3.0',
    since: '2026',
    status: 'In service',
    hero: {
      src: '/media/mullion-terminal-stream',
      width: 1600,
      height: 1000,
      alt: 'An agent session streaming into a Mullion terminal next to the project sidebar',
      caption: 'An agent at work, live in the dashboard.',
    },
    features: [
      {
        size: 'lg',
        title: 'Every agent CLI, one tab',
        body: 'Claude Code, Codex, opencode and friends, each on a real PTY kept alive under dtach, so sessions survive redeploys and closed tabs.',
        shot: {
          image: mullionDashboard,
          crop: { x: 18, y: 4, w: 44, h: 48 },
          alt: 'Claude Code running inside a Mullion terminal',
        },
      },
      {
        size: 'sm',
        title: 'Workspaces that stay',
        body: 'Saved layouts you can switch between.',
        shot: {
          image: mullionDashboard,
          crop: { x: 0, y: 4, w: 18, h: 15 },
          alt: 'Mullion workspace switcher',
        },
      },
      {
        size: 'sm',
        title: 'Who needs you',
        body: 'Attention, working and exited, per project.',
        shot: {
          image: mullionDashboard,
          crop: { x: 0, y: 20, w: 18, h: 31 },
          alt: 'Mullion session filters and per-project sessions',
        },
      },
      {
        size: 'half',
        title: 'Git, beside the agent',
        body: 'Branch and changes in a drawer next to every session.',
        shot: {
          image: mullionGit,
          crop: { x: 76, y: 4, w: 24, h: 22 },
          alt: 'Mullion git drawer next to a terminal',
        },
      },
      {
        size: 'half',
        title: 'Tasks agents can take',
        body: 'A board from backlog to done that agents pick work from.',
        shot: {
          image: mullionKanban,
          crop: { x: 18, y: 6, w: 38, h: 32 },
          alt: 'Mullion Task Master board',
        },
      },
    ],
    phones: [
      {
        image: mullionMobileTerminal,
        alt: 'Mullion terminal on a phone',
        caption: 'Terminal with key bar.',
      },
      {
        image: mullionMobileList,
        alt: 'Mullion session list on a phone',
        caption: 'Sessions on the go.',
      },
    ],
  },
  {
    id: 'pocket',
    part: 'S3N-02',
    name: 'Pocket',
    fn: 'A portfolio tracker that does the tax report too.',
    summary:
      'Equities, gold, bonds, funds and cash in one place. Import from broker screenshots, CSV, PDF or live sync, and keep every number on your own server.',
    accent: '#12b981',
    logo: pocketLogo,
    github: 'https://github.com/s3ntin3l8/pocket-portfolio-tracker',
    stack: ['TypeScript', 'Next.js', 'Fastify', 'Postgres'],
    runsOn: 'Docker, PWA',
    auth: 'Authentik SSO',
    version: 'v0.2.4',
    license: 'AGPL-3.0',
    since: '2026',
    status: 'In service',
    hero: {
      image: pocketHoldings,
      alt: 'Pocket holdings with portfolio value, positions and allocation',
      caption: 'Holdings across every asset class and currency.',
    },
    features: [
      {
        size: 'half',
        title: 'Tax, done',
        body: 'Abgeltungsteuer and the Freistellungsauftrag for Germany, the final-tax regime for Indonesia.',
        shot: {
          image: pocketTax,
          crop: { x: 16, y: 18, w: 61, h: 42 },
          alt: 'Pocket tax report with estimated tax and allowance usage',
        },
      },
      {
        size: 'half',
        title: 'Import from anywhere',
        body: 'Broker screenshots read by an LLM, CSV and PDF parsers, or live sync with Trade Republic and IBKR.',
        stat: '4 ways in',
      },
      {
        size: 'sm',
        title: 'Every asset class',
        body: 'Equities, gold, bonds, funds and cash, across currencies.',
        shot: {
          image: pocketHoldings,
          crop: { x: 78, y: 68, w: 22, h: 32 },
          alt: 'Pocket allocation donut by asset class',
        },
      },
      {
        size: 'lg',
        title: 'Returns that make sense',
        body: 'Money-weighted XIRR, year-by-year returns against the S&P 500, and drift from your target weights.',
        shot: {
          image: pocketInsights,
          crop: { x: 15.5, y: 7, w: 63, h: 93 },
          alt: 'Pocket insights with annualised return, rebalancing and yearly returns',
        },
      },
      {
        size: 'sm',
        title: 'Years at a glance',
        body: 'Portfolio value from a month to all time, against a benchmark.',
        shot: {
          image: pocketHoldings,
          crop: { x: 16, y: 8, w: 45, h: 29 },
          alt: 'Pocket portfolio value chart',
        },
      },
    ],
    loop: {
      src: '/media/pocket-holdings-range',
      width: 1600,
      height: 1000,
      alt: 'Pocket holdings chart switching between ranges',
      caption: 'Ranges from a month to all time.',
    },
    phones: [
      {
        image: pocketHoldingsMobile,
        alt: 'Pocket holdings on a phone',
        caption: 'Holdings.',
      },
      {
        image: pocketInsightsMobile,
        alt: 'Pocket insights on a phone',
        caption: 'Insights.',
      },
    ],
  },
  {
    id: 'runway',
    part: 'S3N-03',
    name: 'Runway',
    fn: 'How much AI is left, and when it runs out.',
    summary:
      'A local-first dashboard for remaining capacity and reset timers across fifteen AI providers, with forecasts instead of surprises.',
    accent: '#8b5cf6',
    logo: runwayLogo,
    github: 'https://github.com/s3ntin3l8/runway-ai-usage-tracker',
    stack: ['Python', 'FastAPI', 'React', 'SQLite'],
    runsOn: 'Docker + sidecars',
    auth: 'Forward auth',
    version: 'v2.12.0',
    license: 'AGPL-3.0',
    since: '2026',
    status: 'In service',
    hero: {
      image: runwayDashboard,
      alt: 'Runway home with at-risk quotas, usage value and every provider',
      caption: 'Every provider, with what is at risk on top.',
    },
    features: [
      {
        size: 'full',
        title: 'Fifteen providers. One glance',
        body: 'Claude, ChatGPT, Gemini, Copilot, Ollama, OpenCode and more, each with remaining capacity and a reset timer.',
        shot: {
          image: runwayDashboard,
          crop: { x: 16, y: 57, w: 82, h: 36 },
          alt: 'Runway provider cards with usage bars and reset timers',
        },
      },
      {
        size: 'sm',
        title: 'At risk, on top',
        body: 'What is exhausted, or about to be, comes first.',
        shot: {
          image: runwayDashboard,
          crop: { x: 16, y: 10, w: 26, h: 18 },
          alt: 'Runway at-risk card for a nearly exhausted quota',
        },
      },
      {
        size: 'lg',
        title: 'Pace, not just percent',
        body: 'Every window shows where usage should be right now, and where it will land at the reset.',
        shot: {
          image: runwayProvider,
          crop: { x: 16, y: 43, w: 41, h: 28 },
          alt: 'Runway quota windows with pace markers and projections',
        },
      },
      {
        size: 'sm',
        title: 'Forecasts',
        body: 'A robust trend to the end of every window.',
        shot: {
          image: runwayProvider,
          crop: { x: 57, y: 43, w: 42, h: 28 },
          alt: 'Runway forecast chart for the current window',
        },
      },
    ],
    loop: {
      src: '/media/runway-provider-tabs',
      width: 1600,
      height: 1000,
      alt: 'Runway provider detail stepping through its tabs',
      caption: 'Activity, sessions and cost for every provider.',
    },
    phones: [
      {
        image: runwayDashboardMobile,
        alt: 'Runway home on a phone',
        caption: 'At risk, on the go.',
      },
    ],
  },
  {
    id: 'branchdam',
    part: 'S3N-04',
    name: 'branchDAM',
    fn: 'Every edit and export, traced back to the RAW.',
    summary:
      'A local-first digital asset manager that models media as a version graph. The camera RAW is the immutable root; every proxy, edit and export hangs off it.',
    accent: '#6366f1',
    logo: branchdamLogo,
    github: 'https://github.com/s3ntin3l8/branchdam',
    stack: ['Go', 'SQLite', 'React', 'Kotlin', 'SwiftUI'],
    runsOn: 'Docker, Android, iOS',
    auth: 'Authentik or local',
    version: 'v0.27.1',
    license: 'AGPL-3.0',
    since: '2026',
    status: 'In service',
    hero: {
      image: branchdamGraph,
      alt: 'branchDAM lineage graph: a RAW with its camera JPEG, graded export, edit decision list and proxy',
      caption:
        'One RAW, everything derived from it, with the confidence of every link.',
    },
    features: [
      {
        size: 'lg',
        title: 'Every file, indexed',
        body: 'RAWs, exports, proxies and project files, each with its camera, lifecycle and place in the graph.',
        shot: {
          image: branchdamAssets,
          crop: { x: 15, y: 30, w: 45, h: 68 },
          alt: 'branchDAM asset list with thumbnails and graph status',
        },
      },
      {
        size: 'sm',
        title: 'Manifests first',
        body: 'Edit lists and project files are the strongest evidence.',
        stat: 'EDL · FCPXML',
      },
      {
        size: 'sm',
        title: 'Trash buffer',
        body: 'Deleted media waits before it is gone.',
        stat: '30 days',
      },
      {
        size: 'half',
        title: 'A human in the loop',
        body: 'Links below the auto-accept threshold wait in a review queue instead of guessing.',
        shot: {
          image: branchdamAudit,
          crop: { x: 15, y: 20, w: 62, h: 30 },
          alt: 'branchDAM audit queue with a link candidate and its matching metrics',
        },
      },
      {
        size: 'half',
        title: 'Verified reclaim',
        body: 'Space is only freed once a BLAKE3 hash check passes.',
        stat: 'BLAKE3',
      },
    ],
    loop: {
      src: '/media/branchdam-asset-graph',
      width: 1600,
      height: 1000,
      alt: 'From the branchDAM asset list into an asset and its lineage graph',
      caption: 'From the library into an asset’s graph.',
    },
    phones: [
      {
        image: branchdamAuditPhone,
        alt: 'branchDAM Android app reviewing a suggested edit link between a photo and its edited copy',
        caption: 'Lineage audit, on Android.',
      },
      {
        image: branchdamSyncPhone,
        alt: 'branchDAM Android app showing a completed backup sync',
        caption: 'Camera roll backup.',
      },
    ],
  },
  {
    id: 'sanctuary',
    part: 'S3N-05',
    name: 'Sanctuary',
    fn: 'A case intelligence engine for litigation, on your own machine.',
    summary:
      'Court letters, emails and scans become a graph of who said what to whom, a map of what is contested and a clock of what is due. The AI runs locally; no document leaves the machine.',
    accent: '#14b8a6',
    logo: sanctuaryLogo,
    github: 'https://github.com/s3ntin3l8/sanctuary',
    stack: ['Python', 'FastAPI', 'React', 'Postgres + pgvector', 'Ollama'],
    runsOn: 'Docker Compose',
    auth: 'Local accounts or OIDC',
    version: 'v0.6.1',
    license: 'AGPL-3.0',
    since: '2026',
    status: 'Pre-release',
    hero: {
      src: '/media/sanctuary-case-views',
      width: 1600,
      height: 1000,
      alt: 'A Sanctuary case switching between its graph, truth map, calendar and costs',
      caption: 'One case, four views.',
    },
    features: [
      {
        size: 'lg',
        title: 'A case as a graph',
        body: 'Every letter and email on a swim lane by who sent it: you, the court, the other side, third parties. Hundreds of letters collapse to the few that matter.',
        shot: {
          image: sanctuaryGraph,
          crop: { x: 3.5, y: 12.5, w: 79.5, h: 76.5 },
          alt: 'Sanctuary correspondence graph with swim lanes for you, the court, the opposing side and third parties',
        },
      },
      {
        size: 'sm',
        title: 'A clock, not a pile',
        body: 'Deadlines pulled from the letters, with the cost exposure beside them.',
        shot: {
          image: sanctuaryGraph,
          crop: { x: 83.3, y: 20.5, w: 16.7, h: 29 },
          alt: 'Sanctuary deadlines with days late and the court that set them',
        },
      },
      {
        size: 'sm',
        title: 'Triage by email',
        body: 'Each email is one bundle, filtered by case and proceeding.',
        shot: {
          image: sanctuaryFilter,
          crop: { x: 0, y: 0, w: 100, h: 100 },
          alt: 'Sanctuary triage filter listing proceedings by file number and court',
        },
      },
      {
        size: 'half',
        title: 'What is contested',
        body: 'Every claim with its evidence chain, marked asserted, established, contested or refuted. No invented probabilities.',
        shot: {
          image: sanctuaryTruth,
          crop: { x: 4.5, y: 14.5, w: 78, h: 49 },
          alt: 'Sanctuary truth map with contested claims and their evidence',
        },
      },
      {
        size: 'half',
        title: 'The sentence that matters',
        body: 'A three-bullet summary per document, and each key passage anchored in the text.',
        shot: {
          image: sanctuaryDocument,
          crop: { x: 79, y: 62, w: 21, h: 32 },
          alt: 'Sanctuary AI summary with legal significance, action and finance, and the key passages',
        },
      },
    ],
    phones: [
      {
        image: sanctuaryTriageMobile,
        alt: 'Sanctuary triage on a phone',
        caption: 'Triage.',
      },
      {
        image: sanctuaryDocumentMobile,
        alt: 'Sanctuary document with highlighted passages on a phone',
        caption: 'A document.',
      },
    ],
  },
];
