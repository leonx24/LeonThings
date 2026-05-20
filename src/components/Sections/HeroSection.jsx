import { motion } from "framer-motion";

import { personalInfo } from "../../Data/project";

const HeroSection = () => {
  return (
    <section
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        px-6
      "
    >

      {/* SUBTLE GRID */}
      <div
        className="
          absolute
          inset-0
          opacity-[0.015]
        "
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* AMBIENT GLOW */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-500px
          w-500px
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-cyan-500/6
          blur-[140px]
        "
      />

      {/* TOP LIGHT */}
      <div
        className="
          pointer-events-none
          absolute
          top-0
          left-1/2
          h-300px
          w-900px
          -translate-x-1/2
          opacity-40
        "
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)",

          filter: "blur(100px)",
        }}
      />

      {/* CONTENT */}
      <div
        className="
          relative
          z-10
          mx-auto
          max-w-5xl
          text-center
        "
      >

        {/* BADGE */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            duration: 0.8,
          }}

          className="
            mb-8
            inline-flex
            items-center
            gap-3
            rounded-full
            border
            border-cyan-400/20
            bg-cyan-400/10
            px-5
            py-2.5
            text-sm
            text-cyan-300
            backdrop-blur-xl
          "
        >
          <span
            className="
              h-2
              w-2
              rounded-full
              bg-cyan-400
              shadow-[0_0_12px_rgba(34,211,238,0.8)]
            "
          />

          Available for freelance
        </motion.div>

        {/* TITLE */}
        <motion.h1
          initial={{
            opacity: 0,
            y: 30,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}

          className="
            text-6xl
            font-black
            leading-[0.9]
            tracking-tight
            text-white
            md:text-8xl
          "
        >
          Building modern
          <br />
          digital experiences.
        </motion.h1>

        {/* TAGLINE */}
        <motion.p
          initial={{
            opacity: 0,
            y: 20,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            duration: 1,
            delay: 0.15,
          }}

          className="
            mx-auto
            mt-8
            max-w-3xl
            text-lg
            leading-8
            text-zinc-400
            md:text-xl
          "
        >
          {personalInfo.bio}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            duration: 1,
            delay: 0.3,
          }}

          className="
            mt-12
            flex
            flex-wrap
            items-center
            justify-center
            gap-4
          "
        >

          {/* PRIMARY */}
          <a
            href="#projects"
            className="
              rounded-full
              bg-white
              px-7
              py-3.5
              text-sm
              font-medium
              text-black
              transition-all
              duration-500
              hover:bg-zinc-200
            "
          >
            View Projects
          </a>

          {/* SECONDARY */}
          <a
            href="#contact"
            className="
              rounded-full
              border
              border-white/10
              bg-white/3
              px-7
              py-3.5
              text-sm
              text-white
              backdrop-blur-xl
              transition-all
              duration-500
              hover:bg-white/6
            "
          >
            Contact Me
          </a>

        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;