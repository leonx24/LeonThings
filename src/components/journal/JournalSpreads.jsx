import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import emailjs from "@emailjs/browser"
import {
  BookOpen,
  ArrowUpRight,
  Send,
  MapPin,
  Clock,
} from "lucide-react"
import { projects } from "../../data/projects"
import { journalAudio } from "../../lib/journalAudio"

export const PAGE_PX_W = 560
export const PAGE_PX_H = 720
export const COVER_PX_W = 588
export const COVER_PX_H = 756

const leonX = projects[0]
const discordBot = projects[1]

// Unified Vintage Folio Page — Click anywhere on Left Page = Back, Right Page = Next!
export function ParchmentPage({
  pageNumber,
  chapterTag,
  side = "left",
  onPageFlip,
  children,
}) {
  const handleSurfaceClick = (e) => {
    // Do not flip when clicking interactive controls, links, inputs, or code blocks
    if (
      e.target.closest(
        'a, button, input, textarea, select, label, pre, [data-no-flip="true"]'
      )
    ) {
      return
    }
    if (onPageFlip) onPageFlip()
  }

  return (
    <div
      onClick={handleSurfaceClick}
      title={
        side === "left"
          ? "Click page to turn back"
          : "Click page to turn forward"
      }
      style={{
        width: `${PAGE_PX_W}px`,
        height: `${PAGE_PX_H}px`,
        background:
          side === "left"
            ? "linear-gradient(to right, #efe5d0 0%, #faf5e9 9%, #fcf9f2 86%, #dfd1b5 98%, #cab896 100%)"
            : "linear-gradient(to left, #efe5d0 0%, #faf5e9 9%, #fcf9f2 86%, #dfd1b5 98%, #cab896 100%)",
        boxShadow:
          side === "left"
            ? "inset -34px 0 40px -16px rgba(34, 21, 10, 0.34)"
            : "inset 34px 0 40px -16px rgba(34, 21, 10, 0.34)",
      }}
      className="group/folio relative flex flex-col justify-between px-10 py-8 text-[#1c1611] font-book-sans select-text overflow-hidden cursor-pointer"
    >
      {/* Subtle Classic Archival Margin Frame + Corner Ticks */}
      <div className="pointer-events-none absolute inset-4 border border-[#cbb99c]/65" />
      <span className="pointer-events-none absolute top-3.5 left-3.5 w-2.5 h-2.5 border-t-2 border-l-2 border-[#9e8462]" />
      <span className="pointer-events-none absolute top-3.5 right-3.5 w-2.5 h-2.5 border-t-2 border-r-2 border-[#9e8462]" />
      <span className="pointer-events-none absolute bottom-3.5 left-3.5 w-2.5 h-2.5 border-b-2 border-l-2 border-[#9e8462]" />
      <span className="pointer-events-none absolute bottom-3.5 right-3.5 w-2.5 h-2.5 border-b-2 border-r-2 border-[#9e8462]" />

      {/* Center Spine Binding Seam + Crimson Silk Ribbon (Left spine edge) */}
      {side === "left" && (
        <div
          className="pointer-events-none absolute top-0 right-0 w-[3px] h-full opacity-75"
          style={{
            background: "linear-gradient(to bottom, #7f1d1d, #991b1b, #691414)",
          }}
        />
      )}

      {/* Top Running Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-[#d5c5aa] pb-2.5 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-[#6e5a44]">
        <span>{chapterTag}</span>
        <span className="font-book-mono text-[#4a3a28]">Folio {pageNumber}</span>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-between py-4">
        {children}
      </div>

      {/* Bottom Folio Bar with Interactive Turn Hint */}
      <div className="relative z-10 flex items-center justify-between border-t border-[#ddd0b8] pt-2.5 text-[12px] font-medium text-[#6e5a44]">
        {side === "left" ? (
          <>
            <span className="inline-flex items-center gap-1.5 text-[#7c2318] font-semibold group-hover/folio:-translate-x-1 transition-transform">
              ← Click page for Prev
            </span>
            <span className="font-book-display italic text-[13.5px] text-[#7c6850]">
              Leon’s Journal · MMXXVI
            </span>
          </>
        ) : (
          <>
            <span className="font-book-display italic text-[13.5px] text-[#7c6850]">
              Creative Developer Archive
            </span>
            <span className="inline-flex items-center gap-1.5 text-[#7c2318] font-semibold group-hover/folio:translate-x-1 transition-transform">
              Click page for Next →
            </span>
          </>
        )}
      </div>
    </div>
  )
}

// Vintage Archival Photo Plate with Passepartout Mat, Leather Photo Corners & Warm Paper Grading
export function ArchivalPhotoPlate({
  src,
  alt,
  figureLabel = "FIG. 01",
  caption = "Archival Specimen Capture",
  aspectClass = "aspect-[16/9.2]",
  actionNode = null,
}) {
  return (
    <div
      data-no-flip="true"
      className="group/plate relative rounded-[3px] bg-[#efe4ce] border border-[#b89f7a] p-2.5 pb-2 shadow-[inset_0_1px_5px_rgba(45,28,12,0.16),0_2px_5px_rgba(30,18,8,0.08)]"
    >
      {/* Inner double-ruled archival engraving line */}
      <div className="pointer-events-none absolute inset-[3px] border border-[#cbb592]/70" />

      {/* Mounted Photo Aperture */}
      <div
        className={`relative overflow-hidden bg-[#1b140e] border border-[#8e7453] ${aspectClass}`}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover sepia-[0.22] contrast-[0.94] brightness-[0.95] group-hover/plate:sepia-0 group-hover/plate:contrast-100 group-hover/plate:brightness-100 transition-all duration-300"
        />

        {/* Warm Parchment Edge Vignette so dark screenshots blend into the cream mat */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, transparent 56%, rgba(42, 27, 13, 0.42) 100%)",
            boxShadow: "inset 0 0 18px rgba(239, 228, 206, 0.22)",
          }}
        />

        {/* 4 Vintage Leather & Brass Photo Mount Corners */}
        <span
          className="pointer-events-none absolute top-0 left-0 w-4 h-4 bg-[#2b180d] border-b border-r border-[#d4af37]/70"
          style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
        />
        <span
          className="pointer-events-none absolute top-0 right-0 w-4 h-4 bg-[#2b180d] border-b border-l border-[#d4af37]/70"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
        />
        <span
          className="pointer-events-none absolute bottom-0 left-0 w-4 h-4 bg-[#2b180d] border-t border-r border-[#d4af37]/70"
          style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }}
        />
        <span
          className="pointer-events-none absolute bottom-0 right-0 w-4 h-4 bg-[#2b180d] border-t border-l border-[#d4af37]/70"
          style={{ clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }}
        />

        {actionNode}
      </div>

      {/* Archival Plate Caption Strip */}
      <div className="relative z-10 flex items-center justify-between pt-1.5 px-1 text-[10.5px] font-book-mono text-[#5a4632]">
        <span className="font-bold tracking-wider uppercase text-[#7c2318]">
          {figureLabel}
        </span>
        <span className="italic font-book-display text-[12px] text-[#4a3a28] truncate max-w-[260px]">
          {caption}
        </span>
      </div>
    </div>
  )
}

// ============================================================================
// FRONT LEATHER COVER
// ============================================================================
export function FrontCoverFace({ onOpenBook, onJumpToSpread }) {
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
        background:
          "radial-gradient(circle at 40% 28%, #3d2417 0%, #24130b 64%, #140a05 100%)",
        boxShadow:
          "inset 0 0 0 2px rgba(218, 178, 74, 0.35), inset 22px 0 34px rgba(0,0,0,0.78)",
      }}
      className="group relative pl-12 pr-9 py-9 flex flex-col justify-between cursor-pointer select-none overflow-hidden rounded-r-[10px]"
    >
      {/* Raised Spine Hinge */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-9 bg-gradient-to-r from-[#0d0603] via-[#2b170e] to-[#140a05] border-r border-[#d4af37]/40" />

      {/* Double Gold Filigree Border */}
      <div className="relative flex-1 border-2 border-[#d8b24c]/60 p-8 flex flex-col justify-between text-center bg-[#1a0e08]/30">
        <div className="pointer-events-none absolute inset-2 border border-[#d8b24c]/25" />
        <span className="pointer-events-none absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#f2cf6b]" />
        <span className="pointer-events-none absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#f2cf6b]" />
        <span className="pointer-events-none absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#f2cf6b]" />
        <span className="pointer-events-none absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#f2cf6b]" />

        <div className="space-y-1">
          <div className="text-[11.5px] font-book-sans font-semibold uppercase tracking-[0.22em] text-[#e8ce9d]">
            Personal Archive · Edition IV
          </div>
          <div className="text-[11px] text-[#b89d74] tracking-wider">
            Bandung, Indonesia
          </div>
        </div>

        <div className="my-auto space-y-4">
          {/* Crimson Wax Monogram */}
          <div
            className="w-18 h-18 mx-auto mb-5 rounded-full border-2 border-[#eab34b] flex items-center justify-center shadow-xl"
            style={{
              background: "radial-gradient(circle at 35% 30%, #a6281c, #4f100a)",
            }}
          >
            <span className="font-book-display italic font-bold text-2xl text-[#fae29c]">
              L·X
            </span>
          </div>

          <h1 className="font-book-display font-bold text-[54px] tracking-tight text-[#fbe39e] leading-[1.04]">
            Leon’s Journal
          </h1>

          <p className="font-book-display italic text-[20px] text-[#ecd3a6]">
            Creative Developer & Systems Engineer
          </p>

          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#eab34b]/70 to-transparent mx-auto my-4" />

          <p className="font-book-sans text-[13px] text-[#cbb28a] max-w-[310px] mx-auto leading-relaxed">
            Selected works in minimal web architecture, Roblox Luau frameworks,
            and cloud automation.
          </p>
        </div>

        <div className="space-y-3.5">
          <span className="inline-flex items-center gap-2.5 px-7 py-3 rounded-[4px] bg-[#eab34b] text-[#1a0e07] font-book-sans text-[13px] font-bold tracking-wide shadow-lg group-hover:bg-[#fae29c] transition-all">
            <BookOpen className="w-4 h-4" />
            Click or Scroll to Open
          </span>

          <div
            className="flex items-center justify-center gap-2.5 pt-1"
            onClick={(e) => e.stopPropagation()}
          >
            {[
              { label: "About", spread: 1 },
              { label: "Leon X", spread: 2 },
              { label: "Bot & Stack", spread: 3 },
              { label: "Contact", spread: 4 },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => onJumpToSpread(item.spread)}
                className="px-2.5 py-1 text-[11px] font-medium text-[#e6cea3] hover:text-[#fae29c] bg-[#120905]/70 border border-[#d8b24c]/30 hover:border-[#fae29c] rounded-[3px] transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// BACK LEATHER COVER
// ============================================================================
export function BackCoverFace({ onReopenBook, onFlipToFront }) {
  return (
    <div
      onClick={onReopenBook}
      style={{
        width: `${COVER_PX_W}px`,
        height: `${COVER_PX_H}px`,
        background:
          "radial-gradient(circle at 60% 35%, #382115 0%, #21120b 65%, #140a06 100%)",
        boxShadow:
          "inset 0 0 0 2px rgba(218, 178, 74, 0.28), inset -22px 0 34px rgba(0,0,0,0.78)",
      }}
      className="relative pl-9 pr-12 py-10 flex flex-col justify-between cursor-pointer select-none overflow-hidden rounded-l-[10px]"
    >
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-9 bg-gradient-to-l from-[#0d0603] via-[#2b170e] to-[#140a05] border-l border-[#d4af37]/35" />

      <div className="relative flex-1 border-2 border-[#d8b24c]/45 p-9 flex flex-col justify-between text-center bg-[#1a0e08]/30">
        <div className="text-[11.5px] font-book-sans font-semibold uppercase tracking-[0.2em] text-[#d4ba90]">
          Finis · LeonThings Archive
        </div>

        <div className="my-auto space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full border border-[#eab34b]/65 bg-[#160b06] flex items-center justify-center font-book-display italic font-bold text-lg text-[#fae29c]">
            2026
          </div>

          <h2 className="font-book-display font-bold text-[38px] text-[#fbe39e]">
            Thanks for reading.
          </h2>
          <p className="font-book-sans text-[15px] text-[#dec79e] max-w-[310px] mx-auto leading-relaxed">
            Built with React 19, Three.js WebGL & CSS3D, and procedural Web
            Audio synthesis.
          </p>

          <div
            className="pt-2 flex justify-center gap-5 font-book-sans text-[14px] font-semibold text-[#fae29c]"
            onClick={(e) => e.stopPropagation()}
          >
            <a
              href="https://github.com/leonx24"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              GitHub ↗
            </a>
            <a href="mailto:affavanleon@gmail.com" className="hover:underline">
              Email ↗
            </a>
          </div>
        </div>

        <div
          className="flex gap-3 justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onReopenBook}
            className="px-5 py-2.5 rounded-[4px] bg-[#eab34b] text-[#1a0e07] text-[13px] font-bold hover:bg-[#fae29c] transition-all cursor-pointer"
          >
            ← Reopen Book
          </button>
          <button
            type="button"
            onClick={onFlipToFront}
            className="px-5 py-2.5 rounded-[4px] border border-[#d8b24c]/50 text-[#f2d9a6] text-[13px] font-medium hover:border-[#fae29c] transition-all cursor-pointer"
          >
            Front Cover ↺
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// SPREAD 1: CONTENTS (PAGE 01) & AUTHOR PROFILE (PAGE 02)
// ============================================================================
export function Folio01Index({ onJumpToSpread, onPrev }) {
  const chapters = [
    {
      num: "01",
      title: "Identity & Story",
      desc: "Who I am, philosophy & key numbers",
      page: "02",
      spread: 1,
    },
    {
      num: "02",
      title: "Case Study: Leon X",
      desc: "56+ module Luau framework & architecture",
      page: "03–04",
      spread: 2,
    },
    {
      num: "03",
      title: "Discord Bot & Tech Arsenal",
      desc: "Automation pipeline, full stack & workflow",
      page: "05–06",
      spread: 3,
    },
    {
      num: "04",
      title: "Services & Contact",
      desc: "What I offer & direct message postcard",
      page: "07–08",
      spread: 4,
    },
  ]

  return (
    <ParchmentPage
      pageNumber="01"
      chapterTag="Index · Contents"
      side="left"
      onPageFlip={onPrev}
    >
      <div className="space-y-5">
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-[3px] bg-[#8f2419]/10 border border-[#8f2419]/40 text-[#8f2419] text-[11px] font-bold uppercase tracking-wider mb-2">
            Field Edition · Vol. IV
          </span>
          <h2 className="font-book-display font-bold text-[38px] text-[#18120c] tracking-tight leading-none">
            Table of Contents
          </h2>
          <p className="mt-2 text-[14.5px] text-[#5c4b3a]">
            Click a chapter below, scroll your mouse wheel, or click any page to
            flip through the book.
          </p>
        </div>

        <div className="divide-y divide-[#ddd0ba] border-y border-[#ddd0ba]">
          {chapters.map((ch) => (
            <button
              key={ch.num}
              type="button"
              onClick={() => onJumpToSpread(ch.spread)}
              className="w-full py-3.5 flex items-center justify-between text-left group cursor-pointer transition-colors hover:bg-[#f2e8d4]/75 px-2.5 -mx-2.5 rounded-[4px]"
            >
              <div className="flex items-baseline gap-3.5">
                <span className="font-book-display italic text-[20px] text-[#8f2419] font-bold">
                  {ch.num}
                </span>
                <div>
                  <div className="text-[16.5px] font-semibold text-[#18120c] group-hover:text-[#8f2419] transition-colors">
                    {ch.title}
                  </div>
                  <div className="text-[13px] text-[#665442] mt-0.5">
                    {ch.desc}
                  </div>
                </div>
              </div>

              <span className="font-book-mono text-[12px] font-semibold text-[#665442] group-hover:text-[#18120c] group-hover:translate-x-0.5 transition-all">
                p. {ch.page} →
              </span>
            </button>
          ))}
        </div>

        {/* Vintage Epigraph Box */}
        <div className="p-3.5 rounded-[4px] bg-[#f4ecdc] border-l-3 border-[#8f2419]">
          <p className="font-book-display italic text-[15px] text-[#2b2118] leading-snug">
            “Simplicity is about subtracting the obvious and adding the
            meaningful.”
          </p>
          <p className="text-[11.5px] font-semibold text-[#6e5a44] mt-1">
            — John Maeda
          </p>
        </div>
      </div>
    </ParchmentPage>
  )
}

export function Folio02About({ onJumpToSpread, onNext }) {
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Jakarta",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }).format(new Date())
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 15000)
    return () => clearInterval(interval)
  }, [])

  return (
    <ParchmentPage
      pageNumber="02"
      chapterTag="Chapter 01 · Identity"
      side="right"
      onPageFlip={onNext}
    >
      <div className="space-y-5">
        {/* Location & Live Status Row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b5e32]/12 border border-[#1b5e32]/35 text-[#154d28] text-[12px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#1b5e32] animate-pulse" />
            Available for Commissions
          </span>
          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#5c4b3a]">
            <MapPin className="w-3.5 h-3.5 text-[#8f2419]" />
            Jakarta {currentTime && `· ${currentTime}`}
          </span>
        </div>

        <div>
          <h2 className="font-book-display font-bold text-[34px] text-[#18120c] leading-[1.15]">
            I shape fast, minimal{" "}
            <em className="italic text-[#8f2419]">digital craft.</em>
          </h2>
          <p className="mt-3 text-[15px] leading-[1.68] text-[#2c231b]">
            Hi, I’m <strong>Leon</strong> — a creative developer bridging sleek
            front-end interfaces, custom automation bots, and high-performance
            Roblox script engines. No bloated libraries, no fluff—just clean
            code built to feel effortless.
          </p>
        </div>

        {/* Stamped Metric Cards */}
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { val: "2+", label: "Years Active" },
            { val: "1.2k+", label: "Users Served" },
            { val: "56+", label: "Luau Modules" },
          ].map((m) => (
            <div
              key={m.label}
              className="p-3 rounded-[4px] bg-[#f6efe0] border border-[#d6c6ac] text-center"
            >
              <div className="font-book-display font-bold text-[26px] text-[#18120c] leading-none">
                {m.val}
              </div>
              <div className="text-[11.5px] font-semibold text-[#5c4b3a] mt-1.5">
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* Core Focus */}
        <div className="p-3.5 rounded-[4px] bg-white/75 border border-[#ddd0ba] space-y-2">
          <div className="text-[11.5px] font-bold uppercase tracking-wider text-[#6e5a44]">
            What I Focus On
          </div>
          <div className="grid grid-cols-2 gap-2 text-[13px] font-medium text-[#241c14]">
            <div>✦ Interactive React & 3D Web</div>
            <div>✦ Luau Engines & Custom UI</div>
            <div>✦ Discord Bots & Webhooks</div>
            <div>✦ Edge & Cloud Deployment</div>
          </div>
        </div>

        {/* Signature & CTA */}
        <div className="pt-1 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#7a6650]">
              Signed,
            </div>
            <div className="font-book-display italic font-bold text-[22px] text-[#18120c]">
              Affavan Leon
            </div>
          </div>

          <button
            type="button"
            onClick={() => onJumpToSpread(2)}
            className="px-4.5 py-2.5 rounded-[4px] bg-[#1c1611] text-[#fdfbf6] text-[13px] font-semibold hover:bg-[#8f2419] transition-colors cursor-pointer"
          >
            Explore Leon X →
          </button>
        </div>
      </div>
    </ParchmentPage>
  )
}

// ============================================================================
// SPREAD 2: LEON X SHOWCASE — GALLERY (PAGE 03) & ARCHITECTURE (PAGE 04)
// ============================================================================
export function Folio03LeonX({ onPrev }) {
  const [activeImg, setActiveImg] = useState(0)

  return (
    <ParchmentPage
      pageNumber="03"
      chapterTag="Chapter 02 · Featured Work"
      side="left"
      onPageFlip={onPrev}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-[3px] bg-[#8f2419] text-[#fdfbf6] text-[11px] font-bold uppercase tracking-wider">
            {leonX.status}
          </span>
          <span className="font-book-mono text-[12px] font-semibold text-[#5c4b3a]">
            {leonX.version} · {leonX.year}
          </span>
        </div>

        <div>
          <h2 className="font-book-display font-bold text-[36px] text-[#18120c] leading-none">
            {leonX.title}
          </h2>
          <p className="text-[13.5px] font-medium text-[#7c2318] mt-1">
            Universal Roblox Script Framework & CyberNoir UI
          </p>
        </div>

        {/* Interactive Archival Photo Plate with Switchable Captures */}
        <div data-no-flip="true" className="space-y-2">
          <ArchivalPhotoPlate
            src={leonX.gallery[activeImg]}
            alt={`${leonX.title} preview ${activeImg + 1}`}
            figureLabel={`FIG. 0${activeImg + 1} / 0${leonX.gallery.length}`}
            caption="CyberNoir UI v5.1 · Live Runtime Specimen"
            aspectClass="aspect-[16/8.8]"
          />

          {/* Thumbnail Switcher */}
          <div className="flex items-center gap-2">
            {leonX.gallery.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  journalAudio.playStampClick()
                  setActiveImg(idx)
                }}
                className={`px-2.5 py-1 rounded-[3px] text-[11.5px] font-semibold border transition-all cursor-pointer ${
                  activeImg === idx
                    ? "bg-[#1c1611] text-[#fdfbf6] border-[#1c1611]"
                    : "bg-[#f4ecdc] text-[#4a3a28] border-[#cbb99c] hover:border-[#1c1611]"
                }`}
              >
                Plate 0{idx + 1}
              </button>
            ))}
          </div>
        </div>

        <p className="text-[14.5px] leading-[1.62] text-[#2c231b]">
          Engineered in Luau with an async parallel bootloader, PlaceId-isolated
          auto-saving profiles, 7 dynamic UI palettes, and secure edge delivery
          via Cloudflare Workers.
        </p>

        {/* 4 Key Metrics */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          {leonX.metrics.map((m) => (
            <div
              key={m.label}
              className="p-2 rounded-[4px] bg-[#f4ecdc] border border-[#d8c8ae]"
            >
              <div className="text-[10px] font-semibold uppercase text-[#6e5a44]">
                {m.label}
              </div>
              <div className="font-book-display font-bold text-[14.5px] text-[#18120c] mt-0.5">
                {m.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ParchmentPage>
  )
}

export function Folio04LeonXArch({ onNext }) {
  return (
    <ParchmentPage
      pageNumber="04"
      chapterTag="Chapter 02 · Architecture"
      side="right"
      onPageFlip={onNext}
    >
      <div className="space-y-4">
        <div>
          <h3 className="font-book-display font-bold text-[26px] text-[#18120c] leading-tight">
            Inside the Engine
          </h3>
          <p className="text-[13.5px] text-[#5c4b3a] mt-0.5">
            Built for sub-150ms startup and zero UI lag across 56+ modules.
          </p>
        </div>

        {/* Clean 4-Step Architecture */}
        <div className="grid grid-cols-2 gap-2.5">
          {leonX.architecture.map((item) => (
            <div
              key={item.step}
              className="p-3 rounded-[4px] bg-white/80 border border-[#d8c8ae]"
            >
              <div className="font-book-mono text-[11px] font-bold text-[#8f2419]">
                STEP {item.step}
              </div>
              <div className="text-[14px] font-bold text-[#18120c] mt-0.5">
                {item.label}
              </div>
              <div className="text-[12px] text-[#4a3a28] leading-snug mt-1">
                {item.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Archival Module Suites Ledger (Blends 100% with Vintage Paper) */}
        <div className="rounded-[4px] bg-[#f4ecdc] border border-[#cbb99c] p-3.5 space-y-2.5">
          <div className="flex items-center justify-between border-b border-[#d8c8ae] pb-1.5 text-[11px] font-book-mono font-bold uppercase tracking-wider text-[#7c2318]">
            <span>Core Module Suites</span>
            <span className="text-[#5c4b3a]">56+ Active Modules</span>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {leonX.moduleCategories.map((suite, idx) => (
              <div key={suite.title} className="text-[12px]">
                <div className="font-bold text-[#18120c]">
                  0{idx + 1}. {suite.title}
                </div>
                <div className="text-[11.5px] text-[#5c4b3a] truncate">
                  {suite.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex gap-1.5">
            {["Movement", "ESP", "Automation"].map((suite) => (
              <span
                key={suite}
                className="px-2.5 py-1 rounded-[3px] bg-[#f1e7d3] border border-[#d8c8ae] text-[11.5px] font-semibold text-[#3d2e20]"
              >
                {suite}
              </span>
            ))}
          </div>

          <Link
            to="/project/leonx"
            state={{ returnSpread: 2 }}
            onClick={() => journalAudio.playStampClick()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[4px] bg-[#1c1611] text-[#fdfbf6] text-[12.5px] font-semibold hover:bg-[#8f2419] transition-colors"
          >
            Full Case Study <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </ParchmentPage>
  )
}

// ============================================================================
// SPREAD 3: DISCORD BOT (PAGE 05) & TECH ARSENAL / WORKFLOW (PAGE 06)
// ============================================================================
export function Folio05DiscordBot({ onPrev }) {
  return (
    <ParchmentPage
      pageNumber="05"
      chapterTag="Chapter 03 · Automation"
      side="left"
      onPageFlip={onPrev}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-[3px] bg-[#1c1611] text-[#fdfbf6] text-[11px] font-bold uppercase tracking-wider">
            Railway Cloud
          </span>
          <span className="font-book-mono text-[12px] font-semibold text-[#5c4b3a]">
            TypeScript · Python
          </span>
        </div>

        <div>
          <h2 className="font-book-display font-bold text-[34px] text-[#18120c] leading-none">
            {discordBot.title}
          </h2>
          <p className="text-[13.5px] font-medium text-[#7c2318] mt-1">
            High-Uptime Verification, Webhooks & Rate-Limited Gateway
          </p>
        </div>

        <ArchivalPhotoPlate
          src={discordBot.gallery[0]}
          alt={discordBot.title}
          figureLabel="FIG. 02 · GATEWAY"
          caption="Railway Cloud Bot & Verification Console"
          aspectClass="aspect-[16/8.6]"
        />

        <p className="text-[14.5px] leading-[1.62] text-[#2c231b]">
          A clean, modular Discord automation system engineered for fast slash
          commands, SQLite WAL transactional whitelisting, and real-time SSE
          dashboard synchronization.
        </p>

        <div className="grid grid-cols-2 gap-2">
          {discordBot.architecture.slice(0, 2).map((step) => (
            <div
              key={step.step}
              className="p-2.5 rounded-[4px] bg-[#f4ecdc] border border-[#d8c8ae]"
            >
              <div className="text-[12.5px] font-bold text-[#18120c]">
                {step.step}. {step.label}
              </div>
              <div className="text-[11.5px] text-[#5c4b3a] mt-0.5 leading-snug">
                {step.desc}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-1 flex items-center justify-between">
          <span className="text-[12px] font-semibold text-[#1b5e32]">
            ● 99.9% Uptime on Railway
          </span>
          <Link
            to="/project/discord-bot"
            state={{ returnSpread: 3 }}
            onClick={() => journalAudio.playStampClick()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[4px] bg-[#1c1611] text-[#fdfbf6] text-[12.5px] font-semibold hover:bg-[#8f2419] transition-colors"
          >
            Full Case Study <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </ParchmentPage>
  )
}

export function Folio06Arsenal({ onNext }) {
  const stackGroups = [
    {
      category: "Frontend & Interactive 3D",
      skills: ["React 19", "Three.js", "Tailwind CSS", "Framer Motion", "Vite"],
    },
    {
      category: "Roblox & Client Engines",
      skills: ["Luau", "CyberNoir UI", "Parallel Async", "Config Serialization"],
    },
    {
      category: "Backend, Bots & Edge",
      skills: ["Python", "TypeScript", "SQLite WAL", "Cloudflare Workers", "Railway"],
    },
  ]

  const workflow = [
    {
      step: "01",
      title: "Architecture First",
      desc: "Clean modular structure before writing UI or automation logic.",
    },
    {
      step: "02",
      title: "Zero Bloat Performance",
      desc: "Sub-150ms execution, lightweight bundles, and responsive 60fps feel.",
    },
    {
      step: "03",
      title: "Production Hardened",
      desc: "Rate-limited, persistent, and battle-tested by 1,200+ real users.",
    },
  ]

  return (
    <ParchmentPage
      pageNumber="06"
      chapterTag="Chapter 03 · Craft & Stack"
      side="right"
      onPageFlip={onNext}
    >
      <div className="space-y-4.5">
        <div>
          <h2 className="font-book-display font-bold text-[32px] text-[#18120c] leading-tight">
            Tech Arsenal & Workflow
          </h2>
          <p className="text-[14px] text-[#5c4b3a] mt-0.5">
            Tools and engineering principles behind every build.
          </p>
        </div>

        {/* Categorized Tech Matrix */}
        <div className="space-y-2.5">
          {stackGroups.map((grp) => (
            <div
              key={grp.category}
              className="p-3 rounded-[4px] bg-white/80 border border-[#d8c8ae]"
            >
              <div className="text-[11.5px] font-bold uppercase tracking-wider text-[#7c2318] mb-2">
                {grp.category}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {grp.skills.map((sk) => (
                  <span
                    key={sk}
                    className="px-2.5 py-0.5 rounded-[3px] bg-[#f3ead8] border border-[#d8c8ae] text-[12px] font-semibold text-[#241c14]"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 3-Step Engineering Philosophy */}
        <div className="pt-1">
          <div className="text-[11.5px] font-bold uppercase tracking-wider text-[#6e5a44] mb-2">
            How I Build
          </div>
          <div className="space-y-2">
            {workflow.map((wf) => (
              <div
                key={wf.step}
                className="flex items-start gap-3 p-2.5 rounded-[4px] bg-[#f4ecdc]"
              >
                <span className="font-book-display italic font-bold text-[17px] text-[#8f2419] leading-none mt-0.5">
                  {wf.step}
                </span>
                <div>
                  <div className="text-[13.5px] font-bold text-[#18120c]">
                    {wf.title}
                  </div>
                  <div className="text-[12.5px] text-[#4a3a28]">
                    {wf.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ParchmentPage>
  )
}

// ============================================================================
// SPREAD 4: SERVICES (PAGE 07) & CONTACT POSTCARD (PAGE 08)
// ============================================================================
export function Folio07Services({ onPrev }) {
  const items = [
    {
      num: "01",
      title: "Web Development",
      desc: "Minimal React web apps, interactive 3D showcases, and custom dashboards.",
      deliverables: "React · Three.js · Tailwind",
    },
    {
      num: "02",
      title: "Roblox / Luau Systems",
      desc: "Universal script frameworks, custom UI engines, and data serialization.",
      deliverables: "Luau · Modular OOP · Fast Boot",
    },
    {
      num: "03",
      title: "Discord Bots & Backend",
      desc: "Custom slash-command bots, webhook pipelines, and database persistence.",
      deliverables: "Python · TypeScript · SQLite",
    },
  ]

  return (
    <ParchmentPage
      pageNumber="07"
      chapterTag="Chapter 04 · Services"
      side="left"
      onPageFlip={onPrev}
    >
      <div className="space-y-5">
        <div>
          <h2 className="font-book-display font-bold text-[36px] text-[#18120c] leading-none">
            Services & Craft
          </h2>
          <p className="mt-2 text-[14.5px] text-[#5c4b3a]">
            Available for custom commissions and collaborative builds.
          </p>
        </div>

        <div className="space-y-2.5">
          {items.map((srv) => (
            <div
              key={srv.num}
              className="p-3.5 rounded-[4px] bg-white/80 border border-[#d8c8ae]"
            >
              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-2.5">
                  <span className="font-book-display italic font-bold text-[18px] text-[#8f2419]">
                    {srv.num}
                  </span>
                  <h3 className="text-[16px] font-bold text-[#18120c]">
                    {srv.title}
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-[#6e5a44]">
                  {srv.deliverables}
                </span>
              </div>
              <p className="mt-1 pl-6.5 text-[13.5px] leading-relaxed text-[#3d3126]">
                {srv.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Direct Contact Card */}
        <div
          data-no-flip="true"
          className="p-3.5 rounded-[4px] bg-[#f4ecdc] border border-[#d5c5aa] space-y-2"
        >
          <div className="flex items-center justify-between text-[11.5px] font-bold uppercase tracking-wider text-[#6e5a44]">
            <span>Direct Channels</span>
            <span className="inline-flex items-center gap-1 text-[#1b5e32]">
              <Clock className="w-3 h-3" /> Replies &lt; 24h
            </span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13.5px] font-semibold text-[#1c1611]">
            <a
              href="mailto:affavanleon@gmail.com"
              className="hover:text-[#8f2419] underline underline-offset-4"
            >
              affavanleon@gmail.com
            </a>
            <a
              href="https://github.com/leonx24"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#8f2419] underline underline-offset-4"
            >
              github.com/leonx24
            </a>
            <span className="text-[#5c4b3a]">Discord: leonx24</span>
          </div>
        </div>
      </div>
    </ParchmentPage>
  )
}

export function Folio08Contact({ onNext }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [status, setStatus] = useState("idle")
  const [activeTag, setActiveTag] = useState(null)

  const tags = [
    {
      label: "Web Project",
      text: "Hi Leon, I'd like to collaborate on a web project: ",
    },
    {
      label: "Roblox / Luau",
      text: "Hi Leon, I'm interested in commissioning a Roblox/Luau project: ",
    },
    {
      label: "Discord Bot",
      text: "Hi Leon, I need a custom Discord bot: ",
    },
    {
      label: "Say Hi",
      text: "Hi Leon, loved exploring your 3D journal portfolio!",
    },
  ]

  const handleTagClick = (tag) => {
    journalAudio.playStampClick()
    setActiveTag(tag.label)
    setFormData((prev) => ({ ...prev, message: tag.text }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    journalAudio.playStampClick()
    setStatus("sending")

    try {
      const serviceId =
        import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_ecwex65"
      const templateId =
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_otfuenn"
      const publicKey =
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "RHsH6QtIq6dXMYYq6"

      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        publicKey
      )

      setStatus("success")
      setFormData({ name: "", email: "", message: "" })
      setTimeout(() => setStatus("idle"), 5000)
    } catch (err) {
      console.error("EmailJS error:", err)
      setStatus("error")
      setTimeout(() => setStatus("idle"), 5000)
    }
  }

  return (
    <ParchmentPage
      pageNumber="08"
      chapterTag="Chapter 04 · Contact"
      side="right"
      onPageFlip={onNext}
    >
      <form
        data-no-flip="true"
        onSubmit={handleSubmit}
        className="space-y-3.5"
      >
        <div>
          <h2 className="font-book-display font-bold text-[34px] text-[#18120c] leading-tight">
            Send a Note
          </h2>
          <p className="mt-1 text-[14px] text-[#5c4b3a]">
            Pick a topic or write your message directly below.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => {
            const isActive = activeTag === tag.label
            return (
              <button
                key={tag.label}
                type="button"
                onClick={() => handleTagClick(tag)}
                className={`px-3 py-1 rounded-[4px] text-[12px] font-semibold border transition-all cursor-pointer ${isActive
                    ? "bg-[#1c1611] text-[#fdfbf6] border-[#1c1611]"
                    : "bg-[#f4ecdc] text-[#2c231b] border-[#cbb99c] hover:border-[#1c1611]"
                  }`}
              >
                {tag.label}
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[12.5px] font-semibold text-[#3d3126] mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Your name"
              style={{ userSelect: "text" }}
              className="w-full px-3 py-2 rounded-[4px] bg-white border border-[#cbb99c] text-[14px] text-[#18120c] placeholder:text-[#9c8b75] focus:outline-none focus:border-[#1c1611]"
            />
          </div>

          <div>
            <label className="block text-[12.5px] font-semibold text-[#3d3126] mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="you@example.com"
              style={{ userSelect: "text" }}
              className="w-full px-3 py-2 rounded-[4px] bg-white border border-[#cbb99c] text-[14px] text-[#18120c] placeholder:text-[#9c8b75] focus:outline-none focus:border-[#1c1611]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[12.5px] font-semibold text-[#3d3126] mb-1">
            Message
          </label>
          <textarea
            name="message"
            rows={4}
            required
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            placeholder="Tell me about your project or idea..."
            style={{ userSelect: "text" }}
            className="w-full px-3 py-2 rounded-[4px] bg-white border border-[#cbb99c] text-[14px] text-[#18120c] placeholder:text-[#9c8b75] focus:outline-none focus:border-[#1c1611] resize-none leading-relaxed"
          />
        </div>

        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full py-3 px-5 rounded-[4px] bg-[#1c1611] hover:bg-[#8f2419] text-[#fdfbf6] text-[13.5px] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          {status === "sending"
            ? "Sending..."
            : status === "success"
              ? "Message Sent ✓"
              : status === "error"
                ? "Failed — Try Again"
                : "Send Message"}
        </button>
      </form>
    </ParchmentPage>
  )
}
