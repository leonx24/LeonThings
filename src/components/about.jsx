import Reveal from "./reveal"
import { Atom, Terminal, Cpu, Wind, Gamepad2, Layers } from "lucide-react"
import { projects } from "../data/projects"

const skills = [
  { name: "React", icon: Atom },
  { name: "Python", icon: Terminal },
  { name: "Node.js", icon: Cpu },
  { name: "Tailwind CSS", icon: Wind },
  { name: "Roblox / Luau", icon: Gamepad2 },
  { name: "Vercel", icon: Layers },
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
              text-[15px]
              leading-[1.8]
              text-white/50
              font-light
            "
          >
            I specialize in building <span className="text-white font-normal">modern web experiences</span>, backend integrations, 
            and <span className="text-white font-normal">scalable game systems</span>. By bridging the gap between React applications, 
            Python-driven services, and Roblox/Luau engineering, I craft digital products 
            that are <em className="font-serif italic text-white/80">polished</em>, <em className="font-serif italic text-white/80">performant</em>, and built to scale.
          </p>

          {/* Minimalist Metrics Grid */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            {[
              { value: "02+", label: "Years\nActive" },
              { value: projects.length > 10 ? "10+" : projects.length.toString().padStart(2, "0"), label: "Projects\nDelivered" },
              { value: "100%", label: "Precision\nFocused" },
            ].map((stat, i) => (
              <div 
                key={i} 
                className="
                  p-5 
                  border 
                  border-white/[0.05] 
                  bg-white/[0.01] 
                  hover:bg-white/[0.03] 
                  hover:border-white/10
                  transition-all 
                  duration-300
                  group
                "
              >
                <div className="font-serif text-[clamp(24px,2.5vw,36px)] leading-none text-white mb-2 group-hover:translate-x-1 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="font-mono text-[9px] uppercase tracking-wider text-white/35 leading-relaxed whitespace-pre-line">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

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
                key={skill.name}
                className="
                  flex
                  items-center
                  gap-3

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

                  hover:bg-white/[0.03]
                  hover:text-white
                  group
                "
              >
                <skill.icon 
                  size={14} 
                  className="
                    text-white/35 
                    transition-colors 
                    duration-300 
                    group-hover:text-white
                  " 
                />
                {skill.name}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}