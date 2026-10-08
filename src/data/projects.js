import Leonx from "../assets/images/leonx.webp"
import Leonx2 from "../assets/images/leonx2.webp"
import Leonx3 from "../assets/images/leonx3.webp"

import dcbot from "../assets/images/leonxbot.webp"

export const projects = [
  {
    number: "01",
    title: "Leon X",
    slug: "leonx",
    version: "v1.0.5",
    status: "Active Production",
    category: "Universal Script Framework",
    tags: ["Luau", "Roblox", "CyberNoir UI", "Cloudflare Workers", "Stealth Architecture"],
    year: "2026",
    overview: "Leon X is a high-performance Universal Roblox Enhancement Script framework engineered in Luau. Built around the CyberNoir UI v5.1 design system, it features an asynchronous parallel bootloader, PlaceId-isolated config serialization, and secure edge distribution via Cloudflare Workers.",
    challenge: "Engineering a 56+ feature suite across diverse Roblox games that guarantees sub-millisecond execution, bypasses client-side anti-cheat heuristics (BAC 10516/1513/6518/8519/7516), and provides seamless profile persistence across servers with zero UI lag.",
    solution: "Constructed a flat-registry UI engine with 7 dynamic themes, async parallel bootloader with DUMMY safe-wrappers, PlaceId-isolated config serialization with background diff auto-saving, and Cloudflare Worker edge proxy with GitLab private distribution.",
    result: "Delivered a rock-solid, zero-detection execution experience with 56+ universal & game-specific automation modules, instant multi-select ESP, and sub-150ms boot times.",
    gallery: [Leonx, Leonx2, Leonx3],
    metrics: [
      { label: "Codebase", value: "56+ Modules" },
      { label: "Boot Telemetry", value: "<150ms Async" },
      { label: "Theme Engine", value: "7 Palettes" },
      { label: "Edge Delivery", value: "Cloudflare" }
    ],
    moduleCategories: [
      {
        title: "Movement Engine",
        desc: "Zero-rubberband physics & spatial manipulation",
        items: ["Stepped Teleport (Safe Increments)", "Fly with Shift-Sprint Boost (2x)", "Noclip & Anti-Ragdoll", "Walk on Water & Anti-Void", "Position Backtracker (Cancel Fling)"]
      },
      {
        title: "Combat & Visuals",
        desc: "Real-time client telemetry & target rendering",
        items: ["Hitbox Expander with Wall ESP", "Player ESP (Health Bar, Distance & Glow)", "Persistent Fullbright & Fog Removal", "Tracers & Super Anti-Lag Performance Booster"]
      },
      {
        title: "Automation Suites",
        desc: "Game-specific suites & recorded macros",
        items: ["Ride a Pet: Rarity Priority Farm", "Egg Teleport & Instant Pickup", "Waypoint Queue Engine (Playback/Queue)", "Auto-Clicker with Anti-Detection Jitter"]
      },
      {
        title: "Stealth & Delivery",
        desc: "Hardened security & distributed networking",
        items: ["CyberNoir UI Flat-Registry (Zero Tree Scans)", "Cloudflare Worker Edge Distribution", "BAC Heuristics Evasion (10516/1513/6518)", "PlaceId Config Profiles + Diff Auto-Save"]
      }
    ],
    keybinds: [
      { key: "U", desc: "Toggle CyberNoir UI Window / Mobile Floating Toggle" },
      { key: "Delete", desc: "Panic Key (Instantly kill all modules & close UI)" },
      { key: "F", desc: "Toggle Fly (LeftShift for 2x sprint boost)" },
      { key: "N", desc: "Toggle Noclip" },
      { key: "T", desc: "Teleport to Nearest / Selected Egg (Ride a Pet)" },
      { key: "G", desc: "Teleport to Selected Saved Waypoint" },
      { key: "X", desc: "Start / Stop Waypoint Queue Playback" },
      { key: "C", desc: "Toggle Auto-Clicker (Live Jitter CPS)" },
      { key: "H", desc: "Toggle Hitbox Expander" },
      { key: "B", desc: "Rewind Position Backtracker (Teleport back 5-10s)" }
    ],
    architecture: [
      { step: "01", label: "Parallel Async Bootloader", desc: "Spawns 56+ universal modules concurrently via task.spawn with safe metatable wrappers, eliminating sequential network delays." },
      { step: "02", label: "Flat-Registry CyberNoir UI", desc: "Zero descendant tree scanning with centralized Flag registry, Lucide multi-CDN asset loader, and 7 dynamic theme palettes." },
      { step: "03", label: "PlaceId Config & Diff Auto-Save", desc: "Serializes component states into isolated executor filesystem JSON profiles with background diff-detection auto-save." },
      { step: "04", label: "Cloudflare Edge Gateway", desc: "Proxies private GitLab repository via Cloudflare Worker edge routes with token verification, cache-busting, and retry backoff." }
    ],
    snippet: {
      language: "luau",
      filename: "bootloader.lua",
      code: `-- Leon X Parallel Async Bootloader & Safe Wrapper
local MODULES_TO_LOAD = {
    { key = "ConfigMgr",    path = "modules/core/configmanager.lua" },
    { key = "Fly",          path = "modules/movements/fly.lua" },
    { key = "SteppedTP",    path = "modules/movements/stepped_tp.lua" },
    { key = "HitboxExp",    path = "modules/combat/hitbox.lua" },
    { key = "ESP",          path = "modules/visuals/esp.lua" },
    { key = "AutoClicker",  path = "modules/automation/autoclicker.lua" },
    { key = "RideAPet",     path = "modules/games/rideapet.lua" },
}

local moduleResults = {}
local moduleDone = 0
local TOTAL = #MODULES_TO_LOAD

-- Parallel thread dispatcher (eliminates sequential HTTP latency)
for _, item in ipairs(MODULES_TO_LOAD) do
    local key, path = item.key, item.path
    task.spawn(function()
        local res = secureLoad(path)
        moduleResults[key] = safeWrap(res)
        moduleDone = moduleDone + 1
        setSplashProgress(0.05 + 0.90 * (moduleDone / TOTAL))
    end)
end

while moduleDone < TOTAL do task.wait() end
print("[LeonX v1.0.5] All 56 modules initialized in parallel.")`
    }
  },
  {
    number: "02",
    title: "Discord Bot",
    slug: "discord-bot",
    tags: ["TypeScript", "JavaScript"],
    year: "2026",
    overview: "A Discord bot built with Python and hosted on Railway, featuring a clean UI and modern execution experience.",
    challenge: "Build a powerful Discord bot while keeping the interface simple, responsive, and easy to navigate.",
    solution: "Created a modular architecture with reusable components, optimized logic, and a modern monochrome design system.",
    result: "Delivered a polished scripting experience with improved usability, performance, and scalability.",
    gallery: [dcbot],
    architecture: [
      { step: "01", label: "Discord Client Payload", desc: "User triggers application slash commands or dashboard verification buttons." },
      { step: "02", label: "Railway Gateway Server", desc: "Node.js webhook handler receiving secure API events from the Discord Gateway." },
      { step: "03", label: "DB Transaction WAL", desc: "SQLite WAL transactional engine validating database queries for whitelists & logging." },
      { step: "04", label: "API Sync Console", desc: "Real-time SSE event synchronizer updating the web status dashboard." }
    ],
    snippet: {
      language: "typescript",
      filename: "gatewayLimiter.ts",
      code: `import { Collection } from "discord.js";

const cooldowns = new Collection<string, number>();

export async function checkRateLimit(
  userId: string, 
  limitMs = 3000
): Promise<boolean> {
  const now = Date.now();
  const lastActive = cooldowns.get(userId) || 0;
  
  if (now - lastActive < limitMs) {
    return false; // Action rejected (cooldown active)
  }
  
  cooldowns.set(userId, now);
  return true; // Action permitted
}`
    }
  }
]