import Reveal from "./reveal"
import { projects } from "../data/projects"
import { Link } from "react-router-dom"

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

      <div>
        {projects.map((project, index) => (
          <Reveal
            key={project.number}
            delay={index * 0.08}
          >
            <Link
              to={`/project/${project.slug}`}
              className="block group"
            >
              <div
                className={`
                  grid
                  grid-cols-1
                  lg:grid-cols-[52px_1fr_auto_40px]

                  gap-5
                  lg:gap-8

                  py-8

                  border-t
                  border-white/[0.07]

                  transition-all
                  duration-300

                  hover:bg-white/1.5

                  ${
                    index === projects.length - 1
                      ? "border-b border-white/[0.07]"
                      : ""
                  }
                `}
              >
                <span
                  className="
                    font-mono

                    text-[11px]
                    tracking-widest

                    text-white/35
                  "
                >
                  {project.number}
                </span>

                <h3
                  className="
                    font-serif

                    text-[clamp(20px,2.2vw,34px)]

                    transition-all
                    duration-300

                    group-hover:translate-x-1
                  "
                >
                  {project.title}
                </h3>

                <div
                  className="
                    flex
                    flex-wrap
                    gap-2

                    lg:justify-end
                  "
                >
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="
                        border
                        border-white/13

                        px-2.5
                        py-1

                        font-mono

                        text-[9px]
                        uppercase
                        tracking-[0.18em]

                        text-white/35
                      "
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <span
                  className="
                    hidden
                    lg:block

                    text-right
                    text-lg

                    text-white/35

                    transition-all
                    duration-300

                    group-hover:text-white
                    group-hover:translate-x-1
                    group-hover:-translate-y-1
                  "
                >
                  ↗
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}