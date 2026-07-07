import { useParams, Link, useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowUpRight, Calendar, Tag, Layers } from "lucide-react"

import { projects } from "../data/projects"
import Navbar from "../components/navbar"
import GridLines from "../components/gridLines"
import Noise from "../components/noise"
import LazyImage from "../components/LazyImage"
import CustomCursor from "../components/CustomCursor"
import Footer from "../components/footer"
import SEO from "../components/SEO"
import useSmoothScroll from "../hooks/useSmoothScroll"

// Reusable fade-up animation wrapper
function FadeUp({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Scroll-triggered reveal
function ScrollReveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function ProjectDetail() {
  useSmoothScroll()
  const { slug } = useParams()
  const navigate = useNavigate()
  const [heroImgLoaded, setHeroImgLoaded] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopySnippet = () => {
    if (project?.snippet?.code) {
      navigator.clipboard.writeText(project.snippet.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const highlightSnippet = (line, lang) => {
    if (!line) return " "
    if (lang === "luau" && line.trim().startsWith("--")) {
      return <span className="text-white/30">{line}</span>
    }
    if (lang === "typescript" && line.trim().startsWith("//")) {
      return <span className="text-white/30">{line}</span>
    }
    const stringRegex = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g
    const parts = line.split(stringRegex)
    const keywords = lang === "luau" 
      ? ["local", "function", "return", "if", "then", "end", "and", "or", "nil", "game"]
      : ["import", "export", "async", "function", "const", "let", "return", "await", "Promise", "boolean", "new", "false", "true"]

    return parts.map((part, i) => {
      if (part.startsWith('"') || part.startsWith("'")) {
        return <span key={i} className="text-stone-400">{part}</span>
      }
      const subparts = part.split(/(\b\w+\b)/g)
      return subparts.map((word, j) => {
        if (keywords.includes(word)) {
          return <span key={`${i}-${j}`} className="text-white font-medium">{word}</span>
        }
        if (word === "newcclosure" || word === "getrawmetatable" || word === "setreadonly" || word === "print" || word === "checkRateLimit" || word === "getnamecallmethod") {
          return <span key={`${i}-${j}`} className="text-white/95 underline decoration-white/20 underline-offset-2">{word}</span>
        }
        if (/^\d+$/.test(word)) {
          return <span key={`${i}-${j}`} className="text-white/40">{word}</span>
        }
        return word
      })
    })
  }

  const project = projects.find((p) => p.slug === slug)

  // Scroll to top on slug change with a small delay to handle route transitions and Lenis initialization
  useEffect(() => {
    const resetScroll = () => {
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true })
      } else {
        window.scrollTo(0, 0)
      }
    }
    
    // Execute immediately and after a short transition delay to ensure layout resolves
    resetScroll()
    const timer = setTimeout(resetScroll, 100)
    
    setHeroImgLoaded(false)
    return () => clearTimeout(timer)
  }, [slug])

  if (!project) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-[48px] mb-4">404</h1>
          <p className="text-white/40 font-mono text-[11px] uppercase tracking-[0.2em] mb-8">Project Not Found</p>
          <Link to="/" className="text-white/50 hover:text-white transition-colors font-mono text-[10px] uppercase tracking-[0.2em]">
            ← Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const currentIndex = projects.findIndex((p) => p.slug === slug)
  const nextProject = projects[(currentIndex + 1) % projects.length]
  const prevProject = projects[(currentIndex - 1 + projects.length) % projects.length]

  // Split overview into sentences for staggered animation
  const metaItems = [
    { icon: Calendar, label: "Year", value: project.year },
    { icon: Tag, label: "Category", value: project.tags.join(" · ") },
    { icon: Layers, label: "Project", value: `${project.number} of ${String(projects.length).padStart(2, "0")}` },
  ]

  return (
    <main className="bg-black text-white min-h-screen relative">
      <SEO
        title={`${project.title} — Case Study`}
        description={project.overview}
        path={`/project/${project.slug}`}
      />
      <CustomCursor />
      <GridLines />
      <Noise />
      <Navbar />

      {/* ─── CINEMATIC HERO ─── */}
      <section id="hero" className="relative z-10 min-h-[85vh] lg:min-h-[90vh] flex flex-col justify-end">
        
        {/* Hero Image - Full bleed background */}
        <div className="absolute inset-0 z-0">
          <motion.div
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: heroImgLoaded ? 0.35 : 0 }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full"
          >
            <img
              src={project.gallery[0]}
              alt=""
              onLoad={() => setHeroImgLoaded(true)}
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          {/* Gradient overlays for cinematic depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 px-8 lg:px-16 pb-20 lg:pb-28">
          <div className="max-w-6xl mx-auto">
            
            {/* Back navigation */}
            <FadeUp delay={0.1}>
              <Link
                to="/#works"
                className="
                  inline-flex items-center gap-2.5
                  font-mono text-[10px] uppercase tracking-[0.25em]
                  text-white/35 hover:text-white
                  transition-all duration-300
                  mb-16 lg:mb-20
                  group
                "
              >
                <ArrowLeft size={12} className="transition-transform duration-300 group-hover:-translate-x-1" />
                Back to Works
              </Link>
            </FadeUp>

            {/* Project Number + Label */}
            <FadeUp delay={0.2}>
              <div className="flex items-center gap-4 mb-6">
                <span className="font-mono text-[clamp(48px,8vw,100px)] leading-none text-white/[0.06] font-light select-none">
                  {project.number}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/30">
                  Case Study
                </span>
              </div>
            </FadeUp>

            {/* Title */}
            <FadeUp delay={0.35}>
              <h1 className="font-serif text-[clamp(48px,7.5vw,120px)] leading-[0.95] tracking-[-0.02em] max-w-4xl">
                {project.title}
              </h1>
            </FadeUp>

            {/* Tags */}
            <FadeUp delay={0.5}>
              <div className="flex flex-wrap gap-3 mt-8">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="
                      border border-white/10 rounded-full
                      px-4 py-1.5
                      font-mono text-[9px] uppercase tracking-[0.18em]
                      text-white/50
                      backdrop-blur-sm
                    "
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ─── PROJECT META BAR ─── */}
      <section className="relative z-10 border-t border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-8 lg:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.06]">
            {metaItems.map((item, i) => (
              <ScrollReveal key={item.label} delay={i * 0.1}>
                <div className="py-6 sm:py-8 sm:px-8 first:sm:pl-0 last:sm:pr-0 flex items-center gap-4">
                  <item.icon size={14} className="text-white/20 flex-shrink-0" />
                  <div>
                    <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/25 block mb-1">
                      {item.label}
                    </span>
                    <span className="font-mono text-[12px] text-white/70 tracking-wide">
                      {item.value}
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── OVERVIEW + HERO IMAGE ─── */}
      <section className="relative z-10 px-8 lg:px-16 pt-24 lg:pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            
            {/* Overview Text */}
            <div className="lg:col-span-5">
              <ScrollReveal>
                <div className="flex items-center gap-3.5 mb-10 font-mono uppercase tracking-[0.32em] text-[10px] text-white/35">
                  <span className="w-7 h-px bg-white/35" />
                  Overview
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.15}>
                <p className="text-[clamp(15px,1.6vw,18px)] leading-[1.85] text-white/55 font-light">
                  {project.overview}
                </p>
              </ScrollReveal>
            </div>

            {/* Primary Showcase Image */}
            <div className="lg:col-span-7">
              <ScrollReveal delay={0.2}>
                <div className="
                  relative overflow-hidden
                  border border-white/[0.07]
                  bg-white/[0.02]
                  group
                ">
                  <div className="aspect-[16/10] overflow-hidden">
                    <LazyImage
                      src={project.gallery[0]}
                      alt={project.title}
                      priority={true}
                      className="
                        w-full h-full object-cover
                        transition-transform duration-[1.2s] ease-out
                        group-hover:scale-[1.03]
                      "
                    />
                  </div>
                  
                  {/* Subtle corner accent */}
                  <div className="absolute top-0 left-0 w-12 h-px bg-white/20" />
                  <div className="absolute top-0 left-0 w-px h-12 bg-white/20" />
                  <div className="absolute bottom-0 right-0 w-12 h-px bg-white/20" />
                  <div className="absolute bottom-0 right-0 w-px h-12 bg-white/20" />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CHALLENGE · SOLUTION · RESULT (Editorial Layout) ─── */}
      <section className="relative z-10 px-8 lg:px-16 py-24 lg:py-32 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">

          {/* Challenge - Left aligned */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 mb-24 lg:mb-32">
            <div className="lg:col-span-4">
              <ScrollReveal>
                <div className="flex items-center gap-3.5 mb-6 font-mono uppercase tracking-[0.32em] text-[10px] text-white/35">
                  <span className="w-7 h-px bg-white/35" />
                  01
                </div>
                <h3 className="font-serif text-[clamp(24px,3vw,40px)] leading-[1.15] text-white/90 italic">
                  The Challenge
                </h3>
              </ScrollReveal>
            </div>
            <div className="lg:col-span-7 lg:col-start-6 flex items-center">
              <ScrollReveal delay={0.15}>
                <p className="text-[14px] leading-[2] text-white/50 font-light lg:border-l lg:border-white/[0.06] lg:pl-10">
                  {project.challenge}
                </p>
              </ScrollReveal>
            </div>
          </div>

          {/* Solution - Right aligned */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 mb-24 lg:mb-32">
            <div className="lg:col-span-4">
              <ScrollReveal>
                <div className="flex items-center gap-3.5 mb-6 font-mono uppercase tracking-[0.32em] text-[10px] text-white/35">
                  <span className="w-7 h-px bg-white/35" />
                  02
                </div>
                <h3 className="font-serif text-[clamp(24px,3vw,40px)] leading-[1.15] text-white/90 italic">
                  The Approach
                </h3>
              </ScrollReveal>
            </div>
            <div className="lg:col-span-7 lg:col-start-6 flex items-center">
              <ScrollReveal delay={0.15}>
                <p className="text-[14px] leading-[2] text-white/50 font-light lg:border-l lg:border-white/[0.06] lg:pl-10">
                  {project.solution}
                </p>
              </ScrollReveal>
            </div>
          </div>

          {/* Result - Full-width accent */}
          <ScrollReveal>
            <div className="
              relative
              p-10 lg:p-16
              border border-white/[0.06]
              bg-white/[0.01]
            ">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-16 h-px bg-white/15" />
              <div className="absolute top-0 left-0 w-px h-16 bg-white/15" />
              <div className="absolute bottom-0 right-0 w-16 h-px bg-white/15" />
              <div className="absolute bottom-0 right-0 w-px h-16 bg-white/15" />

              <div className="flex items-center gap-3.5 mb-6 font-mono uppercase tracking-[0.32em] text-[10px] text-white/35">
                <span className="w-7 h-px bg-white/35" />
                03. Outcome
              </div>
              <p className="font-serif text-[clamp(20px,2.5vw,32px)] leading-[1.55] text-white/75 italic max-w-3xl">
                "{project.result}"
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── TECHNICAL ARCHITECTURE & SNIPPETS (Anti-AI Proof of Work) ─── */}
      {project.architecture && project.snippet && (
        <section className="relative z-10 px-8 lg:px-16 py-24 lg:py-32 border-t border-white/[0.06] bg-white/[0.005]">
          <div className="max-w-6xl mx-auto">
            
            <ScrollReveal>
              <div className="flex items-center gap-3.5 mb-16 font-mono uppercase tracking-[0.32em] text-[10px] text-white/35">
                <span className="w-7 h-px bg-white/35" />
                Technical Implementation
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              
              {/* Left: System Architecture Flow */}
              <div className="lg:col-span-5 space-y-12">
                <ScrollReveal delay={0.1}>
                  <h3 className="font-serif text-[clamp(28px,3vw,44px)] leading-none text-white/95 mb-4">
                    Data Flow & Systems
                  </h3>
                  <p className="text-[13px] leading-[1.85] text-white/40 font-light mb-8">
                    Below is the telemetry map detailing how data moves through this system's environment securely.
                  </p>
                </ScrollReveal>

                {/* Vertical Stepper Diagram */}
                <div className="relative border-l border-white/[0.07] ml-2.5 pl-8 space-y-10">
                  {project.architecture.map((item, index) => (
                    <ScrollReveal key={item.step} delay={0.15 + index * 0.1}>
                      <div className="relative">
                        
                        {/* Dot Anchor */}
                        <span className="absolute -left-[37px] top-1 flex h-4 w-4 items-center justify-center rounded-full border border-white/20 bg-black text-[8px] font-mono text-white/50 select-none">
                          {item.step}
                        </span>

                        <div className="flex flex-col gap-1.5">
                          <span className="font-mono text-[10px] uppercase tracking-wider text-white">
                            {item.label}
                          </span>
                          <span className="text-[12px] leading-relaxed text-white/40 font-light">
                            {item.desc}
                          </span>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>

              {/* Right: Interactive Code Snippet Window */}
              <div className="lg:col-span-7">
                <ScrollReveal delay={0.2}>
                  <div className="border border-white/[0.07] bg-black rounded-sm overflow-hidden flex flex-col">
                    
                    {/* Window Header */}
                    <div className="border-b border-white/[0.07] bg-white/[0.015] px-4.5 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                          <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                          <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                        </div>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-white/35 ml-2.5">
                          src/{project.snippet.filename}
                        </span>
                      </div>
                      
                      {/* Copy Code Button */}
                      <button
                        onClick={handleCopySnippet}
                        className="
                          font-mono text-[9px] uppercase tracking-wider
                          px-3 py-1.5 border border-white/10 rounded-sm
                          text-white/45 hover:text-white hover:bg-white/[0.03]
                          transition-all duration-300
                          cursor-hover
                        "
                      >
                        {copied ? "Copied" : "Copy Code"}
                      </button>
                    </div>

                    {/* Syntax Highlighted Code Area */}
                    <div className="overflow-x-auto p-5 font-mono text-[11px] leading-[1.8] text-white/70 max-h-[380px] overflow-y-auto select-text">
                      <pre className="whitespace-pre">
                        <code>
                          {project.snippet.code.split("\n").map((line, idx) => (
                            <div key={idx} className="flex gap-4">
                              <span className="w-6 text-white/15 text-right select-none tabular-nums">
                                {idx + 1}
                              </span>
                              <span>
                                {highlightSnippet(line, project.snippet.language)}
                              </span>
                            </div>
                          ))}
                        </code>
                      </pre>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── GALLERY (Bento Grid) ─── */}
      {project.gallery.length > 1 && (
        <section className="relative z-10 px-8 lg:px-16 py-20 lg:py-28 border-t border-white/[0.06]">
          <div className="max-w-6xl mx-auto">
            
            <ScrollReveal>
              <div className="flex items-center gap-3.5 mb-14 font-mono uppercase tracking-[0.32em] text-[10px] text-white/35">
                <span className="w-7 h-px bg-white/35" />
                Visual Gallery
              </div>
            </ScrollReveal>

            {/* Bento-style grid based on gallery count */}
            <div className={`
              grid gap-4 lg:gap-5
              ${project.gallery.length === 2 
                ? "grid-cols-1" 
                : project.gallery.length === 3 
                  ? "grid-cols-1 lg:grid-cols-12" 
                  : "grid-cols-1 lg:grid-cols-2"
              }
            `}>
              {project.gallery.slice(1).map((image, index) => {
                // For 3-image galleries: first extra image is wide (8col), second is narrow (4col)
                const isWide = project.gallery.length === 3 && index === 0
                const isNarrow = project.gallery.length === 3 && index === 1
                
                return (
                  <ScrollReveal
                    key={index}
                    delay={index * 0.1}
                    className={`
                      ${isWide ? "lg:col-span-8" : ""}
                      ${isNarrow ? "lg:col-span-4" : ""}
                    `}
                  >
                    <div className="
                      group
                      relative
                      border border-white/[0.06]
                      bg-white/[0.015]
                      overflow-hidden
                    ">
                      <div className={`
                        overflow-hidden
                        ${isNarrow ? "aspect-[3/4]" : "aspect-[16/10]"}
                      `}>
                        <LazyImage
                          src={image}
                          alt={`${project.title} — ${index + 2}`}
                          className="
                            w-full h-full object-cover
                            transition-transform duration-[1.4s] ease-out
                            group-hover:scale-[1.04]
                          "
                        />
                      </div>
                      
                      {/* Image index label */}
                      <div className="
                        absolute bottom-4 left-4
                        font-mono text-[9px] uppercase tracking-[0.2em]
                        text-white/25
                        bg-black/60 backdrop-blur-sm
                        px-2.5 py-1 rounded-sm
                      ">
                        {String(index + 2).padStart(2, "0")} / {String(project.gallery.length).padStart(2, "0")}
                      </div>
                    </div>
                  </ScrollReveal>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── NEXT PROJECT (Cinematic Transition) ─── */}
      {projects.length > 1 && (
        <section className="relative z-10 border-t border-white/[0.06]">
          <Link
            to={`/project/${nextProject.slug}`}
            className="group block"
          >
            <div className="relative overflow-hidden">
              
              {/* Background image of next project */}
              <motion.div
                className="absolute inset-0 z-0"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              >
                <img
                  src={nextProject.gallery[0]}
                  alt=""
                  className="
                    w-full h-full object-cover opacity-[0.08]
                    transition-all duration-[1.5s] ease-out
                    group-hover:opacity-[0.18]
                    group-hover:scale-[1.05]
                  "
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/60" />
              </motion.div>

              {/* Content */}
              <div className="relative z-10 px-8 lg:px-16 py-24 lg:py-32">
                <div className="max-w-6xl mx-auto">
                  <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                    
                    <div>
                      <ScrollReveal>
                        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/25 block mb-6">
                          Next Project — {nextProject.number}
                        </span>
                      </ScrollReveal>
                      
                      <ScrollReveal delay={0.1}>
                        <h2 className="
                          font-serif
                          text-[clamp(36px,6vw,80px)]
                          leading-[0.95]
                          tracking-[-0.02em]
                          transition-transform duration-700 ease-out
                          group-hover:translate-x-4
                        ">
                          {nextProject.title}
                        </h2>
                      </ScrollReveal>

                      <ScrollReveal delay={0.2}>
                        <div className="flex flex-wrap gap-2.5 mt-6">
                          {nextProject.tags.map((tag) => (
                            <span
                              key={tag}
                              className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/30"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </ScrollReveal>
                    </div>

                    <ScrollReveal delay={0.15}>
                      <div className="
                        flex items-center gap-3
                        font-mono text-[10px] uppercase tracking-[0.2em]
                        text-white/40
                        transition-all duration-500 ease-out
                        group-hover:text-white
                        group-hover:translate-x-2
                        flex-shrink-0
                      ">
                        View Project
                        <ArrowUpRight 
                          size={16} 
                          className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" 
                        />
                      </div>
                    </ScrollReveal>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      <Footer />
    </main>
  )
}