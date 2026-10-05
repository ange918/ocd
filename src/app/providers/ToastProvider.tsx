import { useCallback, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { Check, Info, TriangleAlert, X, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/tones'
import { ToastContext, type ToastInput, type ToastItem } from './toast-context'

const ICON: Record<ToastItem['tone'], LucideIcon> = { success: Check, info: Info, error: TriangleAlert }
const ICON_CLASS: Record<ToastItem['tone'], string> = {
  success: 'bg-ocd-green/15 text-ocd-green',
  info: 'bg-ocd-orange/15 text-ocd-orange',
  error: 'bg-red-500/15 text-red-300',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const idRef = useRef(0)
  const reduce = useReducedMotion()

  const dismiss = useCallback((id: number) => setItems((list) => list.filter((t) => t.id !== id)), [])

  const push = useCallback(
    (input: ToastInput) => {
      const id = ++idRef.current
      const item: ToastItem = { id, title: input.title, description: input.description, tone: input.tone ?? 'success', duration: input.duration ?? 3800 }
      setItems((list) => [...list.slice(-2), item])
      window.setTimeout(() => dismiss(id), item.duration)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 bottom-20 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-auto sm:left-auto sm:right-6 sm:top-6 sm:items-end"
      >
        <AnimatePresence initial={false}>
          {items.map((t) => {
            const ToneIcon = ICON[t.tone]
            return (
            <m.div
              key={t.id}
              layout
              role={t.tone === 'error' ? 'alert' : 'status'}
              initial={{ opacity: 0, y: reduce ? 0 : 24, scale: reduce ? 1 : 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: reduce ? 0 : 12, scale: reduce ? 1 : 0.96, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-ocd-border bg-ocd-card/95 p-3.5 shadow-card backdrop-blur-xl"
            >
              <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-xl', ICON_CLASS[t.tone])} aria-hidden>
                <ToneIcon className="size-4" strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{t.title}</p>
                {t.description && <p className="mt-0.5 text-xs leading-relaxed text-ocd-muted">{t.description}</p>}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="rounded-full p-1 text-ocd-muted hover:text-ocd-cream"
                aria-label="Fermer la notification"
              >
                <X className="size-4" strokeWidth={2} />
              </button>
            </m.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
