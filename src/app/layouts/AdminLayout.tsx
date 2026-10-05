import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router'
import { AnimatePresence, m } from 'framer-motion'
import { Folder, Kanban, LayoutDashboard, MessageCircle, Settings, Users, type LucideIcon } from 'lucide-react'
import { Icon, LogoMark } from '@/components/ui'
import { cn } from '@/lib/tones'
import { AnimatedOutlet } from '../AnimatedOutlet'

const NAV: { to: string; label: string; icon: LucideIcon; end: boolean; also?: string }[] = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/pipeline', label: 'Pipeline Kanban', icon: Kanban, end: false },
  { to: '/admin/candidatures', label: 'Candidatures', icon: Folder, end: false, also: '/admin/projets' },
  { to: '/admin/candidats', label: 'Candidats', icon: Users, end: false },
  { to: '/admin/messagerie', label: 'Messagerie', icon: MessageCircle, end: false },
  { to: '/admin/parametres', label: 'Paramètres', icon: Settings, end: false },
]

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <LogoMark className="h-7" title="OCD" />
      <div>
        <p className="font-display text-sm leading-none font-semibold">Admin</p>
        <p className="eyebrow mt-1 text-[7px] tracking-[0.26em] text-ocd-muted">Back-office</p>
      </div>
    </div>
  )
}

function SideNav({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation()
  return (
    <nav aria-label="Back-office" className="flex-1 space-y-1 px-3 py-4 text-sm">
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) => {
            const active = isActive || (item.also ? pathname.startsWith(item.also) : false)
            return cn('relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors', active ? 'font-medium text-ocd-orange' : 'text-ocd-muted hover:text-ocd-cream')
          }}
        >
          {({ isActive }) => {
            const active = isActive || (item.also ? pathname.startsWith(item.also) : false)
            return (
              <>
                {active && <m.span layoutId="admin-nav-active" className="absolute inset-0 rounded-xl bg-ocd-orange/15" transition={{ type: 'spring', stiffness: 450, damping: 36 }} />}
                <item.icon className="relative size-4 shrink-0" strokeWidth={1.75} aria-hidden />
                <span className="relative">{item.label}</span>
              </>
            )
          }}
        </NavLink>
      ))}
    </nav>
  )
}

function UserCard() {
  return (
    <div className="flex items-center gap-3 border-t border-ocd-border p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ocd-orange/20 text-xs font-bold text-ocd-orange" aria-hidden>
        AK
      </div>
      <div>
        <p className="text-sm font-medium">Aminata K.</p>
        <p className="text-[10px] text-ocd-muted">Ops · Cotonou</p>
      </div>
    </div>
  )
}

/** Back-office (maquettes 06–08) : sidebar desktop, tiroir sur mobile. */
export default function AdminLayout() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])

  return (
    <div className="flex min-h-dvh">
      <aside className="hidden w-60 shrink-0 border-r border-ocd-border bg-ocd-anthra lg:block">
        <div className="sticky top-0 flex h-dvh flex-col">
          <div className="flex h-16 items-center border-b border-ocd-border px-5">
            <Brand />
          </div>
          <SideNav />
          <UserCard />
        </div>
      </aside>

      {/* Barre mobile */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-ocd-border bg-ocd-anthra/95 px-4 backdrop-blur-xl lg:hidden">
        <Brand />
        <button type="button" onClick={() => setOpen(true)} aria-label="Ouvrir le menu" aria-expanded={open} className="flex h-10 w-10 items-center justify-center rounded-full border border-ocd-border text-ocd-muted">
          <Icon.Menu />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <>
            <m.div className="fixed inset-0 z-50 bg-black/60 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <m.aside
              role="dialog"
              aria-modal="true"
              aria-label="Menu back-office"
              className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-ocd-border bg-ocd-anthra lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            >
              <div className="flex h-14 items-center justify-between border-b border-ocd-border px-4">
                <Brand />
                <button type="button" onClick={() => setOpen(false)} aria-label="Fermer le menu" className="flex h-10 w-10 items-center justify-center rounded-full text-ocd-muted hover:text-ocd-cream">
                  <Icon.Close />
                </button>
              </div>
              <SideNav onNavigate={() => setOpen(false)} />
              <UserCard />
            </m.aside>
          </>
        )}
      </AnimatePresence>

      <main id="contenu" className="min-w-0 flex-1 pt-14 lg:pt-0">
        <AnimatedOutlet kind="fade" />
      </main>
    </div>
  )
}
