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
  /** Fig. N.1. 'graph' is the line-drawing stand-in until real captures exist. */
  hero: Shot | 'graph';
  /** Bento tiles, in grid order. */
  features: Feature[];
  /** Secondary figures: wide shots or phones. */
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
    features: [
      {
        size: 'lg',
        title: 'Git, beside the agent',
        body: 'Branch, changes and worktrees in a panel next to every session, with auto-fetch while agents work.',
        shot: {
          image: mullionGit,
          crop: { x: 15.5, y: 12, w: 31, h: 34 },
          alt: 'Mullion git panel open over a terminal session',
        },
      },
      {
        size: 'sm',
        title: 'Workspaces that stay',
        body: 'Saved layouts. Sessions survive redeploys and closed tabs.',
        shot: {
          image: mullionDashboard,
          crop: { x: 0, y: 4, w: 15, h: 11 },
          alt: 'Mullion workspace switcher',
        },
      },
      {
        size: 'sm',
        title: 'Who needs you',
        body: 'Attention, working and exited, at a glance.',
        shot: {
          image: mullionDashboard,
          crop: { x: 0, y: 25, w: 15, h: 19 },
          alt: 'Mullion session filters and per-project sessions',
        },
      },
      {
        size: 'half',
        title: 'Any agent CLI',
        body: 'Claude Code, Codex, opencode and friends, each on a real PTY kept alive under dtach.',
        shot: {
          image: mullionDashboard,
          crop: { x: 15, y: 7, w: 33, h: 32 },
          alt: 'Claude Code running inside a Mullion terminal',
        },
      },
      {
        size: 'half',
        title: 'Tasks agents can take',
        body: 'A Kanban board from backlog to done that agents pick work from.',
        shot: {
          image: mullionKanban,
          crop: { x: 15.5, y: 10, w: 36.5, h: 35 },
          alt: 'Mullion Task Master Kanban board',
        },
      },
    ],
    extras: [
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
    features: [
      {
        size: 'half',
        title: 'Tax, done',
        body: 'Abgeltungsteuer and the Freistellungsauftrag for Germany, the final-tax regime for Indonesia.',
        shot: {
          image: pocketTax,
          crop: { x: 24.3, y: 14.5, w: 30.2, h: 23 },
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
          crop: { x: 24.5, y: 37.5, w: 17.5, h: 12.5 },
          alt: 'Pocket allocation donut by asset class',
        },
      },
      {
        size: 'lg',
        title: 'Returns that make sense',
        body: 'Money-weighted XIRR, time-weighted return, and drift from your target weights with a hint for each class.',
        shot: {
          image: pocketInsights,
          crop: { x: 24, y: 10.5, w: 35.5, h: 34.5 },
          alt: 'Pocket insights with annualised return and rebalancing',
        },
      },
      {
        size: 'sm',
        title: 'A year at a glance',
        body: 'Portfolio value from one day to all time, with live IDX prices.',
        shot: {
          image: pocketHoldings,
          crop: { x: 24.3, y: 12, w: 35.7, h: 24 },
          alt: 'Pocket portfolio value chart',
        },
      },
    ],
    extras: [
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
      image: runwayHistory,
      alt: 'Runway history page with usage over seven days',
      caption: 'Usage history for every quota window.',
    },
    features: [
      {
        size: 'full',
        title: 'Fifteen providers. One glance',
        body: 'Claude, Gemini, ChatGPT, Copilot, OpenRouter, Ollama and more, each with remaining capacity and a reset timer.',
        shot: {
          image: runwayDashboard,
          crop: { x: 17.5, y: 41, w: 80.5, h: 56 },
          alt: 'Runway provider cards with usage bars and reset timers',
        },
      },
      {
        size: 'sm',
        title: 'At risk, on top',
        body: 'What is exhausted, or about to be, comes first.',
        shot: {
          image: runwayDashboard,
          crop: { x: 17.5, y: 11.5, w: 26.5, h: 16.5 },
          alt: 'Runway at-risk card for an exhausted quota',
        },
      },
      {
        size: 'lg',
        title: 'Pace, not just percent',
        body: 'Every window shows where usage should be right now, and where it will land at the reset.',
        shot: {
          image: runwayProvider,
          crop: { x: 17.5, y: 20, w: 40, h: 21.5 },
          alt: 'Runway quota windows with pace markers and projections',
        },
      },
      {
        size: 'sm',
        title: 'Forecasts',
        body: 'A Theil-Sen trend to the end of every window.',
        shot: {
          image: runwayProvider,
          crop: { x: 58, y: 20, w: 40, h: 21.5 },
          alt: 'Runway forecast chart for the current window',
        },
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
    features: [
      {
        size: 'half',
        title: 'Manifests first',
        body: 'DaVinci, FCPXML and EDL projects, then XMP IDs and filenames, then capture time and image similarity.',
        stat: 'FCPXML · EDL',
      },
      {
        size: 'half',
        title: 'A human in the loop',
        body: 'Low-confidence links wait in a review queue instead of guessing.',
        stat: 'Review',
      },
      {
        size: 'sm',
        title: 'RAW is the root',
        body: 'Originals are never modified.',
        stat: 'Immutable',
      },
      {
        size: 'sm',
        title: 'Trash buffer',
        body: 'Deleted media waits before it is gone.',
        stat: '30 days',
      },
      {
        size: 'sm',
        title: 'Verified reclaim',
        body: 'Space is only freed once a hash check passes.',
        stat: 'BLAKE3',
      },
    ],
  },
];
