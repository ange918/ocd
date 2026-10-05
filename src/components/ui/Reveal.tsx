import type { ReactNode } from 'react'
import { m, useReducedMotion, type HTMLMotionProps, type Variants } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/motion'

type RevealProps = Omit<HTMLMotionProps<'div'>, 'children'> & {
  children: ReactNode
  stagger?: number
  delay?: number
  /** Portion visible avant déclenchement */
  amount?: number
  as?: 'div' | 'section' | 'ul' | 'header' | 'footer'
}

/** Révèle ses <RevealItem> en cascade quand la section entre dans le viewport (une seule fois). */
export function Reveal({ children, stagger = 0.09, delay = 0, amount = 0.2, as = 'div', ...rest }: RevealProps) {
  const Comp = m[as] as typeof m.div
  return (
    <Comp initial="hidden" whileInView="show" viewport={{ once: true, amount }} variants={staggerContainer(stagger, delay)} {...rest}>
      {children}
    </Comp>
  )
}

const reducedVariants: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } }

export function RevealItem({ children, variants, as = 'div', ...rest }: Omit<HTMLMotionProps<'div'>, 'children'> & { children?: ReactNode; as?: 'div' | 'li' | 'article' | 'p' | 'h2' }) {
  const reduce = useReducedMotion()
  const Comp = m[as] as typeof m.div
  return (
    <Comp variants={reduce ? reducedVariants : (variants ?? fadeUp)} {...rest}>
      {children}
    </Comp>
  )
}
