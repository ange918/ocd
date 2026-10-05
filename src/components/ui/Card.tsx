import type { ReactNode } from 'react'
import { m, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/tones'

type CardProps = Omit<HTMLMotionProps<'div'>, 'children'> & {
  children?: ReactNode
  /** Effet de survol (élévation + bordure orange) */
  interactive?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  radius?: '2xl' | '3xl'
}

const PADDING = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' }

export function Card({ children, interactive, padding = 'md', radius = '2xl', className, ...rest }: CardProps) {
  return (
    <m.div
      whileHover={interactive ? { y: -4, borderColor: 'rgba(241,90,36,0.5)' } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={cn('border border-ocd-border bg-ocd-card', radius === '3xl' ? 'rounded-3xl' : 'rounded-2xl', PADDING[padding], className)}
      {...rest}
    >
      {children}
    </m.div>
  )
}
