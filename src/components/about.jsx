import Reveal from "./reveal"

const skills = [
  "React",
  "Python",
  "Node.js",
  "Tailwind CSS", 
  "Roblox / Luau",
  "Vercel",
]

export default function About() {
  return (
    <section
      id="about"
      className="
        px-8
        lg:px-16

        py-25
        lg:py-35

        grid
        grid-cols-1
        lg:grid-cols-[1fr_1.1fr]

        gap-16
        lg:gap-25

        items-start
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
            About
          </div>

          <h2
            className="
              font-serif

              text-[clamp(26px,3vw,46px)]

              leading-[1.18]
              tracking-[-0.01em]
            "
          >
            I don't just write code.
            <br />
            I{" "}
            <em className="italic text-white/60">
              shape the way
            </em>
            <br />
            people experience
            <br />
            the web.
          </h2>
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="lg:pt-18">
          <p
            className="
              mb-12

              max-w-155

              text-[13px]
              leading-[1.95]

              text-white/60
            "
          >
            With years of experience building web
            applications and Roblox systems, I focus
            on creating products that feel polished,
            scalable, and thoughtfully crafted.
            Every decision is made with clarity,
            performance, and long-term maintainability
            in mind.
          </p>

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2

              border-t
              border-l

              border-white/[0.07]
            "
          >
            {skills.map((skill) => (
              <div
                key={skill}
                className="
                  px-4.5
                  py-3.5

                  border-r
                  border-b

                  border-white/[0.07]

                  font-mono
                  text-[11px]

                  tracking-[0.06em]

                  text-white/60

                  transition-all
                  duration-300

                  hover:bg-[#161616]
                  hover:text-white
                "
              >
                {skill}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}