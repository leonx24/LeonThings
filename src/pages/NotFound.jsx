import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import GridLines from "../components/gridLines"
import Noise from "../components/noise"
import CustomCursor from "../components/CustomCursor"
import SEO from "../components/SEO"

// ASCII art for 404
const ASCII_ART = `
 ██╗  ██╗ ██████╗ ██╗  ██╗
 ██║  ██║██╔═████╗██║  ██║
 ███████║██║██╔██║███████║
 ╚════██║████╔╝██║╚════██║
      ██║╚██████╔╝     ██║
      ╚═╝ ╚═════╝      ╚═╝
`.trim()

// Glitch characters for scramble effect
const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;':\",./<>?~`01"

function GlitchText({ text, className = "" }) {
  const [displayText, setDisplayText] = useState(text)
  const [isGlitching, setIsGlitching] = useState(false)
  const intervalRef = useRef(null)

  const triggerGlitch = () => {
    if (isGlitching) return
    setIsGlitching(true)
    
    let iterations = 0
    const maxIterations = 8
    
    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, i) => {
            if (char === " " || char === "\n") return char
            if (iterations > i * 0.4) return char
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
          })
          .join("")
      )
      
      iterations += 1
      if (iterations > maxIterations) {
        clearInterval(intervalRef.current)
        setDisplayText(text)
        setIsGlitching(false)
      }
    }, 50)
  }

  useEffect(() => {
    // Auto-glitch on mount
    const timer = setTimeout(triggerGlitch, 800)
    return () => {
      clearTimeout(timer)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  // Periodic glitch
  useEffect(() => {
    const periodic = setInterval(triggerGlitch, 5000 + Math.random() * 3000)
    return () => clearInterval(periodic)
  }, [])

  return (
    <span
      className={`${className} cursor-hover`}
      onMouseEnter={triggerGlitch}
    >
      {displayText}
    </span>
  )
}

export default function NotFound() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [scanlineOffset, setScanlineOffset] = useState(0)

  // Track mouse for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Scanline animation
  useEffect(() => {
    const interval = setInterval(() => {
      setScanlineOffset((prev) => (prev + 1) % 200)
    }, 30)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="bg-black text-white min-h-screen relative overflow-hidden">
      <SEO
        title="404 — Page Not Found"
        description="The page you're looking for doesn't exist or has been moved."
        noIndex={true}
      />
      <CustomCursor />
      <GridLines />
      <Noise />

      {/* Scanline overlay */}
      <div
        className="fixed inset-0 z-20 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.08) 2px,
            rgba(255, 255, 255, 0.08) 4px
          )`,
          backgroundPosition: `0 ${scanlineOffset}px`,
        }}
      />

      {/* Ambient glow */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            600px circle at ${50 + mousePos.x * 10}% ${50 + mousePos.y * 10}%,
            rgba(255, 255, 255, 0.015),
            transparent 60%
          )`,
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-8 lg:px-16">
        
        {/* ASCII Art 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-10"
          style={{
            transform: `translate(${mousePos.x * -4}px, ${mousePos.y * -4}px)`,
          }}
        >
          <pre className="
            font-mono text-[6px] sm:text-[8px] md:text-[10px]
            leading-tight text-white/[0.06]
            select-none whitespace-pre
            text-center
          ">
            {ASCII_ART}
          </pre>
        </motion.div>

        {/* Error label */}
        <motion.div
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/25 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <GlitchText text="ERROR 404 — NOT FOUND" />
        </motion.div>

        {/* Main heading with glitch */}
        <motion.h1
          className="
            font-serif
            text-[clamp(48px,9vw,130px)]
            leading-[0.92]
            tracking-[-0.02em]
            text-center
            mb-8
            relative
          "
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          style={{
            transform: `translate(${mousePos.x * 3}px, ${mousePos.y * 3}px)`,
          }}
        >
          {/* Glitch duplicate layers */}
          <span
            className="absolute inset-0 text-white/[0.04] select-none pointer-events-none"
            style={{ transform: `translate(${mousePos.x * 8}px, ${mousePos.y * -2}px)` }}
            aria-hidden="true"
          >
            Page not<br /><em className="italic">found</em>
          </span>
          
          <span className="relative">
            Page not
            <br />
            <em className="italic text-white/60">found</em>
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          className="
            max-w-md mx-auto text-center
            text-[13px] leading-[1.85]
            text-white/40
            mb-14
          "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          The resource at this address has been moved, deleted, or never existed.
          <br />
          <span className="text-white/20 font-mono text-[10px]">
            Path: <code className="text-white/30">{window.location.pathname}</code>
          </span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
        >
          <Link
            to="/"
            className="
              group relative
              px-8 py-4
              border border-white/10
              font-mono text-[10px] uppercase tracking-[0.2em]
              transition-all duration-300
              hover:bg-white hover:text-black hover:border-white
            "
          >
            <span className="relative z-10">Back to Home</span>
          </Link>

          <Link
            to="/#works"
            className="
              group
              px-8 py-4
              font-mono text-[10px] uppercase tracking-[0.2em]
              text-white/40
              transition-colors duration-300
              hover:text-white
            "
          >
            View Projects →
          </Link>
        </motion.div>

        {/* Terminal-style error log */}
        <motion.div
          className="
            mt-20
            w-full max-w-md
            border border-white/[0.05]
            bg-white/[0.01]
            p-5
            font-mono text-[10px]
            text-white/20
            leading-relaxed
          "
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1 }}
        >
          <div className="flex items-center gap-2 mb-3 text-white/10 text-[8px] uppercase tracking-[0.2em]">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
            System Log
          </div>
          <div className="space-y-1">
            <p><span className="text-white/30">[GET]</span> {window.location.pathname} <span className="text-red-400/50">→ 404</span></p>
            <p><span className="text-white/30">[SYS]</span> Route resolver returned null</p>
            <p><span className="text-white/30">[SYS]</span> Fallback handler activated</p>
            <p className="text-white/10">— End of log —</p>
          </div>
        </motion.div>
      </div>
    </main>
  )
}