import { motion, useScroll } from "framer-motion";

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="
        fixed
        left-0
        top-0
        z-9999
        h-0.5px
        origin-left
        bg-cyan-400
        shadow-[0_0_12px_rgba(34,211,238,0.8)]
      "
      style={{
        scaleX: scrollYProgress,
        width: "100%",
      }}
    />
  );
};

export default ScrollProgress;