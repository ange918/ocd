import type { ReactNode } from 'react'
import type { ApplicationStatus, Need, Tone } from '@/types'
import { NEED_META, STATUS_META } from '@/data/labels'
import { cn, toneSoftBg } from '@/lib/tones'

interface BadgeProps {
  tone?: Tone
  size?: 'xs' | 'sm' | 'md'
  className?: string
  children: ReactNode
}

const SIZE = { xs: 'px-2 py-0.5 text-xs', sm: 'px-2.5 py-1 text-[11px]', md: 'px-3 py-1.5 text-xs' }

export function Badge({ tone = 'muted', size = 'xs', className, children }: BadgeProps) {
  return <span className={cn('inline-flex shrink-0 items-center rounded-full', SIZE[size], toneSoftBg[tone], className)}>{children}</span>
}

export function StatusBadge({ status, variant = 'long', size = 'xs', className }: { status: ApplicationStatus; variant?: 'long' | 'short' | 'column'; size?: BadgeProps['size']; className?: string }) {
  const meta = STATUS_META[status]
  const label = variant === 'long' && status === 'preselectionne' ? 'Présélectionné' : meta[variant]
  return (
    <Badge tone={meta.tone} size={size} className={cn('font-medium', className)}>
      {label}
    </Badge>
  )
}

export function NeedBadge({ need, className }: { need: Need; className?: string }) {
  const meta = NEED_META[need]
  return (
    <Badge tone={meta.tone} className={className}>
      {meta.label}
    </Badge>
  )
}

/** Pastille « Données d'exemple » des en-têtes admin. */
export function ExamplePill() {
  return <span className="hidden rounded-full border border-ocd-border px-3 py-1.5 text-xs text-ocd-muted sm:inline-flex">Données d'exemple</span>
}
