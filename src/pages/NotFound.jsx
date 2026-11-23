import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import SEO from "../components/SEO"

export default function NotFound() {
  return (
    <main className="relative min-h-screen bg-[#091d2c] text-[#f4efe6] font-ui flex items-center justify-center p-6 overflow-hidden">
      <SEO
        title="404 — Page Not Found"
        description="The page you're looking for doesn't exist or has been moved."
        noIndex={true}
      />

      {/* Atmospheric HARBOR Sunset-to-Abyss Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(circle at 70% 20%, rgba(255, 210, 125, 0.14), transparent 45%), radial-gradient(circle at 25% 75%, rgba(126, 232, 250, 0.14), transparent 50%), linear-gradient(180deg, #1e315c 0%, #164e6b 45%, #091d2c 100%)",
        }}
      />

      <div className="harbor-glass relative z-10 max-w-lg w-full rounded-2xl p-8 sm:p-10 text-center space-y-5 shadow-[0_24px_64px_rgba(4,12,20,0.65)]">
        <div className="font-mono-code text-[11px] uppercase tracking-[0.3em] text-[#7ee8fa]">
          Error 404 · Uncharted Waters
        </div>

        <h1 className="font-editorial font-semibold text-6xl sm:text-7xl text-[#f4efe6] leading-none">
          Adrift<span className="text-[#ffd27d]">.</span>
        </h1>

        <p className="text-sm sm:text-base text-[#b8c7d4] leading-relaxed">
          The depth coordinate you requested doesn&apos;t exist or has drifted
          beyond this harbor chart.
        </p>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#f4efe6] text-[#091d2c] text-xs font-semibold uppercase tracking-[0.18em] hover:bg-[#ffd27d] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Surface
          </Link>
        </div>
      </div>
    </main>
  )
}
