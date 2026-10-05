import { m, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { ApplicationStatus, HistoryEvent } from '@/types'
import { STATUS_META, STATUS_ORDER } from '@/data/labels'
import { formatDateTime } from '@/lib/format'
import { cn } from '@/lib/tones'

interface Props {
  status: ApplicationStatus
  history: HistoryEvent[]
  className?: string
}

/** Timeline Soumis → En cours d'étude → Présélectionné → Accompagnement validé → Clôturé (maquette 05). */
export function StatusTimeline({ status, history, className }: Props) {
  const reduce = useReducedMotion()
  const current = STATUS_ORDER.indexOf(status)
  const isFinal = status === 'cloture'
  const progress = current / (STATUS_ORDER.length - 1)

  const dateFor = (s: ApplicationStatus): string | undefined => {
    const ev = history.filter((h) => h.status === s).sort((a, b) => b.at.localeCompare(a.at))[0]
    return ev ? formatDateTime(ev.at) : undefined
  }

  return (
    <ol className={cn('relative pl-6', className)} aria-label="Suivi du statut du dossier">
      <span aria-hidden className="absolute top-2 bottom-2 left-[9px] w-0.5 rounded-full bg-ocd-border" />
      <m.span
        aria-hidden
        className="absolute top-2 bottom-2 left-[9px] w-0.5 origin-top rounded-full bg-gradient-to-b from-ocd-green to-ocd-orange"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: progress }}
        transition={{ duration: reduce ? 0 : 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      />
      {STATUS_ORDER.map((s, i) => {
        const done = i < current || (isFinal && i === current)
        const active = i === current && !isFinal
        const meta = STATUS_META[s]
        const date = dateFor(s)
        return (
          <m.li
            key={s}
            className={cn('relative', i < STATUS_ORDER.length - 1 && 'pb-6', !done && !active && 'opacity-45')}
            initial={{ opacity: 0, x: reduce ? 0 : -8 }}
            animate={{ opacity: !done && !active ? 0.45 : 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.12, duration: 0.35 }}
            aria-current={active ? 'step' : undefined}
          >
            <m.span
              aria-hidden
              className={cn(
                'absolute top-0.5 -left-6 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-extrabold',
                done && 'bg-ocd-green text-ocd-black',
                active && 'bg-ocd-orange text-ocd-black ring-4 ring-ocd-orange/20',
                !done && !active && 'border-2 border-ocd-border bg-ocd-black',
              )}
              initial={{ scale: reduce ? 1 : 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22, delay: 0.25 + i * 0.12 }}
            >
              {done ? <Check className="size-3" strokeWidth={3} /> : active ? <span className="h-1.5 w-1.5 rounded-full bg-ocd-black" /> : ''}
              {active && !reduce && (
                <m.span
                  className="absolute inset-0 rounded-full bg-ocd-orange/40"
                  animate={{ scale: [1, 1.9], opacity: [0.6, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
            </m.span>
            <p className={cn('text-sm', active ? 'font-semibold text-ocd-orange' : done ? 'font-semibold' : 'font-medium')}>{meta.long}</p>
            <p className="text-[11px] text-ocd-muted">
              {active ? meta.current : done ? (date ?? 'Terminé') : 'En attente'}
              <span className="sr-only">{done ? ' — étape terminée' : active ? ' — étape en cours' : ' — étape à venir'}</span>
            </p>
          </m.li>
        )
      })}
    </ol>
  )
}
