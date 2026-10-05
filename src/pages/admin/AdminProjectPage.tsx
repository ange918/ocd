import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { AnimatePresence, m } from 'framer-motion'
import { Search } from 'lucide-react'
import type { Application, ApplicationStatus, HistoryEvent } from '@/types'
import { Avatar, Button, ButtonLink, Eyebrow, ExamplePill, Img, NeedBadge, StatusBadge } from '@/components/ui'
import { Skeleton } from '@/components/ui/Skeleton'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { useToast } from '@/app/providers/toast-context'
import { applicationsService } from '@/services'
import { useAsync } from '@/hooks/useAsync'
import { SECTOR_META, STAGE_META, STATUS_META, STATUS_ORDER } from '@/data/labels'
import { formatDateTime, formatPhone } from '@/lib/format'
import { cn } from '@/lib/tones'

const STATUS_BTN: Record<ApplicationStatus, { active: string; hover: string }> = {
  soumis: { active: 'border-2 border-ocd-muted bg-ocd-muted/10 text-ocd-cream', hover: 'text-ocd-muted hover:border-ocd-muted' },
  en_etude: { active: 'border-2 border-ocd-yellow bg-ocd-yellow/10 text-ocd-yellow', hover: 'hover:border-ocd-yellow hover:text-ocd-yellow' },
  preselectionne: { active: 'border-2 border-ocd-soft bg-ocd-soft/10 text-ocd-soft', hover: 'hover:border-ocd-soft hover:text-ocd-soft' },
  accompagne: { active: 'border-2 border-ocd-green bg-ocd-green/10 text-ocd-green', hover: 'hover:border-ocd-green hover:text-ocd-green' },
  cloture: { active: 'border-2 border-ocd-muted bg-ocd-muted/10 text-ocd-cream', hover: 'text-ocd-muted hover:border-ocd-muted' },
}

function historyDot(ev: HistoryEvent): string {
  if (ev.kind === 'request') return 'bg-ocd-orange'
  if (ev.kind === 'submitted') return 'bg-ocd-green'
  switch (ev.status) {
    case 'en_etude':
      return 'bg-ocd-yellow'
    case 'preselectionne':
      return 'bg-ocd-soft'
    case 'accompagne':
      return 'bg-ocd-green'
    default:
      return 'bg-ocd-muted'
  }
}

function nextStatus(s: ApplicationStatus): ApplicationStatus {
  const i = STATUS_ORDER.indexOf(s)
  return STATUS_ORDER[Math.min(i + 1, STATUS_ORDER.length - 1)]!
}

/** Maquette 08 — fiche projet détaillée. */
export default function AdminProjectPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { data: app, setData, loading } = useAsync(() => applicationsService.getApplication(id), [id])
  const [selected, setSelected] = useState<ApplicationStatus | null>(null)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [reminding, setReminding] = useState(false)

  useEffect(() => {
    if (app) {
      document.title = `${app.title} — OCD Admin`
      setSelected(app.status)
    }
  }, [app?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading && !app) {
    return (
      <div className="space-y-4 p-8">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-48" />
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (!app) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
        <Search className="size-8 text-ocd-muted" strokeWidth={1.75} aria-hidden />
        <h1 className="font-display text-2xl font-medium">Projet introuvable</h1>
        <p className="text-sm text-ocd-muted">Ce dossier n'existe pas ou a été supprimé.</p>
        <ButtonLink to="/admin/candidatures" variant="secondary">
          Retour aux candidatures
        </ButtonLink>
      </div>
    )
  }

  const sel = selected ?? app.status
  const firstName = app.applicant.fullName.split(' ')[0] ?? app.applicant.fullName
  const previewStatus = sel === app.status ? nextStatus(app.status) : sel
  const preview = `« Bonjour ${firstName}, ton dossier ${app.title} est passé en ${STATUS_META[previewStatus].short}. L'équipe OCD te recontacte bientôt. — OCD »`

  const patch = (fn: (a: Application) => Application) => setData((a) => (a ? fn(a) : a))

  const save = async () => {
    if (sel === app.status) {
      toast({ title: 'Aucun changement de statut', description: 'Choisis un nouveau statut avant d’enregistrer.', tone: 'info' })
      return
    }
    setSaving(true)
    try {
      const updated = await applicationsService.updateApplicationStatus(app.id, sel)
      setData(updated)
      toast({ title: `Statut enregistré : ${STATUS_META[sel].long}`, description: `${firstName} est notifié·e par WhatsApp (simulation).` })
    } catch {
      toast({ title: 'Enregistrement impossible', tone: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const addNote = async (e: FormEvent) => {
    e.preventDefault()
    if (!note.trim()) return
    const created = await applicationsService.addInternalNote(app.id, note)
    patch((a) => ({ ...a, notes: [created, ...a.notes] }))
    setNote('')
  }

  const remind = async () => {
    setReminding(true)
    try {
      const ev = await applicationsService.sendWhatsAppReminder(app.id)
      patch((a) => ({ ...a, history: [ev, ...a.history] }))
      toast({ title: 'Relance WhatsApp envoyée', description: formatPhone(app.applicant.phone) })
    } finally {
      setReminding(false)
    }
  }

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast({ title: 'Lien copié', description: 'Partage-le avec un membre de l’équipe OCD.' })
    } catch {
      toast({ title: 'Copie impossible', description: window.location.href, tone: 'info' })
    }
  }

  const images = app.media

  return (
    <>
      <AdminHeader
        title={
          <nav aria-label="Fil d'Ariane" className="flex items-center gap-3 font-sans text-sm font-normal text-ocd-muted">
            <Link to="/admin/candidatures" className="hover:text-ocd-cream">
              Candidatures
            </Link>
            <span aria-hidden>/</span>
            <span className="font-medium text-ocd-cream" aria-current="page">
              {app.title}
            </span>
          </nav>
        }
        actions={
          <>
            <ExamplePill />
            <Button variant="outline" size="sm" className="px-4 text-xs" onClick={() => void share()}>
              Partager
            </Button>
          </>
        }
      />

      <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-12 lg:p-8">
        <div className="space-y-6 lg:col-span-8">
          {/* En-tête projet */}
          <m.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-ocd-border bg-ocd-card p-5 sm:p-6">
            <div className="flex flex-col-reverse items-start justify-between gap-4 sm:flex-row sm:gap-6">
              <div className="flex items-start gap-4">
                <Avatar person={app.applicant} size="xl" square />
                <div>
                  <Eyebrow className="text-ocd-soft">Projet · {SECTOR_META[app.sector].short}</Eyebrow>
                  <h1 className="mt-1 font-display text-2xl font-medium sm:text-3xl">{app.title}</h1>
                  <p className="mt-1 text-sm text-ocd-muted">
                    {app.applicant.fullName} · {app.city}, {app.country} · {formatPhone(app.applicant.phone)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full border border-ocd-border bg-ocd-anthra px-2.5 py-1 text-xs">Stade · {STAGE_META[app.stage].label}</span>
                    {app.needs.map((n) => (
                      <NeedBadge key={n} need={n} className="px-2.5 py-1" />
                    ))}
                  </div>
                </div>
              </div>
              <StatusBadge status={app.status} size="md" className="font-semibold" />
            </div>
            <p className="mt-5 text-sm leading-relaxed text-ocd-muted">{app.description}</p>
          </m.section>

          {/* Galerie */}
          <m.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} aria-labelledby="gallery-title" className="rounded-2xl border border-ocd-border bg-ocd-card p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 id="gallery-title" className="font-display font-medium">
                Pièces jointes &amp; galerie
              </h2>
              <span className="text-xs text-ocd-muted">{images.length} fichier(s)</span>
            </div>
            {images.length > 0 ? (
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {images.map((f) => (
                  <m.li key={f.id} whileHover={{ scale: 1.02 }} className="aspect-[4/3] overflow-hidden rounded-xl border border-ocd-border bg-ocd-anthra">
                    {f.kind === 'image' && f.url ? (
                      <Img src={f.url} alt={f.name} className="h-full w-full object-cover" fallbackClassName="h-full w-full bg-ocd-orange/20" />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ocd-orange/20 text-ocd-orange" aria-hidden>
                          ▶
                        </span>
                        <span className="text-xs text-ocd-muted">
                          {f.name}
                          {f.sizeLabel ? ` · ${f.sizeLabel}` : ''}
                        </span>
                      </div>
                    )}
                  </m.li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 rounded-xl border border-dashed border-ocd-border p-6 text-center text-xs text-ocd-muted">Aucun média envoyé.</p>
            )}
            {app.pendingRequest && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-ocd-border bg-ocd-anthra/50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium">Demande en cours</p>
                  <p className="text-xs text-ocd-muted">{app.pendingRequest}</p>
                </div>
                <Button variant="soft" size="sm" className="px-3 py-1.5 text-xs font-semibold" loading={reminding} onClick={() => void remind()}>
                  Relancer WhatsApp
                </Button>
              </div>
            )}
          </m.section>

          {/* Notes internes */}
          <m.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} aria-labelledby="notes-title" className="rounded-2xl border border-ocd-border bg-ocd-card p-5 sm:p-6">
            <h2 id="notes-title" className="font-display font-medium">
              Notes internes
            </h2>
            <p className="mt-1 text-xs text-ocd-muted">Visibles uniquement par l'équipe OCD — jamais envoyées au candidat.</p>
            <ul className="mt-4 space-y-3">
              <AnimatePresence initial={false}>
                {app.notes.map((n) => (
                  <m.li key={n.id} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden rounded-xl border border-ocd-border bg-ocd-anthra p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold text-ocd-soft">{n.author}</p>
                      <p className="text-[10px] text-ocd-muted">{formatDateTime(n.createdAt)}</p>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-ocd-muted">{n.body}</p>
                  </m.li>
                ))}
              </AnimatePresence>
              {app.notes.length === 0 && <li className="text-xs text-ocd-muted">Aucune note pour l'instant.</li>}
            </ul>
            <form onSubmit={(e) => void addNote(e)} className="mt-4 flex gap-2">
              <label htmlFor="new-note" className="sr-only">
                Ajouter une note interne
              </label>
              <input
                id="new-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ajouter une note interne…"
                className="min-w-0 flex-1 rounded-xl border border-ocd-border bg-ocd-anthra px-4 py-2.5 text-sm outline-none focus:border-ocd-orange focus:ring-2 focus:ring-ocd-orange/30"
              />
              <Button type="submit" variant="solid" rounded="xl" size="sm" className="px-4 py-2.5 font-semibold" disabled={!note.trim()}>
                Ajouter
              </Button>
            </form>
          </m.section>

          {/* Historique */}
          <m.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} aria-labelledby="history-title" className="rounded-2xl border border-ocd-border bg-ocd-card p-5 sm:p-6">
            <h2 id="history-title" className="font-display font-medium">
              Historique
            </h2>
            <ol className="relative mt-5 space-y-5 pl-6">
              <span aria-hidden className="absolute top-1 bottom-1 left-[5px] w-px bg-ocd-border" />
              <AnimatePresence initial={false}>
                {app.history.map((ev) => (
                  <m.li key={ev.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="relative">
                    <span aria-hidden className={cn('absolute top-1 -left-6 h-3 w-3 rounded-full', historyDot(ev))} />
                    <p className="text-sm font-medium">{ev.label}</p>
                    <p className="text-xs text-ocd-muted">
                      {formatDateTime(ev.at)} · {ev.meta}
                    </p>
                  </m.li>
                ))}
              </AnimatePresence>
            </ol>
          </m.section>
        </div>

        {/* Actions statut */}
        <aside className="lg:col-span-4" aria-labelledby="actions-title">
          <m.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-ocd-border bg-ocd-card p-5 sm:p-6 lg:sticky lg:top-6">
            <Eyebrow className="text-ocd-soft">Changer le statut</Eyebrow>
            <h2 id="actions-title" className="mt-2 font-display text-xl font-medium">
              Actions rapides
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-ocd-muted">
              Le candidat sera notifié par <span className="font-medium text-ocd-green">WhatsApp</span> à chaque changement de statut.
            </p>

            <div className="mt-5 space-y-2" role="radiogroup" aria-label="Nouveau statut">
              {STATUS_ORDER.map((s) => {
                const isCurrent = s === app.status
                const isSel = s === sel
                return (
                  <m.button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={isSel}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelected(s)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition-colors',
                      isSel || isCurrent ? STATUS_BTN[s].active : cn('border border-ocd-border bg-ocd-anthra font-medium', STATUS_BTN[s].hover),
                      isCurrent && !isSel && 'opacity-70',
                    )}
                  >
                    {STATUS_META[s].long}
                    {isCurrent && <span className="text-xs">actuel</span>}
                    {isSel && !isCurrent && <span className="text-xs">sélectionné</span>}
                  </m.button>
                )
              })}
            </div>

            <div className="mt-5 rounded-xl border border-ocd-orange/30 bg-ocd-orange/5 p-4">
              <p className="text-xs font-semibold text-ocd-soft">Notification WhatsApp</p>
              <AnimatePresence mode="wait">
                <m.p key={previewStatus} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mt-1 text-[11px] leading-relaxed text-ocd-muted">
                  Aperçu : {preview}
                </m.p>
              </AnimatePresence>
            </div>

            <div className="mt-5">
              <label htmlFor="status-select" className="eyebrow text-ocd-muted">
                Ou via menu
              </label>
              <div className="relative mt-2">
                <select
                  id="status-select"
                  value={sel}
                  onChange={(e) => setSelected(e.target.value as ApplicationStatus)}
                  className="w-full appearance-none rounded-xl border border-ocd-border bg-ocd-anthra px-4 py-3 text-sm outline-none focus:border-ocd-orange"
                >
                  {STATUS_ORDER.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_META[s].long}
                    </option>
                  ))}
                </select>
                <span aria-hidden className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ocd-muted">
                  ▾
                </span>
              </div>
            </div>

            <Button fullWidth glow size="md" className="mt-5 py-3.5" loading={saving} onClick={() => void save()}>
              Enregistrer &amp; notifier
            </Button>
            <Button variant="outline" fullWidth size="md" className="mt-2 py-3 text-ocd-muted" onClick={() => navigate('/admin/messagerie')}>
              Ouvrir la messagerie
            </Button>
          </m.div>
        </aside>
      </div>
    </>
  )
}
