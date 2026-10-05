import { useState } from 'react'
import { AnimatePresence, LayoutGroup, m } from 'framer-motion'
import type { Application, ApplicationStatus, Tone } from '@/types'
import { STATUS_META, STATUS_ORDER } from '@/data/labels'
import { cn, toneDot } from '@/lib/tones'
import { KanbanCard } from './KanbanCard'

interface Props {
  applications: Application[]
  onMove: (id: string, status: ApplicationStatus) => void
  onOpen: (id: string) => void
}

const COUNT_CLASS: Record<ApplicationStatus, string> = {
  soumis: 'border border-ocd-border bg-ocd-card text-ocd-muted',
  en_etude: 'bg-ocd-yellow/15 text-ocd-yellow',
  preselectionne: 'bg-ocd-soft/15 text-ocd-soft',
  accompagne: 'bg-ocd-green/15 text-ocd-green',
  cloture: 'border border-ocd-border bg-ocd-card text-ocd-muted',
}

/** Pipeline Kanban (maquette 07) : glisser une carte change son statut. */
export function KanbanBoard({ applications, onMove, onOpen }: Props) {
  const [over, setOver] = useState<ApplicationStatus | null>(null)

  return (
    <LayoutGroup>
      <p id="kanban-help" className="sr-only">
        Glisse la carte vers une autre colonne pour changer son statut. Au clavier : flèches gauche et droite pour changer de colonne, Entrée pour ouvrir la fiche.
      </p>
      <div className="flex min-w-max gap-4">
        {STATUS_ORDER.map((status) => {
          const meta = STATUS_META[status]
          const items = applications.filter((a) => a.status === status)
          const tone: Tone = meta.tone
          const isOver = over === status
          return (
            <section key={status} data-kanban-column={status} aria-label={`Colonne ${meta.column}, ${items.length} projet(s)`} className="w-64 shrink-0">
              <header className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className={cn('h-2 w-2 rounded-full', status === 'en_etude' ? 'bg-ocd-yellow' : toneDot[tone])} />
                  <h2 className="text-sm font-semibold">{meta.column}</h2>
                  <m.span key={items.length} initial={{ scale: 1.4 }} animate={{ scale: 1 }} className={cn('rounded-full px-1.5 text-[10px]', COUNT_CLASS[status])}>
                    {items.length}
                  </m.span>
                </div>
              </header>
              <m.div
                animate={{ backgroundColor: isOver ? 'rgba(241,90,36,0.06)' : 'rgba(241,90,36,0)', borderColor: isOver ? 'rgba(241,90,36,0.45)' : 'rgba(42,42,46,0)' }}
                className="-m-1.5 min-h-[160px] space-y-3 rounded-3xl border border-dashed p-1.5"
              >
                <AnimatePresence initial={false}>
                  {items.map((app) => (
                    <KanbanCard key={app.id} app={app} onMove={onMove} onOpen={onOpen} onDragOverColumn={setOver} />
                  ))}
                </AnimatePresence>
                {items.length === 0 && <p className="px-2 py-6 text-center text-[11px] text-ocd-muted/70">Dépose une carte ici</p>}
              </m.div>
            </section>
          )
        })}
      </div>
    </LayoutGroup>
  )
}
