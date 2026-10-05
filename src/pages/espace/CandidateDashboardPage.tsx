import { useEffect, useState } from 'react'
import { m } from 'framer-motion'
import { Hand, Rocket, User } from 'lucide-react'
import type { AppNotification } from '@/types'
import { Avatar, ButtonLink, Icon, LogoMark } from '@/components/ui'
import { StatusTimeline } from '@/components/ui/StatusTimeline'
import { Skeleton } from '@/components/ui/Skeleton'
import { DossierCard } from '@/components/espace/DossierCard'
import { NotificationsList } from '@/components/espace/NotificationsList'
import { ChatPanel } from '@/components/espace/ChatPanel'
import { useAuth } from '@/app/providers/auth-context'
import { useMyApplication } from '@/hooks/useMyApplication'
import { messagingService } from '@/services'
import { formatPhone } from '@/lib/format'

/** Maquette 05 — tableau de bord candidat. */
export default function CandidateDashboardPage() {
  const { session } = useAuth()
  const { data: app, loading } = useMyApplication()
  const [notifs, setNotifs] = useState<AppNotification[]>([])

  useEffect(() => {
    document.title = 'Mon espace — OCD'
  }, [])

  useEffect(() => {
    if (!app) return
    let alive = true
    void messagingService.listNotifications(app.id).then((n) => alive && setNotifs(n))
    return () => {
      alive = false
    }
  }, [app])

  const name = session?.fullName ?? app?.applicant.fullName ?? (session ? formatPhone(session.phone) : '')
  const unread = notifs.some((n) => !n.read)

  const markAll = async () => {
    if (!app) return
    setNotifs((list) => list.map((n) => ({ ...n, read: true, highlight: false })))
    await messagingService.markAllNotificationsRead(app.id)
  }

  return (
    <div>
      <header className="flex items-center justify-between px-5 pt-6 pb-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <LogoMark className="h-5 opacity-90" title="OCD" />
          </div>
          <p className="text-xs text-ocd-muted">Bonjour,</p>
          <p className="flex items-center gap-1.5 font-display text-lg font-medium">
            {name}
            <Hand className="size-4 text-ocd-orange" strokeWidth={1.75} aria-hidden />
          </p>
        </div>
        <div className="flex items-center gap-3">
          <m.a
            href="#notifications"
            whileTap={{ scale: 0.9 }}
            aria-label={unread ? 'Notifications — nouvelles notifications' : 'Notifications'}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-ocd-border"
          >
            <Icon.Bell />
            {unread && (
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-ocd-orange">
                <m.span className="absolute inset-0 rounded-full bg-ocd-orange" animate={{ scale: [1, 2.2], opacity: [0.7, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
              </span>
            )}
          </m.a>
          {app ? (
            <Avatar person={app.applicant} size="md" className="border border-ocd-border" />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-ocd-border bg-ocd-card text-ocd-muted" aria-hidden>
              <User className="size-4" strokeWidth={1.75} />
            </span>
          )}
        </div>
      </header>

      {loading && (
        <div className="space-y-4 px-5">
          <Skeleton className="h-24" />
          <Skeleton className="h-64" />
        </div>
      )}

      {!loading && !app && (
        <m.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-5 rounded-2xl border border-dashed border-ocd-border bg-ocd-card/60 p-6 text-center">
          <Rocket className="mx-auto size-8 text-ocd-orange" strokeWidth={1.75} aria-hidden />
          <h1 className="mt-3 font-display text-xl font-medium">Tu n'as pas encore soumis de projet</h1>
          <p className="mt-2 text-sm text-ocd-muted">Ça prend quelques minutes. L'équipe OCD te répond — souvent sous 48h.</p>
          <ButtonLink to="/candidature" glow size="lg" className="mt-5 text-[15px]">
            Soumettre mon projet
          </ButtonLink>
        </m.section>
      )}

      {app && (
        <>
          <h1 className="sr-only">Mon espace candidat</h1>
          <div className="px-5">
            <DossierCard app={app} />
          </div>

          <section aria-labelledby="suivi-title" className="mt-8 px-5">
            <h2 id="suivi-title" className="font-display text-base font-medium">
              Suivi du statut
            </h2>
            <StatusTimeline status={app.status} history={app.history} className="mt-5" />
          </section>

          <NotificationsList items={notifs} onMarkAllRead={() => void markAll()} />

          <section aria-labelledby="chat-title" className="mt-6 mb-4 px-5">
            <h2 id="chat-title" className="font-display text-base font-medium">
              Messagerie de suivi
            </h2>
            <div className="mt-3">
              <ChatPanel applicationId={app.id} />
            </div>
          </section>
        </>
      )}
    </div>
  )
}
