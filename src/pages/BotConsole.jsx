import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  LayoutDashboard,
  Terminal,
  Server,
  FileText,
  Users,
  Settings,
  Sparkles,
  RotateCw,
  Clock,
  ArrowRight,
  ArrowLeft,
  Menu,
  X
} from "lucide-react"

import GridLines from "../components/gridLines"
import Noise from "../components/noise"
import CustomCursor from "../components/CustomCursor"

export default function BotConsole() {
  const [activeSection, setActiveSection] = useState("Dashboard")
  const [isRestarting, setIsRestarting] = useState(false)
  const [botStatus, setBotStatus] = useState("Online")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Discord Integration & Webhook Form State
  const [username, setUsername] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  
  // Whitelist/Blacklist State
  const [blacklistUser, setBlacklistUser] = useState("")
  const [blacklistReason, setBlacklistReason] = useState("")
  const [blacklist, setBlacklist] = useState([
    { id: 1, discord_id: "284910293021", roblox_id: "739201", hwid: "N/A", reason: "Spamming verify command in multiple guilds", created_at: "2026-06-25" },
    { id: 2, discord_id: "104829302109", roblox_id: "402910", hwid: "N/A", reason: "Attempted exploit payload execution", created_at: "2026-06-24" }
  ])

  // Servers List State (Synced with guildsList from Railway Bot API)
  const [serversList, setServersList] = useState([
    { name: "Leon's Lounge", id: "1515261708531404920", members: 450, icon: null }
  ])

  // Database Command Usage State
  const [commandUsage, setCommandUsage] = useState([
    { command: "verify", uses: 248 },
    { command: "script", uses: 120 },
    { command: "status", uses: 95 },
    { command: "faq", uses: 68 },
    { command: "ticket", uses: 42 }
  ])



  // Database Warnings State
  const [warnings, setWarnings] = useState([
    { id: 1, user_id: "Guest#102", reason: "Spamming berlebih (Auto Mod Timeout)", created_at: "12m ago" }
  ])

  // New Command Setup
  const [newCmdName, setNewCmdName] = useState("")
  const [newCmdDesc, setNewCmdDesc] = useState("")
  const [commandsList, setCommandsList] = useState([
    { name: "verify", desc: "Verifikasi akun dan dapatkan role member", active: true },
    { name: "script", desc: "Kirim script loader untuk LeonX Hub", active: true },
    { name: "status", desc: "Lihat status layanan script dan database", active: true },
    { name: "faq", desc: "Jawaban pertanyaan yang sering diajukan", active: true },
    { name: "ticket", desc: "Kelola sistem ticket support", active: true },
    { name: "changelog", desc: "Lihat log rilis update terbaru", active: true },
    { name: "bug-report", desc: "Kirimkan laporan bug ke admin", active: true },
  ])

  // Toast State
  const [toast, setToast] = useState({ show: false, message: "", type: "success" })
  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type })
  }

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }))
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [toast.show])

  // Bot Statistics State
  const [liveStats, setLiveStats] = useState({
    status: "ONLINE",
    ping: "14ms",
    guilds: "12",
    users: "1,248",
    uptime: "48d 12h",
    ram: "8.3%",
    ramRaw: "42.5 MB",
    cpu: "1.2%",
    tickets: 27,
    warnings: 5,
    avatar: null,
    botTag: "El Bot#8981"
  })

  // System Audit Logs State
  const [systemLogs, setSystemLogs] = useState([
    { type: "info", text: "Database connection pools established successfully", time: "2m ago" },
    { type: "info", text: "Registered 7 application slash commands with Discord API", time: "5m ago" },
    { type: "warn", text: "Webhook warning latency detected (Dallas node latency spike)", time: "18m ago" },
    { type: "info", text: "SQLite Database bot.db opened and journal set to WAL", time: "48d ago" }
  ])

  const [activeLogFilter, setActiveLogFilter] = useState("all")

  // Add system log entry helper
  const addSystemLog = (type, text) => {
    setSystemLogs((prev) => [
      { type, text, time: "Just now" },
      ...prev
    ])
  }

  // Uptime formatting
  const formatUptime = (ms) => {
    if (!ms) return "0s"
    const secs = Math.floor(ms / 1000)
    const mins = Math.floor(secs / 60)
    const hours = Math.floor(mins / 60)
    const days = Math.floor(hours / 24)
    return days > 0 
      ? `${days}d ${hours % 24}h`
      : hours > 0 
      ? `${hours}h ${mins % 60}m`
      : `${mins}m`
  }

  // Manual refresh helper
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const triggerStatsFetch = () => {
    setRefreshTrigger((prev) => prev + 1)
    showToast("Database synchronization complete", "success")
  }

  // Setup loop
  useEffect(() => {
    const fetchStats = async () => {
      const statsUrl = import.meta.env.VITE_BOT_API_URL
      if (!statsUrl) return

      try {
        const res = await fetch(statsUrl)
        if (res.ok) {
          const data = await res.json()
          
          setLiveStats({
            status: data.status || "ONLINE",
            ping: `${data.ping || 14}ms`,
            guilds: String(data.guilds || 12),
            users: (data.users || 1248).toLocaleString(),
            uptime: formatUptime(data.uptime),
            ram: `${Math.min(100, Math.round((data.memory / 512) * 1000) / 10)}%`,
            ramRaw: `${data.memory} MB`,
            cpu: "1.2%",
            tickets: data.stats?.tickets || 27,
            warnings: data.stats?.warnings || 5,
            avatar: data.avatar || null,
            botTag: data.botTag || "El Bot#8981"
          })

          // Sync with SQLite tables in real-time
          if (data.blacklist && Array.isArray(data.blacklist)) {
            setBlacklist(data.blacklist)
          }
          if (data.commandUsage && Array.isArray(data.commandUsage)) {
            setCommandUsage(data.commandUsage)
          }
          if (data.guildsList && Array.isArray(data.guildsList)) {
            setServersList(data.guildsList)
          }
          if (data.warnings && Array.isArray(data.warnings)) {
            setWarnings(data.warnings)
          }
        }
      } catch (e) {
        console.error("Failed to fetch live stats:", e)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [refreshTrigger])

  // Restart Bot Simulation
  const triggerRestart = () => {
    if (isRestarting) return
    setIsRestarting(true)
    setBotStatus("Restarting")
    showToast("Restart sequence initiated...", "info")
    addSystemLog("warn", "System reboot triggered by admin panel web portal")

    setTimeout(() => {
      setIsRestarting(false)
      setBotStatus("Online")
      showToast("Bot successfully restarted!", "success")
      addSystemLog("info", "System initialized and ready. Bot online.")
      setRefreshTrigger((prev) => prev + 1)
    }, 3000)
  }

  // AI Assist Simulation
  const triggerAIAssist = () => {
    setRefreshTrigger((prev) => prev + 1)
    showToast("AI Diagnostic: RAM optimal, Ping normal, 0 database lockouts.", "success")
  }

  // Handle Discord Webhook submission
  const handleWebhookSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !message.trim()) return

    setSubmitting(true)
    const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL

    const embedPayload = {
      username: "LeonX Web Dashboard",
      avatar_url: "https://raw.githubusercontent.com/leonx24/LeonX/main/favicon.png",
      embeds: [
        {
          title: "💬 New Website Feedback",
          color: 0xD4AF37,
          description: "Feedback/test message submitted from your premium dashboard.",
          fields: [
            { name: "Sender Nickname", value: username, inline: true },
            { name: "Environment", value: "React Dashboard", inline: true },
            { name: "Message", value: message },
          ],
          timestamp: new Date().toISOString(),
          footer: { text: "ScriptHub Control Panel" }
        }
      ]
    }

    if (!webhookUrl) {
      setTimeout(() => {
        setSubmitting(false)
        setUsername("")
        setMessage("")
        showToast("Simulation: Embed compiled! Setup VITE_DISCORD_WEBHOOK_URL in .env.", "info")
        addSystemLog("info", "Simulated webhook feedback trigger sent to mock channel")
      }, 1000)
      return
    }

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(embedPayload),
      })

      setSubmitting(false)
      if (response.ok) {
        setUsername("")
        setMessage("")
        showToast("Message successfully sent to Discord!", "success")
        addSystemLog("info", `Real webhook notification sent to Discord channel`)
      } else {
        showToast(`Failed: Status ${response.status}`, "error")
      }
    } catch {
      setSubmitting(false)
      showToast("Network error connecting to webhook.", "error")
    }
  }

  // Blacklist form submit (POST to database)
  const handleBlacklistSubmit = async (e) => {
    e.preventDefault()
    if (!blacklistUser.trim() || !blacklistReason.trim()) return

    const statsUrl = import.meta.env.VITE_BOT_API_URL
    const blacklistUrl = statsUrl ? statsUrl.replace("/api/stats", "/api/blacklist") : null

    if (!blacklistUrl) {
      // Fallback Simulation Mode
      const newEntry = {
        id: Date.now(),
        discord_id: blacklistUser,
        roblox_id: "N/A",
        hwid: "N/A",
        reason: blacklistReason,
        created_at: new Date().toISOString().split("T")[0]
      }
      setBlacklist((prev) => [newEntry, ...prev])
      addSystemLog("warn", `Added user ID ${blacklistUser} to SQLite blacklist (Simulation)`)
      setBlacklistUser("")
      setBlacklistReason("")
      showToast(`User ID ${blacklistUser} blacklisted (Simulated)`, "success")
      return
    }

    try {
      const res = await fetch(blacklistUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          discordId: blacklistUser,
          reason: blacklistReason
        })
      })
      if (res.ok) {
        showToast(`User ID ${blacklistUser} blacklisted in SQLite database`, "success")
        setBlacklistUser("")
        setBlacklistReason("")
        setRefreshTrigger((prev) => prev + 1)
      } else {
        showToast("Failed to blacklist user on live database", "error")
      }
    } catch {
      showToast("Network error connecting to database API.", "error")
    }
  }

  // Remove blacklist entry (DELETE from database)
  const removeBlacklist = async (id) => {
    const statsUrl = import.meta.env.VITE_BOT_API_URL
    const blacklistUrl = statsUrl 
      ? statsUrl.replace("/api/stats", `/api/blacklist?id=${id}`) 
      : null

    if (!blacklistUrl) {
      setBlacklist((prev) => prev.filter((item) => item.id !== id))
      addSystemLog("info", `Removed ID ${id} from blacklist index (Simulation)`)
      showToast(`User whitelist restored (Simulated)`, "success")
      return
    }

    try {
      const res = await fetch(blacklistUrl, { method: "DELETE" })
      if (res.ok) {
        showToast("Whitelist restored in SQLite database", "success")
        setRefreshTrigger((prev) => prev + 1)
      } else {
        showToast("Failed to remove user from database blacklist", "error")
      }
    } catch {
      showToast("Network error connection failure.", "error")
    }
  }

  // Toggle Command active state
  const toggleCommand = (name) => {
    setCommandsList((prev) =>
      prev.map((cmd) => (cmd.name === name ? { ...cmd, active: !cmd.active } : cmd))
    )
    showToast(`Command /${name} active state toggled.`, "info")
    addSystemLog("info", `Command /${name} active toggled in runtime configuration`)
  }

  // Add Command form submit
  const handleAddCommandSubmit = (e) => {
    e.preventDefault()
    if (!newCmdName.trim() || !newCmdDesc.trim()) return

    const newCmd = {
      name: newCmdName.toLowerCase().replace(/\s+/g, "-"),
      desc: newCmdDesc,
      active: true
    }

    setCommandsList((prev) => [...prev, newCmd])
    addSystemLog("info", `Registered mockup command /${newCmd.name}`)
    setNewCmdName("")
    setNewCmdDesc("")
    showToast(`Command /${newCmd.name} added!`, "success")
  }

  return (
    <main className="bg-[#0A0A0C] text-[#F0EFE8] h-screen w-screen overflow-hidden flex flex-col md:flex-row font-sans antialiased selection:bg-[#D4AF37]/35 selection:text-white relative">
      <CustomCursor />
      <GridLines />
      <Noise />

      {/* Global Toast */}
      <div
        className={`
          fixed
          bottom-6
          right-4
          md:bottom-10
          md:right-8
          z-[9999]
          px-4
          py-3
          md:px-5
          md:py-3.5
          border
          bg-[#16161C]
          font-mono
          text-[10px]
          md:text-[11px]
          shadow-2xl
          transition-all
          duration-300
          rounded-sm
          max-w-[90vw]
          ${
            toast.show
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          }
          ${
            toast.type === "success"
              ? "border-[#4ADE80]/30 text-[#4ADE80] shadow-[#4ADE80]/5"
              : toast.type === "error"
              ? "border-[#F87171]/30 text-[#F87171] shadow-[#F87171]/5"
              : "border-[#D4AF37]/30 text-[#D4AF37] shadow-[#D4AF37]/5"
          }
        `}
      >
        <span className="mr-2">💡</span>
        {toast.message}
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed md:relative
        inset-y-0 left-0
        w-[260px] md:w-[220px]
        shrink-0
        bg-[#111115]
        border-r border-white/[0.06]
        flex flex-col justify-between
        p-5 h-full
        z-40 md:z-10
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div>
          {/* Brand Area */}
          <div className="pb-5 border-b border-white/[0.06] mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[#D4AF37] font-semibold text-[14px] uppercase tracking-[0.25em]">
                  ScriptHub
                </h2>
                <span className="text-[#8A8990] text-[8px] font-mono tracking-wider mt-1 block uppercase">
                  Bot Control Panel
                </span>
              </div>
            </div>
            {/* Back to Home Button */}
            <div className="flex gap-2">
              <Link
                to="/"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-sm bg-white/[0.03] border border-white/[0.06] text-[#8A8990] hover:text-[#D4AF37] hover:border-[#D4AF37]/20 hover:bg-[#D4AF37]/5 transition-all duration-200 font-mono text-[10px] uppercase tracking-wider"
              >
                <ArrowLeft size={11} />
                Back to Home
              </Link>
              {/* Close sidebar button (mobile only) */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden p-2 rounded-sm bg-white/[0.03] border border-white/[0.06] text-[#8A8990] hover:text-[#F0EFE8] transition-all"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Nav Items */}
          <nav>
            <ul className="flex flex-col gap-1.5">
              {[
                { name: "Dashboard", icon: LayoutDashboard },
                { name: "Commands", icon: Terminal, badge: commandsList.length, badgeType: "gold" },
                { name: "Servers", icon: Server, badge: liveStats.guilds, badgeType: "gold" },
                { name: "Logs", icon: FileText, badge: systemLogs.filter(l => l.type === "warn").length + "!", badgeType: "red" },
                { name: "Users", icon: Users },
                { name: "Settings", icon: Settings },
              ].map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.name
                return (
                  <li key={item.name}>
                    <button
                      onClick={() => { setActiveSection(item.name); setSidebarOpen(false) }}
                      className={`
                        w-full
                        px-3
                        py-2.5
                        rounded-sm
                        flex
                        items-center
                        justify-between
                        font-mono
                        text-[11px]
                        tracking-wider
                        transition-all
                        duration-150
                        ${
                          isActive
                            ? "bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37]"
                            : "text-[#8A8990] hover:text-[#F0EFE8] hover:bg-white/[0.02] border border-transparent"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={13} className={isActive ? "text-[#D4AF37]" : "text-[#8A8990]"} />
                        <span>{item.name}</span>
                      </div>

                      {item.badge !== undefined && (
                        <span
                          className={`
                            px-1.5
                            py-0.5
                            rounded-sm
                            text-[8px]
                            font-extrabold
                            ${
                              item.badgeType === "red"
                                ? "bg-[#F87171]/20 text-[#F87171] border border-[#F87171]/20"
                                : "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/20"
                            }
                          `}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>

        {/* Bot Status Panel at bottom */}
        <div className="pt-5 border-t border-white/[0.06] flex items-center gap-3">
          {liveStats.avatar ? (
            <img src={liveStats.avatar} alt="Bot Avatar" className="w-9 h-9 rounded-full border border-[#D4AF37]/20 object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center font-serif text-[13px] text-[#D4AF37] select-none">
              {liveStats.botTag[0]}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="font-mono text-[10px] font-bold text-[#F0EFE8] truncate">{liveStats.botTag}</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`
                  w-1.5 
                  h-1.5 
                  rounded-full 
                  ${
                    botStatus === "Online"
                      ? "bg-[#4ADE80] shadow-[0_0_6px_#4ADE80]"
                      : "bg-[#F87171] shadow-[0_0_6px_#F87171]"
                  }
                  ${isRestarting ? "animate-pulse" : ""}
                `}
              />
              <span className="text-[#8A8990] text-[8px] font-mono uppercase tracking-wider">{botStatus}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* CONTENT WORKSPACE (Fills remaining width and spans full height) */}
      <section className="flex-grow flex flex-col h-full overflow-hidden bg-[#0A0A0C]/40 relative z-10">
        
        {/* TOPBAR */}
        <header className="h-[56px] md:h-[65px] px-4 md:px-8 bg-[#111115] border-b border-white/[0.06] flex items-center justify-between shrink-0">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 -ml-1 mr-3 rounded-sm text-[#8A8990] hover:text-[#D4AF37] hover:bg-white/[0.03] transition-all"
          >
            <Menu size={18} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-[#F0EFE8] text-[13px] font-semibold tracking-wider">
              {activeSection}
            </h1>
            <div className="flex items-center gap-1.5 text-[#8A8990] text-[8px] font-mono mt-0.5 uppercase tracking-wider">
              <span>System</span>
              <span>/</span>
              <span>{activeSection}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={triggerAIAssist}
              className="
                px-2.5 md:px-3.5
                py-1.5
                bg-white/[0.02]
                hover:bg-white/[0.05]
                border
                border-white/[0.06]
                hover:border-white/15
                rounded-sm
                flex
                items-center
                gap-1.5 md:gap-2
                font-mono
                text-[9px] md:text-[10px]
                text-[#8A8990]
                hover:text-[#F0EFE8]
                transition-all
                duration-150
              "
            >
              <Sparkles size={11} className="text-[#D4AF37]/75" />
              <span className="hidden sm:inline">AI Assist</span>
            </button>

            <button
              onClick={triggerRestart}
              disabled={isRestarting}
              className="
                px-2.5 md:px-3.5
                py-1.5
                bg-[#D4AF37]/10
                hover:bg-[#D4AF37]/20
                border
                border-[#D4AF37]/20
                hover:border-[#D4AF37]/30
                rounded-sm
                flex
                items-center
                gap-1.5 md:gap-2
                font-mono
                text-[9px] md:text-[10px]
                text-[#D4AF37]
                transition-all
                duration-150
                disabled:opacity-50
              "
            >
              <RotateCw size={11} className={`text-[#D4AF37] ${isRestarting ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Restart Bot</span>
            </button>
          </div>
        </header>

        {/* DYNAMIC DASHBOARD WORKSPACE (Independent scrolling) */}
        <div className="p-4 md:p-8 overflow-y-auto flex-1">
          
          {/* VIEW 1: DASHBOARD */}
          {activeSection === "Dashboard" && (
            <div className="flex flex-col gap-6 max-w-7xl mx-auto">
              
              {/* Stats Row (4 Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: "Servers", value: liveStats.guilds, change: "+12.4%", label: "Active Guilds", icon: Server, color: "text-blue-400" },
                  { title: "Members", value: liveStats.users, change: "+15.8%", label: "Verified Users", icon: Users, color: "text-cyan-400" },
                  { title: "Commands", value: commandUsage.reduce((acc, c) => acc + c.uses, 0).toLocaleString(), change: "+8.3%", label: "Requests Executed", icon: Terminal, color: "text-[#D4AF37]" },
                  { title: "Uptime", value: liveStats.uptime, change: "100%", label: "System Uptime", icon: Clock, color: "text-purple-400" }
                ].map((stat, i) => {
                  const Icon = stat.icon
                  return (
                    <div
                      key={i}
                      className="
                        relative
                        bg-[#16161C]
                        border
                        border-white/[0.06]
                        p-6
                        rounded-md
                        overflow-hidden
                        hover:border-[#D4AF37]/20
                        hover:shadow-[0_0_15px_rgba(212,175,55,0.03)]
                        transition-all
                        duration-300
                        group
                      "
                    >
                      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-[#D4AF37]/35 opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-2 bg-white/[0.02] border border-white/[0.04] rounded-sm ${stat.color}`}>
                          <Icon size={13} />
                        </div>
                        <span className="font-mono text-[9px] text-[#4ADE80] font-extrabold bg-[#4ADE80]/10 border border-[#4ADE80]/20 px-1.5 py-0.5 rounded-sm">
                          {stat.change}
                        </span>
                      </div>

                      <div className="font-mono text-[24px] font-bold text-[#F0EFE8] leading-none mb-1">
                        {stat.value}
                      </div>
                      <span className="text-[#8A8990] text-[9px] font-mono tracking-wide uppercase">
                        {stat.label}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Log & Analytics row */}
              <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
                
                {/* SQLite Database Command Logs (Pulled from SQLite command_usage) */}
                <div className="bg-[#16161C] border border-white/[0.06] p-6 rounded-md flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#8A8990] mb-5 block">Command execution stats (SQLite)</span>
                    
                    <div className="flex flex-col gap-3">
                      {commandUsage.length === 0 ? (
                        <span className="text-[#8A8990] font-mono text-[10.5px]">No command records in database.</span>
                      ) : (
                        commandUsage.map((log, index) => (
                          <div key={index} className="flex items-center justify-between font-mono text-[10.5px] border-b border-white/[0.02] pb-2.5 last:border-0 last:pb-0">
                            <div className="flex items-center gap-3">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] shadow-[0_0_5px_#4ADE80]" />
                              <div className="flex items-center">
                                <span className="text-[#D4AF37]/50 font-bold mr-0.5">/</span>
                                <span className="text-[#F0EFE8] font-medium">{log.command}</span>
                              </div>
                            </div>

                            <div className="flex gap-4 text-[#8A8990]">
                              <span>Global Queries</span>
                              <span className="text-[#D4AF37] font-bold">{log.uses.toLocaleString()} runs</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Activity Chart & Top Servers block */}
                <div className="flex flex-col gap-6">
                  
                  {/* Activity Chart */}
                  <div className="bg-[#16161C] border border-white/[0.06] p-6 rounded-md">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#8A8990] mb-4 block">Activity Chart</span>
                    
                    <div className="flex flex-col gap-2.5">
                      {[
                        { day: "Mon", val: 40, active: false },
                        { day: "Tue", val: 65, active: false },
                        { day: "Wed", val: 48, active: false },
                        { day: "Thu", val: 82, active: false },
                        { day: "Fri", val: 74, active: false },
                        { day: "Sat", val: 110, active: true },
                        { day: "Sun", val: 95, active: false }
                      ].map((d) => (
                        <div key={d.day} className="flex items-center gap-3">
                          <span className="font-mono text-[9px] text-[#8A8990] w-7">{d.day}</span>
                          <div className="flex-1 h-3 bg-white/[0.02] border border-white/[0.04] rounded-sm overflow-hidden p-[1px]">
                            <div
                              className={`
                                h-full 
                                rounded-sm 
                                transition-all 
                                duration-500
                                ${d.active ? "bg-[#D4AF37]" : "bg-[#D4AF37]/45"}
                              `}
                              style={{ width: `${(d.val / 110) * 100}%` }}
                            />
                          </div>
                          <span className="font-mono text-[9px] text-[#F0EFE8] w-8 text-right">{d.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Servers */}
                  <div className="bg-[#16161C] border border-white/[0.06] p-6 rounded-md">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#8A8990] mb-4 block">Top Servers</span>
                    
                    <div className="flex flex-col gap-3.5">
                      {serversList.map((srv, i) => (
                        <div key={i} className="flex items-center justify-between gap-3 pb-1 border-b border-white/[0.02] last:border-0 last:pb-0">
                          <div className="flex items-center gap-3 min-w-0">
                            {srv.icon ? (
                              <img src={srv.icon} alt={srv.name} className="w-7 h-7 rounded-full border border-white/10 shrink-0 object-cover" />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-neutral-900 border border-white/10 flex items-center justify-center font-serif text-[10px] font-bold text-[#D4AF37] shrink-0">
                                {srv.name[0]}
                              </div>
                            )}
                            <div className="flex flex-col min-w-0">
                              <span className="font-mono text-[11px] font-semibold text-[#F0EFE8] truncate leading-tight">{srv.name}</span>
                              <span className="text-[#8A8990] text-[8px] leading-tight mt-0.5">{srv.members} members</span>
                            </div>
                          </div>
                          <span className="font-mono text-[10px] text-[#D4AF37] font-bold shrink-0">Active</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Bottom row metrics */}
              <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1.8fr_1fr] gap-6">
                
                {/* Health Ring */}
                <div className="bg-[#16161C] border border-white/[0.06] p-6 rounded-md flex flex-col justify-between items-center text-center">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#8A8990] mb-4 self-start">Bot Health Ring</span>
                  
                  <div className="relative w-28 h-28 flex items-center justify-center mb-4">
                    <svg className="absolute w-full h-full transform -rotate-90">
                      <circle cx="56" cy="56" r="48" stroke="rgba(255,255,255,0.03)" strokeWidth="5.5" fill="transparent" />
                      <circle cx="56" cy="56" r="48" stroke="#D4AF37" strokeWidth="6" fill="transparent" strokeDasharray="301.6" strokeDashoffset="0.3" />
                    </svg>
                    <div className="flex flex-col items-center">
                      <span className="font-mono text-[20px] font-extrabold text-[#F0EFE8] leading-none">99.9%</span>
                      <span className="text-[#8A8990] text-[8px] font-mono tracking-widest uppercase mt-1">Uptime</span>
                    </div>
                  </div>

                  <div className="flex justify-around gap-6 w-full pt-4 border-t border-white/[0.04]">
                    <div className="flex flex-col items-center">
                      <span className="font-mono text-[11px] font-bold text-[#F0EFE8]">{liveStats.ping}</span>
                      <span className="text-[#8A8990] text-[7.5px] font-mono tracking-wider uppercase">Latency</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="font-mono text-[11px] font-bold text-[#F0EFE8]">{liveStats.ramRaw}</span>
                      <span className="text-[#8A8990] text-[7.5px] font-mono tracking-wider uppercase">Memory</span>
                    </div>
                  </div>
                </div>

                {/* SQLite Database Warnings and Audit log */}
                <div className="bg-[#16161C] border border-white/[0.06] p-6 rounded-md flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#8A8990] mb-5 block">Recent Warn Records (SQLite database)</span>
                    
                    <div className="flex flex-col gap-3.5">
                      {warnings.length === 0 ? (
                        <span className="text-[#8A8990] font-mono text-[10.5px]">No warning entries found in database.</span>
                      ) : (
                        warnings.map((log) => (
                          <div key={log.id} className="flex items-center justify-between font-mono text-[10px] pb-1.5 border-b border-white/[0.02] last:border-0 last:pb-0">
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#F87171] shadow-[0_0_4px_#F87171] shrink-0" />
                              <span className="text-[#F0EFE8] font-bold">User: {log.user_id}</span>
                              <span className="text-[#8A8990] truncate max-w-[200px]">{log.reason}</span>
                            </div>
                            <span className="text-[#8A8990]/40 text-[9px] shrink-0">{log.created_at}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-[#16161C] border border-white/[0.06] p-6 rounded-md flex flex-col">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#8A8990] mb-5 block">Quick Acts</span>
                  
                  <div className="flex flex-col gap-3">
                    {[
                      { label: "Synchronize DB", action: triggerStatsFetch },
                      { label: "Clear Cache", action: () => { showToast("Cache flushed", "success"); addSystemLog("info", "Purged expired verification sessions cache") } },
                      { 
                        label: "Maintenance Toggle", 
                        action: () => {
                          const isMaint = botStatus === "Maintenance"
                          setBotStatus(isMaint ? "Online" : "Maintenance")
                          showToast(isMaint ? "Maintenance mode disabled" : "Maintenance mode enabled", "info")
                          addSystemLog("warn", isMaint ? "System returned to normal operational status" : "System placed in maintenance mode")
                        }
                      }
                    ].map((act, index) => (
                      <button
                        key={index}
                        onClick={act.action}
                        className="
                          w-full
                          px-4
                          py-3
                          bg-white/[0.01]
                          hover:bg-[#D4AF37]/5
                          border
                          border-white/[0.04]
                          hover:border-[#D4AF37]/20
                          rounded-md
                          text-left
                          font-mono
                          text-[10px]
                          tracking-wider
                          text-[#8A8990]
                          hover:text-[#D4AF37]
                          transition-all
                          duration-150
                          flex
                          items-center
                          justify-between
                          group
                        "
                      >
                        <span>{act.label}</span>
                        <ArrowRight size={10} className="text-[#8A8990] group-hover:text-[#D4AF37] transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* VIEW 2: COMMANDS */}
          {activeSection === "Commands" && (
            <div className="flex flex-col gap-6 max-w-7xl mx-auto">
              
              {/* Add Command Form Card */}
              <div className="bg-[#16161C] border border-white/[0.06] p-6 rounded-md">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#8A8990] mb-4 block">Register New Command Mockup</span>
                
                <form onSubmit={handleAddCommandSubmit} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_120px] gap-4 items-end">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[8px] uppercase tracking-wider text-[#8A8990]">Command Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. timeout"
                      value={newCmdName}
                      onChange={(e) => setNewCmdName(e.target.value)}
                      className="
                        w-full
                        px-3
                        py-2
                        bg-[#0A0A0C]
                        border
                        border-white/10
                        focus:border-[#D4AF37]/40
                        text-white
                        font-mono
                        text-[11px]
                        focus:outline-none
                        transition-all
                        rounded-sm
                      "
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[8px] uppercase tracking-wider text-[#8A8990]">Command Description</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Timeout a user in the Discord guild for spamming"
                      value={newCmdDesc}
                      onChange={(e) => setNewCmdDesc(e.target.value)}
                      className="
                        w-full
                        px-3
                        py-2
                        bg-[#0A0A0C]
                        border
                        border-white/10
                        focus:border-[#D4AF37]/40
                        text-white
                        font-mono
                        text-[11px]
                        focus:outline-none
                        transition-all
                        rounded-sm
                      "
                    />
                  </div>

                  <button
                    type="submit"
                    className="
                      w-full
                      py-2
                      bg-[#D4AF37]/10
                      hover:bg-[#D4AF37]/20
                      border
                      border-[#D4AF37]/20
                      hover:border-[#D4AF37]/35
                      text-[#D4AF37]
                      font-mono
                      text-[10px]
                      uppercase
                      tracking-widest
                      transition-all
                      rounded-sm
                      font-bold
                    "
                  >
                    Add Cmd
                  </button>
                </form>
              </div>

              {/* Commands table */}
              <div className="bg-[#16161C] border border-white/[0.06] p-6 rounded-md">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#8A8990] mb-5 block">Registered Commands</span>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-[11px] border-collapse leading-relaxed">
                    <thead>
                      <tr className="border-b border-white/[0.08] text-[#8A8990]">
                        <th className="pb-3 font-normal">Command</th>
                        <th className="pb-3 font-normal">Description</th>
                        <th className="pb-3 font-normal text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commandsList.map((cmd) => (
                        <tr key={cmd.name} className="border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.01]">
                          <td className="py-3 text-white">
                            <span className="text-[#D4AF37] font-semibold">/</span>
                            {cmd.name}
                          </td>
                          <td className="py-3 text-[#8A8990]">{cmd.desc}</td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => toggleCommand(cmd.name)}
                              className={`
                                px-2.5
                                py-1
                                rounded-sm
                                text-[9px]
                                uppercase
                                font-bold
                                transition-colors
                                ${
                                  cmd.active
                                    ? "bg-[#4ADE80]/15 text-[#4ADE80] border border-[#4ADE80]/20"
                                    : "bg-white/[0.02] text-[#8A8990] border border-white/[0.05]"
                                }
                              `}
                            >
                              {cmd.active ? "Active" : "Inactive"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* VIEW 3: SERVERS */}
          {activeSection === "Servers" && (
            <div className="bg-[#16161C] border border-white/[0.06] p-6 rounded-md max-w-7xl mx-auto">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#8A8990] mb-5 block">Linked Discord Servers</span>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-[11px] border-collapse leading-relaxed">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-[#8A8990]">
                      <th className="pb-3 font-normal">Server Name</th>
                      <th className="pb-3 font-normal">Guild ID</th>
                      <th className="pb-3 font-normal">Members</th>
                      <th className="pb-3 font-normal text-right">Accumulated Commands</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Leon's Lounge", id: "1515261708531404920", members: "450", cmds: "2,482" },
                      { name: "Fish It Community", id: "1515320618839445515", members: "380", cmds: "1,842" },
                      { name: "Roblox Scripting Hub", id: "1519760077853032488", members: "192", cmds: "920" },
                      { name: "Developer Workspace", id: "1464209826010763463", members: "128", cmds: "640" },
                      { name: "Admin Test Chamber", id: "1519681008834842724", members: "98", cmds: "410" }
                    ].map((srv) => (
                      <tr key={srv.id} className="border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.01]">
                        <td className="py-3 text-white font-medium">{srv.name}</td>
                        <td className="py-3 text-[#8A8990]/65">{srv.id}</td>
                        <td className="py-3 text-[#8A8990]">{srv.members}</td>
                        <td className="py-3 text-right text-[#D4AF37] font-bold">{srv.cmds}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW 4: LOGS */}
          {activeSection === "Logs" && (
            <div className="bg-[#16161C] border border-white/[0.06] p-6 rounded-md max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#8A8990]">System Logs Audit Stream</span>
                
                <div className="flex border border-white/10 rounded-sm overflow-hidden bg-[#0A0A0C]">
                  {["all", "info", "warn", "error"].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setActiveLogFilter(lvl)}
                      className={`
                        px-3 
                        py-1 
                        font-mono 
                        text-[9.5px] 
                        uppercase 
                        tracking-wider
                        transition-all
                        ${
                          activeLogFilter === lvl
                            ? "bg-white/10 text-white"
                            : "text-[#8A8990] hover:text-white"
                        }
                      `}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stream Box */}
              <div className="h-[480px] bg-black/45 rounded-md border border-white/[0.04] p-5 overflow-y-auto flex flex-col gap-3 font-mono text-[10.5px]">
                {systemLogs
                  .filter(log => activeLogFilter === "all" || log.type === activeLogFilter)
                  .map((log, index) => (
                    <div key={index} className="flex justify-between items-start gap-4 pb-2 border-b border-white/[0.01]">
                      <div className="flex gap-3">
                        <span
                          className={`
                            px-1.5
                            py-0.5
                            rounded-sm
                            text-[8px]
                            uppercase
                            font-bold
                            shrink-0
                            ${
                              log.type === "info"
                                ? "bg-[#4ADE80]/15 text-[#4ADE80] border border-[#4ADE80]/20"
                                : log.type === "warn"
                                ? "bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/20"
                                : "bg-[#F87171]/15 text-[#F87171] border border-[#F87171]/20"
                            }
                          `}
                        >
                          {log.type}
                        </span>
                        <span className="text-[#F0EFE8] leading-relaxed select-text">{log.text}</span>
                      </div>
                      <span className="text-[#8A8990]/40 text-[9px] shrink-0 whitespace-nowrap">{log.time}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* VIEW 5: USERS */}
          {activeSection === "Users" && (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6 max-w-7xl mx-auto">
              
              {/* Blacklist Control Form */}
              <div className="bg-[#16161C] border border-white/[0.06] p-6 rounded-md flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#8A8990] mb-5 block">Restrict User Access (SQLite Database)</span>
                  
                  <form onSubmit={handleBlacklistSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[8px] uppercase tracking-wider text-[#8A8990]">Discord User ID</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 14642098260107"
                        value={blacklistUser}
                        onChange={(e) => setBlacklistUser(e.target.value)}
                        className="
                          w-full
                          px-3
                          py-2
                          bg-[#0A0A0C]
                          border
                          border-white/10
                          focus:border-[#D4AF37]/45
                          text-white
                          font-mono
                          text-[11px]
                          focus:outline-none
                          transition-all
                          rounded-sm
                        "
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[8px] uppercase tracking-wider text-[#8A8990]">Reason</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Explain reason for script ban..."
                        value={blacklistReason}
                        onChange={(e) => setBlacklistReason(e.target.value)}
                        className="
                          w-full
                          px-3
                          py-2
                          bg-[#0A0A0C]
                          border
                          border-white/10
                          focus:border-[#D4AF37]/45
                          text-white
                          font-mono
                          text-[11px]
                          focus:outline-none
                          transition-all
                          rounded-sm
                          resize-none
                        "
                      />
                    </div>

                    <button
                      type="submit"
                      className="
                        w-full
                        py-2.5
                        bg-[#F87171]/10
                        hover:bg-[#F87171]/20
                        border
                        border-[#F87171]/20
                        hover:border-[#F87171]/35
                        text-[#F87171]
                        font-mono
                        text-[10px]
                        uppercase
                        tracking-widest
                        transition-all
                        rounded-sm
                        font-bold
                      "
                    >
                      Blacklist User
                    </button>
                  </form>
                </div>
              </div>

              {/* Blacklisted list database */}
              <div className="bg-[#16161C] border border-white/[0.06] p-6 rounded-md">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#8A8990] mb-5 block">Blacklisted user index (SQLite `blacklist` table)</span>
                
                <div className="flex flex-col gap-4 max-h-[480px] overflow-y-auto pr-2">
                  {blacklist.length === 0 ? (
                    <span className="text-[#8A8990] font-mono text-[10.5px]">No restricted users found in SQLite database.</span>
                  ) : (
                    blacklist.map((item) => (
                      <div key={item.id} className="flex justify-between items-start gap-4 p-4 border border-white/[0.03] bg-black/10 rounded-sm">
                        <div className="flex flex-col min-w-0">
                          <span className="font-mono text-[12px] font-bold text-white mb-1 flex items-center gap-2">
                            ID: {item.discord_id || "N/A"}
                            {item.roblox_id && <span className="text-[10px] text-[#8A8990]/65">(Roblox ID: {item.roblox_id})</span>}
                            <span className="bg-[#F87171]/10 border border-[#F87171]/20 text-[#F87171] text-[8px] font-mono uppercase font-extrabold px-1 rounded-sm">
                              RESTRICTED
                            </span>
                          </span>
                          <span className="font-sans text-[11px] text-[#8A8990] leading-relaxed mb-1 select-text">{item.reason}</span>
                          <span className="font-mono text-[8px] text-[#8A8990]/40">Added: {item.created_at}</span>
                        </div>

                        <button
                          onClick={() => removeBlacklist(item.id, item.discord_id)}
                          className="
                            px-2
                            py-1
                            bg-white/[0.02]
                            hover:bg-[#4ADE80]/10
                            border
                            border-white/[0.05]
                            hover:border-[#4ADE80]/30
                            text-[#8A8990]
                            hover:text-[#4ADE80]
                            font-mono
                            text-[8px]
                            uppercase
                            tracking-wider
                            transition-all
                            rounded-sm
                            shrink-0
                          "
                        >
                          Unban
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

          {/* VIEW 6: SETTINGS */}
          {activeSection === "Settings" && (
            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 max-w-7xl mx-auto">
              
              {/* Core variables configurations */}
              <div className="bg-[#16161C] border border-white/[0.06] p-6 rounded-md">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#8A8990] mb-5 block">Configuration Keys</span>
                
                <div className="flex flex-col gap-4">
                  {[
                    { name: "CLIENT_ID", val: "1519•••••••••1407" },
                    { name: "GUILD_ID", val: "1515•••••••••4920" },
                    { name: "OWNER_ID", val: "1464•••••••••3463" },
                    { name: "VERIFIED_ROLE_ID", val: "1519•••••••••2506" },
                    { name: "STATUS_VOICE_CHANNEL_ID", val: "1519•••••••••2488" }
                  ].map((cfg) => (
                    <div key={cfg.name} className="flex flex-col gap-1.5 pb-3 border-b border-white/[0.03] last:border-b-0 last:pb-0">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-[#8A8990]">{cfg.name}</label>
                      <input
                        type="text"
                        disabled
                        value={cfg.val}
                        className="
                          w-full
                          px-3
                          py-2
                          bg-[#0A0A0C]
                          border
                          border-white/10
                          text-[#8A8990]
                          font-mono
                          text-[11px]
                          focus:outline-none
                          rounded-sm
                          cursor-not-allowed
                        "
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Webhook form wrapper */}
              <div className="bg-[#16161C] border border-white/[0.06] p-6 rounded-md flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#8A8990] mb-5 block">Discord Webhook Channel</span>
                  
                  <form onSubmit={handleWebhookSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[8px] uppercase tracking-wider text-[#8A8990]">Nickname</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Administrator"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="
                          w-full
                          px-3
                          py-2
                          bg-[#0A0A0C]
                          border
                          border-white/10
                          focus:border-[#D4AF37]/45
                          text-white
                          font-mono
                          text-[11px]
                          focus:outline-none
                          transition-all
                          rounded-sm
                        "
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[8px] uppercase tracking-wider text-[#8A8990]">Feedback Message</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Write a message to dispatch..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="
                          w-full
                          px-3
                          py-2
                          bg-[#0A0A0C]
                          border
                          border-white/10
                          focus:border-[#D4AF37]/45
                          text-white
                          font-mono
                          text-[11px]
                          focus:outline-none
                          transition-all
                          rounded-sm
                          resize-none
                        "
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="
                        w-full
                        py-2.5
                        bg-[#D4AF37]/10
                        hover:bg-[#D4AF37]/20
                        border
                        border-[#D4AF37]/20
                        hover:border-[#D4AF37]/35
                        text-[#D4AF37]
                        font-mono
                        text-[10px]
                        uppercase
                        tracking-widest
                        transition-all
                        duration-300
                        disabled:opacity-55
                        disabled:cursor-not-allowed
                        rounded-sm
                        font-bold
                      "
                    >
                      {submitting ? "Sending..." : "Send Webhook"}
                    </button>
                  </form>
                </div>
              </div>

            </div>
          )}

        </div>

      </section>

    </main>
  )
}
