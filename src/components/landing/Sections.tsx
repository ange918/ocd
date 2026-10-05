import { m } from 'framer-motion'
import { ButtonLink, Card, Eyebrow, Icon, Img } from '@/components/ui'
import { Reveal, RevealItem } from '@/components/ui/Reveal'
import { useToast } from '@/app/providers/toast-context'
import { HOW_STEPS, LANDING_SECTORS, LANDING_STATS, PHILOSOPHY_POINTS, TESTIMONIALS } from '@/data/landing'
import { SECTOR_META } from '@/data/labels'
import { IMG, unsplash } from '@/data/images'
import { cn, toneText } from '@/lib/tones'
import { CountUp } from './CountUp'

const STAT_TONE = { cream: 'text-ocd-cream', orange: 'text-ocd-orange', green: 'text-ocd-green', yellow: 'text-ocd-yellow' } as const
const STEP_BADGE = { orange: 'bg-ocd-orange/15 text-ocd-orange', yellow: 'bg-ocd-yellow/15 text-ocd-yellow', green: 'bg-ocd-green/15 text-ocd-green' } as const

export function StatsBand() {
  return (
    <section aria-label="Chiffres clés" className="border-y border-ocd-border bg-ocd-anthra">
      <Reveal className="mx-auto grid max-w-6xl grid-cols-2 gap-5 px-5 py-8 md:grid-cols-4 md:gap-6 md:px-8 md:py-12">
        {LANDING_STATS.map((s) => (
          <RevealItem key={s.value}>
            <p className={cn('font-display text-2xl font-semibold md:text-3xl', STAT_TONE[s.tone as keyof typeof STAT_TONE])}>
              <CountUp value={s.value} />
            </p>
            <p className="mt-0.5 text-xs text-ocd-muted md:mt-1 md:text-sm">
              <span className="md:hidden">{s.mobileLabel}</span>
              <span className="hidden md:inline">{s.label}</span>
            </p>
          </RevealItem>
        ))}
      </Reveal>
      <p className="mx-auto max-w-6xl px-5 pb-6 text-[10px] text-ocd-muted/70 md:px-8 md:text-[11px]">
        <span className="md:hidden">* Données d'exemple — maquette</span>
        <span className="hidden md:inline">* Chiffres d'exemple pour maquette — non représentatifs de données réelles.</span>
      </p>
    </section>
  )
}

export function Philosophy() {
  return (
    <section id="philosophie" aria-labelledby="philo-title" className="mx-auto max-w-6xl scroll-mt-16 px-5 py-12 md:px-8 md:py-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <RevealItem>
            <Eyebrow>Philosophie</Eyebrow>
          </RevealItem>
          <RevealItem as="h2">
            <span id="philo-title" className="mt-3 block font-display text-2xl leading-tight font-medium md:text-4xl">
              L'opportunité ne frappe pas à la porte. Elle est dehors.
            </span>
          </RevealItem>
          <RevealItem as="p" className="mt-5 leading-relaxed text-ocd-muted">
            Trop de talents restent invisibles faute de réseau, de mentoring ou simplement d'une première vitrine. OCD est un mouvement : on valorise ceux qui agissent, on connecte les porteurs de projets aux bons leviers, et on refuse le fatalisme.
          </RevealItem>
          <ul className="mt-8 space-y-4">
            {PHILOSOPHY_POINTS.map((p, i) => (
              <RevealItem as="li" key={p.title} className="flex gap-3">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ocd-orange/20 text-xs font-bold text-ocd-orange">{i + 1}</span>
                <div>
                  <p className="font-medium">{p.title}</p>
                  <p className="text-sm text-ocd-muted">{p.text}</p>
                </div>
              </RevealItem>
            ))}
          </ul>
        </Reveal>
        <Reveal className="grid grid-cols-2 gap-4" stagger={0.12}>
          <div className="space-y-4">
            <RevealItem className="aspect-[3/4] overflow-hidden rounded-2xl border border-ocd-border">
              <Img src={unsplash(IMG.philoGroup, 500, 700)} alt="Groupe de jeunes amis en extérieur" className="h-full w-full object-cover" fallbackClassName="h-full w-full bg-gradient-to-br from-ocd-orange/40 to-ocd-card" />
            </RevealItem>
            <RevealItem>
              <Card padding="none" className="p-5" interactive>
                <p className="font-display text-xl font-medium">« Dehors »</p>
                <p className="mt-2 text-sm text-ocd-muted">Sortir de sa zone, pitcher, apprendre, recommencer.</p>
              </Card>
            </RevealItem>
          </div>
          <div className="space-y-4 pt-10">
            <RevealItem>
              <m.div whileHover={{ y: -4 }} className="rounded-2xl border border-ocd-border bg-ocd-orange p-5 text-ocd-black">
                <p className="font-display text-xl font-medium">Porté par Bovann</p>
                <p className="mt-2 text-sm opacity-80">Influenceur engagé pour la jeunesse qui entreprend.</p>
              </m.div>
            </RevealItem>
            <RevealItem className="aspect-[3/4] overflow-hidden rounded-2xl border border-ocd-border">
              <Img src={unsplash(IMG.philoPortrait, 500, 700)} alt="Portrait d'une entrepreneure" className="h-full w-full object-cover" fallbackClassName="h-full w-full bg-gradient-to-br from-ocd-green/30 to-ocd-card" />
            </RevealItem>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function VideoBlock() {
  const toast = useToast()
  return (
    <section aria-labelledby="video-title" className="mx-auto max-w-6xl px-5 pb-12 md:px-8 md:pb-24">
      <Reveal>
        <RevealItem className="relative overflow-hidden rounded-3xl border border-ocd-border bg-ocd-card">
          <div className="absolute inset-0 opacity-40">
            <Img src={unsplash(IMG.video, 1400, 700)} alt="" className="h-full w-full object-cover" fallbackClassName="h-full w-full bg-ocd-card" />
          </div>
          <div className="relative flex flex-col items-center justify-center px-6 py-16 text-center md:px-8 md:py-28">
            <m.button
              type="button"
              aria-label="Lire la vidéo du mouvement"
              onClick={() => toast({ title: 'Vidéo bientôt disponible', description: 'Les reportages OCD arrivent très vite.', tone: 'info' })}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="relative flex h-16 w-16 items-center justify-center rounded-full bg-ocd-orange text-ocd-black shadow-glow md:h-20 md:w-20"
            >
              <m.span aria-hidden className="absolute inset-0 rounded-full border-2 border-ocd-orange" animate={{ scale: [1, 1.5], opacity: [0.7, 0] }} transition={{ duration: 1.8, repeat: Infinity }} />
              <Icon.Play />
            </m.button>
            <h3 id="video-title" className="mt-6 font-display text-2xl font-medium md:text-3xl">
              Regarde le mouvement en action
            </h3>
            <p className="mt-2 max-w-md text-sm text-ocd-muted md:text-base">Reportages, pitchs et coulisses des projets OCD — du marché de Dantokpa aux ateliers d'Abidjan.</p>
          </div>
        </RevealItem>
      </Reveal>
    </section>
  )
}

export function HowItWorks() {
  return (
    <section id="comment" aria-labelledby="comment-title" className="scroll-mt-16 md:border-y md:border-ocd-border md:bg-ocd-anthra md:py-24">
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-0">
        <Reveal className="max-w-2xl">
          <RevealItem>
            <Eyebrow>Parcours</Eyebrow>
          </RevealItem>
          <RevealItem as="h2">
            <span id="comment-title" className="mt-2 block font-display text-2xl font-medium md:mt-3 md:text-4xl">
              <span className="md:hidden">3 étapes</span>
              <span className="hidden md:inline">Comment ça marche</span>
            </span>
          </RevealItem>
          <RevealItem as="p" className="mt-4 hidden text-ocd-muted md:block">
            Trois étapes simples pour faire connaître ton activité et recevoir un accompagnement adapté.
          </RevealItem>
        </Reveal>
        {/* Mobile : liste compacte (maquette 02) */}
        <Reveal as="ul" className="mt-6 space-y-4 md:hidden">
          {HOW_STEPS.map((s) => (
            <RevealItem as="li" key={s.n} className="flex gap-4 rounded-2xl border border-ocd-border bg-ocd-card p-4">
              <span className={cn('font-display text-lg font-semibold', toneText[s.tone])}>{s.n}</span>
              <div>
                <p className="text-sm font-semibold">{s.title}</p>
                <p className="mt-1 text-xs text-ocd-muted">{s.mobileText}</p>
              </div>
            </RevealItem>
          ))}
        </Reveal>
        {/* Desktop : cartes (maquette 01) */}
        <Reveal as="ul" className="mt-14 hidden gap-6 md:grid md:grid-cols-3" stagger={0.12}>
          {HOW_STEPS.map((s) => (
            <RevealItem as="li" key={s.n}>
              <Card radius="3xl" padding="lg" interactive className="h-full">
                <div className={cn('flex h-12 w-12 items-center justify-center rounded-2xl font-display text-xl font-semibold', STEP_BADGE[s.tone as keyof typeof STEP_BADGE])}>{s.n}</div>
                <h3 className="mt-6 font-display text-xl font-medium">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ocd-muted">{s.text}</p>
              </Card>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

export function Sectors() {
  const AutreIcon = SECTOR_META.autre.icon
  return (
    <section id="secteurs" aria-labelledby="secteurs-title" className="mx-auto max-w-6xl scroll-mt-16 px-5 pb-12 md:px-8 md:py-24">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <RevealItem>
          <Eyebrow>Secteurs</Eyebrow>
          <h2 id="secteurs-title" className="mt-2 font-display text-2xl font-medium md:mt-3 md:text-4xl">
            Tous les terrains d'expression
          </h2>
        </RevealItem>
        <RevealItem as="p" className="max-w-sm text-sm text-ocd-muted">
          Du commerce de quartier à la startup tech — OCD accueille la diversité des vocations.
        </RevealItem>
      </Reveal>
      <Reveal as="ul" className="mt-8 grid grid-cols-2 gap-3 md:mt-12 md:grid-cols-4 md:gap-4" stagger={0.06}>
        {LANDING_SECTORS.map((key) => {
          const s = SECTOR_META[key]
          return (
            <RevealItem as="li" key={key}>
              <Card padding="none" interactive className="h-full p-4 md:p-6">
                <s.icon className="size-6 text-ocd-orange" strokeWidth={1.75} aria-hidden />
                <p className="mt-3 font-display font-medium md:mt-4">{s.label}</p>
                <p className="mt-1 text-xs text-ocd-muted">{s.hint}</p>
              </Card>
            </RevealItem>
          )
        })}
        <RevealItem as="li" className="col-span-2">
          <Card padding="none" interactive className="flex h-full items-center justify-between gap-4 p-4 md:p-6">
            <div>
              <AutreIcon className="size-6 text-ocd-orange" strokeWidth={1.75} aria-hidden />
              <p className="mt-3 font-display font-medium md:mt-4">Autre</p>
              <p className="mt-1 text-xs text-ocd-muted">Ton projet ne rentre dans aucune case ? Dis-nous.</p>
            </div>
            <ButtonLink to="/candidature" variant="cream" size="sm" className="shrink-0">
              Soumettre →
            </ButtonLink>
          </Card>
        </RevealItem>
      </Reveal>
    </section>
  )
}

export function Testimonials() {
  return (
    <section id="temoignages" aria-labelledby="temoignages-title" className="scroll-mt-16 md:border-t md:border-ocd-border md:bg-ocd-anthra md:py-24">
      <div className="mx-auto max-w-6xl px-5 pb-12 md:px-8 md:pb-0">
        <Reveal>
          <RevealItem>
            <Eyebrow>Témoignages</Eyebrow>
          </RevealItem>
          <RevealItem as="h2">
            <span id="temoignages-title" className="mt-3 hidden font-display text-4xl font-medium md:block">
              Ils sont sortis. Voici ce qui a changé.
            </span>
            <span className="sr-only md:hidden">Ils sont sortis. Voici ce qui a changé.</span>
          </RevealItem>
        </Reveal>
        <Reveal as="ul" className="-mx-5 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 scrollbar-none md:mx-0 md:mt-12 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0" stagger={0.12}>
          {TESTIMONIALS.map((t) => (
            <RevealItem as="li" key={t.name} className="w-[85%] shrink-0 snap-start md:w-auto">
              <Card padding="none" interactive className="h-full rounded-2xl p-5 md:rounded-3xl md:p-7">
                <article>
                  <div className="flex items-center gap-3">
                    <Img src={t.avatar} alt="" className="h-10 w-10 rounded-full object-cover md:h-12 md:w-12" fallbackClassName={cn('h-10 w-10 rounded-full md:h-12 md:w-12', t.tone === 'orange' ? 'bg-ocd-orange' : t.tone === 'green' ? 'bg-ocd-green' : 'bg-ocd-yellow')} />
                    <div>
                      <p className="text-sm font-semibold md:text-base">{t.name}</p>
                      <p className="text-[11px] text-ocd-muted md:text-xs">{t.meta}</p>
                    </div>
                  </div>
                  <blockquote className="mt-3 text-sm leading-relaxed text-ocd-muted md:mt-5">
                    <span className="md:hidden">{t.mobileQuote}</span>
                    <span className="hidden md:inline">{t.quote}</span>
                  </blockquote>
                  <p className="mt-4 hidden text-xs font-medium text-ocd-soft md:block">{t.result}</p>
                </article>
              </Card>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="mx-auto max-w-6xl px-5 pb-16 md:px-8 md:py-24">
      <Reveal>
        <RevealItem className="relative overflow-hidden rounded-2xl bg-ocd-grad p-6 text-ocd-black md:rounded-3xl md:border md:border-ocd-border md:bg-gradient-to-br md:from-ocd-orange md:via-ocd-soft md:to-ocd-yellow md:p-16">
          <m.div aria-hidden className="pointer-events-none absolute -right-20 -bottom-24 h-72 w-72 rounded-full bg-white/20 blur-3xl" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 8, repeat: Infinity }} />
          <div className="relative z-10 max-w-xl">
            <h2 id="cta-title" className="font-display text-xl leading-tight font-semibold md:text-5xl md:font-medium">
              Prêt à sortir ?
            </h2>
            <p className="mt-2 text-sm opacity-80 md:mt-4 md:text-lg">
              <span className="md:hidden">Soumets ton projet en quelques minutes.</span>
              <span className="hidden md:inline">Soumets ton projet en quelques minutes. L'équipe OCD te recontacte — souvent sous 48h*.</span>
            </p>
            <div className="mt-5 flex flex-wrap gap-3 md:mt-8">
              <ButtonLink to="/candidature" variant="dark" size="lg" className="w-full py-3 text-sm md:w-auto md:py-3.5 md:text-base">
                Soumettre mon projet
              </ButtonLink>
              <a href="#philosophie" className="hidden rounded-full border border-ocd-black/20 bg-white/30 px-7 py-3.5 font-medium backdrop-blur transition-transform hover:scale-[1.02] md:inline-flex">
                Découvrir le mouvement
              </a>
            </div>
            <p className="mt-4 hidden text-xs opacity-60 md:block">* Délai d'exemple pour maquette.</p>
          </div>
        </RevealItem>
      </Reveal>
    </section>
  )
}
