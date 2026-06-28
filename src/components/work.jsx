import Reveal from "./reveal"
import { projects } from "../data/projects"
import { Link } from "react-router-dom"
import LazyImage from "./LazyImage"

export default function Works() {
  return (
    <section
      id="works"
      className="
        px-8
        lg:px-16

        py-25
        lg:py-35

        border-t
        border-white/[0.07]
      "
    >
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div
            className="
              flex
              flex-col
              gap-6

              lg:flex-row
              lg:items-end
              lg:justify-between

              mb-18
            "
          >
            <h2
              className="
                font-serif
                text-[clamp(36px,4.5vw,72px)]
                leading-none
              "
            >
              Selected
              <br />
              <em className="italic text-white/60">
                Works
              </em>
            </h2>

            <span
              className="
                font-mono
                uppercase
                tracking-[0.2em]
                text-[11px]
                text-white/35
              "
            >
              {projects.length.toString().padStart(2, "0")} Projects
            </span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {projects.map((project, index) => (
            <Reveal
              key={project.number}
              delay={index * 0.12}
            >
              <Link
                to={`/project/${project.slug}`}
                className="block group"
              >
                <div className="flex flex-col">
                  {/* Visual Project Frame */}
                  <div className="relative aspect-[16/10] overflow-hidden border border-white/[0.08] bg-white/[0.02] mb-6">
                    {/* Subtle hover gradient shine */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500 z-10" />
                    
                    <LazyImage
                      src={project.gallery[0]}
                      alt={project.title}
                      className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>

                  {/* Meta details header line */}
                  <div className="flex justify-between items-center font-mono text-[10px] uppercase tracking-[0.2em] text-white/35 mb-3">
                    <span>{project.number}</span>
                    <span>{project.year}</span>
                  </div>

                  {/* Title and arrow link trigger */}
                  <h3
                    className="
                      font-serif
                      text-[24px]
                      lg:text-[28px]
                      text-white
                      leading-snug
                      flex
                      items-center
                      justify-between
                      
                      group-hover:text-white/85
                      transition-colors
                      duration-300
                    "
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-500 ease-out">
                      {project.title}
                    </span>
                    <span className="font-sans text-lg text-white/35 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500 ease-out">
                      ↗
                    </span>
                  </h3>

                  {/* Summary / description */}
                  <p className="font-sans text-[12px] leading-[1.8] text-white/50 mb-5 mt-2 line-clamp-2">
                    {project.overview}
                  </p>

                  {/* Tags row */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="
                          border
                          border-white/10
                          px-2.5
                          py-1
                          font-mono
                          text-[9px]
                          uppercase
                          tracking-[0.15em]
                          text-white/35
                          group-hover:text-white/55
                          group-hover:border-white/20
                          transition-all
                          duration-500
                          ease-out
                        "
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}