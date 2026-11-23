import { useState } from "react"
import { Link } from "react-router-dom"
import {
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  Maximize2,
} from "lucide-react"
import {
  ParchmentPage,
  ArchivalPhotoPlate,
  COVER_PX_W,
  COVER_PX_H,
} from "./JournalSpreads"
import { journalAudio } from "../../lib/journalAudio"

// ============================================================================
// PROJECT DOSSIER FRONT COVER
// ============================================================================
export function ProjectFrontCoverFace({
  project,
  accentGrad,
  onOpenBook,
}) {
  return (
    <div
      onClick={onOpenBook}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpenBook()
      }}
      style={{
        width: `${COVER_PX_W}px`,
        height: `${COVER_PX_H}px`,
        background: accentGrad,
        boxShadow:
          "inset 0 0 0 2px rgba(218, 178, 74, 0.35), inset 22px 0 34px rgba(0,0,0,0.78)",
      }}
      className="group relative pl-12 pr-9 py-9 flex flex-col justify-between cursor-pointer select-none overflow-hidden rounded-r-[10px] font-book-sans"
    >
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-9 bg-gradient-to-r from-[#090504] via-[#1f120d] to-[#110906] border-r border-[#d4af37]/40" />

      <div className="relative flex-1 border-2 border-[#d8b24c]/60 p-8 flex flex-col justify-between text-center bg-black/20">
        <div className="pointer-events-none absolute inset-2 border border-[#d8b24c]/25" />

        <div className="space-y-1">
          <div className="text-[11.5px] font-semibold uppercase tracking-[0.22em] text-[#f0d7a6]">
            Project Case Study · Dossier No. {project.number}
          </div>
          <div className="text-[11px] text-[#cbb389] tracking-wider">
            {project.category || "Systems Engineering"} · {project.year}
          </div>
        </div>

        <div className="my-auto space-y-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-[#eab34b] bg-black/45 flex items-center justify-center shadow-xl">
            <span className="font-book-display italic font-bold text-xl text-[#fae29c]">
              #{project.number}
            </span>
          </div>

          <h1 className="font-book-display font-bold text-[50px] tracking-tight text-[#fbe39e] leading-[1.05]">
            {project.title}
          </h1>

          {project.version && (
            <p className="font-book-mono text-[13px] font-semibold text-[#eab34b]">
              Release {project.version} · {project.status}
            </p>
          )}

          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#eab34b]/70 to-transparent mx-auto my-4" />

          <div className="flex flex-wrap justify-center gap-1.5 max-w-[340px] mx-auto">
            {project.tags.map((t) => (
              <span
                key={t}
                className="px-2.5 py-0.5 rounded-[3px] bg-black/35 border border-[#eab34b]/35 text-[11px] text-[#ecd5aa]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div>
          <span className="inline-flex items-center gap-2.5 px-7 py-3 rounded-[4px] bg-[#eab34b] text-[#1a0e07] text-[13px] font-bold tracking-wide shadow-lg group-hover:bg-[#fae29c] transition-all">
            <BookOpen className="w-4 h-4" />
            Open Project Dossier
          </span>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// PROJECT DOSSIER BACK COVER
// ============================================================================
export function ProjectBackCoverFace({
  project,
  otherProject,
  returnSpread = 2,
  accentGrad,
  onReopenBook,
}) {
  return (
    <div
      onClick={onReopenBook}
      style={{
        width: `${COVER_PX_W}px`,
        height: `${COVER_PX_H}px`,
        background: accentGrad,
        boxShadow:
          "inset 0 0 0 2px rgba(218, 178, 74, 0.3), inset -22px 0 34px rgba(0,0,0,0.78)",
      }}
      className="relative pl-9 pr-12 py-10 flex flex-col justify-between cursor-pointer select-none overflow-hidden rounded-l-[10px] font-book-sans"
    >
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-9 bg-gradient-to-l from-[#090504] via-[#1f120d] to-[#110906] border-l border-[#d4af37]/35" />

      <div className="relative flex-1 border-2 border-[#d8b24c]/45 p-9 flex flex-col justify-between text-center bg-black/20">
        <div className="text-[11.5px] font-semibold uppercase tracking-[0.2em] text-[#dec79e]">
          End of Dossier #{project.number}
        </div>

        <div className="my-auto space-y-4">
          <h2 className="font-book-display font-bold text-[36px] text-[#fbe39e]">
            {project.title}
          </h2>
          <p className="text-[14.5px] text-[#e5cfa3] max-w-[310px] mx-auto leading-relaxed">
            Return to Leon’s Main Journal or continue reading the next project
            volume on the desk.
          </p>
        </div>

        <div
          className="flex flex-col gap-2.5 max-w-[280px] mx-auto w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <Link
            to="/"
            state={{ initialSpread: returnSpread }}
            onClick={() => journalAudio.playBookThud(true)}
            className="w-full py-2.5 px-4 rounded-[4px] bg-[#eab34b] text-[#1a0e07] text-[13px] font-bold hover:bg-[#fae29c] transition-all text-center"
          >
            ← Back to Main Journal
          </Link>

          {otherProject && (
            <Link
              to={`/project/${otherProject.slug}`}
              onClick={() => journalAudio.playBookThud(true)}
              className="w-full py-2.5 px-4 rounded-[4px] border border-[#d8b24c]/55 text-[#fae29c] text-[13px] font-semibold hover:bg-white/10 transition-all text-center"
            >
              Next Volume: {otherProject.title} →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// SPREAD 1: EXECUTIVE OVERVIEW (P.01) & CHALLENGE/SOLUTION/RESULT (P.02)
// ============================================================================
export function ProjectFolio01Overview({
  project,
  returnSpread = 2,
  onPrev,
}) {
  const metrics = project.metrics || [
    { label: "Year", value: project.year },
    { label: "Platform", value: "Discord / Web" },
    { label: "Database", value: "SQLite WAL" },
    { label: "Hosting", value: "Railway 99.9%" },
  ]

  return (
    <ParchmentPage
      pageNumber="01"
      chapterTag={`Dossier #${project.number} · Overview`}
      side="left"
      onPageFlip={onPrev}
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            state={{ initialSpread: returnSpread }}
            onClick={() => journalAudio.playStampClick()}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[4px] bg-[#f1e7d3] border border-[#cbb99c] text-[12px] font-semibold text-[#2c231b] hover:bg-[#1c1611] hover:text-[#fdfbf6] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Main Journal
          </Link>

          <span className="px-2.5 py-0.5 rounded-[3px] bg-[#8f2419]/12 border border-[#8f2419]/40 text-[#8f2419] text-[11px] font-bold uppercase tracking-wider">
            {project.status || `Release ${project.year}`}
          </span>
        </div>

        <div>
          <div className="text-[12.5px] font-semibold uppercase tracking-wider text-[#6e5a44] mb-1">
            {project.category || "Featured Engineering Case Study"}
          </div>
          <h1 className="font-book-display font-bold text-[40px] text-[#18120c] leading-none">
            {project.title}
          </h1>
          {project.version && (
            <div className="font-book-mono text-[12.5px] font-semibold text-[#7c2318] mt-1.5">
              Version {project.version} · {project.year}
            </div>
          )}
        </div>

        <p className="text-[15px] leading-[1.7] text-[#261e17]">
          {project.overview}
        </p>

        {/* Key Telemetry Metrics */}
        <div className="grid grid-cols-2 gap-2.5">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="p-3 rounded-[4px] bg-[#f5ede0] border border-[#d6c6ac]"
            >
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#6e5a44]">
                {m.label}
              </div>
              <div className="font-book-display font-bold text-[19px] text-[#18120c] mt-0.5">
                {m.value}
              </div>
            </div>
          ))}
        </div>

        {/* Technology Stack Tags */}
        <div>
          <div className="text-[11.5px] font-bold uppercase tracking-wider text-[#6e5a44] mb-2">
            Technologies Used
          </div>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-[3px] bg-white border border-[#cbb99c] text-[12px] font-semibold text-[#241c14]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </ParchmentPage>
  )
}

export function ProjectFolio02CaseStudy({ project, onJumpToSpread, onNext }) {
  const blocks = [
    {
      num: "01",
      title: "The Challenge",
      text: project.challenge,
      accent: "border-l-[#8f2419]",
    },
    {
      num: "02",
      title: "The Solution",
      text: project.solution,
      accent: "border-l-[#1d4e6e]",
    },
    {
      num: "03",
      title: "The Outcome",
      text: project.result,
      accent: "border-l-[#1b5e32]",
    },
  ]

  return (
    <ParchmentPage
      pageNumber="02"
      chapterTag="Case Study · Narrative"
      side="right"
      onPageFlip={onNext}
    >
      <div className="space-y-4.5">
        <div>
          <h2 className="font-book-display font-bold text-[30px] text-[#18120c] leading-tight">
            Problem, Architecture & Impact
          </h2>
          <p className="text-[14px] text-[#5c4b3a] mt-1">
            How {project.title} was engineered from concept to production.
          </p>
        </div>

        <div className="space-y-3">
          {blocks.map((b) => (
            <div
              key={b.num}
              className={`p-3.5 rounded-[4px] bg-white/85 border border-[#d8c8ae] border-l-4 ${b.accent}`}
            >
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-book-mono text-[11px] font-bold text-[#6e5a44]">
                  {b.num}
                </span>
                <h3 className="text-[15.5px] font-bold text-[#18120c]">
                  {b.title}
                </h3>
              </div>
              <p className="text-[13.5px] leading-[1.6] text-[#2c231b]">
                {b.text}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-1 flex justify-end">
          <button
            type="button"
            onClick={() => onJumpToSpread(2)}
            className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-[4px] bg-[#1c1611] text-[#fdfbf6] text-[12.5px] font-semibold hover:bg-[#8f2419] transition-colors cursor-pointer"
          >
            Inspect Visuals & Modules <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </ParchmentPage>
  )
}

// ============================================================================
// SPREAD 2: VISUAL GALLERY PLATES (P.03) & MODULE SUITES (P.04)
// ============================================================================
export function ProjectFolio03Gallery({
  project,
  onOpenLightbox,
  onPrev,
}) {
  const [activeIdx, setActiveIdx] = useState(0)
  const images = project.gallery || []

  return (
    <ParchmentPage
      pageNumber="03"
      chapterTag="Visual Documentation"
      side="left"
      onPageFlip={onPrev}
    >
      <div className="space-y-4">
        <div>
          <h2 className="font-book-display font-bold text-[32px] text-[#18120c] leading-tight">
            Interface & Visual Plates
          </h2>
          <p className="text-[14px] text-[#5c4b3a] mt-0.5">
            Captured directly from live production builds.
          </p>
        </div>

        {images.length > 0 && (
          <div data-no-flip="true" className="space-y-3">
            <ArchivalPhotoPlate
              src={images[activeIdx]}
              alt={`${project.title} screenshot ${activeIdx + 1}`}
              figureLabel={`PLATE 0${activeIdx + 1} / 0${images.length}`}
              caption={`${project.title} · Production Specimen`}
              aspectClass="aspect-[16/9.4]"
              actionNode={
                <button
                  type="button"
                  onClick={() => {
                    journalAudio.playStampClick()
                    onOpenLightbox?.(images[activeIdx])
                  }}
                  className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] bg-[#1b120b]/90 border border-[#d4af37]/50 hover:bg-[#eab34b] text-[#fae29c] hover:text-[#18120c] text-[11px] font-semibold transition-colors cursor-pointer shadow-md"
                >
                  <Maximize2 className="w-3 h-3" /> Enlarge Plate
                </button>
              }
            />

            {images.length > 1 && (
              <div className="grid grid-cols-3 gap-2.5">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      journalAudio.playStampClick()
                      setActiveIdx(i)
                    }}
                    className={`p-1 rounded-[3px] bg-[#efe4ce] border transition-all cursor-pointer ${
                      activeIdx === i
                        ? "border-[#8f2419] ring-2 ring-[#8f2419]/25 shadow-sm"
                        : "border-[#b89f7a] opacity-75 hover:opacity-100"
                    }`}
                  >
                    <div className="overflow-hidden aspect-[16/10] border border-[#8e7453]/60">
                      <img
                        src={img}
                        alt={`Thumbnail ${i + 1}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover sepia-[0.22] contrast-[0.94]"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="p-3 rounded-[4px] bg-[#f4ecdc] border border-[#d8c8ae] text-[13px] text-[#3d3126]">
          <strong className="text-[#18120c]">Design Note:</strong> Built with a
          high-contrast dark interface to keep telemetry and controls legible
          during fast gameplay and live server management.
        </div>
      </div>
    </ParchmentPage>
  )
}

export function ProjectFolio04Modules({ project, onNext }) {
  const suites = project.moduleCategories || [
    {
      title: "Slash Command Engine",
      desc: "Instant interaction handlers & modal workflows",
      items: [
        "Role & Whitelist Verification",
        "Cooldown & Anti-Spam Guard",
        "Modular Command Auto-Loader",
      ],
    },
    {
      title: "Transactional Storage",
      desc: "Zero-corruption local & cloud persistence",
      items: [
        "SQLite WAL Concurrent Mode",
        "Audit Trail Event Logging",
        "Automated State Snapshots",
      ],
    },
    {
      title: "Live Telemetry Sync",
      desc: "Real-time gateway & status monitoring",
      items: [
        "Railway Webhook Receiver",
        "Server-Sent Events (SSE) Feed",
        "99.9% Uptime Health Checks",
      ],
    },
  ]

  return (
    <ParchmentPage
      pageNumber="04"
      chapterTag="Feature Breakdown"
      side="right"
      onPageFlip={onNext}
    >
      <div className="space-y-3.5">
        <div>
          <h2 className="font-book-display font-bold text-[30px] text-[#18120c] leading-tight">
            Core Capabilities
          </h2>
          <p className="text-[13.5px] text-[#5c4b3a] mt-0.5">
            Modular subsystems engineered inside {project.title}.
          </p>
        </div>

        <div className="space-y-2.5">
          {suites.map((cat) => (
            <div
              key={cat.title}
              className="p-3 rounded-[4px] bg-white/85 border border-[#d8c8ae]"
            >
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-[15px] font-bold text-[#18120c]">
                  {cat.title}
                </h3>
                <span className="text-[11.5px] text-[#7c2318] font-medium">
                  {cat.desc}
                </span>
              </div>
              <ul className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-1 text-[12px] text-[#2c231b]">
                {cat.items.slice(0, 4).map((item) => (
                  <li key={item} className="truncate">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </ParchmentPage>
  )
}

// ============================================================================
// SPREAD 3: SYSTEM ARCHITECTURE (P.05) & SOURCE CODE CIPHER (P.06)
// ============================================================================
export function ProjectFolio05Architecture({ project, onPrev }) {
  return (
    <ParchmentPage
      pageNumber="05"
      chapterTag="System Architecture"
      side="left"
      onPageFlip={onPrev}
    >
      <div className="space-y-4">
        <div>
          <h2 className="font-book-display font-bold text-[30px] text-[#18120c] leading-tight">
            Execution Pipeline
          </h2>
          <p className="text-[13.5px] text-[#5c4b3a] mt-0.5">
            End-to-end data flow and runtime lifecycle.
          </p>
        </div>

        <div className="space-y-2.5">
          {(project.architecture || []).map((arch) => (
            <div
              key={arch.step}
              className="p-3 rounded-[4px] bg-white/85 border border-[#d8c8ae] flex items-start gap-3"
            >
              <span className="px-2 py-0.5 rounded bg-[#1c1611] text-[#fae29c] font-book-mono text-[11px] font-bold mt-0.5">
                {arch.step}
              </span>
              <div>
                <div className="text-[14.5px] font-bold text-[#18120c]">
                  {arch.label}
                </div>
                <div className="text-[12.5px] text-[#3d3126] leading-snug mt-0.5">
                  {arch.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {project.keybinds && (
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#6e5a44] mb-1.5">
              Quick Hotkey Map
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {project.keybinds.slice(0, 6).map((kb) => (
                <div
                  key={kb.key}
                  className="flex items-center gap-2 px-2.5 py-1 rounded-[3px] bg-[#f4ecdc] border border-[#d8c8ae] text-[11.5px]"
                >
                  <kbd className="px-1.5 py-0.5 rounded bg-[#1c1611] text-[#fdfbf6] font-book-mono text-[10.5px] font-bold">
                    {kb.key}
                  </kbd>
                  <span className="truncate text-[#2c231b]">{kb.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ParchmentPage>
  )
}

export function ProjectFolio06Code({
  project,
  otherProject,
  returnSpread = 2,
  onNext,
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    journalAudio.playStampClick()
    if (project.snippet?.code) {
      navigator.clipboard.writeText(project.snippet.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <ParchmentPage
      pageNumber="06"
      chapterTag="Source Excerpt"
      side="right"
      onPageFlip={onNext}
    >
      <div className="flex flex-col h-full justify-between space-y-4">
        <div>
          <h2 className="font-book-display font-bold text-[30px] text-[#18120c] leading-tight">
            Core Implementation
          </h2>
          <p className="text-[13.5px] text-[#5c4b3a] mt-0.5 mb-3">
            Production snippet from <code className="font-book-mono font-semibold">{project.snippet?.filename}</code>.
          </p>

          {project.snippet && (
            <div
              data-no-flip="true"
              className="relative rounded-[4px] bg-[#f3ead8] border border-[#b89f7a] p-3.5 text-[#1e1610] shadow-[inset_0_1px_4px_rgba(45,28,12,0.1)]"
            >
              <div className="flex items-center justify-between border-b border-[#cbb99c] pb-2 mb-2.5 font-book-mono text-[11.5px] font-bold text-[#7c2318]">
                <span>
                  MANUSCRIPT · {project.snippet.filename} ({project.snippet.language})
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] bg-[#e5d6bc] hover:bg-[#1c1611] text-[#1c1611] hover:text-[#fdfbf6] border border-[#b89f7a] text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#1b5e32]" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Snippet
                    </>
                  )}
                </button>
              </div>
              <pre className="font-book-mono text-[11.2px] leading-[1.55] overflow-x-auto max-h-[300px] text-[#241b13]">
                <code>{project.snippet.code}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Navigation Between Volumes */}
        <div
          data-no-flip="true"
          className="pt-2 flex items-center justify-between gap-2"
        >
          <Link
            to="/"
            state={{ initialSpread: returnSpread }}
            onClick={() => journalAudio.playBookThud(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[4px] bg-[#f1e7d3] border border-[#cbb99c] text-[12.5px] font-semibold text-[#1c1611] hover:bg-[#e4d5ba] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Main Journal
          </Link>

          {otherProject && (
            <Link
              to={`/project/${otherProject.slug}`}
              onClick={() => journalAudio.playBookThud(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[4px] bg-[#1c1611] text-[#fdfbf6] text-[12.5px] font-semibold hover:bg-[#8f2419] transition-colors"
            >
              Next: {otherProject.title} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </ParchmentPage>
  )
}

