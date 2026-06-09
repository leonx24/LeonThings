import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import GridLines from "../components/gridLines"
import Noise from "../components/noise"
import CustomCursor from "../components/CustomCursor"

export default function NotFound() {
  return (
    <main className="bg-black text-white min-h-screen relative overflow-hidden">
      <CustomCursor />
      <GridLines />
      <Noise />

      <div
        className="
          relative
          z-10

          min-h-screen

          flex
          flex-col
          items-center
          justify-center

          px-8
          lg:px-16
        "
      >
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* 404 Number */}
          <motion.div
            className="
              font-mono
              text-[10px]
              uppercase
              tracking-[0.3em]
              text-white/35
              mb-12
            "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Error 404
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            className="
              font-serif
              text-[clamp(48px,8vw,120px)]
              leading-[0.95]
              tracking-[-0.01em]
              mb-8
            "
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Page not
            <br />
            <em className="italic text-white/60">found</em>
          </motion.h1>

          {/* Description */}
          <motion.p
            className="
              max-w-[420px]
              mx-auto
              text-[13px]
              leading-[1.85]
              text-white/60
              mb-16
            "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="
              flex
              flex-col
              sm:flex-row
              items-center
              justify-center
              gap-4
            "
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            <Link
              to="/"
              className="
                group
                relative

                px-8
                py-4

                border
                border-white/10

                font-mono
                text-[10px]
                uppercase
                tracking-[0.2em]

                transition-all
                duration-300

                hover:bg-white
                hover:text-black
                hover:border-white
              "
            >
              <span className="relative z-10">Back to Home</span>
            </Link>

            <Link
              to="/#works"
              className="
                group

                px-8
                py-4

                font-mono
                text-[10px]
                uppercase
                tracking-[0.2em]
                text-white/60

                transition-colors
                duration-300

                hover:text-white
              "
            >
              View Projects →
            </Link>
          </motion.div>

          {/* Divider Line */}
          <motion.div
            className="
              w-12
              h-px
              bg-white/10
              mx-auto
              mt-20
            "
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          />
        </motion.div>
      </div>
    </main>
  )
}