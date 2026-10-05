import { useEffect, useRef, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { m, useDragControls, useReducedMotion, type PanInfo } from 'framer-motion'
import { Paperclip } from 'lucide-react'
import type { Application, ApplicationStatus } from '@/types'
import { NEED_META, SECTOR_META, STATUS_ORDER } from '@/data/labels'
import { formatShortDate } from '@/lib/format'
import { cn, toneText } from '@/lib/tones'
import { Avatar } from '@/components/ui'

interface Props {
  app: Application
  onMove: (id: string, status: ApplicationStatus) => void
  onOpen: (id: string) => void
  onDragOverColumn: (status: ApplicationStatus | null) => void
}

const LONG_PRESS_MS = 260

/** Retrouve la colonne sous le pointeur (coordonnées écran). */
export function columnAt(x: number, y: number): ApplicationStatus | null {
  const els = document.elementsFromPoint(x, y)
  for (const el of els) {
    const col = (el as HTMLElement).closest<HTMLElement>('[data-kanban-column]')
    if (col) return col.dataset.kanbanColumn as ApplicationStatus
  }
  return null
}

function clientPoint(e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): { x: number; y: number } {
  if ('clientX' in e) return { x: e.clientX, y: e.clientY }
  const t = e.changedTouches[0]
  if (t) return { x: t.clientX, y: t.clientY }
  return { x: info.point.x - window.scrollX, y: info.point.y - window.scrollY }
}

export function KanbanCard({ app, onMove, onOpen, onDragOverColumn }: Props) {
  const controls = useDragControls()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const dragged = useRef(false)
  const dragging = useRef(false)
  const pressTimer = useRef<number | undefined>(undefined)
  const lastCol = useRef<ApplicationStatus | null>(null)

  const highlighted = Boolean(app.pendingRequest)
  const closed = app.status === 'cloture'
  const firstNeed = app.needs[0]
  const needTone = closed ? 'muted' : firstNeed ? NEED_META[firstNeed].tone : 'muted'

  // Empêche le scroll natif pendant un drag tactile (après appui long).
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const block = (e: TouchEvent) => {
      if (dragging.current) e.preventDefault()
    }
    el.addEventListener('touchmove', block, { passive: false })
    return () => el.removeEventListener('touchmove', block)
  }, [])

  const handlePointerDown = (e: ReactPointerEvent) => {
    dragged.current = false
    if (e.pointerType === 'mouse' || e.pointerType === 'pen') {
      controls.start(e)
      return
    }
    // Tactile : appui long pour saisir la carte, sinon on laisse défiler le tableau.
    const native = e.nativeEvent
    window.clearTimeout(pressTimer.current)
    pressTimer.current = window.setTimeout(() => {
      dragging.current = true
      navigator.vibrate?.(15)
      controls.start(native)
    }, LONG_PRESS_MS)
  }

  const cancelPress = () => window.clearTimeout(pressTimer.current)

  const handleKey = (e: KeyboardEvent) => {
    const i = STATUS_ORDER.indexOf(app.status)
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onOpen(app.id)
    } else if (e.key === 'ArrowRight' && i < STATUS_ORDER.length - 1) {
      e.preventDefault()
      onMove(app.id, STATUS_ORDER[i + 1]!)
    } else if (e.key === 'ArrowLeft' && i > 0) {
      e.preventDefault()
      onMove(app.id, STATUS_ORDER[i - 1]!)
    }
  }

  return (
    <m.article
      ref={ref}
      layout
      layoutId={`kanban-${app.id}`}
      drag
      dragControls={controls}
      dragListener={false}
      dragSnapToOrigin
      dragElastic={0.15}
      dragMomentum={false}
      whileHover={reduce ? undefined : { y: -2 }}
      whileDrag={{ scale: 1.04, rotate: reduce ? 0 : 1.5, zIndex: 50, boxShadow: '0 20px 50px rgba(0,0,0,0.5)', cursor: 'grabbing' }}
      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
      onPointerDown={handlePointerDown}
      onPointerUp={cancelPress}
      onPointerMove={(e) => {
        if (!dragging.current && e.pointerType !== 'mouse' && (Math.abs(e.movementX) > 4 || Math.abs(e.movementY) > 4)) cancelPress()
      }}
      onPointerCancel={cancelPress}
      onDragStart={() => {
        dragged.current = true
      }}
      onDrag={(e, info) => {
        const p = clientPoint(e, info)
        const col = columnAt(p.x, p.y)
        if (col !== lastCol.current) {
          lastCol.current = col
          onDragOverColumn(col)
        }
      }}
      onDragEnd={(e, info) => {
        dragging.current = false
        const p = clientPoint(e, info)
        const col = columnAt(p.x, p.y)
        lastCol.current = null
        onDragOverColumn(null)
        if (col && col !== app.status) onMove(app.id, col)
      }}
      onClick={() => {
        if (!dragged.current) onOpen(app.id)
      }}
      onKeyDown={handleKey}
      tabIndex={0}
      role="button"
      aria-roledescription="carte déplaçable"
      aria-label={`${app.title} — ${app.applicant.fullName}`}
      aria-describedby="kanban-help"
      className={cn(
        'relative cursor-grab touch-manipulation rounded-2xl bg-ocd-card p-3.5 outline-none select-none focus-visible:ring-2 focus-visible:ring-ocd-soft',
        highlighted ? 'border-2 border-ocd-orange/40 ring-2 ring-ocd-orange/10' : 'border border-ocd-border',
        closed && 'bg-ocd-card/60 opacity-70',
      )}
    >
      <div className="flex items-center gap-2">
        <Avatar person={app.applicant} size="xs" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{app.title}</p>
          <p className="text-[10px] text-ocd-muted">{app.applicant.fullName}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="rounded-md bg-ocd-anthra px-1.5 py-0.5 text-[10px] text-ocd-muted">{SECTOR_META[app.sector].short}</span>
        <span className="rounded-md bg-ocd-anthra px-1.5 py-0.5 text-[10px] text-ocd-muted">{app.city}</span>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className={cn('truncate text-[10px]', toneText[needTone])}>{app.needs.map((n) => NEED_META[n].label).join(' + ')}</span>
        <span className="shrink-0 text-[10px] text-ocd-muted">{formatShortDate(app.submittedAt)}</span>
      </div>
      {app.pendingRequest && (
        <div className="mt-2 flex items-center gap-1 rounded-lg bg-ocd-orange/10 px-2 py-1 text-[10px] text-ocd-soft">
          <Paperclip className="size-3 shrink-0" strokeWidth={1.75} aria-hidden />
          Pièce demandée
        </div>
      )}
    </m.article>
  )
}
