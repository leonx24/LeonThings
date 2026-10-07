import Leonx from "../assets/images/leonx.webp"
import Leonx2 from "../assets/images/leonx2.webp"
import Leonx3 from "../assets/images/leonx3.webp"

import dcbot from "../assets/images/leonxbot.webp"

export const projects = [
  {
    number: "01",
    title: "Leon X",
    slug: "leonx",
    tags: ["Lua", "Roblox", "UI"],
    year: "2026",
    overview: "Leon X is a Roblox scripting project focused on clean UI, performance, and a modern execution experience.",
    challenge: "Build a powerful Roblox utility while keeping the interface simple, responsive, and easy to navigate.",
    solution: "Created a modular architecture with reusable components, optimized logic, and a modern monochrome design system.",
    result: "Delivered a polished scripting experience with improved usability, performance, and scalability.",
    gallery: [Leonx, Leonx2, Leonx3],
    architecture: [
      { step: "01", label: "Game Process Injection", desc: "Injects and binds the custom environment into the target game client safely." },
      { step: "02", label: "Metatable Redirection", desc: "Intercepts and redirects core metamethods (__index, __namecall) to enable safe execution hooks." },
      { step: "03", label: "Luau Execution Engine", desc: "Compiles and executes raw Luau scripts within a highly isolated thread environment." },
      { step: "04", label: "Railway Synced Client", desc: "Synchronizes user HWID metrics and authentication keys with Railway API gateways." }
    ],
    snippet: {
      language: "luau",
      filename: "init.lua",
      code: `-- Leon X Hook Engine Initializer
local getrawmetatable = getrawmetatable or debug.getmetatable
local setreadonly = setreadonly or make_writeable

local mt = getrawmetatable(game)
setreadonly(mt, false)

local old_namecall = mt.__namecall
mt.__namecall = newcclosure(function(self, ...)
    local method = getnamecallmethod()
    if method == "FireServer" and tostring(self) == "LogWebhook" then
        print("Filtered hook client event: " .. method)
        return nil -- Block tracking events
    end
    return old_namecall(self, ...)
end)

print("Leon X Hook Environment Initialized.")`
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