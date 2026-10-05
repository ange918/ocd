import { Link } from 'react-router'
import { AnimatePresence, m } from 'framer-motion'
import { Bell, Inbox, Paperclip, type LucideIcon } from 'lucide-react'
import type { AppNotification } from '@/types'
import { formatRelative } from '@/lib/format'
import { cn } from '@/lib/tones'

const NOTIFICATION_ICONS: Record<string, LucideIcon> = {
  paperclip: Paperclip,
  inbox: Inbox,
  bell: Bell,
  '📎': Paperclip,
  '📬': Inbox,
  '🔔': Bell,
}

interface Props {
  items: AppNotification[]
  onMarkAllRead: () => void
}

export function NotificationsList({ items, onMarkAllRead }: Props) {
  const unread = items.filter((n) => !n.read).length
  return (
    <section id="notifications" aria-labelledby="notif-title" className="mt-4 scroll-mt-4 px-5">
      <div className="flex items-center justify-between">
        <h2 id="notif-title" className="font-display text-base font-medium">
          Notifications {unread > 0 && <span className="sr-only">({unread} non lues)</span>}
        </h2>
        {unread > 0 && (
          <button type="button" onClick={onMarkAllRead} className="text-xs font-medium text-ocd-orange hover:underline">
            Tout marquer lu
          </button>
        )}
      </div>
      <ul className="mt-3 space-y-2">
        <AnimatePresence initial>
          {items.map((n, i) => {
            const isMsg = n.meta.toLowerCase().includes('messagerie')
            const NotifIcon = NOTIFICATION_ICONS[n.icon] ?? Bell
            const content = (
              <>
                <span
                  aria-hidden
                  className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', n.highlight ? 'bg-ocd-orange/20 text-ocd-orange' : 'border border-ocd-border bg-ocd-card text-ocd-cream')}
                >
                  <NotifIcon className="size-4" strokeWidth={1.75} />
                </span>
                <span>
                  <span className={cn('block text-sm', n.read ? 'font-medium' : 'font-semibold')}>{n.title}</span>
                  <span className="mt-0.5 block text-xs text-ocd-muted">
                    {formatRelative(n.createdAt)} · {n.meta}
                  </span>
                </span>
                {!n.read && <span className="ml-auto mt-1.5 h-2 w-2 shrink-0 rounded-full bg-ocd-orange" aria-label="non lue" />}
              </>
            )
            const cls = cn(
              'flex gap-3 rounded-2xl border p-3.5 transition-colors',
              n.highlight ? 'border-ocd-orange/30 bg-ocd-orange/5' : 'border-ocd-border bg-ocd-card',
              isMsg && 'hover:border-ocd-orange/50',
            )
            return (
              <m.li key={n.id} layout initial={{ opacity: 0, y: 14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.1 + i * 0.07, type: 'spring', stiffness: 400, damping: 30 }}>
                {isMsg ? (
                  <Link to="/espace/messages" className={cls}>
                    {content}
                  </Link>
                ) : (
                  <div className={cls}>{content}</div>
                )}
              </m.li>
            )
          })}
        </AnimatePresence>
        {items.length === 0 && <li className="rounded-2xl border border-ocd-border bg-ocd-card p-4 text-center text-xs text-ocd-muted">Aucune notification pour l'instant.</li>}
      </ul>
    </section>
  )
}
