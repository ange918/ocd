import { useEffect } from 'react'
import { Paperclip, Play } from 'lucide-react'
import { ButtonLink, Card, Img, NeedBadge, StatusBadge } from '@/components/ui'
import { Skeleton } from '@/components/ui/Skeleton'
import { StatusTimeline } from '@/components/ui/StatusTimeline'
import { SECTOR_META, STAGE_META } from '@/data/labels'
import { useMyApplication } from '@/hooks/useMyApplication'
import { formatDate } from '@/lib/format'
import { EspacePageHeader } from './PageHeader'

/** Détail du dossier candidat (onglet « Dossier » de la barre basse). */
export default function CandidateDossierPage() {
  const { data: app, loading } = useMyApplication()
  useEffect(() => {
    document.title = 'Mon dossier — OCD'
  }, [])

  return (
    <div>
      <EspacePageHeader title="Mon dossier" subtitle="Ce que l'équipe OCD voit de ton projet." />
      <div className="space-y-4 px-5">
        {loading && <Skeleton className="h-60" />}
        {!loading && !app && (
          <Card className="text-center">
            <p className="text-sm text-ocd-muted">Aucun dossier pour l'instant.</p>
            <ButtonLink to="/candidature" className="mt-4" glow>
              Soumettre mon projet
            </ButtonLink>
          </Card>
        )}
        {app && (
          <>
            <Card padding="sm" className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="eyebrow text-ocd-soft">Projet · {SECTOR_META[app.sector].short}</p>
                  <h2 className="mt-1 font-display text-xl font-medium">{app.title}</h2>
                  <p className="mt-1 text-xs text-ocd-muted">
                    {app.city}, {app.country} · Soumis le {formatDate(app.submittedAt)}
                  </p>
                </div>
                <StatusBadge status={app.status} size="sm" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-ocd-border bg-ocd-anthra px-2.5 py-1 text-xs">Stade · {STAGE_META[app.stage].label}</span>
                {app.needs.map((n) => (
                  <NeedBadge key={n} need={n} className="px-2.5 py-1" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ocd-muted">{app.description}</p>
            </Card>
            {app.pendingRequest && (
              <div className="rounded-2xl border border-ocd-orange/30 bg-ocd-orange/5 p-4">
                <p className="flex items-center gap-1.5 text-sm font-semibold">
                  <Paperclip className="size-4 text-ocd-orange" strokeWidth={1.75} aria-hidden />
                  Pièce complémentaire demandée
                </p>
                <p className="mt-1 text-xs text-ocd-muted">{app.pendingRequest}</p>
                <ButtonLink to="/espace/messages" variant="soft" size="sm" className="mt-3">
                  Répondre dans la messagerie
                </ButtonLink>
              </div>
            )}
            {app.media.length > 0 && (
              <Card padding="sm" className="p-5">
                <h2 className="font-display font-medium">Médias envoyés</h2>
                <ul className="mt-3 grid grid-cols-3 gap-2">
                  {app.media.map((f) => (
                    <li key={f.id} className="flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-ocd-border bg-ocd-anthra">
                      {f.kind === 'image' && f.url ? <Img src={f.url} alt={f.name} className="h-full w-full object-cover" fallbackClassName="h-full w-full bg-ocd-orange/20" /> : <span className="flex flex-col items-center gap-1 px-1 text-center text-[10px] text-ocd-muted"><Play className="size-4 text-ocd-orange" strokeWidth={1.75} aria-hidden />{f.name}</span>}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
            <Card padding="sm" className="p-5">
              <h2 className="font-display font-medium">Suivi du statut</h2>
              <StatusTimeline status={app.status} history={app.history} className="mt-5" />
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
