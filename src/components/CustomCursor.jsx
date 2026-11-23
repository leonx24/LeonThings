import { useEffect, useRef, useState } from "react"

export default function CustomCursor() {
  const [isMobile, setIsMobile] = useState(false)
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || window.innerWidth < 1024
      )
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    if (isMobile) {
      return () => window.removeEventListener("resize", checkMobile)
    }

    let targetX = -100
    let targetY = -100
    let ringX = -100
    let ringY = -100
    let hovering = false
    let rafId = null

    const moveCursor = (e) => {
      targetX = e.clientX
      targetY = e.clientY
      if (dotRef.current) {
        const s = hovering ? 0.55 : 1
        dotRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%) scale(${s})`
      }
    }

    const handleMouseOver = (e) => {
      const hit = Boolean(
        e.target?.closest?.(
          'a, button, [role="button"], input, textarea, .cursor-hover'
        )
      )
      if (hit !== hovering) {
        hovering = hit
        if (ringRef.current) {
          ringRef.current.style.borderColor = hovering
            ? "rgba(234, 179, 75, 0.9)"
            : "rgba(247, 231, 196, 0.42)"
          ringRef.current.style.backgroundColor = hovering
            ? "rgba(234, 179, 75, 0.1)"
            : "transparent"
        }
      }
    }

    const animateRing = () => {
      rafId = requestAnimationFrame(animateRing)
      ringX += (targetX - ringX) * 0.24
      ringY += (targetY - ringY) * 0.24
      if (ringRef.current) {
        const rs = hovering ? 1.42 : 1
        ringRef.current.style.transform = `translate3d(${ringX.toFixed(1)}px, ${ringY.toFixed(1)}px, 0) translate(-50%, -50%) scale(${rs})`
      }
    }

    window.addEventListener("mousemove", moveCursor, { passive: true })
    window.addEventListener("mouseover", handleMouseOver, { passive: true })
    rafId = requestAnimationFrame(animateRing)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener("mousemove", moveCursor)
      window.removeEventListener("mouseover", handleMouseOver)
      window.removeEventListener("resize", checkMobile)
    }
  }, [isMobile])

  if (isMobile) return null

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#fbe39e] shadow-[0_0_6px_rgba(234,179,75,0.8)] pointer-events-none z-[9999] will-change-transform transition-transform duration-75"
        style={{ transform: "translate3d(-100px, -100px, 0)" }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#f7e7c4]/40 pointer-events-none z-[9998] will-change-transform transition-colors duration-200"
        style={{ transform: "translate3d(-100px, -100px, 0)" }}
      />
    </>
  )
}
