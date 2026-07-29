import { useState, useEffect, useRef } from "react"
import { Play, Trash2, RotateCcw, FileCode, Terminal, HelpCircle, Sparkles } from "lucide-react"

// Lua presets
const PRESETS = {
  spheres: {
    name: "spawner.lua",
    desc: "Spawns bouncing physical bodies in the viewport",
    code: `-- Preset: Sphere Spawner
local count = 25
local radius = 8

for i = 1, count do
    task.wait(0.04)
    Instance.new("Part", {
        Shape = "Ball",
        Size = radius,
        Color = Color3.random(),
        Position = Vector2.new(math.random(40, 420), 40)
    })
    print("Spawned Sphere #" .. i)
end
print("Execution completed. Enjoy the physics!")`
  },
  gravity: {
    name: "gravity_mod.lua",
    desc: "Modifies workplace gravity & applies wind forces",
    code: `-- Preset: Gravity & Wind Mod
local workspace = game:GetService("Workspace")

-- Lower gravity (standard is 0.6)
workspace.Gravity = 0.12
workspace.WindSpeed = 0.8

print("Success: Gravity set to 12%.")
print("Applied global wind factor: " .. workspace.WindSpeed)
print("Click and fling spheres to see the drift!")`
  },
  nuke: {
    name: "orb_explosion.lua",
    desc: "Detonates a localized blast wave pushing all bodies",
    code: `-- Preset: Orb Explosion
local power = 380
local x = math.random(100, 360)
local y = math.random(80, 220)

task.spawn(function()
    local exp = Instance.new("Explosion")
    exp.Position = Vector2.new(x, y)
    exp.BlastRadius = power
    exp:Hit()
end)

print("DETONATION: Explosion triggered at (" .. x .. ", " .. y .. ")")
print("Shockwave expanding with power: " .. power)`
  },
  rainbow: {
    name: "rainbow_chaos.lua",
    desc: "Toggles color-cycling trail effects on all parts",
    code: `-- Preset: Rainbow Chaos
local workspace = game:GetService("Workspace")
workspace.Theme = "Rainbow"
workspace.WindSpeed = 1.8

print("Rainbow cycle active!")
print("All bodies will now glow and leave color trails.")`
  }
}

export default function RobloxPlayground() {
  const [selectedPreset, setSelectedPreset] = useState("spheres")
  const [code, setCode] = useState(PRESETS.spheres.code)
  const [logs, setLogs] = useState([
    { type: "sys", text: "Leon X Environment initialized successfully.", time: "12:00:00" },
    { type: "sys", text: "Ready to run Lua script files. Type 'help()' or choose a preset.", time: "12:00:01" }
  ])
  const [activeTheme, setActiveTheme] = useState("default") // default, rainbow
  
  const canvasRef = useRef(null)
  const codeEditorRef = useRef(null)
  const terminalEndRef = useRef(null)
  
  // Physics simulation state refs (to prevent closure stale variables in canvas loops)
  const bodiesRef = useRef([])
  const physicsParamsRef = useRef({
    gravity: 0.6,
    wind: 0,
    rainbow: false,
    explosion: null // { x, y, maxRadius, currentRadius, force }
  })
  const mouseRef = useRef({ x: -1000, y: -1000, active: false })
  
  // Custom console print log helper
  const addLog = (type, text) => {
    const time = new Date().toTimeString().split(" ")[0]
    setLogs((prev) => [...prev, { type, text, time }])
  }

  // Auto-scroll terminal (only within the logs container, not the page)
  useEffect(() => {
    if (terminalEndRef.current) {
      const container = terminalEndRef.current.parentElement
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    }
  }, [logs])

  // Canvas Physics Engine Hook
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animationId
    
    // Scale for high DPI
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Primary Physics Loop
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const bodies = bodiesRef.current
      const params = physicsParamsRef.current
      const mouse = mouseRef.current
      
      // Update/Draw explosion wave if active
      if (params.explosion) {
        const exp = params.explosion
        exp.currentRadius += 10
        
        ctx.beginPath()
        ctx.arc(exp.x, exp.y, exp.currentRadius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(255, 60, 60, ${Math.max(0, 1 - exp.currentRadius / exp.maxRadius)})`
        ctx.lineWidth = 3
        ctx.stroke()
        
        ctx.beginPath()
        ctx.arc(exp.x, exp.y, exp.currentRadius * 0.7, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 120, 60, ${Math.max(0, 0.4 - exp.currentRadius / exp.maxRadius)})`
        ctx.fill()
        
        if (exp.currentRadius >= exp.maxRadius) {
          params.explosion = null
        }
      }

      // Draw Cursor Force Field range
      if (mouse.active) {
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 45, 0, Math.PI * 2)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)"
        ctx.setLineDash([4, 4])
        ctx.stroke()
        ctx.setLineDash([])
      }

      // Physics logic & Draw objects
      for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i]
        
        // Apply forces
        body.vy += params.gravity
        body.vx += params.wind
        
        // Update positions
        body.x += body.vx
        body.y += body.vy
        
        // Bounce off walls (horizontal)
        if (body.x - body.radius < 0) {
          body.x = body.radius
          body.vx = -body.vx * 0.75
        } else if (body.x + body.radius > canvas.width) {
          body.x = canvas.width - body.radius
          body.vx = -body.vx * 0.75
        }
        
        // Bounce off floor/ceiling
        if (body.y - body.radius < 0) {
          body.y = body.radius
          body.vy = -body.vy * 0.75
        } else if (body.y + body.radius > canvas.height) {
          body.y = canvas.height - body.radius
          body.vy = -body.vy * 0.65 // Ground inelastic friction
          body.vx *= 0.98           // Slide friction
        }

        // Apply Explosion shockwave force
        if (params.explosion) {
          const exp = params.explosion
          const dx = body.x - exp.x
          const dy = body.y - exp.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < exp.currentRadius + 20 && dist > exp.currentRadius - 30) {
            const angle = Math.atan2(dy, dx)
            const push = (1 - dist / exp.maxRadius) * 16
            body.vx += Math.cos(angle) * push
            body.vy += Math.sin(angle) * push
          }
        }

        // Cursor Repulsion/Attraction Force Field
        if (mouse.active) {
          const dx = body.x - mouse.x
          const dy = body.y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 45) {
            const angle = Math.atan2(dy, dx)
            const force = (45 - dist) * 0.12
            body.vx += Math.cos(angle) * force
            body.vy += Math.sin(angle) * force
          }
        }

        // Collision between balls (Simple grid check / double loop for realistic collision)
        for (let j = i + 1; j < bodies.length; j++) {
          const other = bodies[j]
          const dx = other.x - body.x
          const dy = other.y - body.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const minDist = body.radius + other.radius
          
          if (dist < minDist) {
            // Collision resolve
            const angle = Math.atan2(dy, dx)
            const targetX = body.x + Math.cos(angle) * minDist
            const targetY = body.y + Math.sin(angle) * minDist
            const ax = (targetX - other.x) * 0.4
            const ay = (targetY - other.y) * 0.4
            
            body.vx -= ax
            body.vy -= ay
            other.vx += ax
            other.vy += ay
          }
        }

        // Rainbow color shift
        if (params.rainbow) {
          body.hue = (body.hue + 1.5) % 360
          body.color = `hsl(${body.hue}, 95%, 65%)`
          
          // Draw trail
          body.trail.push({ x: body.x, y: body.y })
          if (body.trail.length > 8) body.trail.shift()
          
          ctx.beginPath()
          for (let t = 0; t < body.trail.length; t++) {
            const pt = body.trail[t]
            ctx.lineTo(pt.x, pt.y)
          }
          ctx.strokeStyle = `hsla(${body.hue}, 95%, 65%, 0.15)`
          ctx.lineWidth = body.radius * 0.6
          ctx.stroke()
        }

        // Draw body
        ctx.beginPath()
        ctx.arc(body.x, body.y, body.radius, 0, Math.PI * 2)
        ctx.fillStyle = body.color
        ctx.fill()
        
        // Gloss highlight overlay for Roblox shiny look
        ctx.beginPath()
        ctx.arc(body.x - body.radius * 0.3, body.y - body.radius * 0.3, body.radius * 0.25, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255, 255, 255, 0.45)"
        ctx.fill()
      }

      animationId = requestAnimationFrame(loop)
    }

    loop()
    
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  // Load a preset script
  const handlePresetSelect = (key) => {
    setSelectedPreset(key)
    setCode(PRESETS[key].code)
    addLog("info", `Loaded file: ${PRESETS[key].name}`)
  }

  // Parse and execute script mock-up
  const handleExecute = () => {
    addLog("run", "Executing code buffer...")
    
    // 1. Check for basic print commands in code
    const lines = code.split("\n")
    let index = 0
    
    // Simple custom instruction parsing
    let customGravity = 0.6
    let customWind = 0
    let isRainbow = false
    let numSpheres = 0
    let triggerExplode = false
    let explodePower = 350
    let logPrints = []

    lines.forEach((line) => {
      const trimmed = line.trim()
      if (trimmed.startsWith("--") || trimmed === "") return // Ignore comments

      // Parse print
      const printMatch = trimmed.match(/print\s*\(\s*"(.*?)"\s*\)/)
      const printConcatMatch = trimmed.match(/print\s*\(\s*"(.*?)"\s*\.\.\s*(.*?)\)/)
      if (printConcatMatch) {
        logPrints.push({ text: `${printConcatMatch[1]} (Dynamic Output)`, delay: index * 100 })
        index++
      } else if (printMatch) {
        logPrints.push({ text: printMatch[1], delay: index * 100 })
        index++
      }

      // Parse Gravity changes
      const gravMatch = trimmed.match(/workspace\.Gravity\s*=\s*([%d%.]+)/) || trimmed.match(/setGravity\s*\(\s*([%d%.]+)\s*\)/)
      if (gravMatch) {
        customGravity = parseFloat(gravMatch[1]) * 5 // Scale up for visual speed
      }

      // Parse Wind changes
      const windMatch = trimmed.match(/workspace\.WindSpeed\s*=\s*([%d%.]+)/) || trimmed.match(/applyWindForce\s*\(\s*([%d%.]+)?\s*\)/)
      if (windMatch) {
        customWind = parseFloat(windMatch[1] || "0.5")
      }

      // Parse Rainbow Theme
      if (trimmed.includes('Theme = "Rainbow"') || trimmed.includes("rainbow")) {
        isRainbow = true
      }

      // Parse Spawns
      const countMatch = trimmed.match(/local\s+count\s*=\s*(\d+)/) || trimmed.match(/spawnSpheres\s*\(\s*(\d+)\s*\)/)
      if (countMatch) {
        numSpheres = parseInt(countMatch[1])
      }
      if (trimmed.includes('Instance.new("Part"') || trimmed.includes("spawnSpheres")) {
        if (numSpheres === 0) numSpheres = 10
      }

      // Parse Explosions
      if (trimmed.includes("Explosion") || trimmed.includes("triggerExplosion") || trimmed.includes("nuke")) {
        triggerExplode = true
        const powerMatch = trimmed.match(/local\s+power\s*=\s*(\d+)/)
        if (powerMatch) explodePower = parseInt(powerMatch[1])
      }
    })

    // 2. Trigger logs sequentially
    if (logPrints.length === 0) {
      addLog("sys", "Compilation successful (0 warnings, 0 errors).")
    } else {
      logPrints.forEach((log) => {
        setTimeout(() => {
          addLog("lua", log.text)
        }, log.delay)
      })
    }

    // 3. Apply changes to live physics engine
    setTimeout(() => {
      physicsParamsRef.current.gravity = customGravity
      physicsParamsRef.current.wind = customWind
      physicsParamsRef.current.rainbow = isRainbow
      setActiveTheme(isRainbow ? "rainbow" : "default")
      
      // Spawn spheres if requested
      if (numSpheres > 0) {
        const canvas = canvasRef.current
        const maxSpawn = Math.min(numSpheres, 100) // Cap to prevent lag
        const newBodies = []
        
        for (let i = 0; i < maxSpawn; i++) {
          const r = Math.random() * 5 + 6
          const hue = Math.random() * 360
          newBodies.push({
            x: Math.random() * (canvas.width - 40) + 20,
            y: Math.random() * -150 - 20, // Spawn offscreen top
            vx: Math.random() * 4 - 2,
            vy: Math.random() * 2,
            radius: r,
            color: isRainbow ? `hsl(${hue}, 95%, 65%)` : `rgba(255, 255, 255, ${0.45 + Math.random() * 0.45})`,
            hue: hue,
            trail: []
          })
        }
        
        bodiesRef.current = [...bodiesRef.current, ...newBodies].slice(-120) // Cap max bodies
      }

      // Detonate explosion
      if (triggerExplode) {
        const canvas = canvasRef.current
        const ex = Math.random() * (canvas.width - 100) + 50
        const ey = Math.random() * (canvas.height - 120) + 60
        
        physicsParamsRef.current.explosion = {
          x: ex,
          y: ey,
          maxRadius: explodePower * 0.7,
          currentRadius: 0
        }
      }
    }, logPrints.length * 100 + 50)
  }

  // Clear workspace physics body objects
  const handleClearWorkspace = () => {
    bodiesRef.current = []
    physicsParamsRef.current = {
      gravity: 0.6,
      wind: 0,
      rainbow: false,
      explosion: null
    }
    setActiveTheme("default")
    addLog("info", "Workspace cleared. Physics bodies destroyed.")
  }

  // Reset environmental configurations
  const handleResetEnvironment = () => {
    physicsParamsRef.current.gravity = 0.6
    physicsParamsRef.current.wind = 0
    physicsParamsRef.current.rainbow = false
    setActiveTheme("default")
    addLog("info", "Environment variables reset to default (Gravity = 0.6).")
  }

  // Track cursor on viewport canvas
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true
    }
  }

  const handleMouseLeave = () => {
    mouseRef.current.active = false
  }

  // Syntactic highlights in text editor overlay
  const highlightCode = (rawCode) => {
    // 1. Extract strings to prevent keyword highlighting inside them
    const strings = []
    let tempCode = rawCode.replace(/(["'].*?["'])/g, (match) => {
      strings.push(match)
      return `__LUA_STR_${strings.length - 1}__`
    })

    // 2. Extract comments to prevent keyword highlighting inside comments
    const comments = []
    tempCode = tempCode.replace(/(--.*?)$/gm, (match) => {
      comments.push(match)
      return `__LUA_COMMENT_${comments.length - 1}__`
    })

    // 3. Highlight keywords
    tempCode = tempCode
      .replace(/\b(local|function|end|for|do|then|if|else|elseif|return)\b/g, '<span class="text-pink-500">$1</span>')
      .replace(/\b(print)\b/g, '<span class="text-emerald-400">$1</span>')
      .replace(/(Instance\.new|game|workspace)/g, '<span class="text-sky-400">$1</span>')

    // 4. Restore comments (with dark gray color)
    tempCode = tempCode.replace(/__LUA_COMMENT_(\d+)__/g, (match, index) => {
      return `<span class="text-white/30">${comments[parseInt(index)]}</span>`
    })

    // 5. Restore strings (with amber color)
    tempCode = tempCode.replace(/__LUA_STR_(\d+)__/g, (match, index) => {
      return `<span class="text-amber-300">${strings[parseInt(index)]}</span>`
    })

    return tempCode
  }

  return (
    <section
      id="playground"
      className="
        px-8
        lg:px-16

        pt-24
        lg:pt-32
        pb-24

        border-t
        border-white/[0.07]
        bg-[#070707]
        relative
        overflow-hidden
      "
    >
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex items-center gap-3.5 mb-14 font-mono uppercase tracking-[0.32em] text-[10px] text-white/35">
          <span className="w-7 h-px bg-white/35" />
          03. Interactive Playground
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Section Introduction Column */}
          <div className="lg:col-span-4 flex flex-col justify-between pr-0 lg:pr-8">
            <div>
              <h3 className="font-serif text-[clamp(32px,3.8vw,52px)] text-white leading-[1.1] mb-6">
                Test the <span className="italic text-white/60">script execution</span> environment.
              </h3>
              <p className="text-white/60 text-[13px] leading-[1.85] mb-8">
                In my primary scripting client, <strong>Leon X</strong>, performance and responsive interfaces are crucial. 
                Interact with this simulated execution board. Choose one of the preset Lua script files in the explorer, 
                hit execute, and watch the physics react. Hover over the canvas to affect bodies with gravity fields.
              </p>
            </div>

            {/* Presets/Files List */}
            <div className="space-y-3 mb-10 lg:mb-0">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/35 block mb-4">
                Script Presets (Lua)
              </span>
              
              {Object.keys(PRESETS).map((key) => {
                const preset = PRESETS[key]
                const isActive = selectedPreset === key
                return (
                  <button
                    key={key}
                    onClick={() => handlePresetSelect(key)}
                    className={`
                      w-full
                      text-left
                      p-4
                      rounded-lg
                      border
                      transition-all
                      duration-300
                      flex
                      items-start
                      gap-3.5
                      cursor-hover
                      ${
                        isActive
                          ? "bg-white/[0.03] border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.03)]"
                          : "bg-transparent border-white/[0.04] hover:bg-white/[0.015] hover:border-white/10"
                      }
                    `}
                  >
                    <FileCode size={16} className={isActive ? "text-white" : "text-white/40"} />
                    <div>
                      <div className={`font-mono text-[12px] ${isActive ? "text-white" : "text-white/70"}`}>
                        {preset.name}
                      </div>
                      <div className="text-[10px] text-white/40 mt-1 leading-[1.4]">
                        {preset.desc}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Executor & Viewport Mockup Window (8cols) */}
          <div className="lg:col-span-8">
            <div className="
              w-full 
              h-full 
              bg-black/50 
              border 
              border-white/[0.07] 
              backdrop-blur-md 
              rounded-xl 
              overflow-hidden 
              shadow-[0_24px_60px_-15px_rgba(0,0,0,0.8)] 
              flex 
              flex-col
            ">
              
              {/* Window Title Bar Header */}
              <div className="
                px-5 
                py-3.5 
                bg-[#0d0d0d] 
                border-b 
                border-white/[0.06] 
                flex 
                items-center 
                justify-between
                select-none
              ">
                <div className="flex items-center gap-2">
                  {/* MacOS styled buttons */}
                  <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <span className="font-mono text-[10px] text-white/50 tracking-wider ml-4">
                    LEON X v2.4.2 [EXECUTOR CLIENT]
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-3 font-mono text-[9px]">
                  <span className="text-emerald-500/80 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    STABLE
                  </span>
                  <span className="text-white/20">|</span>
                  <span className="text-white/35">PORT: 5173</span>
                </div>
              </div>

              {/* Main Window Workspace Workspace split */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/[0.06] h-[380px] md:h-[450px]">
                
                {/* Editor Shell (Left) */}
                <div className="flex flex-col h-full bg-[#0a0a0a]">
                  
                  {/* Editor Header controls */}
                  <div className="px-4 py-2 border-b border-white/[0.06] flex items-center justify-between bg-black/30">
                    <span className="font-mono text-[10px] text-white/45">Source Code Editor</span>
                    <div className="flex gap-2">
                      <button
                        onClick={handleResetEnvironment}
                        title="Reset Environment variables"
                        aria-label="Reset Environment"
                        className="p-1 rounded text-white/40 hover:text-white transition-colors cursor-hover hover:bg-white/[0.05]"
                      >
                        <RotateCcw size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Editor Code Area */}
                  <div className="flex-1 min-h-0 relative font-mono text-[12px] p-4 overflow-hidden flex">
                    {/* Line numbers gutter */}
                    <div className="text-white/20 text-right pr-3 select-none border-r border-white/[0.04] leading-[1.8] flex flex-col">
                      {Array.from({ length: 15 }).map((_, i) => (
                        <span key={i}>{(i + 1).toString().padStart(2, "0")}</span>
                      ))}
                    </div>

                    {/* Textarea editor and custom styled output highlights overlay */}
                    <div className="flex-1 relative h-full ml-3 leading-[1.8]">
                      {/* Highlight layer */}
                      <pre 
                        className="
                          absolute 
                          inset-0 
                          pointer-events-none 
                          whitespace-pre-wrap 
                          word-break-all 
                          text-white/80 
                          overflow-hidden
                        "
                        dangerouslySetInnerHTML={{ __html: highlightCode(code) }}
                      />
                      
                      {/* Transparent Textarea caret controller */}
                      <textarea
                        ref={codeEditorRef}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        aria-label="Lua Source Code Editor"
                        spellCheck="false"
                        className="
                          absolute 
                          inset-0 
                          w-full 
                          h-full 
                          bg-transparent 
                          text-transparent 
                          caret-white 
                          resize-none 
                          border-none 
                          outline-none 
                          whitespace-pre-wrap 
                          word-break-all
                          overflow-y-auto
                          focus:ring-0
                        "
                      />
                    </div>
                  </div>

                  {/* Run controls footer bar */}
                  <div className="p-3 border-t border-white/[0.06] flex items-center justify-between gap-3 bg-black/40">
                    <button
                      onClick={handleClearWorkspace}
                      aria-label="Clean Workspace"
                      className="
                        px-3.5 
                        py-1.5 
                        rounded 
                        border 
                        border-white/[0.07] 
                        text-[10px] 
                        font-mono 
                        text-white/50 
                        hover:text-white 
                        hover:bg-white/[0.04]
                        transition-all 
                        duration-200
                        flex
                        items-center
                        gap-1.5
                        cursor-hover
                      "
                    >
                      <Trash2 size={11} />
                      Clean
                    </button>

                    <button
                      onClick={handleExecute}
                      aria-label="Execute Lua Script"
                      className="
                        px-5 
                        py-1.5 
                        rounded 
                        bg-white 
                        text-black 
                        font-mono 
                        text-[10px] 
                        font-medium
                        hover:bg-white/90 
                        transition-all 
                        duration-200
                        flex
                        items-center
                        gap-1.5
                        shadow-[0_0_15px_rgba(255,255,255,0.15)]
                        cursor-hover
                      "
                    >
                      <Play size={11} fill="black" />
                      Execute
                    </button>
                  </div>
                </div>

                {/* Viewport Canvas Space (Right) */}
                <div className="flex flex-col h-full bg-[#080808] relative">
                  
                  {/* Viewport Header */}
                  <div className="px-4 py-2 border-b border-white/[0.06] flex items-center justify-between bg-black/30">
                    <span className="font-mono text-[10px] text-white/45">Roblox Workspace Viewport</span>
                    <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest flex items-center gap-1">
                      <Sparkles size={8} className="text-white/40 animate-pulse" />
                      3D Engine
                    </span>
                  </div>

                  {/* Physics Canvas Area */}
                  <div className="flex-1 relative overflow-hidden bg-black/40">
                    <canvas
                      ref={canvasRef}
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                      className="w-full h-full block cursor-crosshair"
                    />

                    {/* Simulated Game UI overlays */}
                    
                    {/* Roblox Leaderboard widget (top right) */}
                    <div className="
                      absolute 
                      top-3.5 
                      right-3.5 
                      bg-[#0d0d0d]/90 
                      border 
                      border-white/[0.05] 
                      p-2 
                      rounded 
                      font-mono 
                      text-[9px] 
                      w-32 
                      shadow-md
                      select-none
                      pointer-events-none
                    ">
                      <div className="text-white/35 uppercase text-[7px] tracking-wider mb-1 border-b border-white/[0.05] pb-0.5">
                        Players
                      </div>
                      <div className="flex justify-between items-center text-white/80">
                        <span className="truncate">Leon (Dev)</span>
                        <span className="text-emerald-400">1,337$</span>
                      </div>
                      <div className="flex justify-between items-center text-white/40 text-[8px] mt-0.5">
                        <span>Guest#102</span>
                        <span>0$</span>
                      </div>
                    </div>

                    {/* Gravity/Theme status tag (bottom left) */}
                    <div className="
                      absolute 
                      bottom-3.5 
                      left-3.5 
                      bg-[#0d0d0d]/95 
                      border 
                      border-white/[0.06] 
                      px-2.5 
                      py-1.5 
                      rounded-md 
                      font-mono 
                      text-[9px] 
                      text-white/60 
                      flex 
                      flex-col 
                      gap-0.5
                      shadow-lg
                      pointer-events-none
                      select-none
                    ">
                      <div className="flex items-center gap-1.5">
                        <span className="text-white/35">Gravity:</span>
                        <span className="text-white font-medium">
                          {(physicsParamsRef.current.gravity / 5).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-white/35">Wind:</span>
                        <span className="text-white font-medium">
                          {physicsParamsRef.current.wind.toFixed(1)}
                        </span>
                      </div>
                      {activeTheme === "rainbow" && (
                        <div className="text-pink-400 font-bold text-[8px] tracking-wider animate-pulse mt-0.5">
                          RAINBOW EFFECTS ACTIVE
                        </div>
                      )}
                    </div>

                    {/* Canvas Hover Prompt overlay if empty */}
                    {bodiesRef.current.length === 0 && (
                      <div className="
                        absolute 
                        inset-0 
                        flex 
                        flex-col 
                        items-center 
                        justify-center 
                        text-center 
                        px-6 
                        pointer-events-none 
                        select-none
                      ">
                        <HelpCircle className="text-white/10 mb-3" size={28} />
                        <div className="font-mono text-[11px] text-white/45 uppercase tracking-widest mb-1.5">
                          Viewport Empty
                        </div>
                        <div className="text-[10px] text-white/30 max-w-[200px] leading-relaxed">
                          Run the <code>spawner.lua</code> script or click Execute to generate physical bodies.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Console Logs Footer Panel (Syncd output) */}
              <div className="
                border-t 
                border-white/[0.06] 
                bg-[#060606] 
                h-[110px] 
                flex 
                flex-col
              ">
                <div className="
                  px-4 
                  py-1.5 
                  bg-[#0a0a0a] 
                  border-b 
                  border-white/[0.05] 
                  flex 
                  items-center 
                  gap-2 
                  font-mono 
                  text-[9px] 
                  text-white/45
                ">
                  <Terminal size={10} />
                  Output Logs
                </div>
                
                <div className="
                  flex-1 
                  overflow-y-auto 
                  p-4.5 
                  font-mono 
                  text-[11px] 
                  space-y-1.5
                  scroll-smooth
                ">
                  {logs.map((log, i) => {
                    let typeColor = "text-white/40"
                    let label = "PRINT"
                    if (log.type === "sys") {
                      typeColor = "text-sky-400/80"
                      label = "SYSTEM"
                    } else if (log.type === "run") {
                      typeColor = "text-amber-400"
                      label = "LAUNCH"
                    } else if (log.type === "info") {
                      typeColor = "text-white/60"
                      label = "INFO"
                    } else if (log.type === "lua") {
                      typeColor = "text-emerald-400"
                      label = "LUA"
                    }

                    return (
                      <div key={i} className="flex items-start gap-2.5 leading-relaxed">
                        <span className="text-white/20 select-none text-[10px]">{log.time}</span>
                        <span className={`text-[9px] tracking-wider uppercase font-semibold ${typeColor}`}>
                          [{label}]
                        </span>
                        <span className="text-white/70 flex-1 whitespace-pre-wrap">{log.text}</span>
                      </div>
                    )
                  })}
                  <div ref={terminalEndRef} />
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
