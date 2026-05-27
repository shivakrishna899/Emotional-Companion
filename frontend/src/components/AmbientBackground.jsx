import { motion } from 'framer-motion'

export default function AmbientBackground() {

  return (
    <div className="ambient-wrapper">

      <motion.div
        className="ambient ambient-1"

        animate={{
          x: [0, 80, -40, 0],
          y: [0, -60, 40, 0]
        }}

        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      <motion.div
        className="ambient ambient-2"

        animate={{
          x: [0, -100, 60, 0],
          y: [0, 50, -40, 0]
        }}

        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      <motion.div
        className="ambient ambient-3"

        animate={{
          x: [0, 40, -80, 0],
          y: [0, -50, 60, 0]
        }}

        transition={{
          duration: 26,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

    </div>
  )
}