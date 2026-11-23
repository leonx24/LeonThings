import { useParams, Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import SEO from "../components/SEO"
import HarborExperience from "../harbor/ui/HarborExperience"
import { getHarborProjectBySlug } from "../harbor/ui/projectAdapter"

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = getHarborProjectBySlug(slug)

  if (!project) {
    return (
      <div className="min-h-screen bg-[#091d2c] text-[#f4efe6] flex items-center justify-center p-6 font-ui">
        <div className="harbor-glass max-w-md w-full p-8 rounded-2xl text-center space-y-4">
          <div className="font-mono-code text-xs uppercase tracking-[0.25em] text-[#7ee8fa]">
            Depth Coordinate Missing
          </div>
          <h1 className="font-editorial text-5xl text-[#f4efe6]">
            Project Not Found
          </h1>
          <p className="text-sm text-[#b8c7d4]">
            The requested case study could not be located in the harbor archive.
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#f4efe6] text-[#091d2c] text-xs font-semibold hover:bg-[#ffd27d] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Surface
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO
        title={`${project.title} — Case Study`}
        description={project.summary}
        path={`/project/${project.slug}`}
      />
      <HarborExperience initialProjectSlug={project.slug} />
    </>
  )
}
