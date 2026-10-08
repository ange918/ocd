import { m } from 'framer-motion'
import { ButtonLink, Img } from '@/components/ui'
import { IMG, unsplash } from '@/data/images'
import { JOINED_AVATARS, LANDING_STATS } from '@/data/landing'
import { fadeUp, staggerContainer } from '@/lib/motion'

export function Hero({ accountTo, accountLabel }: { accountTo: string; accountLabel: string }) {
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-title">
      <div aria-hidden className="pointer-events-none absolute -top-10 left-1/2 h-64 w-64 -translate-x-1/2 grad-orb opacity-90 md:-top-32 md:h-[520px] md:w-[720px] md:opacity-80" />
      <div aria-hidden className="pointer-events-none absolute right-0 bottom-0 hidden h-64 w-64 rounded-full bg-ocd-green/10 blur-3xl md:block" />
      <div className="mx-auto grid max-w-6xl gap-8 px-5 pt-10 pb-12 md:px-8 md:pt-20 md:pb-20 lg:grid-cols-12 lg:items-center lg:gap-12">
        <m.div className="relative z-10 lg:col-span-7" initial="hidden" animate="show" variants={staggerContainer(0.1, 0.05)}>
          <m.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-ocd-border bg-ocd-card/80 px-3 py-1 text-[11px] font-medium text-ocd-soft md:mb-6 md:py-1.5 md:text-xs">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ocd-green" />
            <span className="md:hidden">Porté par Bovann</span>
            <span className="hidden md:inline">Mouvement porté par Bovann · Afrique de l'Ouest</span>
          </m.div>
          <m.h1 id="hero-title" variants={fadeUp} className="mt-5 font-display text-[2.35rem] leading-[1.05] font-medium tracking-tight sm:text-6xl md:mt-0 lg:text-[4.25rem]">
            Les opportunités,
            <br />
            <span className="text-grad">c'est dehors.</span>
          </m.h1>
          <m.p variants={fadeUp} className="mt-4 text-[15px] leading-relaxed text-ocd-muted md:mt-6 md:max-w-xl md:text-lg">
            <span className="md:hidden">La plateforme qui connecte la jeunesse africaine qui entreprend à de la visibilité, du mentoring et des ressources.</span>
            <span className="hidden md:inline">
              OCD connecte la jeunesse africaine qui entreprend — commerce, artisanat, tech, mode — à de la visibilité, du mentoring et des ressources concrètes. Arrête d'attendre. Sors. Construit.
            </span>
          </m.p>
          <m.div variants={fadeUp} className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 md:mt-8">
            <ButtonLink to="/candidature" size="lg" glow className="w-full text-[15px] sm:w-auto md:text-base">
              Soumettre mon projet
            </ButtonLink>
            <ButtonLink to={accountTo} variant="secondary" size="lg" className="w-full text-[15px] sm:w-auto md:text-base">
              {accountLabel}
            </ButtonLink>
          </m.div>
          <m.div variants={fadeUp} className="mt-8 flex items-center gap-3 sm:mt-10 sm:gap-4">
            <div className="flex -space-x-3">
              {JOINED_AVATARS.map((src) => (
                <Img key={src} src={src} alt="" className="h-8 w-8 rounded-full border-2 border-ocd-black object-cover sm:h-10 sm:w-10" fallbackClassName="bg-ocd-card" />
              ))}
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ocd-black bg-ocd-orange text-xs font-bold text-ocd-black">+</div>
            </div>
            <p className="text-xs text-ocd-muted sm:text-sm">
              <span className="font-medium text-ocd-cream">{LANDING_STATS[0]?.value} candidatures*</span>
              <span className="hidden sm:inline"> · Cotonou, Lomé, Abidjan, Dakar…</span>
            </p>
          </m.div>
        </m.div>

        <m.div className="relative lg:col-span-5" initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-ocd-border lg:aspect-[4/5] lg:rounded-3xl lg:shadow-card">
            <picture>
              <source media="(min-width: 1024px)" srcSet={unsplash(IMG.heroTeam, 800, 1000)} />
              <Img src={unsplash(IMG.heroTeam, 780, 480)} alt="Jeunes entrepreneurs en atelier" priority className="h-full w-full object-cover" fallbackClassName="h-full w-full grad-hero opacity-40" />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-t from-ocd-black/80 to-transparent lg:from-ocd-black lg:via-ocd-black/20" />
            <p className="absolute bottom-3 left-3 text-xs font-medium lg:hidden">Atelier Wax &amp; Co · Cotonou</p>
            <div className="absolute right-5 bottom-5 left-5 hidden rounded-2xl p-4 glass lg:block">
              <p className="text-xs font-medium tracking-wider text-ocd-soft uppercase">Projet mis en avant</p>
              <p className="mt-1 font-display text-lg font-medium">Atelier Wax &amp; Co · Cotonou</p>
              <p className="text-sm text-ocd-muted">Mode · Mentoring + Visibilité</p>
            </div>
          </div>
          <m.div
            className="absolute top-16 -left-6 hidden rounded-2xl px-4 py-3 shadow-card glass lg:block"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: 3, ease: 'easeInOut' }}
          >
            <p className="font-display text-2xl font-semibold text-ocd-orange">+340</p>
            <p className="text-xs text-ocd-muted">projets accompagnés*</p>
          </m.div>
        </m.div>
      </div>
    </section>
  )
}
