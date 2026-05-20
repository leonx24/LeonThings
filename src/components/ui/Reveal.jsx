import { motion } from "framer-motion";

const Reveal = ({
  children,
  className = "",
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40,
      }}

      whileInView={{
        opacity: 1,
        y: 0,
      }}

      viewport={{
        once: true,
        amount: 0.15,
      }}

      transition={{
        duration: 0.9,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}

      className={className}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;