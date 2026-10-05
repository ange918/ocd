import { m, useReducedMotion } from 'framer-motion'
import type { DashboardStats } from '@/types'
import { toneDot, cn } from '@/lib/tones'

const ease = [0.22, 1, 0.36, 1] as const

export function GeoBars({ items }: { items: DashboardStats['geo'] }) {
  return (
    <ul className="mt-6 space-y-3">
      {items.map((g, i) => (
        <li key={g.city}>
          <div className="mb-1.5 flex justify-between text-sm">
            <span>{g.city}</span>
            <span className="font-medium text-ocd-muted">{g.count}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-ocd-anthra" role="presentation">
            <m.div
              className={cn('h-full rounded-full', toneDot[g.tone])}
              initial={{ width: 0 }}
              whileInView={{ width: `${g.percent}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.1 + i * 0.07, ease }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

/** Donut SVG animé (remplace le conic-gradient de la maquette, même rendu). */
export function SectorDonut({ items, total }: { items: DashboardStats['sectors']; total: string }) {
  const reduce = useReducedMotion()
  const r = 52
  const c = 2 * Math.PI * r
  let offset = 0
  return (
    <div className="mt-6 flex flex-col items-center">
      <div className="relative h-36 w-36">
        <svg viewBox="0 0 144 144" className="h-full w-full -rotate-90" role="img" aria-label={`Répartition par secteur : ${items.map((s) => `${s.label} ${s.percent}%`).join(', ')}`}>
          <circle cx="72" cy="72" r={r} fill="none" stroke="#141416" strokeWidth="20" />
          {items.map((s, i) => {
            const len = (s.percent / 100) * c
            const dash = `${len} ${c - len}`
            const el = (
              <m.circle
                key={s.label}
                cx="72"
                cy="72"
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth="20"
                strokeDashoffset={-offset}
                initial={{ strokeDasharray: reduce ? dash : `0 ${c}` }}
                whileInView={{ strokeDasharray: dash }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12, ease }}
              />
            )
            offset += len
            return el
          })}
        </svg>
        <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-ocd-card">
          <p className="font-display text-xl font-medium">{total}</p>
          <p className="text-[10px] text-ocd-muted">total*</p>
        </div>
      </div>
      <ul className="mt-5 w-full space-y-1.5 text-[11px]">
        {items.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: s.color }} aria-hidden />
            {s.label} {s.percent}%
          </li>
        ))}
      </ul>
    </div>
  )
}

const PIPE_BAR: Record<string, string> = {
  soumis: 'bg-ocd-border/80',
  en_etude: 'bg-ocd-yellow/70',
  preselectionne: 'bg-ocd-soft/80',
  accompagne: 'bg-ocd-green/80',
  cloture: 'bg-ocd-muted/40',
}

export function PipelineBars({ items }: { items: DashboardStats['pipeline'] }) {
  return (
    <ul className="mt-5 space-y-4">
      {items.map((p, i) => (
        <li key={p.status} className="flex items-center gap-3">
          <div className="w-24 text-sm text-ocd-muted xl:w-28">{p.label}</div>
          <div className="relative h-8 flex-1 overflow-hidden rounded-lg bg-ocd-anthra">
            <m.div
              className={cn('h-full rounded-lg', PIPE_BAR[p.status])}
              initial={{ width: 0 }}
              whileInView={{ width: `${p.percent}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.1 + i * 0.08, ease }}
            />
            <span className="absolute top-1/2 right-2 -translate-y-1/2 text-xs font-semibold">{p.count}</span>
          </div>
        </li>
      ))}
    </ul>
  )
}
