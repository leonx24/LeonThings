import { projects } from "../../data/projects.js"
import { services } from "../../data/services.js"
import type { HarborDepthZone } from "../scroll/ScrollChoreographer"

export interface HarborMetric {
  label: string
  value: string
}

export interface HarborArchitectureStep {
  step: string
  label: string
  desc: string
}

export interface HarborModuleCategory {
  title: string
  desc: string
  items: string[]
}

export interface HarborKeybind {
  key: string
  desc: string
}

export interface HarborCodeSnippet {
  language: string
  filename: string
  code: string
}

export interface HarborProject {
  id: string
  slug: string
  index: string
  title: string
  subtitle: string
  category: string
  year: string
  version: string | null
  status: string
  techStack: string[]
  summary: string
  challenge: string
  solution: string
  result: string
  thumbnail: string
  gallery: string[]
  metrics: HarborMetric[]
  architecture: HarborArchitectureStep[]
  moduleCategories: HarborModuleCategory[]
  keybinds: HarborKeybind[]
  snippet: HarborCodeSnippet | null
  liveUrl: string | null
  repoUrl: string | null
  zone: HarborDepthZone
  depthLabel: string
  accentTone: "lantern" | "caustics"
  alignment: "left" | "right"
}

export interface HarborService {
  id: string
  title: string
  desc: string
  tech: string[]
}

interface RawProjectRecord {
  number: string
  title: string
  slug: string
  version?: string
  status?: string
  category?: string
  tags?: string[]
  year: string
  overview: string
  challenge: string
  solution: string
  result: string
  gallery?: string[]
  metrics?: HarborMetric[]
  architecture?: HarborArchitectureStep[]
  moduleCategories?: HarborModuleCategory[]
  keybinds?: HarborKeybind[]
  snippet?: HarborCodeSnippet
  liveUrl?: string
  repoUrl?: string
}

interface RawServiceRecord {
  id: string
  title: string
  desc: string
  tech: string[]
}

const DISCORD_BOT_MODULES: HarborModuleCategory[] = [
  {
    title: "Verification & Blacklist",
    desc: "Automated role gate & SQLite WAL bans",
    items: [
      "Instant Member Verification Panel",
      "Auto Role Provisioning Flow",
      "SQLite WAL HWID & Roblox ID Blacklist",
      "Zero-Race Concurrent Queries",
    ],
  },
  {
    title: "Support Ticket System",
    desc: "Queued claims, ratings & HTML logs",
    items: [
      "Private Channel Ticket Creator",
      "Staff Claim & Response Workflow",
      "Instant DM HTML Transcript Archive",
      "1–5 Star Experience Feedback",
    ],
  },
  {
    title: "Game Update Detector",
    desc: "5-minute Roblox API telemetry polling",
    items: [
      "Automated Game Version Diff Check",
      "Instant Server Embed Notifications",
      "Dynamic Voice Status Renamer",
      "Online / Testing / Maint Mode Sync",
    ],
  },
  {
    title: "Gateway & 24/7 Voice",
    desc: "Resilient Railway uptime & rate-limits",
    items: [
      "24/7 Alive Voice Heartbeat Lock",
      "Auto-Reconnect Recovery Handler",
      "Per-User Cooldown Rate Limiter",
      "Real-Time SSE Status Console",
    ],
  },
]

const DISCORD_BOT_METRICS: HarborMetric[] = [
  { label: "Uptime", value: "99.9% Live" },
  { label: "Database", value: "SQLite WAL" },
  { label: "API Poll", value: "5m Interval" },
  { label: "Hosting", value: "Railway 24/7" },
]

function adaptProject(raw: RawProjectRecord, idx: number): HarborProject {
  const indexLabel = raw.number || String(idx + 1).padStart(2, "0")
  const isLeonX = raw.slug === "leonx"
  const isDiscordBot = raw.slug === "discord-bot"

  const zone: HarborDepthZone = idx === 0 ? "waterline" : "depths"
  const alignment: "left" | "right" = idx % 2 === 0 ? "right" : "left"

  const thumbnail = isLeonX
    ? "/assets/harbor/thumb-leonx-windows.webp"
    : "/assets/harbor/thumb-leonx-bot.webp"

  const rawGallery = raw.gallery || []
  const gallery = isLeonX
    ? [thumbnail, ...rawGallery.slice(1)]
    : [thumbnail]

  return {
    id: raw.slug || `project-${indexLabel}`,
    slug: raw.slug,
    index: indexLabel,
    title: isLeonX
      ? "Leon X Windows"
      : isDiscordBot
        ? "LeonX-Bot"
        : raw.title,
    subtitle: isLeonX
      ? "Universal Roblox Luau Framework & Windows Execution Suite"
      : isDiscordBot
        ? "Discord Automation, Ticket Desk, Update Radar & SQLite WAL Gateway"
        : raw.category || "Systems Engineering",
    category: raw.category || "Systems & Automation",
    year: raw.year,
    version: raw.version || (isDiscordBot ? "v2.4 Live" : null),
    status: raw.status || "Active Production",
    techStack: isDiscordBot
      ? ["Discord.js", "TypeScript", "SQLite WAL", "Railway", "Roblox API"]
      : raw.tags || [],
    summary: isDiscordBot
      ? "Full-stack Discord community automation engine hosted 24/7 on Railway—combining instant verification, staff-claimed HTML ticket transcripts, dynamic status voice channels, SQLite WAL HWID blacklisting, and live Roblox update polling."
      : raw.overview,
    challenge: raw.challenge,
    solution: raw.solution,
    result: raw.result,
    thumbnail,
    gallery,
    metrics:
      raw.metrics && raw.metrics.length > 0
        ? raw.metrics
        : isDiscordBot
          ? DISCORD_BOT_METRICS
          : [],
    architecture: raw.architecture || [],
    moduleCategories:
      raw.moduleCategories && raw.moduleCategories.length > 0
        ? raw.moduleCategories
        : isDiscordBot
          ? DISCORD_BOT_MODULES
          : [],
    keybinds: raw.keybinds || [],
    snippet: raw.snippet || null,
    liveUrl: raw.liveUrl || null,
    repoUrl: raw.repoUrl || "https://github.com/leonx24",
    zone,
    depthLabel: isLeonX
      ? "Depth 01 · Waterline Horizon"
      : "Depth 02 · Abyssal Trench",
    accentTone: isLeonX ? "lantern" : "caustics",
    alignment,
  }
}

const ADAPTED_PROJECTS: HarborProject[] = (projects as RawProjectRecord[]).map(
  adaptProject
)

const ADAPTED_SERVICES: HarborService[] = (services as RawServiceRecord[]).map(
  (s) => ({
    id: s.id,
    title: s.title.replace(/\n/g, " "),
    desc: s.desc,
    tech: s.tech,
  })
)

export function getHarborProjects(): HarborProject[] {
  return ADAPTED_PROJECTS
}

export function getHarborProjectBySlug(
  slug: string | undefined
): HarborProject | undefined {
  if (!slug) return undefined
  return ADAPTED_PROJECTS.find((p) => p.slug === slug)
}

export function getHarborServices(): HarborService[] {
  return ADAPTED_SERVICES
}
