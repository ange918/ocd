import { useEffect } from 'react'
import { Link, useParams } from 'react-router'
import { Eyebrow } from '@/components/ui'
import { LEGAL_DOCS, LEGAL_LINKS, type LegalSlug } from '@/data/legal'
import NotFoundPage from './NotFoundPage'

export default function LegalPage() {
  const { slug } = useParams()
  const doc = slug ? LEGAL_DOCS[slug as LegalSlug] : undefined

  useEffect(() => {
    if (doc) document.title = `${doc.title} — OCD`
  }, [doc])

  if (!doc) return <NotFoundPage />
  return (
    <article className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-20">
      <Eyebrow>Légal</Eyebrow>
      <h1 className="mt-3 font-display text-3xl font-medium md:text-5xl">{doc.title}</h1>
      <p className="mt-4 text-ocd-muted">{doc.intro}</p>
      <p className="mt-2 text-xs text-ocd-muted/85">Dernière mise à jour : octobre 2026</p>
      <div className="mt-10 space-y-8">
        {doc.sections.map((sec) => (
          <section key={sec.title}>
            <h2 className="font-display text-xl font-medium">{sec.title}</h2>
            <div className="mt-3 space-y-2 text-sm leading-relaxed text-ocd-muted md:text-base">
              {sec.body.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
      <nav aria-label="Autres pages légales" className="mt-14 flex flex-wrap gap-3 border-t border-ocd-border pt-6 text-sm">
        {LEGAL_LINKS.filter((l) => l.slug !== slug).map((l) => (
          <Link key={l.slug} to={`/${l.slug}`} className="rounded-full border border-ocd-border px-4 py-2 hover:border-ocd-muted">
            {l.label}
          </Link>
        ))}
      </nav>
    </article>
  )
}
