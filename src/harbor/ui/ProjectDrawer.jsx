import { useState, useEffect } from "react"
import {
  X,
  ArrowUpRight,
  ArrowRight,
  Copy,
  Check,
  Layers,
  Cpu,
  Code2,
  Maximize2,
} from "lucide-react"

const DRAWER_TABS = [
  { id: "overview", label: "Overview", icon: Layers },
  { id: "architecture", label: "Architecture", icon: Cpu },
  { id: "source", label: "Source", icon: Code2 },
]

export default function ProjectDrawer({
  project,
  allProjects = [],
  onClose,
  onSelectProject,
}) {
  const [activeTab, setActiveTab] = useState("overview")
  const [activeImgIdx, setActiveImgIdx] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [prevSlug, setPrevSlug] = useState(project?.slug || null)

  if ((project?.slug || null) !== prevSlug) {
    setPrevSlug(project?.slug || null)
    setActiveTab("overview")
    setActiveImgIdx(0)
    setLightboxOpen(false)
    setCopied(false)
  }

  useEffect(() => {
    if (!project) return
    const handleKey = (e) => {
      if (e.key === "Escape") {
        if (lightboxOpen) setLightboxOpen(false)
        else onClose?.()
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [project, lightboxOpen, onClose])

  if (!project) return null

  const isLantern = project.accentTone === "lantern"
  const accentHex = isLantern ? "#ffd27d" : "#7ee8fa"
  const images = project.gallery || []
  const currentIndex = allProjects.findIndex((p) => p.slug === project.slug)
  const nextProject =
    allProjects.length > 1
      ? allProjects[(currentIndex + 1) % allProjects.length]
      : null

  const handleCopySnippet = () => {
    if (!project.snippet?.code) return
    navigator.clipboard.writeText(project.snippet.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end pointer-events-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="harbor-drawer-title"
    >
      {/* Frosted Ocean Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#040d16]/78 backdrop-blur-md transition-opacity"
      />

      {/* Slide-Over HARBOR Panel */}
      <aside
        data-lenis-prevent="true"
        className="relative z-10 w-full max-w-2xl h-full overflow-y-auto bg-gradient-to-b from-[#0e263c]/98 via-[#091d2c]/98 to-[#06131f]/99 border-l border-[#f4efe6]/16 text-[#f4efe6] shadow-[-24px_0_72px_rgba(2,8,16,0.82)] flex flex-col"
      >
        {/* Atmospheric Thumbnail Banner */}
        <div className="relative h-56 sm:h-64 shrink-0 overflow-hidden bg-[#061420]">
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover opacity-55 scale-[1.03]"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(9,29,44,0.35) 0%, rgba(9,29,44,0.68) 60%, rgba(12,35,54,1) 100%)",
            }}
          />

          {/* Top Floating Controls */}
          <div className="absolute top-0 inset-x-0 p-5 sm:px-8 flex items-center justify-between">
            <span
              className="harbor-glass inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono-code text-[10px] uppercase tracking-[0.22em]"
              style={{ color: accentHex }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: accentHex,
                  boxShadow: `0 0 8px ${accentHex}`,
                }}
              />
              {project.depthLabel}
            </span>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close project case study"
              className="harbor-glass p-2 rounded-full text-[#f4efe6]/85 hover:text-[#ffd27d] hover:border-[#ffd27d]/50 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Hero Title Overlaid at Bottom of Banner */}
          <div className="absolute bottom-4 inset-x-0 px-6 sm:px-8 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 font-mono-code text-[10.5px] uppercase tracking-[0.18em]">
              <span style={{ color: accentHex }}>
                PROJECT {project.index}
              </span>
              <span className="text-[#f4efe6]/30">·</span>
              <span className="text-[#b8c7d4]">{project.year}</span>
              {project.version && (
                <>
                  <span className="text-[#f4efe6]/30">·</span>
                  <span className="text-[#f4efe6]/90">{project.version}</span>
                </>
              )}
              <span className="ml-auto px-2.5 py-0.5 rounded-full bg-[#4fa3b8]/20 border border-[#7ee8fa]/35 text-[10px] text-[#7ee8fa]">
                {project.status}
              </span>
            </div>

            <h2
              id="harbor-drawer-title"
              className="font-editorial font-semibold text-4xl sm:text-5xl text-[#f4efe6] harbor-text-shadow leading-none"
            >
              {project.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#b8c7d4]">
              {project.subtitle}
            </p>
          </div>
        </div>

        {/* Subtle Curved Waterline Hairline + Telemetry Strip + Tabs */}
        <div className="sticky top-0 z-20 bg-[#0b2134]/94 backdrop-blur-md border-b border-[#f4efe6]/12 px-6 sm:px-8 pt-3 pb-3 space-y-3">
          {/* Telemetry Metrics Strip */}
          {project.metrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {project.metrics.map((m) => (
                <div
                  key={m.label}
                  className="px-3 py-2 rounded-xl bg-[#f4efe6]/5 border border-[#f4efe6]/10"
                >
                  <div className="font-mono-code text-[9.5px] uppercase tracking-wider text-[#b8c7d4]/75">
                    {m.label}
                  </div>
                  <div
                    className="font-editorial font-semibold text-lg leading-tight mt-0.5"
                    style={{ color: accentHex }}
                  >
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 3-Tab Switcher */}
          <div className="flex items-center gap-1.5">
            {DRAWER_TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#f4efe6] text-[#091d2c] font-semibold shadow-sm"
                      : "bg-[#f4efe6]/6 text-[#b8c7d4] hover:text-[#f4efe6] hover:bg-[#f4efe6]/12"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Body */}
        <div className="p-6 sm:p-8 flex-1 space-y-7">
          {activeTab === "overview" && (
            <>
              {/* Tech Stack & Summary */}
              <div className="space-y-4">
                <p className="text-[15px] leading-relaxed text-[#d7e3ed]">
                  {project.summary}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-full bg-[#4fa3b8]/12 border border-[#7ee8fa]/25 text-[11.5px] font-medium text-[#f4efe6]/90"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interactive Gallery Plates */}
              {images.length > 0 && (
                <div className="space-y-3">
                  <div className="group relative overflow-hidden rounded-2xl border border-[#7ee8fa]/25 bg-[#06131d] aspect-[16/10] shadow-xl">
                    <img
                      src={images[activeImgIdx]}
                      alt={`${project.title} specimen ${activeImgIdx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setLightboxOpen(true)}
                      className="harbor-glass absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium text-[#f4efe6] hover:text-[#ffd27d] hover:border-[#ffd27d]/60 transition-colors cursor-pointer"
                    >
                      <Maximize2 className="w-3 h-3" /> Enlarge View
                    </button>
                  </div>

                  {images.length > 1 && (
                    <div className="grid grid-cols-3 gap-2.5">
                      {images.map((img, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActiveImgIdx(i)}
                          className={`overflow-hidden rounded-xl border aspect-[16/10] transition-all cursor-pointer ${
                            activeImgIdx === i
                              ? "border-[#ffd27d] ring-2 ring-[#ffd27d]/30"
                              : "border-[#f4efe6]/15 opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={img}
                            alt={`${project.title} plate ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Engineering Narrative Cards */}
              <div className="space-y-3 pt-1">
                {[
                  {
                    num: "01",
                    title: "The Challenge",
                    text: project.challenge,
                    border: "border-l-[#ffd27d]",
                  },
                  {
                    num: "02",
                    title: "The Solution",
                    text: project.solution,
                    border: "border-l-[#4fa3b8]",
                  },
                  {
                    num: "03",
                    title: "The Outcome",
                    text: project.result,
                    border: "border-l-[#7ee8fa]",
                  },
                ].map((block) => (
                  <div
                    key={block.num}
                    className={`p-4 rounded-r-2xl bg-[#f4efe6]/4 border border-[#f4efe6]/10 border-l-2 ${block.border}`}
                  >
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-mono-code text-[10.5px] text-[#7ee8fa]">
                        {block.num}
                      </span>
                      <h3 className="text-sm font-semibold text-[#f4efe6]">
                        {block.title}
                      </h3>
                    </div>
                    <p className="text-[13.5px] leading-relaxed text-[#b8c7d4]">
                      {block.text}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "architecture" && (
            <>
              {/* Pipeline Timeline */}
              {project.architecture.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-editorial text-2xl text-[#f4efe6]">
                    Execution Pipeline
                  </h3>
                  <div className="relative pl-6 border-l border-[#7ee8fa]/30 space-y-4">
                    {project.architecture.map((arch) => (
                      <div
                        key={arch.step}
                        className="relative p-4 rounded-2xl bg-[#f4efe6]/5 border border-[#f4efe6]/12"
                      >
                        <span
                          className="absolute -left-[31px] top-5 w-3 h-3 rounded-full border-2 border-[#091d2c]"
                          style={{
                            backgroundColor: accentHex,
                            boxShadow: `0 0 10px ${accentHex}`,
                          }}
                        />
                        <div
                          className="font-mono-code text-[10px] font-semibold"
                          style={{ color: accentHex }}
                        >
                          STEP {arch.step}
                        </div>
                        <div className="text-sm font-semibold text-[#f4efe6] mt-0.5">
                          {arch.label}
                        </div>
                        <p className="text-xs leading-relaxed text-[#b8c7d4] mt-1">
                          {arch.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Core Modules Grid */}
              {project.moduleCategories.length > 0 && (
                <div className="space-y-3 border-t border-[#f4efe6]/12 pt-6">
                  <h3 className="font-editorial text-2xl text-[#f4efe6]">
                    Core Module Suites
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {project.moduleCategories.map((cat) => (
                      <div
                        key={cat.title}
                        className="p-4 rounded-2xl bg-[#f4efe6]/4 border border-[#f4efe6]/10"
                      >
                        <div className="text-sm font-semibold text-[#f4efe6]">
                          {cat.title}
                        </div>
                        <div className="text-xs text-[#7ee8fa]/90 mt-0.5 mb-2.5">
                          {cat.desc}
                        </div>
                        <ul className="space-y-1 text-xs text-[#b8c7d4]">
                          {cat.items.map((item) => (
                            <li key={item}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Runtime Keybinds */}
              {project.keybinds.length > 0 && (
                <div className="space-y-3 border-t border-[#f4efe6]/12 pt-6">
                  <h3 className="font-editorial text-2xl text-[#f4efe6]">
                    Runtime Keybinds
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {project.keybinds.map((kb) => (
                      <div
                        key={kb.key}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#f4efe6]/4 border border-[#f4efe6]/10 text-xs"
                      >
                        <kbd className="px-2 py-0.5 rounded bg-[#f4efe6]/12 text-[#ffd27d] font-mono-code text-[11px] font-semibold shrink-0">
                          {kb.key}
                        </kbd>
                        <span className="text-[#b8c7d4] leading-snug">
                          {kb.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === "source" && project.snippet && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-editorial text-2xl text-[#f4efe6]">
                    Implementation Excerpt
                  </h3>
                  <p className="text-xs text-[#b8c7d4] mt-0.5">
                    Core runtime module from {project.title}.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopySnippet}
                  className="harbor-glass inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-[#f4efe6] hover:text-[#ffd27d] transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Code
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-2xl bg-[#05101b] border border-[#7ee8fa]/20 overflow-hidden shadow-xl">
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#081929] border-b border-[#f4efe6]/10 font-mono-code text-[11px]">
                  <span style={{ color: accentHex }}>
                    {project.snippet.filename}
                  </span>
                  <span className="uppercase text-[#b8c7d4]/70">
                    {project.snippet.language}
                  </span>
                </div>
                <pre className="p-4 font-mono-code text-[11.5px] leading-relaxed overflow-x-auto text-[#dce8f2]">
                  <code>
                    {project.snippet.code.split("\n").map((line, i) => (
                      <div key={i} className="flex gap-4">
                        <span className="w-5 text-right select-none text-[#b8c7d4]/30 tabular-nums">
                          {i + 1}
                        </span>
                        <span>{line || " "}</span>
                      </div>
                    ))}
                  </code>
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Nautical Footer */}
        <div className="sticky bottom-0 z-20 px-6 sm:px-8 py-4 bg-[#071624]/96 backdrop-blur-md border-t border-[#f4efe6]/12 flex items-center justify-between gap-3">
          {project.repoUrl ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#b8c7d4] hover:text-[#f4efe6] transition-colors"
            >
              GitHub Repository <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          ) : (
            <span />
          )}

          {nextProject && (
            <button
              type="button"
              onClick={() => onSelectProject?.(nextProject)}
              className="inline-flex items-center gap-2 px-4.5 py-2 rounded-full bg-[#f4efe6] text-[#091d2c] text-xs font-semibold hover:bg-[#ffd27d] transition-colors cursor-pointer"
            >
              {project.slug === "leonx"
                ? `Dive to ${nextProject.title}`
                : `Ascend to ${nextProject.title}`}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </aside>

      {/* Fullscreen Plate Lightbox */}
      {lightboxOpen && images[activeImgIdx] && (
        <div
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-[#030a12]/90 backdrop-blur-lg flex items-center justify-center p-4 sm:p-10"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="harbor-glass relative max-w-5xl w-full rounded-2xl p-3 sm:p-4 space-y-3"
          >
            <div className="flex items-center justify-between px-1">
              <span className="font-mono-code text-xs text-[#f4efe6]/85">
                {project.title} — Plate 0{activeImgIdx + 1}
              </span>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#f4efe6]/12 hover:bg-[#ffd27d] text-[#f4efe6] hover:text-[#091d2c] text-xs font-semibold transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> Close
              </button>
            </div>
            <img
              src={images[activeImgIdx]}
              alt={project.title}
              className="w-full max-h-[76vh] object-contain rounded-xl bg-[#050f19]"
            />
          </div>
        </div>
      )}
    </div>
  )
}
