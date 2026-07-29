import Reveal from "./reveal"

export default function Quote() {
  return (
    <section
      id="quote"
      className="
        px-8
        lg:px-16

        py-25
        lg:py-35

        border-t
        border-white/[0.07]

        flex
        flex-col
        items-center

        text-center
      "
    >
      <Reveal>
        <blockquote
          className="
            font-serif

            text-[clamp(28px,4vw,60px)]
            italic

            leading-[1.3]

            max-w-210
          "
        >
          mau bobo
        </blockquote>
      </Reveal>

      <Reveal delay={0.15}>
        <div
          className="
            mt-9

            flex
            items-center
            gap-5

            uppercase
            tracking-[0.28em]
            text-[10px]

            text-zinc-400
          "
        >
          <span className="w-9 h-px bg-white/35" />

          LeonThings · Design Philosophy

          <span className="w-9 h-px bg-white/35" />
        </div>
      </Reveal>
    </section>
  )
}