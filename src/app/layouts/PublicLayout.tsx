import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { AnimatePresence, m, useScroll, useSpring } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { ButtonLink, LogoBaseline, LogoLockup, LogoMark } from '@/components/ui'
import { useAuth } from '../providers/auth-context'
import { AnimatedOutlet } from '../AnimatedOutlet'

const NAV = [
  { id: 'philosophie', label: 'Philosophie' },
  { id: 'comment', label: 'Comment ça marche' },
  { id: 'secteurs', label: 'Secteurs' },
  { id: 'temoignages', label: 'Témoignages' },
  { id: 'faq', label: 'FAQ' },
]

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null)
  const { pathname } = useLocation()
  useEffect(() => {
    if (pathname !== '/') return setActive(null)
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e)
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => obs.observe(el))
    const onTop = () => window.scrollY < 200 && setActive(null)
    window.addEventListener('scroll', onTop, { passive: true })
    return () => {
      obs.disconnect()
      window.removeEventListener('scroll', onTop)
    }
  }, [ids, pathname])
  return active
}

const NAV_IDS = NAV.map((n) => n.id)

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 32, restDelta: 0.001 })
  return <m.div aria-hidden style={{ scaleX }} className="absolute inset-x-0 bottom-[-1px] h-0.5 origin-left bg-ocd-grad" />
}

function useSectionNav() {
  const location = useLocation()
  const navigate = useNavigate()
  return (id: string) => {
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      history.replaceState(null, '', `#${id}`)
    } else {
      navigate(`/#${id}`)
    }
  }
}

function Header() {
  const [open, setOpen] = useState(false)
  const { session } = useAuth()
  const goTo = useSectionNav()
  const active = useActiveSection(NAV_IDS)
  const headerRef = useRef<HTMLElement>(null)
  const location = useLocation()

  useEffect(() => setOpen(false), [location.pathname])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onDown = (e: PointerEvent) => !headerRef.current?.contains(e.target as Node) && setOpen(false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  const accountTo = session ? (session.role === 'admin' ? '/admin' : '/espace') : '/connexion'
  const accountLabel = session ? 'Mon espace' : 'Se connecter'

  return (
    <header ref={headerRef} className="sticky top-0 z-50 border-b border-ocd-border/60 bg-ocd-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 md:h-16 md:px-8">
        <Link to="/" aria-label="OCD — accueil" className="flex items-center gap-3">
          <LogoMark className="h-7 md:h-8" title={null} />
          <LogoBaseline className="hidden sm:block" />
        </Link>
        <nav aria-label="Sections" className="hidden items-center gap-8 text-sm text-ocd-muted md:flex">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`${import.meta.env.BASE_URL}#${n.id}`}
              onClick={(e) => {
                e.preventDefault()
                goTo(n.id)
              }}
              aria-current={active === n.id ? 'location' : undefined}
              className={`relative py-1 transition-colors hover:text-ocd-cream ${active === n.id ? 'text-ocd-cream' : ''}`}
            >
              {n.label}
              {active === n.id && <m.span layoutId="nav-underline" aria-hidden className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-ocd-grad" />}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <ButtonLink to={accountTo} variant="outline" size="sm">
            {accountLabel}
          </ButtonLink>
          <ButtonLink to="/candidature" size="sm" glow className="px-5">
            Soumettre mon projet
          </ButtonLink>
        </div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          className="-mr-2 flex size-11 items-center justify-center rounded-full text-ocd-cream md:hidden"
        >
          {open ? <X aria-hidden className="size-6" /> : <Menu aria-hidden className="size-6" />}
        </button>
      </div>
      <ScrollProgress />
      <AnimatePresence>
        {open && (
          <m.nav
            id="menu-mobile"
            aria-label="Menu principal"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-ocd-border/60 md:hidden"
          >
            <m.ul initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }} className="space-y-1 px-5 py-4">
              {NAV.map((n) => (
                <m.li key={n.id} variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }}>
                  <a
                    href={`${import.meta.env.BASE_URL}#${n.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      setOpen(false)
                      goTo(n.id)
                    }}
                    aria-current={active === n.id ? 'location' : undefined}
                    className={`block rounded-xl px-3 py-3 text-[15px] hover:bg-ocd-card ${active === n.id ? 'bg-ocd-card text-ocd-soft' : 'text-ocd-cream'}`}
                  >
                    {n.label}
                  </a>
                </m.li>
              ))}
            </m.ul>
            <div className="flex flex-col gap-3 px-5 pb-5">
              <ButtonLink to="/candidature" fullWidth glow size="lg" className="text-[15px]">
                Soumettre mon projet
              </ButtonLink>
              <ButtonLink to={accountTo} variant="secondary" fullWidth size="lg" className="text-[15px]">
                {accountLabel}
              </ButtonLink>
            </div>
          </m.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-ocd-border md:bg-ocd-anthra">
      <div className="mx-auto hidden max-w-6xl gap-10 px-8 py-14 md:grid md:grid-cols-4">
        <div className="md:col-span-2">
          <LogoLockup />
          <p className="mt-4 max-w-sm text-sm text-ocd-muted">Mouvement pour la jeunesse africaine qui entreprend. Porté par Bovann. Basé en Afrique de l'Ouest.</p>
        </div>
        <div>
          <p className="text-xs font-bold tracking-wider text-ocd-muted uppercase">Plateforme</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link className="hover:text-ocd-soft" to="/candidature">
                Soumettre un projet
              </Link>
            </li>
            <li>
              <Link className="hover:text-ocd-soft" to="/connexion">
                Se connecter
              </Link>
            </li>
            <li>
              <a className="hover:text-ocd-soft" href={`${import.meta.env.BASE_URL}#comment`}>
                Comment ça marche
              </a>
            </li>
            <li>
              <a className="hover:text-ocd-soft" href={`${import.meta.env.BASE_URL}#faq`}>
                FAQ
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold tracking-wider text-ocd-muted uppercase">Contact</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>hello@ocd-app.example</li>
            <li>WhatsApp · +229 ··· ··· ···</li>
            <li>Cotonou · Abidjan · Dakar</li>
          </ul>
        </div>
      </div>
      <div className="md:border-t md:border-ocd-border">
        <div className="mx-auto hidden max-w-6xl flex-wrap items-center justify-between gap-4 px-8 py-6 text-xs text-ocd-muted md:flex">
          <p>© 2026 OCD · Maquette UI — contenu &amp; stats d'exemple</p>
          <p>Confidentialité · Conditions · Mentions légales</p>
        </div>
        <p className="px-5 py-8 text-center text-[11px] text-ocd-muted md:hidden">© 2026 OCD · Maquette — stats d'exemple</p>
      </div>
    </footer>
  )
}

export default function PublicLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main id="contenu" className="flex-1">
        <AnimatedOutlet />
      </main>
      <Footer />
    </div>
  )
}

