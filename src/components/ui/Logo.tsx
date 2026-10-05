import { useId } from 'react'
import { cn } from '@/lib/tones'

/**
 * Marque OCD (O–C liés façon ∞ + D) — reprise de maquettes/html/assets/logo-mark.svg.
 * SVG inline : aucune requête réseau supplémentaire.
 */
export function LogoMark({ className, title = 'OCD' }: { className?: string; title?: string | null }) {
  const id = useId()
  const grad = `ocd-grad-${id.replace(/:/g, '')}`
  return (
    <svg viewBox="0 0 188 64" className={cn('w-auto', className)} role={title ? 'img' : undefined} aria-label={title ?? undefined} aria-hidden={title ? undefined : true}>
      <defs>
        <linearGradient id={grad} x1="0" y1="32" x2="188" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F7931E" />
          <stop offset="1" stopColor="#F15A24" />
        </linearGradient>
      </defs>
      <circle cx="30" cy="32" r="24" fill="none" stroke={`url(#${grad})`} strokeWidth="14" />
      <path d="M42 22 C52 8, 66 8, 76 22" fill="none" stroke={`url(#${grad})`} strokeWidth="13" strokeLinecap="round" />
      <path d="M42 42 C52 56, 66 56, 76 42" fill="none" stroke={`url(#${grad})`} strokeWidth="13" strokeLinecap="round" />
      <path d="M90 14.5 A24 24 0 1 0 90 49.5" fill="none" stroke={`url(#${grad})`} strokeWidth="14" strokeLinecap="round" />
      <path
        fill={`url(#${grad})`}
        d="M122 6h14c21.5 0 39 13.9 39 31S157.5 68 136 68h-14c-5 0-9-4-9-9V15c0-5 4-9 9-9zm11 13v36h3c13.3 0 24-9.2 24-20.5S149.3 19 136 19h-3z"
        transform="translate(0,-6)"
      />
    </svg>
  )
}

/** Baseline « LES OPPORTUNITÉS / — C'EST DEHORS — ». */
export function LogoBaseline({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <span className={cn('block leading-none', className)}>
      <span className={cn('eyebrow block text-[8px] tracking-[0.28em]', light ? 'text-ocd-black' : 'text-ocd-cream/80')}>Les opportunités</span>
      <span className="eyebrow mt-0.5 block text-[7px] tracking-[0.28em] text-ocd-orange">— C'est dehors —</span>
    </span>
  )
}

/** Lockup nav : marque + baseline. */
export function LogoLockup({ className, markClassName = 'h-8', baselineClassName, light }: { className?: string; markClassName?: string; baselineClassName?: string; light?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <LogoMark className={markClassName} title={null} />
      <LogoBaseline className={baselineClassName} light={light} />
      <span className="sr-only">OCD — Les opportunités, c'est dehors</span>
    </span>
  )
}

/** Wordmark typographique (Syne 800) avec soulignement ∞ — planche 00. */
export function LogoWordmark({ className, light }: { className?: string; light?: boolean }) {
  return (
    <div className={cn('text-center', className)}>
      <span className="relative inline-block font-display text-[92px] leading-[0.88] font-extrabold tracking-[-0.055em]">
        <span className="text-ocd-grad">OCD</span>
        <span aria-hidden className="absolute bottom-[0.05em] left-[0.04em] h-[0.2em] w-[1.22em] rounded-full bg-ocd-grad" />
      </span>
      <p className={cn('mt-3.5 text-xs font-bold tracking-[0.42em] uppercase', light ? 'text-ocd-black' : 'text-ocd-cream')}>Les opportunités</p>
      <p className="mt-2 text-[11px] font-bold tracking-[0.38em] text-ocd-orange uppercase">— C'est dehors —</p>
    </div>
  )
}
