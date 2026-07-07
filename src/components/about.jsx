import { useState, useEffect } from "react"
import Reveal from "./reveal"
import { MapPin, Radio } from "lucide-react"
import { projects } from "../data/projects"

export default function About() {
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const options = {
        timeZone: "Asia/Jakarta",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }
      setCurrentTime(new Intl.DateTimeFormat("en-US", options).format(new Date()))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

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
              leading-[1.85]
              text-white/50
              font-light
            "
          >
            I build clean, minimal interfaces and write code that runs fast. Mostly React, Luau, and Python. 
            I enjoy bridging the gap between front-end UI design, custom automation bots, and Roblox game script engines. 
            No bloated libraries, no design fluff.
          </p>

          {/* Minimalist Metrics Grid */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            {[
              { value: "02+", label: "Years\nActive" },
              { value: "02", label: "Projects\nFeatured" },
              { value: "1.2k+", label: "Users\nServed" },
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

          {/* Editorial Skills Directory */}
          <div className="mt-12 border-t border-white/[0.07] divide-y divide-white/[0.07]">
            {[
              { name: "React", note: "Fast component trees, custom hooks, reactive state models" },
              { name: "Roblox / Luau", note: "OOP architecture, replication network sync, secure boundary events" },
              { name: "Python", note: "High-uptime Discord integration client, REST APIs (FastAPI)" },
              { name: "TypeScript", note: "Strictly typed API structures, custom payload typings" },
              { name: "Tailwind CSS", note: "Fluid clamp typography, custom variables, minimal CSS overhead" },
            ].map((skill, i) => (
              <div 
                key={i}
                className="
                  py-4.5 
                  flex 
                  flex-col 
                  sm:flex-row 
                  sm:items-center 
                  justify-between 
                  gap-2.5 
                  group 
                  hover:bg-white/[0.015] 
                  px-3 
                  transition-all 
                  duration-300
                "
              >
                <span className="font-mono text-[11px] uppercase tracking-wider text-white group-hover:translate-x-1 transition-transform duration-300">
                  {skill.name}
                </span>
                <span className="font-mono text-[10px] text-white/40 group-hover:text-white/60 transition-colors duration-300 text-left sm:text-right">
                  // {skill.note}
                </span>
              </div>
            ))}
          </div>

          {/* Status & Local Time Card */}
          <div className="
            mt-10 
            p-5 
            border 
            border-white/[0.05] 
            bg-white/[0.01] 
            flex 
            flex-col 
            sm:flex-row 
            sm:items-center 
            justify-between 
            gap-6
            rounded-sm
          ">
            {/* Left: Location & Time */}
            <div className="flex items-center gap-3">
              <MapPin size={13} className="text-white/20 flex-shrink-0" />
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-white/35">Location & Time</span>
                <span className="text-[11px] font-mono text-white/70">
                  Jakarta, ID · <span className="text-white font-medium">{currentTime}</span>
                </span>
              </div>
            </div>
            
            {/* Center: Current Status */}
            <div className="flex items-center gap-3">
              <div className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-white/35">Status</span>
                <span className="text-[11px] font-mono text-white/80">Refining Leon X Client</span>
              </div>
            </div>
            
            {/* Right: Simulated Spotify */}
            <div className="flex items-center gap-3">
              <Radio size={13} className="text-white/20 flex-shrink-0" />
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-white/35">On Repeat</span>
                <div className="flex items-center gap-2">
                  {/* Minimal Equalizer Animation */}
                  <div className="flex items-end gap-[1.5px] h-2.5 w-3 pb-[1px] flex-shrink-0">
                    <span className="w-[1.5px] bg-white/40 animate-soundwave-1" style={{ height: '70%' }} />
                    <span className="w-[1.5px] bg-white/40 animate-soundwave-2" style={{ height: '30%' }} />
                    <span className="w-[1.5px] bg-white/40 animate-soundwave-3" style={{ height: '80%' }} />
                    <span className="w-[1.5px] bg-white/40 animate-soundwave-4" style={{ height: '40%' }} />
                  </div>
                  <span className="text-[11px] font-mono text-white/70 truncate max-w-[120px]">
                    Resonance — HOME
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}