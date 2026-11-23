import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowDown, ArrowUpRight, Send } from "lucide-react"
import { WebGLApp } from "../webgl/WebGLApp"
import { ScrollChoreographer } from "../scroll/ScrollChoreographer"
import {
  getHarborProjects,
  getHarborProjectBySlug,
  getHarborServices,
} from "./projectAdapter"
import {
  SOCIAL_LINKS,
  CONTACT_TOPICS,
  sendContactMessage,
} from "../../lib/contactService"
import NavigationDock from "./NavigationDock"
import ProjectDrawer from "./ProjectDrawer"

export default function HarborExperience({ initialProjectSlug = null }) {
  const navigate = useNavigate()
  const canvasContainerRef = useRef(null)
  const choreographerRef = useRef(null)

  const projects = getHarborProjects()
  const services = getHarborServices()

  const [activeZone, setActiveZone] = useState("surface")
  const [scrollProgress, setScrollProgress] = useState(0)
  const [selectedProject, setSelectedProject] = useState(() =>
    initialProjectSlug ? getHarborProjectBySlug(initialProjectSlug) || null : null
  )

  // Contact form state (EmailJS integration preserved from Contact / Folio08)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [status, setStatus] = useState("idle")
  const [activeTopic, setActiveTopic] = useState(null)

  // Sync deep-link slug updates cleanly
  const [prevSlug, setPrevSlug] = useState(initialProjectSlug)
  if (initialProjectSlug !== prevSlug) {
    setPrevSlug(initialProjectSlug)
    setSelectedProject(
      initialProjectSlug
        ? getHarborProjectBySlug(initialProjectSlug) || null
        : null
    )
  }

  // Mount WebGL scene & Lenis/GSAP scroll choreographer with strict disposal
  useEffect(() => {
    const container = canvasContainerRef.current
    if (!container) return

    const webglApp = new WebGLApp(container)
    const choreographer = new ScrollChoreographer({
      webglApp,
      trigger: document.documentElement,
      onProgress: (progress, zone) => {
        setScrollProgress(progress)
        setActiveZone(zone)
      },
    })
    choreographerRef.current = choreographer

    // If opened via /project/:slug, scroll subtly toward the waterline/depths zone
    if (initialProjectSlug) {
      const targetProj = getHarborProjectBySlug(initialProjectSlug)
      if (targetProj) {
        setTimeout(() => {
          choreographer.scrollTo("#works", { immediate: true })
        }, 40)
      }
    }

    return () => {
      choreographerRef.current = null
      choreographer.dispose()
      webglApp.dispose()
    }
  }, [initialProjectSlug])

  const handleNavigateSection = (target) => {
    if (choreographerRef.current) {
      choreographerRef.current.scrollTo(target, { duration: 1.25 })
    } else {
      const el = document.querySelector(target)
      el?.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleCloseDrawer = () => {
    setSelectedProject(null)
    if (initialProjectSlug) {
      navigate("/", { replace: true })
    }
  }

  const handleSelectTopic = (topic) => {
    setActiveTopic(topic.label)
    setFormData((prev) => ({ ...prev, message: topic.text }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus("sending")
    try {
      await sendContactMessage(formData)
      setStatus("success")
      setFormData({ name: "", email: "", message: "" })
      setActiveTopic(null)
      setTimeout(() => setStatus("idle"), 5000)
    } catch (err) {
      console.error("EmailJS error:", err)
      setStatus("error")
      setTimeout(() => setStatus("idle"), 5000)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#091d2c] text-[#f4efe6] font-ui selection:bg-[#ffd27d] selection:text-[#091d2c]">
      {/* Fixed Full-Viewport 2.5D WebGL Cross-Section Canvas (or CSS Gradient Fallback) */}
      <div
        ref={canvasContainerRef}
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      />

      {/* Minimal Top Bar */}
      <header className="fixed top-0 inset-x-0 z-20 pointer-events-none px-6 sm:px-10 lg:px-16 py-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => handleNavigateSection("#surface")}
          className="pointer-events-auto font-editorial text-2xl sm:text-3xl tracking-wide text-[#f4efe6] harbor-text-shadow hover:text-[#ffd27d] transition-colors cursor-pointer"
        >
          HARBOR
        </button>

        <nav
          aria-label="Primary sections"
          className="pointer-events-auto flex items-center gap-5 sm:gap-8 text-[11px] sm:text-xs font-medium uppercase tracking-[0.22em] text-[#f4efe6]/85 harbor-text-shadow"
        >
          <button
            type="button"
            onClick={() => handleNavigateSection("#about")}
            className="hover:text-[#ffd27d] transition-colors cursor-pointer"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => handleNavigateSection("#works")}
            className="hover:text-[#ffd27d] transition-colors cursor-pointer"
          >
            Journey
          </button>
          <button
            type="button"
            onClick={() => handleNavigateSection("#contact")}
            className="hover:text-[#ffd27d] transition-colors cursor-pointer"
          >
            Contact
          </button>
        </nav>
      </header>

      {/* Semantic HTML Editorial Layer Floating Over Scenic Negative Space */}
      <main className="relative z-10 pointer-events-none">
        {/* ─── ZONE 1: SURFACE HORIZON (Y > 0) ─── */}
        <section
          id="surface"
          className="min-h-screen flex items-center px-6 sm:px-12 lg:px-20 pt-24 pb-20"
        >
          <div className="max-w-7xl mx-auto w-full">
            <div className="max-w-xl pointer-events-auto harbor-text-shadow space-y-6">
              <div className="inline-flex items-center gap-3 font-mono-code text-[11px] uppercase tracking-[0.28em] text-[#ffd27d]">
                <span className="w-8 h-px bg-[#ffd27d]/70" />
                Leon · Creative Developer
              </div>

              <h1 className="font-editorial font-normal text-[clamp(56px,8.5vw,108px)] leading-[0.94] tracking-[-0.02em] text-[#f4efe6]">
                Leon<span className="text-[#ffd27d]">.</span>
                <span className="block italic text-[clamp(28px,4vw,48px)] text-[#f4efe6]/88 mt-2">
                  Interactive Web &amp; Systems
                </span>
              </h1>

              <p className="text-base sm:text-lg leading-relaxed text-[#b8c7d4] max-w-md">
                Building clean interfaces, real-time 3D web experiences, modular
                Roblox Luau engines, and resilient Discord automation from
                Indonesia.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => handleNavigateSection("#works")}
                  className="harbor-glass inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-medium text-[#f4efe6] hover:border-[#ffd27d]/60 hover:text-[#ffd27d] transition-all cursor-pointer"
                >
                  Start the journey
                  <ArrowDown className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigateSection("#contact")}
                  className="text-xs font-mono-code uppercase tracking-[0.22em] text-[#b8c7d4] hover:text-[#f4efe6] underline underline-offset-8 decoration-[#f4efe6]/30 transition-colors cursor-pointer"
                >
                  Direct Inquiry
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ─── ZONE 2: WATERLINE & UNDERWATER DEPTHS (BORDERLESS ZIG-ZAG WORKS) ─── */}
        <section id="works" className="px-6 sm:px-12 lg:px-20 py-10">
          <div className="max-w-7xl mx-auto space-y-28 sm:space-y-44">
            {projects.map((project) => {
              const isRight = project.alignment === "right"
              const isLantern = project.accentTone === "lantern"
              const accentColor = isLantern ? "#ffd27d" : "#7ee8fa"

              return (
                <article
                  key={project.id}
                  className="min-h-[62vh] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
                >
                  {/* Floating HARBOR-Themed Project Thumbnail Preview */}
                  <div
                    className={`pointer-events-auto lg:col-span-6 ${
                      isRight ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedProject(project)}
                      className="group relative block w-full overflow-hidden rounded-2xl border border-[#f4efe6]/18 bg-[#071828]/55 shadow-[0_24px_60px_rgba(3,12,22,0.65)] transition-all duration-500 hover:-translate-y-1 cursor-pointer text-left"
                      style={{
                        boxShadow: isLantern
                          ? "0 24px 60px rgba(3, 12, 22, 0.65), 0 0 0 1px rgba(255, 210, 125, 0.14)"
                          : "0 24px 60px rgba(3, 12, 22, 0.65), 0 0 0 1px rgba(126, 232, 250, 0.14)",
                      }}
                    >
                      <div className="aspect-[16/10] overflow-hidden">
                        <img
                          src={project.thumbnail}
                          alt={`${project.title} preview`}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        />
                      </div>

                      {/* Subtle edge vignette + bottom open prompt */}
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(180deg, transparent 58%, rgba(6, 18, 30, 0.68) 100%)",
                        }}
                      />
                      <div className="absolute bottom-3.5 inset-x-4 flex items-center justify-between text-[11px] font-mono-code uppercase tracking-[0.2em]">
                        <span style={{ color: accentColor }}>
                          {project.index} · {project.version || project.year}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[#f4efe6]/90 group-hover:text-[#ffd27d] transition-colors">
                          Open Dossier <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </button>
                  </div>

                  {/* Borderless Editorial Typography Column */}
                  <div
                    className={`pointer-events-auto lg:col-span-6 harbor-text-shadow space-y-4 text-left ${
                      isRight
                        ? "lg:order-2 md:text-right md:pl-6"
                        : "lg:order-1 md:text-left md:pr-6"
                    }`}
                  >
                    <div
                      className={`inline-flex items-center gap-2.5 font-mono-code text-[10.5px] uppercase tracking-[0.26em] ${
                        isRight ? "md:flex-row-reverse" : ""
                      }`}
                      style={{ color: accentColor }}
                    >
                      <span
                        className="w-6 h-px opacity-65"
                        style={{ backgroundColor: accentColor }}
                      />
                      {project.depthLabel}
                    </div>

                    <h2 className="font-editorial font-normal text-[clamp(36px,4.8vw,60px)] leading-[1.02] tracking-tight text-[#f4efe6]">
                      <span className="mr-3" style={{ color: accentColor }}>
                        {project.index} /
                      </span>
                      {project.title.toUpperCase()}
                    </h2>

                    <p className="text-[15px] leading-relaxed text-[#b8c7d4]">
                      {project.summary}
                    </p>

                    <div className="font-mono-code text-[11.5px] tracking-wide text-[#f4efe6]/75">
                      — {project.techStack.slice(0, 4).join(", ")}
                    </div>

                    <div
                      className={`pt-2 flex flex-wrap items-center gap-4 ${
                        isRight ? "md:justify-end" : "md:justify-start"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedProject(project)}
                        className="harbor-glass inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-[0.16em] text-[#f4efe6] hover:border-[#7ee8fa]/70 hover:text-[#7ee8fa] transition-all cursor-pointer"
                      >
                        Inspect Case Study
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>

                      {project.version && (
                        <span
                          className="font-mono-code text-[11px]"
                          style={{ color: accentColor }}
                        >
                          {project.version} · {project.status}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* ─── ZONE 3: CRAFT & CAPABILITIES (BORDERLESS EDITORIAL COLUMNS) ─── */}
        <section
          id="about"
          className="px-6 sm:px-12 lg:px-20 py-28 sm:py-36"
        >
          <div className="max-w-6xl mx-auto pointer-events-auto harbor-text-shadow space-y-12">
            <div className="max-w-xl space-y-3">
              <div className="inline-flex items-center gap-3 font-mono-code text-[10.5px] uppercase tracking-[0.28em] text-[#7ee8fa]">
                <span className="w-7 h-px bg-[#7ee8fa]/60" />
                Disciplines &amp; Stack
              </div>
              <h2 className="font-editorial text-[clamp(34px,4.5vw,56px)] leading-[1.06] text-[#f4efe6]">
                Crafted from surface UI down to{" "}
                <em className="italic text-[#ffd27d]">core architecture</em>.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-t border-[#f4efe6]/15 pt-10">
              {services.map((srv) => (
                <div key={srv.id} className="space-y-3">
                  <div className="font-mono-code text-[11px] text-[#ffd27d] tracking-[0.2em]">
                    {srv.id}
                  </div>
                  <h3 className="font-editorial text-3xl text-[#f4efe6]">
                    {srv.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#b8c7d4]">
                    {srv.desc}
                  </p>
                  <div className="font-mono-code text-[11px] text-[#7ee8fa]/85 pt-1">
                    {srv.tech.join(" · ")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── ZONE 4: OCEAN FLOOR ABYSS — CONTACT & PRESERVED SOCIAL LINKS ─── */}
        <section
          id="contact"
          className="px-6 sm:px-12 lg:px-20 pt-20 pb-36"
        >
          <div className="max-w-6xl mx-auto pointer-events-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left: Social Channels & Direct Contact */}
            <div className="lg:col-span-5 harbor-text-shadow space-y-8">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-3 font-mono-code text-[10.5px] uppercase tracking-[0.28em] text-[#7ee8fa]">
                  <span className="w-7 h-px bg-[#7ee8fa]/60" />
                  Abyss · Let’s Talk
                </div>
                <h2 className="font-editorial text-[clamp(38px,5vw,60px)] leading-[1.05] text-[#f4efe6]">
                  Have a project in mind?
                  <em className="block italic text-[#ffd27d]">
                    Let’s build it.
                  </em>
                </h2>
              </div>

              <div className="divide-y divide-[#f4efe6]/14 border-t border-b border-[#f4efe6]/14">
                {SOCIAL_LINKS.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between py-4.5 transition-colors"
                  >
                    <div>
                      <div className="font-mono-code text-[10px] uppercase tracking-[0.25em] text-[#b8c7d4]/75">
                        {item.label}
                      </div>
                      <div className="font-editorial text-2xl text-[#f4efe6]/85 group-hover:text-[#ffd27d] transition-colors mt-0.5">
                        {item.value}
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#b8c7d4] group-hover:text-[#ffd27d] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </a>
                ))}
              </div>
            </div>

            {/* Right: Frosted Glass EmailJS Dispatch Form */}
            <div className="lg:col-span-7">
              <form
                onSubmit={handleSubmit}
                className="harbor-glass rounded-2xl p-6 sm:p-8 space-y-5 shadow-[0_24px_64px_rgba(4,12,20,0.5)]"
              >
                <div className="space-y-1">
                  <div className="font-mono-code text-[10.5px] uppercase tracking-[0.22em] text-[#7ee8fa]">
                    Direct Dispatch
                  </div>
                  <p className="text-sm text-[#b8c7d4]">
                    Pick a preset topic or write your project brief below.
                  </p>
                </div>

                {/* Preset Topics */}
                <div className="flex flex-wrap gap-2">
                  {CONTACT_TOPICS.map((topic) => {
                    const active = activeTopic === topic.label
                    return (
                      <button
                        key={topic.label}
                        type="button"
                        onClick={() => handleSelectTopic(topic)}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all cursor-pointer ${
                          active
                            ? "bg-[#ffd27d] text-[#091d2c] border-[#ffd27d] font-semibold"
                            : "bg-[#f4efe6]/5 text-[#b8c7d4] border-[#f4efe6]/16 hover:border-[#f4efe6]/40 hover:text-[#f4efe6]"
                        }`}
                      >
                        {topic.label}
                      </button>
                    )
                  })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="harbor-name"
                      className="block font-mono-code text-[10px] uppercase tracking-[0.2em] text-[#b8c7d4] mb-1.5"
                    >
                      Name
                    </label>
                    <input
                      id="harbor-name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Your name"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#071624]/70 border border-[#f4efe6]/16 text-sm text-[#f4efe6] placeholder:text-[#b8c7d4]/45 focus:outline-none focus:border-[#7ee8fa]/70"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="harbor-email"
                      className="block font-mono-code text-[10px] uppercase tracking-[0.2em] text-[#b8c7d4] mb-1.5"
                    >
                      Email
                    </label>
                    <input
                      id="harbor-email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="you@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#071624]/70 border border-[#f4efe6]/16 text-sm text-[#f4efe6] placeholder:text-[#b8c7d4]/45 focus:outline-none focus:border-[#7ee8fa]/70"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="harbor-message"
                    className="block font-mono-code text-[10px] uppercase tracking-[0.2em] text-[#b8c7d4] mb-1.5"
                  >
                    Message
                  </label>
                  <textarea
                    id="harbor-message"
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Tell me about your project or idea..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#071624]/70 border border-[#f4efe6]/16 text-sm text-[#f4efe6] placeholder:text-[#b8c7d4]/45 focus:outline-none focus:border-[#7ee8fa]/70 resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full py-3 px-6 rounded-full bg-[#f4efe6] hover:bg-[#ffd27d] text-[#091d2c] text-xs font-semibold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {status === "sending"
                    ? "Sending..."
                    : status === "success"
                      ? "Message Sent ✓"
                      : status === "error"
                        ? "Failed — Try Again"
                        : "Send Message"}
                </button>

                {status === "success" && (
                  <p className="text-center font-mono-code text-[11px] uppercase tracking-wider text-emerald-300">
                    Thanks! I’ll get back to you within 24 hours.
                  </p>
                )}
                {status === "error" && (
                  <p className="text-center font-mono-code text-[11px] uppercase tracking-wider text-rose-300">
                    Something went wrong. Please email affavanleon@gmail.com
                    directly.
                  </p>
                )}
              </form>
            </div>
          </div>

          <footer className="max-w-6xl mx-auto mt-20 pt-6 border-t border-[#f4efe6]/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#b8c7d4]/70 harbor-text-shadow">
            <span>© {new Date().getFullYear()} Affavan Leon · LeonThings</span>
            <span className="font-mono-code text-[10.5px] uppercase tracking-[0.2em]">
              HARBOR · Cross-Section Portfolio
            </span>
          </footer>
        </section>
      </main>

      {/* Bottom Floating Pill Dock */}
      <NavigationDock
        activeZone={activeZone}
        progress={scrollProgress}
        onNavigate={handleNavigateSection}
      />

      {/* Slide-Over Project Case Study Drawer */}
      <ProjectDrawer
        project={selectedProject}
        allProjects={projects}
        onClose={handleCloseDrawer}
        onSelectProject={(proj) => setSelectedProject(proj)}
      />
    </div>
  )
}
