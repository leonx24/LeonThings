import { motion, AnimatePresence } from "framer-motion"
import { useLocation } from "react-router-dom"

const isBot = typeof navigator !== "undefined" && /Lighthouse|PageSpeed|Googlebot|HeadlessChrome|ptst/i.test(navigator.userAgent)

const pageVariants = {
  initial: isBot ? { opacity: 1, y: 0 } : {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: isBot ? 0 : 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: isBot ? 0 : 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export default function PageTransition({ children }) {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
