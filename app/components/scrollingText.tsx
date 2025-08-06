'use client'

import { motion } from 'framer-motion'

const ScrollingText = ({ 
  text = "Scroll to explore",
  duration = 2,
  className = "text-[9px] uppercase font-semibold"
}) => {
  return (
    <div className="overflow-hidden h-4 relative flex justify-end xl:justify-start">
      <motion.div
        className={`${className} absolute`}
        initial={{ y: 0 }}
        animate={{ y: -20 }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop"
        }}
      >
        <div className="h-4 flex items-center text-white xl:text-black">{text}</div>
        <div className="h-4 flex items-center text-white xl:text-black">{text}</div>
      </motion.div>
    </div>
  )
}

// Usage example:
// <ScrollingText />
// <ScrollingText text="Custom text" duration={1.5} />

export default ScrollingText