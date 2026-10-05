import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'

const nf = new Intl.NumberFormat('fr-FR')

/** Compteur animé à l'entrée dans le viewport : « 1 200+ », « 68% », « 5 pays »… */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  const match = /^(\d(?:[\d\s\u202f]*\d)?)(.*)$/.exec(value)
  const target = match ? Number((match[1] ?? '').replace(/\D/g, '')) : NaN
  const suffix = match?.[2] ?? ''
  const [n, setN] = useState(reduce || Number.isNaN(target) ? target : 0)

  useEffect(() => {
    if (!inView || reduce || Number.isNaN(target)) return
    const controls = animate(0, target, { duration: 1.4, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setN(Math.round(v)) })
    return () => controls.stop()
  }, [inView, reduce, target])

  if (Number.isNaN(target)) return <span className={className}>{value}</span>
  return (
    <span ref={ref} className={className} aria-label={value}>
      <span aria-hidden>
        {nf.format(n).replace(/[\u202f\u00a0]/g, ' ')}
        {suffix}
      </span>
    </span>
  )
}
