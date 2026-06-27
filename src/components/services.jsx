import Reveal from "./reveal"
import { services } from "../data/services"

export default function Services() {
  return (
    <section
      id="services"
      className="
        relative
        z-20

        overflow-hidden

        px-8
        lg:px-16

        py-25
        lg:py-35

        bg-[#0f0f0f]

        border-t
        border-white/[0.07]
      "
    >
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div
            className="
              flex
              items-center
              gap-3.5

              uppercase
              tracking-[0.32em]
              text-[10px]

              text-white/35
            "
          >
            <span className="w-7 h-px bg-white/35" />
            What I Do
          </div>
        </Reveal>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3

            mt-18

            border
            border-white/[0.07]

            bg-white/[0.07]

            gap-px
          "
        >
          {services.map((service, index) => (
            <Reveal
              key={service.id}
              delay={index * 0.1}
            >
              <div
                className="
                  h-full

                  bg-[#0f0f0f]

                  px-9
                  py-11

                  transition-colors
                  duration-300

                  hover:bg-white/[0.02]
                  group
                "
              >
                <div
                  className="
                    mb-9

                    font-mono

                    text-[10px]
                    tracking-[0.3em]
                    uppercase

                    text-white/25
                    group-hover:text-white/50
                    transition-colors
                    duration-300
                  "
                >
                  {service.id}
                </div>

                <h3
                  className="
                    font-serif

                    text-[26px]
                    leading-[1.18]

                    mb-5
                    text-white
                    group-hover:text-white/95
                    transition-colors
                    duration-300
                  "
                >
                  {service.title
                    .split("\n")
                    .map((line) => (
                      <div key={line}>
                        {line}
                      </div>
                    ))}
                </h3>

                <p
                  className="
                    text-[12px]
                    leading-[1.8]

                    text-white/50
                    font-light
                  "
                >
                  {service.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}