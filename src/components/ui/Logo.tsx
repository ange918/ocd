import { cn } from '@/lib/tones'

/** Logo officiel OCD (public/logo.png, PNG transparent 568×220). */
export function LogoMark({ className, title = 'OCD' }: { className?: string; title?: string | null }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}logo.png`}
      width={568}
      height={220}
      alt={title ?? ''}
      aria-hidden={title ? undefined : true}
      decoding="async"
      draggable={false}
      className={cn('w-auto select-none', className)}
    />
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

/** Logo officiel + baseline (404, écrans plein cadre). */
export function LogoWordmark({ className, light }: { className?: string; light?: boolean }) {
  return (
    <div className={cn('text-center', className)}>
      <LogoMark className="mx-auto h-24" title="OCD" />
      <p className={cn('mt-5 text-xs font-bold tracking-[0.42em] uppercase', light ? 'text-ocd-black' : 'text-ocd-cream')}>Les opportunités</p>
      <p className="mt-2 text-[11px] font-bold tracking-[0.38em] text-ocd-orange uppercase">— C'est dehors —</p>
    </div>
  )
}
