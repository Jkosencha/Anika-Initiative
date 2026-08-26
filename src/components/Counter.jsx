import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'
import { onSplashDone } from '../lib/splash'

function Counter({ to, suffix = '', duration = 1.5 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [splashDone, setSplashDone] = useState(false)
  const [value, setValue] = useState(0)

  useEffect(() => onSplashDone(() => setSplashDone(true)), [])

  useEffect(() => {
    if (!inView || !splashDone) return
    const controls = animate(0, to, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setValue(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, splashDone, to, duration])

  return (
    <span ref={ref}>
      {value.toLocaleString()}
      {suffix}
    </span>
  )
}

export default Counter
