import { NavLink } from 'react-router'
import { m } from 'framer-motion'
import { ClipboardList, House, MessageCircle, User, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/tones'
import { AnimatedOutlet } from '../AnimatedOutlet'

const NAV: { to: string; label: string; icon: LucideIcon; end: boolean }[] = [
  { to: '/espace', label: 'Accueil', icon: House, end: true },
  { to: '/espace/dossier', label: 'Dossier', icon: ClipboardList, end: false },
  { to: '/espace/messages', label: 'Messages', icon: MessageCircle, end: false },
  { to: '/espace/profil', label: 'Profil', icon: User, end: false },
]

/** Espace candidat (maquette 05) : colonne mobile + barre de navigation basse. */
export default function CandidateLayout() {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-md pb-24 md:max-w-xl">
      <main id="contenu">
        <AnimatedOutlet />
      </main>
      <nav
        aria-label="Navigation espace candidat"
        className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-ocd-border bg-ocd-black/95 px-6 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:max-w-xl"
      >
        <ul className="flex justify-between text-[10px] text-ocd-muted">
          {NAV.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} end={item.end} className={({ isActive }) => cn('relative flex min-w-14 flex-col items-center gap-1 px-2 py-0.5 transition-colors', isActive ? 'text-ocd-orange' : 'hover:text-ocd-cream')}>
                {({ isActive }) => (
                  <>
                    {isActive && <m.span layoutId="candidate-nav-pill" className="absolute -top-3 h-0.5 w-8 rounded-full bg-ocd-orange" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />}
                    <item.icon className="size-[18px]" strokeWidth={1.75} aria-hidden />
                    {item.label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
