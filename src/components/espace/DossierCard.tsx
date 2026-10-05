import { m } from 'framer-motion'
import type { Application } from '@/types'
import { Eyebrow, StatusBadge } from '@/components/ui'
import { SECTOR_META } from '@/data/labels'
import { formatDate } from '@/lib/format'

export function DossierCard({ app }: { app: Application }) {
  return (
    <m.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="rounded-2xl border border-ocd-border bg-ocd-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Eyebrow className="text-ocd-soft">Mon dossier</Eyebrow>
          <p className="mt-1 font-display text-lg leading-tight font-medium">{app.title}</p>
          <p className="mt-0.5 text-xs text-ocd-muted">
            {SECTOR_META[app.sector].short} · {app.city} · Soumis le {formatDate(app.submittedAt)}
          </p>
        </div>
        <StatusBadge status={app.status} size="sm" className="font-semibold" />
      </div>
    </m.div>
  )
}
