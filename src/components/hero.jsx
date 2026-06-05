import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section
      id="hero"
      className="
        min-h-screen
        flex
        flex-col
        justify-end
        px-16
        pb-24
      "
    >
      <motion.div
        className="
          mb-7
          uppercase
          tracking-[0.22em]
          text-[11px]
          text-white/35
        "
        initial={{
          opacity: 0,
          y: 16,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
          delay: 0.2,
        }}
      >
        Creative Developer · Based in Indonesia
      </motion.div>

      <motion.h1
        className="
          font-serif
          leading-[0.93]
          tracking-[-0.01em]
          text-[clamp(60px,8.5vw,136px)]
        "
        initial={{
          opacity: 0,
          y: 24,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.9,
          delay: 0.4,
        }}
      >
        Building
        <br />
        <em className="italic text-white/60">
          modern
        </em>
        <br />
        experiences
      </motion.h1>

      <motion.div
        className="
          mt-14
          flex
          items-end
          justify-between
        "
        initial={{
          opacity: 0,
          y: 16,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
          delay: 0.8,
        }}
      >
        <p
          className="
            max-w-[320px]
            text-[12px]
            leading-[1.85]
            text-white/60
          "
        >
          Building modern web experiences
          and scalable game systems.
        </p>

        <div
          className="
            flex
            items-center
            gap-3
            uppercase
            tracking-[0.2em]
            text-[10px]
            text-white/35
          "
        >
          <span
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-green-500
            "
          />

          Available for selected projects
        </div>
      </motion.div>
    </section>
  )
}