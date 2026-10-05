import { forwardRef, type ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import { m, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/tones'
import { Spinner } from './Spinner'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'dark' | 'cream' | 'glass' | 'solid' | 'ghost' | 'soft'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-ocd-grad text-ocd-black',
  secondary: 'border border-ocd-border bg-ocd-card/60 text-ocd-cream hover:border-ocd-muted',
  outline: 'border border-ocd-border text-ocd-cream hover:border-ocd-muted',
  dark: 'bg-ocd-black text-ocd-cream',
  cream: 'bg-ocd-cream text-ocd-black',
  glass: 'border border-ocd-black/20 bg-white/30 text-ocd-black backdrop-blur',
  solid: 'bg-ocd-orange text-ocd-black',
  ghost: 'text-ocd-muted hover:text-ocd-cream',
  soft: 'bg-ocd-orange/15 text-ocd-orange',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
  xl: 'px-6 py-4 text-[15px]',
}

interface CommonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  glow?: boolean
  loading?: boolean
  rounded?: 'full' | 'xl'
  className?: string
  children?: ReactNode
}

function classes(p: CommonProps & { disabled?: boolean }): string {
  const disabledPrimary = p.disabled && (p.variant ?? 'primary') === 'primary'
  return cn(
    'relative inline-flex select-none items-center justify-center gap-2 font-medium transition-colors duration-200 disabled:opacity-100',
    p.rounded === 'xl' ? 'rounded-xl' : 'rounded-full',
    SIZES[p.size ?? 'md'],
    disabledPrimary ? 'bg-ocd-orange/40 text-ocd-cream/50' : VARIANTS[p.variant ?? 'primary'],
    p.disabled && !disabledPrimary && 'opacity-50',
    p.glow && !p.disabled && 'shadow-glow',
    p.fullWidth && 'w-full',
    p.className,
  )
}

export type ButtonProps = CommonProps & Omit<HTMLMotionProps<'button'>, 'children' | keyof CommonProps>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, fullWidth, glow, loading, rounded, className, children, disabled, type = 'button', ...rest },
  ref,
) {
  const isDisabled = disabled || loading
  return (
    <m.button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      whileHover={isDisabled ? undefined : { scale: 1.02 }}
      whileTap={isDisabled ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={classes({ variant, size, fullWidth, glow, rounded, className, disabled: isDisabled })}
      {...rest}
    >
      {loading && <Spinner className="h-4 w-4" />}
      {children}
    </m.button>
  )
})

const MotionLink = m.create(Link)

type ConflictingHandlers = 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' | 'onDrag' | 'onDragStart' | 'onDragEnd' | 'style'

export type ButtonLinkProps = Omit<CommonProps, 'loading'> & Omit<LinkProps, 'className' | 'children' | ConflictingHandlers>

/** Lien de navigation stylé comme un bouton (garde la sémantique <a>). */
export function ButtonLink({ variant, size, fullWidth, glow, rounded, className, children, ...rest }: ButtonLinkProps) {
  return (
    <MotionLink
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={classes({ variant, size, fullWidth, glow, rounded, className })}
      {...rest}
    >
      {children}
    </MotionLink>
  )
}
