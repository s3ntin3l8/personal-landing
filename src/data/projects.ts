import type { ImageMetadata } from 'astro';

import mullionLogo from '../assets/logos/mullion.svg';
import pocketLogo from '../assets/logos/pocket.svg';
import runwayLogo from '../assets/logos/runway.svg';
import branchdamLogo from '../assets/logos/branchdam.svg';

import mullionDashboard from '../assets/shots/mullion/desktop-dashboard.png';
import mullionKanban from '../assets/shots/mullion/desktop-kanban.png';
import mullionGit from '../assets/shots/mullion/desktop-git-panel.png';
import mullionMobileList from '../assets/shots/mullion/mobile-session-list.png';
import mullionMobileTerminal from '../assets/shots/mullion/mobile-terminal.png';

import pocketHoldings from '../assets/shots/pocket/holdings-dark-wide.png';
import pocketInsights from '../assets/shots/pocket/insights-dark-wide.png';
import pocketTax from '../assets/shots/pocket/tax-dark-wide.png';
import pocketHoldingsNarrow from '../assets/shots/pocket/holdings-dark-narrow.png';
import pocketInsightsNarrow from '../assets/shots/pocket/insights-dark-narrow.png';

import runwayDashboard from '../assets/shots/runway/dashboard.png';
import runwayProvider from '../assets/shots/runway/provider.png';
import runwayHistory from '../assets/shots/runway/history.png';

export interface Shot {
  image: ImageMetadata;
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

export interface Marker {
  /** Position in percent of the *source* image (not the crop). */
  x: number;
  y: number;
  title: string;
  body: string;
}

export interface Detail extends Shot {
  crop: Crop;
  markers: Marker[];
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
  /** Fig. N.1. 'graph' is the line-drawing stand-in until real captures exist. */
  hero: Shot | 'graph';
  /** Fig. N.2, the annotated detail. */
  detail?: Detail;
  /** Notes shown as the legend when there is no annotated screenshot. */
  notes?: { title: string; body: string }[];
  /** Secondary figures: wide crops or phones. */
  extras?: (Shot & { kind: 'wide' | 'phone' })[];
}

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
    version: 'v0.3.40',
    license: 'AGPL-3.0',
    since: '2026',
    status: 'In service',
    hero: {
      image: mullionDashboard,
      alt: 'Mullion dashboard with an agent session next to the project sidebar',
      caption: 'Workspace with a live agent session and the project sidebar.',
    },
    detail: {
      image: mullionGit,
      alt: 'Mullion sidebar and git panel, annotated',
      caption: 'Sidebar and git panel, annotated.',
      crop: { x: 0, y: 3, w: 47, h: 57 },
      markers: [
        {
          x: 4,
          y: 8.9,
          title: 'Named workspaces',
          body: 'Split, tab and save layouts. Sessions survive redeploys and closed tabs.',
        },
        {
          x: 22,
          y: 20.6,
          title: 'Git per project',
          body: 'Branch, changes and worktrees in a panel next to the agent.',
        },
        {
          x: 33,
          y: 23.6,
          title: 'Auto-fetch',
          body: 'Remotes stay current while agents work.',
        },
        {
          x: 7,
          y: 26.8,
          title: 'Attention filters',
          body: 'See at a glance which session is waiting for you.',
        },
        {
          x: 2.6,
          y: 33.8,
          title: 'Live session state',
          body: 'Every PTY reports working, idle or exited.',
        },
      ],
    },
    extras: [
      {
        kind: 'wide',
        image: mullionKanban,
        alt: 'Mullion Task Master Kanban board',
        caption: 'Task Master: a Kanban board that agents pick work from.',
      },
      {
        kind: 'phone',
        image: mullionMobileTerminal,
        alt: 'Mullion terminal on a phone',
        caption: 'Terminal with key bar.',
      },
      {
        kind: 'phone',
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
    version: 'v0.2.2',
    license: 'AGPL-3.0',
    since: '2026',
    status: 'In service',
    hero: {
      image: pocketHoldings,
      alt: 'Pocket holdings overview in dark mode',
      caption: 'Holdings across every asset class and currency.',
    },
    detail: {
      image: pocketInsights,
      alt: 'Pocket insights page, annotated',
      caption: 'Insights, annotated.',
      crop: { x: 24, y: 10, w: 61.5, h: 36 },
      markers: [
        {
          x: 29,
          y: 15.8,
          title: 'Returns that make sense',
          body: 'Money-weighted XIRR next to time-weighted return.',
        },
        {
          x: 53.7,
          y: 23.7,
          title: 'Drift',
          body: 'How far the portfolio has wandered from its targets.',
        },
        {
          x: 57.5,
          y: 29.7,
          title: 'Rebalancing hints',
          body: 'Per asset class, in percentage points.',
        },
        {
          x: 61.5,
          y: 14.5,
          title: 'Concentration',
          body: 'Largest position, classes, markets and currencies.',
        },
        {
          x: 61.4,
          y: 24,
          title: 'Best and worst',
          body: 'Leaders and laggards across the portfolio.',
        },
      ],
    },
    extras: [
      {
        kind: 'wide',
        image: pocketTax,
        alt: 'Pocket tax report page',
        caption: 'German and Indonesian tax reports.',
      },
      {
        kind: 'phone',
        image: pocketHoldingsNarrow,
        alt: 'Pocket holdings on a phone',
        caption: 'Holdings.',
      },
      {
        kind: 'phone',
        image: pocketInsightsNarrow,
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
      alt: 'Runway dashboard with provider quota cards',
      caption: 'Every provider, with what is at risk on top.',
    },
    detail: {
      image: runwayProvider,
      alt: 'Runway provider detail, annotated',
      caption: 'Provider detail, annotated.',
      crop: { x: 17, y: 20, w: 83, h: 21.5 },
      markers: [
        {
          x: 25,
          y: 27.4,
          title: 'Reset timers',
          body: 'Every quota window, counting down.',
        },
        {
          x: 45.4,
          y: 25.9,
          title: 'Pace marker',
          body: 'Where usage should be right now to last until the reset.',
        },
        {
          x: 52,
          y: 27.4,
          title: 'Projected at reset',
          body: 'From event-sourced history, not a guess.',
        },
        {
          x: 88,
          y: 30,
          title: 'Theil-Sen forecast',
          body: 'A robust trend line to the end of the window.',
        },
      ],
    },
    extras: [
      {
        kind: 'wide',
        image: runwayHistory,
        alt: 'Runway history page with usage trends',
        caption: 'History with forecast overlay.',
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
    version: 'v0.26.2',
    license: 'AGPL-3.0',
    since: '2026',
    status: 'In service',
    hero: 'graph',
    notes: [
      {
        title: 'RAW is the root',
        body: 'Originals are immutable. Everything derived links back through the graph.',
      },
      {
        title: 'Links you can trust',
        body: 'Project manifests, then XMP IDs, then capture time and image similarity.',
      },
      {
        title: 'Review queue',
        body: 'Low-confidence links wait for a human instead of guessing.',
      },
      {
        title: 'Safe reclaim',
        body: 'A 30-day trash buffer and BLAKE3-verified space reclaim.',
      },
    ],
  },
];
