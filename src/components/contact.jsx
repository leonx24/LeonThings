import Reveal from "./reveal"

export default function Contact() {
  return (
    <section
      id="contact"
      className="
        px-8
        lg:px-16

        pt-25
        lg:pt-35

        pb-20

        border-t
        border-white/[0.07]
      "
    >
      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-2

          gap-16
          lg:gap-25
        "
      >
        <Reveal>
          <div>
            <div
              className="
                flex
                items-center
                gap-3.5

                mb-10

                font-mono

                uppercase
                tracking-[0.32em]
                text-[10px]

                text-white/35
              "
            >
              <span className="w-7 h-px bg-white/35" />
              Let's Talk
            </div>

            <h2
              className="
                font-serif

                text-[clamp(36px,4.5vw,72px)]
                leading-[1.05]
              "
            >
              Have a project
              <br />
              in mind?
              <em className="block italic text-white/60">
                Let's build it.
              </em>
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="pt-3">
            {[
              {
                label: "Email",
                value: "hello@leonthings.dev",
                href: "mailto:hello@leonthings.dev",
              },
              {
                label: "Github",
                value: "github.com/leon",
                href: "https://github.com",
              },
              {
                label: "Discord",
                value: "leon.dev",
                href: "#",
              },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="
                  group

                  flex
                  justify-between
                  items-center

                  py-5

                  border-b
                  border-white/[0.07]
                "
              >
                <div>
                  <div
                    className="
                      mb-1

                      font-mono

                      uppercase
                      tracking-[0.28em]
                      text-[10px]

                      text-white/35
                    "
                  >
                    {item.label}
                  </div>

                  <div
                    className="
                      font-serif
                      text-xl
                    "
                  >
                    {item.value}
                  </div>
                </div>

                <span
                  className="
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
              </a>
            ))}

            <button
              className="
                mt-10

                px-9
                py-4

                border
                border-white/13

                font-mono

                uppercase
                tracking-[0.22em]
                text-[11px]

                text-white/60

                transition-all
                duration-300

                hover:bg-[#161616]
                hover:text-white
                hover:border-white
              "
            >
              Start A Conversation
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}