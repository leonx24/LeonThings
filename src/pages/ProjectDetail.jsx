import { useParams, Link } from "react-router-dom"
import { projects } from "../data/projects"

import Navbar from "../components/navbar"
import GridLines from "../components/gridLines"
import Noise from "../components/noise"
import LazyImage from "../components/LazyImage"
import CustomCursor from "../components/CustomCursor"

export default function ProjectDetail() {
  const { slug } = useParams()

  const project = projects.find(
    (p) => p.slug === slug
  )

  if (!project) {
    return (
      <div
        className="
          min-h-screen
          bg-black
          text-white

          flex
          items-center
          justify-center
        "
      >
        Project Not Found
      </div>
    )
  }

  const currentIndex = projects.findIndex(
    (p) => p.slug === slug
  )

  const nextProject =
    projects[
      (currentIndex + 1) % projects.length
    ]

  return (
    <main className="bg-black text-white min-h-screen">
      <CustomCursor />
      <GridLines />
      <Noise />
      <Navbar />

      {/* HERO */}
      <section
        className="
          relative
          z-10

          px-8
          lg:px-16

          pt-36
          pb-20
        "
      >
        <div className="max-w-5xl mx-auto">
          <Link
            to="/"
            className="
              inline-block

              font-mono
              text-[10px]
              uppercase
              tracking-[0.25em]

              text-white/35
              hover:text-white

              transition-colors
            "
          >
            ← Back to Home
          </Link>

          <div className="mt-12">
            <span
              className="
                font-mono
                text-[10px]
                uppercase
                tracking-[0.25em]

                text-white/35
              "
            >
              Project Case Study
            </span>

            <h1
              className="
                mt-5

                font-serif

                text-[clamp(44px,6vw,96px)]
                leading-[1.05]
                tracking-[-0.01em]
              "
            >
              {project.title}
            </h1>

            <div
              className="
                mt-6

                flex
                flex-wrap
                gap-2.5
              "
            >
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
                    text-white/45
                  "
                >
                  {tag}
                </span>
              ))}
            </div>

            <p
              className="
                mt-8

                max-w-2xl

                text-[15px]
                leading-[1.8]

                text-white/50
                font-light
              "
            >
              {project.overview}
            </p>
          </div>

          {/* Primary image visual container */}
          <div className="mt-16 border border-white/[0.08] bg-white/[0.02] overflow-hidden aspect-[16/9] w-full">
            <LazyImage
              src={project.gallery[0]}
              alt={project.title}
              priority={true}
              className="w-full h-full object-cover scale-[1.01]"
            />
          </div>
        </div>
      </section>

      {/* CONTENT (Modular panels) */}
      <section
        className="
          relative
          z-10

          px-8
          lg:px-16

          py-20

          border-t
          border-white/[0.07]
        "
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Challenge */}
            <div className="p-6 border border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.02] transition-colors duration-300 flex flex-col justify-start">
              <span className="font-mono uppercase tracking-[0.25em] text-[9px] text-white/35 block mb-4">
                Challenge
              </span>
              <p className="font-sans text-[12px] leading-[1.8] text-white/60 font-light">
                {project.challenge}
              </p>
            </div>

            {/* Card 2: Solution */}
            <div className="p-6 border border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.02] transition-colors duration-300 flex flex-col justify-start">
              <span className="font-mono uppercase tracking-[0.25em] text-[9px] text-white/35 block mb-4">
                Solution
              </span>
              <p className="font-sans text-[12px] leading-[1.8] text-white/60 font-light">
                {project.solution}
              </p>
            </div>

            {/* Card 3: Result */}
            <div className="p-6 border border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.02] transition-colors duration-300 flex flex-col justify-start">
              <span className="font-mono uppercase tracking-[0.25em] text-[9px] text-white/35 block mb-4">
                Result
              </span>
              <p className="font-sans text-[12px] leading-[1.8] text-white/60 font-light">
                {project.result}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      {project.gallery.length > 1 && (
        <section
          className="
            relative
            z-10

            px-8
            lg:px-16

            py-12
          "
        >
          <div className="max-w-4xl mx-auto space-y-12">
            {project.gallery.slice(1).map((image, index) => (
              <div
                key={index}
                className="border border-white/[0.08] bg-white/[0.02] overflow-hidden w-full"
              >
                <LazyImage
                  src={image}
                  alt={`${project.title}-gallery-${index}`}
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* NEXT PROJECT */}
      {projects.length > 1 && (
        <section
          className="
            relative
            z-10

            px-8
            lg:px-16

            py-20

            border-t
            border-white/[0.07]
          "
        >
          <div className="max-w-5xl mx-auto">
            <Link
              to={`/project/${nextProject.slug}`}
              className="
                group
                block
                p-8
                border
                border-white/[0.05]
                bg-white/[0.01]
                hover:bg-white/[0.03]
                hover:border-white/10
                transition-all
                duration-300
              "
            >
              <span
                className="
                  font-mono
                  uppercase
                  tracking-[0.25em]
                  text-[9px]
                  text-white/35
                  block
                  mb-4
                "
              >
                Next Project
              </span>

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >
                <h2
                  className="
                    font-serif
                    text-[clamp(24px,4vw,56px)]
                    leading-none

                    transition-transform
                    duration-500
                    ease-out

                    group-hover:translate-x-2
                  "
                >
                  {nextProject.title}
                </h2>

                <span
                  className="
                    text-2xl
                    text-white/35

                    transition-all
                    duration-500
                    ease-out

                    group-hover:text-white
                    group-hover:translate-x-2
                    group-hover:-translate-y-2
                  "
                >
                  ↗
                </span>
              </div>
            </Link>
          </div>
        </section>
      )}
    </main>
  )
}