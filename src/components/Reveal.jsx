import { motion } from 'framer-motion'

function Reveal({ children, className = '', delay = 0, as = 'div' }) {
  const MotionTag = motion[as] ?? motion.div

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay: delay / 1000, ease: 'easeOut' }}
    >
      {children}
    </MotionTag>
  )
}

export default Reveal
