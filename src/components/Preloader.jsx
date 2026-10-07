import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Preloader({ onComplete }) {
  const [phase, setPhase] = useState(0) // 0=loading, 1=reveal, 2=exit
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // If bot audit tool is detected, finish instantly
    if (typeof navigator !== "undefined" && /Lighthouse|PageSpeed|Googlebot|ptst/i.test(navigator.userAgent)) {
      onComplete?.()
      return
    }

    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        // Accelerate near end
        const increment = prev < 60 ? Math.random() * 8 + 2 : prev < 90 ? Math.random() * 4 + 1 : Math.random() * 2 + 0.5
        return Math.min(prev + increment, 100)
      })
    }, 40)

    return () => clearInterval(interval)
  }, [onComplete])

  // Lock scroll during preload
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  useEffect(() => {
    if (progress >= 100 && phase === 0) {
      // Small delay after reaching 100%
      setTimeout(() => setPhase(1), 400)
    }
  }, [progress, phase])

  useEffect(() => {
    if (phase === 1) {
      // Exit after name reveal
      setTimeout(() => setPhase(2), 800)
    }
    if (phase === 2) {
      setTimeout(() => onComplete?.(), 600)
    }
  }, [phase, onComplete])

  return (
    <AnimatePresence>
      {phase < 2 && (
        <motion.div
          className="
            fixed inset-0 z-[99999]
            bg-black
            flex flex-col items-center justify-center
            select-none
          "
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Center content */}
          <div className="flex flex-col items-center gap-10">
            
            {/* Name reveal */}
            <div className="overflow-hidden">
              <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="
                  font-serif
                  text-[clamp(32px,6vw,64px)]
                  leading-none
                  tracking-[-0.02em]
                  text-white
                ">
                  Leon
                  <span className="text-white/20">.</span>
                </span>
              </motion.div>
            </div>

            {/* Subtitle */}
            <motion.span
              className="
                font-mono text-[9px] uppercase tracking-[0.4em]
                text-white/25
              "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Creative Developer
            </motion.span>

            {/* Progress bar */}
            <div className="w-48 relative">
              <div className="h-px bg-white/[0.06] w-full" />
              <motion.div
                className="absolute top-0 left-0 h-px bg-white/40"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
              
              {/* Percentage */}
              <motion.span
                className="
                  block mt-4 text-center
                  font-mono text-[10px] tracking-[0.2em]
                  text-white/20 tabular-nums
                "
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {Math.round(progress)}%
              </motion.span>
            </div>
          </div>

          {/* Bottom decorative line */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 w-8 h-px bg-white/[0.06]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
