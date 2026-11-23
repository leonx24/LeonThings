import { useState, useEffect, useCallback, useRef, lazy, Suspense } from "react"
import { useLocation } from "react-router-dom"
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Volume2,
  VolumeX,
  Flame,
  CloudRain,
} from "lucide-react"
import {
  PAGE_PX_W,
  PAGE_PX_H,
  FrontCoverFace,
  BackCoverFace,
  Folio01Index,
  Folio02About,
  Folio03LeonX,
  Folio04LeonXArch,
  Folio05DiscordBot,
  Folio06Arsenal,
  Folio07Services,
  Folio08Contact,
} from "./JournalSpreads"
import { journalAudio } from "../../lib/journalAudio"

const ThreeBookScene = lazy(() => import("./ThreeBookScene"))

const BOOK_TABS = [
  { id: 0, short: "Cover", title: "Front Cover" },
  { id: 1, short: "01 · About", title: "Contents & Identity" },
  { id: 2, short: "02 · Leon X", title: "Case Study: Leon X" },
  { id: 3, short: "03 · Bot & Stack", title: "Discord Bot & Arsenal" },
  { id: 4, short: "04 · Contact", title: "Services & Contact" },
  { id: 5, short: "End", title: "Back Cover" },
]

function EndpaperFolio() {
  return (
    <div
      style={{
        width: `${PAGE_PX_W}px`,
        height: `${PAGE_PX_H}px`,
        background:
          "radial-gradient(circle at 50% 50%, #f5ede0 0%, #e4d5ba 100%)",
      }}
      className="p-10 flex items-center justify-center"
    >
      <div className="w-full h-full border border-[#cbb99c] flex items-center justify-center">
        <span className="font-book-display italic text-2xl text-[#7a664f]/65">
          Ex Libris · Affavan Leon
        </span>
      </div>
    </div>
  )
}

export default function VintageJournal() {
  const location = useLocation()
  const [currentSpread, setCurrentSpread] = useState(() => {
    const init = location.state?.initialSpread
    return typeof init === "number" ? Math.max(0, Math.min(5, init)) : 0
  })
  const [inspectMode, setInspectMode] = useState(false)
  const [lampMode, setLampMode] = useState("study") // "study" | "candle"
  const [muted, setMuted] = useState(() => journalAudio.isMuted())
  const [rainPlaying, setRainPlaying] = useState(() =>
    journalAudio.isRainPlaying()
  )
  const [mobileSide, setMobileSide] = useState("left")
  const [transitionState, setTransitionState] = useState({
    active: false,
    fromSpread: 0,
    toSpread: 0,
    progress: 0,
    direction: 1,
  })

  const animRef = useRef(null)
  const wheelCooldownRef = useRef(0)
  const touchStartXRef = useRef(null)

  const goToSpread = useCallback(
    (targetSpread) => {
      const clamped = Math.max(0, Math.min(5, targetSpread))
      if (clamped === currentSpread || transitionState.active) return

      const direction = clamped > currentSpread ? 1 : -1
      const isCoverMove =
        currentSpread === 0 ||
        clamped === 0 ||
        currentSpread === 5 ||
        clamped === 5

      if (isCoverMove) {
        journalAudio.playBookThud(clamped > 0 && clamped < 5)
      } else {
        journalAudio.playPaperFlip(direction)
      }

      setMobileSide("left")

      const duration = isCoverMove ? 650 : 540
      const from = currentSpread
      const startTime = performance.now()

      if (animRef.current) clearTimeout(animRef.current)

      setTransitionState({
        active: true,
        fromSpread: from,
        toSpread: clamped,
        startTime,
        duration,
        direction,
      })

      animRef.current = setTimeout(() => {
        setCurrentSpread(clamped)
        setTransitionState({
          active: false,
          fromSpread: clamped,
          toSpread: clamped,
          startTime: 0,
          duration: 540,
          direction: 1,
        })
      }, duration)
    },
    [currentSpread, transitionState.active]
  )

  useEffect(() => {
    return () => {
      if (animRef.current) clearTimeout(animRef.current)
    }
  }, [])

  const handleToggleMute = useCallback(() => {
    const next = !muted
    setMuted(next)
    journalAudio.setMuted(next)
    if (!next) journalAudio.playStampClick()
  }, [muted])

  const handleToggleRain = useCallback(() => {
    const active = journalAudio.toggleRainAmbience()
    setRainPlaying(active)
    if (active && muted) {
      setMuted(false)
      journalAudio.setMuted(false)
    } else if (!active) {
      journalAudio.playStampClick()
    }
  }, [muted])

  const handleLoupeClick = useCallback(() => {
    if (currentSpread === 0 || currentSpread === 5) {
      goToSpread(1)
      setInspectMode(true)
    } else {
      setInspectMode((prev) => !prev)
    }
  }, [currentSpread, goToSpread])

  const handleInkClick = useCallback(() => {
    goToSpread(4)
  }, [goToSpread])

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase()
      if (tag === "input" || tag === "textarea") return

      if (e.key === "ArrowRight") {
        e.preventDefault()
        goToSpread(currentSpread + 1)
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        goToSpread(currentSpread - 1)
      } else if (e.key === "z" || e.key === "Z") {
        e.preventDefault()
        journalAudio.playStampClick()
        setInspectMode((prev) => !prev)
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault()
        handleToggleMute()
      } else if (e.key === "Escape" && inspectMode) {
        setInspectMode(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentSpread, goToSpread, inspectMode, handleToggleMute])

  // Mouse Wheel & Trackpad Scroll to Flip Pages
  useEffect(() => {
    const handleWheel = (e) => {
      // Allow natural scrolling inside code blocks or textareas
      if (e.target?.closest?.("textarea, pre")) return

      const now = performance.now()
      if (now - wheelCooldownRef.current < 680) return

      const primaryDelta =
        Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX
      if (Math.abs(primaryDelta) < 22) return

      wheelCooldownRef.current = now
      if (primaryDelta > 0) {
        goToSpread(currentSpread + 1)
      } else {
        goToSpread(currentSpread - 1)
      }
    }

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        touchStartXRef.current = e.touches[0].clientX
      }
    }

    const handleTouchEnd = (e) => {
      if (touchStartXRef.current == null || e.changedTouches.length === 0)
        return
      const dx = e.changedTouches[0].clientX - touchStartXRef.current
      touchStartXRef.current = null
      if (Math.abs(dx) > 55) {
        if (dx < 0) goToSpread(currentSpread + 1)
        else goToSpread(currentSpread - 1)
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: true })
    window.addEventListener("touchstart", handleTouchStart, { passive: true })
    window.addEventListener("touchend", handleTouchEnd, { passive: true })
    return () => {
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [currentSpread, goToSpread])

  const renderLeftFolio = (s) => {
    switch (s) {
      case 1:
        return (
          <Folio01Index
            onJumpToSpread={goToSpread}
            onPrev={() => goToSpread(0)}
          />
        )
      case 2:
        return <Folio03LeonX onPrev={() => goToSpread(1)} />
      case 3:
        return <Folio05DiscordBot onPrev={() => goToSpread(2)} />
      case 4:
        return <Folio07Services onPrev={() => goToSpread(3)} />
      default:
        return <EndpaperFolio />
    }
  }

  const renderRightFolio = (s) => {
    switch (s) {
      case 1:
        return (
          <Folio02About
            onJumpToSpread={goToSpread}
            onNext={() => goToSpread(2)}
          />
        )
      case 2:
        return <Folio04LeonXArch onNext={() => goToSpread(3)} />
      case 3:
        return <Folio06Arsenal onNext={() => goToSpread(4)} />
      case 4:
        return <Folio08Contact onNext={() => goToSpread(5)} />
      default:
        return <EndpaperFolio />
    }
  }

  const frontCoverEl = (
    <FrontCoverFace
      onOpenBook={() => goToSpread(1)}
      onJumpToSpread={goToSpread}
    />
  )

  const backCoverEl = (
    <BackCoverFace
      onReopenBook={() => goToSpread(4)}
      onFlipToFront={() => goToSpread(0)}
    />
  )

  let leftPageNode = null
  let rightPageNode = null
  let flipFrontNode = null
  let flipBackNode = null

  if (transitionState.active) {
    const { fromSpread, toSpread, direction } = transitionState
    if (direction > 0) {
      leftPageNode =
        fromSpread === 0 ? <EndpaperFolio /> : renderLeftFolio(fromSpread)
      rightPageNode =
        toSpread === 5 ? <EndpaperFolio /> : renderRightFolio(toSpread)
      flipFrontNode =
        fromSpread === 0 ? frontCoverEl : renderRightFolio(fromSpread)
      flipBackNode = toSpread === 5 ? backCoverEl : renderLeftFolio(toSpread)
    } else {
      leftPageNode =
        toSpread === 0 ? <EndpaperFolio /> : renderLeftFolio(toSpread)
      rightPageNode =
        fromSpread === 5 ? <EndpaperFolio /> : renderRightFolio(fromSpread)
      flipBackNode =
        fromSpread === 5 ? backCoverEl : renderLeftFolio(fromSpread)
      flipFrontNode =
        toSpread === 0 ? frontCoverEl : renderRightFolio(toSpread)
    }
  } else if (currentSpread >= 1 && currentSpread <= 4) {
    leftPageNode = renderLeftFolio(currentSpread)
    rightPageNode = renderRightFolio(currentSpread)
  }

  const displaySpread = transitionState.active
    ? transitionState.toSpread
    : currentSpread
  const isBookOpen = displaySpread >= 1 && displaySpread <= 4

  // Physical 3D Index Tabs protruding cleanly from the right edge (pl-4 ensures zero clipping!)
  const tabsNode = (
    <div className="flex flex-col gap-2.5 py-2 pr-1 select-none font-book-sans">
      {BOOK_TABS.slice(1, 5).map((tab) => {
        const isCurrent = displaySpread === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => goToSpread(tab.id)}
            className={`w-full py-2.5 pl-4 pr-3 text-left text-[12px] font-bold rounded-r-[6px] border-y border-r transition-all cursor-pointer shadow-md whitespace-nowrap ${
              isCurrent
                ? "bg-[#fcf9f2] text-[#18120c] border-[#eab34b] translate-x-1"
                : "bg-[#24140b] text-[#ecd5aa] border-[#d8b24c]/40 hover:bg-[#361e11] hover:text-white"
            }`}
          >
            {tab.short}
          </button>
        )
      })}
    </div>
  )

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0d0805] text-[#f7e7c4] flex flex-col justify-between select-none font-book-sans">
      {/* Unified Three.js WebGL + CSS3D Book & Desk */}
      <Suspense fallback={null}>
        <ThreeBookScene
          currentSpread={currentSpread}
          transitionState={transitionState}
          inspectMode={inspectMode}
          lampMode={lampMode}
          mobileSide={mobileSide}
          onLoupeClick={handleLoupeClick}
          onInkClick={handleInkClick}
          frontCoverNode={frontCoverEl}
          backCoverNode={backCoverEl}
          leftPageNode={leftPageNode}
          rightPageNode={rightPageNode}
          flipFrontNode={flipFrontNode}
          flipBackNode={flipBackNode}
          tabsNode={tabsNode}
        />
      </Suspense>

      {/* Soft Warm Vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-15"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 60%, rgba(6, 3, 2, 0.65) 100%)",
        }}
      />

      {/* Minimal Top Bar */}
      <header className="relative z-30 flex items-center justify-between px-5 sm:px-8 py-3 pointer-events-none">
        <button
          type="button"
          onClick={() => goToSpread(0)}
          className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#150c07]/80 border border-[#eab34b]/25 backdrop-blur-md hover:border-[#eab34b]/60 transition-colors cursor-pointer"
        >
          <span className="font-book-display font-bold text-base text-[#fbe39e]">
            Leon
          </span>
          <span className="text-[12px] text-[#c7b08b]">· Journal</span>
        </button>

        {/* Chapter Navigation Pill */}
        <nav
          aria-label="Journal Sections"
          className="pointer-events-auto hidden md:flex items-center gap-1 p-1 rounded-full bg-[#150c07]/85 border border-[#eab34b]/25 backdrop-blur-md"
        >
          {BOOK_TABS.slice(0, 5).map((tab) => {
            const active = displaySpread === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => goToSpread(tab.id)}
                className={`px-3.5 py-1 rounded-full text-[12px] font-medium transition-all cursor-pointer ${
                  active
                    ? "bg-[#eab34b] text-[#170d07] font-semibold"
                    : "text-[#e2cba4] hover:text-white"
                }`}
              >
                {tab.short.replace(/^\d+ · /, "")}
              </button>
            )
          })}
        </nav>

        {/* Rain Ambience, Candlelight Mood, Zoom & Sound Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleRain}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] font-medium backdrop-blur-md transition-all cursor-pointer ${
              rainPlaying
                ? "bg-[#3b82f6]/25 text-[#bae6fd] border-[#60a5fa]/70 font-semibold"
                : "bg-[#150c07]/80 text-[#f2dcb4] border-[#eab34b]/30 hover:border-[#eab34b]"
            }`}
            title="Toggle Night Rain & Cozy Study Ambience"
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {rainPlaying ? "Rain On" : "Rain"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              journalAudio.playStampClick()
              setLampMode((prev) => (prev === "study" ? "candle" : "study"))
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] font-medium backdrop-blur-md transition-all cursor-pointer ${
              lampMode === "candle"
                ? "bg-[#d97706] text-[#170d07] border-[#f59e0b] font-semibold"
                : "bg-[#150c07]/80 text-[#f2dcb4] border-[#eab34b]/30 hover:border-[#eab34b]"
            }`}
            title="Toggle Study Lamp / Candlelight Ambiance"
          >
            <Flame className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {lampMode === "candle" ? "Candle" : "Lamp"}
            </span>
          </button>

          {isBookOpen && (
            <button
              type="button"
              onClick={() => {
                journalAudio.playStampClick()
                setInspectMode((prev) => !prev)
              }}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[12px] font-medium backdrop-blur-md transition-all cursor-pointer ${
                inspectMode
                  ? "bg-[#eab34b] text-[#170d07] border-[#eab34b] font-semibold"
                  : "bg-[#150c07]/80 text-[#f2dcb4] border-[#eab34b]/30 hover:border-[#eab34b]"
              }`}
              title="Zoom Book (Z)"
            >
              {inspectMode ? (
                <>
                  <ZoomOut className="w-3.5 h-3.5" /> Zoom Out
                </>
              ) : (
                <>
                  <ZoomIn className="w-3.5 h-3.5" /> Zoom
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={handleToggleMute}
            className="p-2 rounded-full border border-[#eab34b]/30 bg-[#150c07]/80 backdrop-blur-md text-[#f2dcb4] hover:border-[#eab34b] transition-colors cursor-pointer"
            title={muted ? "Unmute Sound (M)" : "Mute Sound (M)"}
            aria-label={muted ? "Unmute sound" : "Mute sound"}
          >
            {muted ? (
              <VolumeX className="w-4 h-4 text-[#9e8666]" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#eab34b]" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Left/Right Page Switcher */}
      {isBookOpen && (
        <div className="relative z-30 flex lg:hidden justify-center pt-1 pointer-events-none">
          <div className="pointer-events-auto inline-flex rounded-full p-0.5 border border-[#eab34b]/35 bg-[#150c07]/90 shadow-lg">
            <button
              type="button"
              onClick={() => {
                journalAudio.playStampClick()
                setMobileSide("left")
              }}
              className={`px-3.5 py-1 rounded-full text-[12px] font-medium ${
                mobileSide === "left"
                  ? "bg-[#eab34b] text-[#170d07] font-semibold"
                  : "text-[#e5cda3]"
              }`}
            >
              Page {displaySpread * 2 - 1}
            </button>
            <button
              type="button"
              onClick={() => {
                journalAudio.playStampClick()
                setMobileSide("right")
              }}
              className={`px-3.5 py-1 rounded-full text-[12px] font-medium ${
                mobileSide === "right"
                  ? "bg-[#eab34b] text-[#170d07] font-semibold"
                  : "text-[#e5cda3]"
              }`}
            >
              Page {displaySpread * 2}
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 pointer-events-none" />

      {/* Clean Bottom Page Pill */}
      <footer className="relative z-30 flex justify-center pb-4 px-4 pointer-events-none">
        <div className="pointer-events-auto inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-[#150c07]/85 border border-[#eab34b]/30 backdrop-blur-md shadow-xl">
          <button
            type="button"
            onClick={() => goToSpread(currentSpread - 1)}
            disabled={currentSpread === 0 || transitionState.active}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[12.5px] font-medium text-[#fae29c] hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </button>

          <span className="px-2 text-[13px] font-medium text-[#e6d0a7] min-w-[155px] text-center">
            {BOOK_TABS[displaySpread]?.title}
          </span>

          <button
            type="button"
            onClick={() => goToSpread(currentSpread + 1)}
            disabled={currentSpread === 5 || transitionState.active}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[12.5px] font-medium text-[#fae29c] hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  )
}
