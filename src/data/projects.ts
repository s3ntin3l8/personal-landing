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
import pocketActivity from '../assets/shots/pocket/activity-dark-wide.png';
import pocketInsights from '../assets/shots/pocket/insights-dark-wide.png';
import pocketTax from '../assets/shots/pocket/tax-dark-wide.png';
import pocketHoldingsNarrow from '../assets/shots/pocket/holdings-dark-narrow.png';
import pocketActivityNarrow from '../assets/shots/pocket/activity-dark-narrow.png';
import pocketInsightsNarrow from '../assets/shots/pocket/insights-dark-narrow.png';

import runwayDashboard from '../assets/shots/runway/dashboard.png';
import runwayProvider from '../assets/shots/runway/provider.png';
import runwayHistory from '../assets/shots/runway/history.png';
import runwayFleet from '../assets/shots/runway/fleet.png';

export interface Feature {
  title: string;
  body: string;
  /** Screenshot shown next to this feature. Omit when there is none yet. */
  shot?: { image: ImageMetadata; alt: string };
}

export interface Project {
  id: string;
  name: string;
  kicker: string;
  tagline: string;
  blurb: string;
  accent: string;
  accent2?: string;
  logo: ImageMetadata;
  github: string;
  stack: string[];
  features: Feature[];
  /** Phone screenshots, rendered in a strip under the walkthrough. */
  phones?: { image: ImageMetadata; alt: string }[];
  /** Hero visual. 'graph' is a stand-in illustration until real captures exist. */
  hero: { image: ImageMetadata; alt: string } | 'graph';
}

export const projects: Project[] = [
  {
    id: 'mullion',
    name: 'Mullion',
    kicker: 'Mission control for AI CLIs',
    tagline: 'Every agent session, tiled in one persistent browser dashboard.',
    blurb:
      'Run Claude Code, Codex, opencode and friends on your own host, then drive them all from a single tab, on your desktop or your phone.',
    accent: '#0e9f6e',
    accent2: '#34d399',
    logo: mullionLogo,
    github: 'https://github.com/s3ntin3l8/mullion-session-manager',
    stack: ['TypeScript', 'Fastify', 'React', 'xterm.js', 'SQLite', 'PWA'],
    hero: {
      image: mullionDashboard,
      alt: 'Mullion dashboard with two agent sessions tiled next to the project sidebar',
    },
    features: [
      {
        title: 'Tiled and persistent',
        body: 'Split, tab and save named workspace layouts. Sessions live on the host under dtach and systemd, so they survive redeploys and closed tabs.',
        shot: {
          image: mullionDashboard,
          alt: 'Terminal session open in the Mullion workspace',
        },
      },
      {
        title: 'Task Master',
        body: 'A Kanban board from backlog through review to done, with a default model per CLI, so agents can pick up work on their own.',
        shot: { image: mullionKanban, alt: 'Mullion Task Master Kanban board' },
      },
      {
        title: 'Git and worktrees built in',
        body: 'A per-project dock with branch and worktree pickers, plus status and attention signals so you see which session needs you.',
        shot: {
          image: mullionGit,
          alt: 'Mullion git panel showing branches and worktrees',
        },
      },
    ],
    phones: [
      { image: mullionMobileList, alt: 'Mullion session list on a phone' },
      { image: mullionMobileTerminal, alt: 'Mullion terminal on a phone' },
    ],
  },
  {
    id: 'pocket',
    name: 'Pocket',
    kicker: 'Self-hosted portfolio tracker',
    tagline: 'Your whole portfolio, from a screenshot to a tax report.',
    blurb:
      'Equities, gold, bonds, funds and cash in one place. Import from screenshots, CSV, PDF or live broker sync, and keep the data on your own server.',
    accent: '#12b981',
    accent2: '#ffd24a',
    logo: pocketLogo,
    github: 'https://github.com/s3ntin3l8/pocket-portfolio-tracker',
    stack: ['TypeScript', 'Next.js', 'Fastify', 'Postgres', 'Tailwind', 'PWA'],
    hero: {
      image: pocketHoldings,
      alt: 'Pocket holdings overview in dark mode',
    },
    features: [
      {
        title: 'Every asset in one view',
        body: 'Equities, gold, bonds, mutual funds and cash, with live Indonesian exchange prices and a real-time gold ticker.',
        shot: { image: pocketHoldings, alt: 'Pocket holdings page' },
      },
      {
        title: 'Import from a screenshot',
        body: 'LLM vision reads broker screenshots. CSV and PDF parsers cover DKB, IBKR, Trade Republic and Coinbase, with direct sync for Trade Republic and IBKR.',
        shot: {
          image: pocketActivity,
          alt: 'Pocket activity page listing imported transactions',
        },
      },
      {
        title: 'Returns that make sense',
        body: 'XIRR and time-weighted return, a round-trip trade log, and allocation targets with drift and rebalancing hints.',
        shot: {
          image: pocketInsights,
          alt: 'Pocket insights page with return and allocation charts',
        },
      },
      {
        title: 'German and Indonesian tax',
        body: 'Reports for the Freistellungsauftrag and the Indonesian final-tax regime, in an English and Indonesian interface.',
        shot: { image: pocketTax, alt: 'Pocket tax report page' },
      },
    ],
    phones: [
      { image: pocketHoldingsNarrow, alt: 'Pocket holdings on a phone' },
      { image: pocketActivityNarrow, alt: 'Pocket activity on a phone' },
      { image: pocketInsightsNarrow, alt: 'Pocket insights on a phone' },
    ],
  },
  {
    id: 'runway',
    name: 'Runway',
    kicker: 'AI subscription limits dashboard',
    tagline: 'See how much AI you have left, and when it runs out.',
    blurb:
      'A local-first dashboard for the remaining capacity and reset timers across your whole AI stack, with forecasts instead of surprises.',
    accent: '#8b5cf6',
    accent2: '#60a5fa',
    logo: runwayLogo,
    github: 'https://github.com/s3ntin3l8/runway-ai-usage-tracker',
    stack: ['Python', 'FastAPI', 'React', 'Tailwind', 'SQLite', 'Docker'],
    hero: {
      image: runwayDashboard,
      alt: 'Runway dashboard with provider quota cards',
    },
    features: [
      {
        title: '15 providers, one glance',
        body: 'Claude, Gemini, ChatGPT and Codex, Copilot, OpenRouter, Ollama, Grok and more, with remaining capacity and reset timers on every card.',
        shot: { image: runwayDashboard, alt: 'Runway home dashboard' },
      },
      {
        title: 'Three ways to get the data',
        body: 'APIs first, web scraping next, local files as the last resort. Each provider detail page shows models, windows and usage.',
        shot: { image: runwayProvider, alt: 'Runway provider detail page' },
      },
      {
        title: 'Forecasts, not guesses',
        body: 'Event-sourced history plus Theil-Sen forecasts tell you when a quota will run out, before it does.',
        shot: {
          image: runwayHistory,
          alt: 'Runway history page with usage trends',
        },
      },
      {
        title: 'A fleet of sidecars',
        body: 'Manage the sidecars that collect your data, keep logins alive, and get Discord or Slack alerts when something is at risk.',
        shot: { image: runwayFleet, alt: 'Runway fleet management page' },
      },
    ],
  },
  {
    id: 'branchdam',
    name: 'branchDAM',
    kicker: 'Graph-based digital asset management',
    tagline: 'Every edit, proxy and export, traced back to the original RAW.',
    blurb:
      'A local-first DAM that models your media as a version graph. The camera RAW is the immutable root, and everything you make from it hangs off as a child node.',
    accent: '#6366f1',
    accent2: '#2ba69a',
    logo: branchdamLogo,
    github: 'https://github.com/s3ntin3l8/branchdam',
    stack: ['Go', 'SQLite', 'React', 'Kotlin', 'SwiftUI', 'Docker'],
    hero: 'graph',
    features: [
      {
        title: 'RAW is the root',
        body: 'Originals are immutable. Edits, proxies and exports link back through a version graph you can explore on a canvas.',
      },
      {
        title: 'Links you can trust',
        body: 'Project manifests (DaVinci, FCPXML, EDL), then XMP IDs and filenames, then camera serial, capture time and image similarity. Low-confidence links land in a human review queue.',
      },
      {
        title: 'Storage that is safe',
        body: 'A master archive, a 30-day trash buffer, and BLAKE3-verified space reclaim, with Immich integration and companion apps for mobile and the workstation.',
      },
    ],
  },
];
