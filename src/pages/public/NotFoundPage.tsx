import { useEffect } from 'react'
import { m } from 'framer-motion'
import { ButtonLink } from '@/components/ui'
import { LogoWordmark } from '@/components/ui/Logo'

export default function NotFoundPage() {
  useEffect(() => {
    document.title = 'Page introuvable — OCD'
  }, [])
  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-6 py-20 text-center">
      <div aria-hidden className="pointer-events-none absolute top-0 left-1/2 h-80 w-[520px] -translate-x-1/2 grad-orb opacity-70" />
      <m.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 18 }} className="relative">
        <LogoWordmark className="origin-top scale-75 md:scale-100" />
      </m.div>
      <p className="eyebrow relative mt-6 text-ocd-orange">Erreur 404</p>
      <h1 className="relative mt-3 font-display text-3xl font-medium md:text-4xl">Cette page est… dehors.</h1>
      <p className="relative mt-3 max-w-md text-sm text-ocd-muted">Le lien est peut-être cassé ou la page a déménagé. Les opportunités, elles, t'attendent toujours.</p>
      <div className="relative mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink to="/" glow size="lg">
          Retour à l'accueil
        </ButtonLink>
        <ButtonLink to="/candidature" variant="secondary" size="lg">
          Soumettre mon projet
        </ButtonLink>
      </div>
    </section>
  )
}
