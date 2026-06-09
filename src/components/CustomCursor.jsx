import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springConfig = { damping: 25, stiffness: 400 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    // Check if device is mobile/touch
    const checkMobile = () => {
      setIsMobile(
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || window.innerWidth < 1024
      )
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    // Don't show cursor on mobile
    if (isMobile) return

    const moveCursor = (e) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    // Track mouse movement
    window.addEventListener("mousemove", moveCursor)

    // Track hover on interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, [role="button"], .cursor-hover'
    )

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter)
      el.addEventListener("mouseleave", handleMouseLeave)
    })

    return () => {
      window.removeEventListener("mousemove", moveCursor)
      window.removeEventListener("resize", checkMobile)

      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter)
        el.removeEventListener("mouseleave", handleMouseLeave)
      })
    }
  }, [cursorX, cursorY, isMobile])

  // Don't render on mobile
  if (isMobile) return null

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="
          fixed
          top-0
          left-0

          w-2
          h-2

          bg-white

          rounded-full

          pointer-events-none

          z-[9999]

          mix-blend-difference
        "
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovering ? 0.5 : 1,
        }}
        transition={{
          duration: 0.2,
        }}
      />

      {/* Cursor ring/outline */}
      <motion.div
        className="
          fixed
          top-0
          left-0

          w-8
          h-8

          border
          border-white/30

          rounded-full

          pointer-events-none

          z-[9998]

          mix-blend-difference
        "
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.5 : 1,
        }}
        transition={{
          duration: 0.3,
        }}
      />
    </>
  )
}
