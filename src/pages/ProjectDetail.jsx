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

          pt-40
          pb-24
        "
      >
        <Link
          to="/"
          className="
            inline-block

            font-mono
            text-[11px]
            uppercase
            tracking-[0.2em]

            text-white/35
            hover:text-white

            transition-colors
          "
        >
          ← Back
        </Link>

        <div className="mt-12">
          <span
            className="
              font-mono
              text-[11px]
              uppercase
              tracking-[0.2em]

              text-white/35
            "
          >
            Project
          </span>

          <h1
            className="
              mt-6

              font-serif

              text-[clamp(60px,8vw,140px)]
              leading-[0.92]
            "
          >
            {project.title}
          </h1>

          <div
            className="
              mt-8

              flex
              flex-wrap
              gap-4
            "
          >
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="
                  border
                  border-white/10

                  px-3
                  py-1

                  font-mono
                  text-[10px]
                  uppercase
                  tracking-[0.18em]
                "
              >
                {tag}
              </span>
            ))}
          </div>

          <p
            className="
              mt-10

              max-w-175

              text-lg
              leading-relaxed

              text-white/60
            "
          >
            {project.overview}
          </p>
        </div>

        <LazyImage
          src={project.gallery[0]}
          alt={project.title}
          priority={true}
          className="
            mt-20
            w-full
            border
            border-white/10
          "
        />
      </section>

      {/* CONTENT */}
      <section
        className="
          relative
          z-10

          px-8
          lg:px-16

          py-24

          border-t
          border-white/[0.07]
        "
      >
        <div
          className="
            grid
            lg:grid-cols-3

            gap-16
          "
        >
          <div>
            <span
              className="
                font-mono
                uppercase

                tracking-[0.3em]
                text-[10px]

                text-white/35
              "
            >
              Challenge
            </span>

            <p
              className="
                mt-4

                leading-relaxed
                text-white/70
              "
            >
              {project.challenge}
            </p>
          </div>

          <div>
            <span
              className="
                font-mono
                uppercase

                tracking-[0.3em]
                text-[10px]

                text-white/35
              "
            >
              Solution
            </span>

            <p
              className="
                mt-4

                leading-relaxed
                text-white/70
              "
            >
              {project.solution}
            </p>
          </div>

          <div>
            <span
              className="
                font-mono
                uppercase

                tracking-[0.3em]
                text-[10px]

                text-white/35
              "
            >
              Result
            </span>

            <p
              className="
                mt-4

                leading-relaxed
                text-white/70
              "
            >
              {project.result}
            </p>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section
        className="
          relative
          z-10

          px-8
          lg:px-16

          py-24
        "
      >
        <div className="space-y-24">
          {project.gallery.map((image, index) => (
            <div
              key={index}
              className={`
                flex
                ${
                  index % 2 === 0
                    ? "justify-start"
                    : "justify-end"
                }
              `}
            >
              <LazyImage
                src={image}
                alt={`${project.title}-${index}`}
                className="
                  w-full
                  lg:w-[85%]
                  border
                  border-white/10
                "
              />
            </div>
          ))}
        </div>
      </section>

      {/* NEXT PROJECT */}
      {projects.length > 1 && (
        <section
          className="
            relative
            z-10

            px-8
            lg:px-16

            py-24

            border-t
            border-white/[0.07]
          "
        >
          <Link
            to={`/project/${nextProject.slug}`}
            className="
              group
              block
            "
          >
            <span
              className="
                font-mono
                uppercase

                tracking-[0.3em]
                text-[10px]

                text-white/35
              "
            >
              Next Project
            </span>

            <div
              className="
                mt-8

                flex
                items-center
                justify-between
              "
            >
              <h2
                className="
                  font-serif

                  text-[clamp(34px,5vw,80px)]

                  transition-transform
                  duration-300

                  group-hover:translate-x-2
                "
              >
                {nextProject.title}
              </h2>

              <span
                className="
                  text-3xl

                  transition-all
                  duration-300

                  group-hover:translate-x-2
                  group-hover:-translate-y-2
                "
              >
                ↗
              </span>
            </div>
          </Link>
        </section>
      )}
    </main>
  )
}