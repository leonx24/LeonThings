const ZONE_META = {
  surface: {
    label: "Surface",
    dotClass: "bg-[#ffd27d] shadow-[0_0_10px_#ffd27d]",
  },
  waterline: {
    label: "Waterline",
    dotClass: "bg-[#4fa3b8] shadow-[0_0_10px_#4fa3b8]",
  },
  depths: {
    label: "Depths",
    dotClass: "bg-[#7ee8fa] shadow-[0_0_10px_#7ee8fa]",
  },
  abyss: {
    label: "Abyss",
    dotClass: "bg-[#6cc5d8] shadow-[0_0_10px_#6cc5d8]",
  },
}

const NAV_ITEMS = [
  { id: "surface", label: "Surface" },
  { id: "works", label: "Works" },
  { id: "about", label: "Craft" },
  { id: "contact", label: "Contact" },
]

export default function NavigationDock({
  activeZone = "surface",
  progress = 0,
  onNavigate,
}) {
  const zoneInfo = ZONE_META[activeZone] || ZONE_META.surface
  const depthPercent = Math.round(Math.max(0, Math.min(1, progress)) * 100)

  return (
    <nav
      aria-label="Harbor Depth Navigation"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto max-w-[94vw]"
    >
      <div className="harbor-glass rounded-full px-3 sm:px-4 py-2 flex items-center gap-2 sm:gap-3 shadow-[0_12px_40px_rgba(4,12,22,0.55)]">
        {/* Live Depth Zone Badge */}
        <div className="hidden sm:flex items-center gap-2 pr-3 border-r border-[#f4efe6]/15">
          <span
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${zoneInfo.dotClass}`}
          />
          <span className="font-mono-code text-[10px] uppercase tracking-[0.18em] text-[#f4efe6]/90 min-w-[74px]">
            {zoneInfo.label}
          </span>
        </div>

        {/* Section Scroll Links */}
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isZoneMatch =
              (item.id === "surface" && activeZone === "surface") ||
              (item.id === "works" &&
                (activeZone === "waterline" || activeZone === "depths")) ||
              (item.id === "contact" && activeZone === "abyss")

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate?.(`#${item.id}`)}
                className={`px-3 py-1.5 rounded-full text-[11.5px] font-medium tracking-wide transition-all cursor-pointer ${
                  isZoneMatch
                    ? "bg-[#f4efe6]/16 text-[#f4efe6]"
                    : "text-[#b8c7d4] hover:text-[#f4efe6] hover:bg-[#f4efe6]/8"
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>

        {/* Depth Percentage Telemetry */}
        <div className="pl-2 sm:pl-3 border-l border-[#f4efe6]/15 font-mono-code text-[10px] tabular-nums text-[#7ee8fa]/85">
          {String(depthPercent).padStart(2, "0")}%
        </div>
      </div>
    </nav>
  )
}
