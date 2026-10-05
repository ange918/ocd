import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import type { Application, ApplicationStatus } from '@/types'
import { ExamplePill, Icon } from '@/components/ui'
import { Skeleton } from '@/components/ui/Skeleton'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { FilterPill } from '@/components/admin/FilterPill'
import { KanbanBoard } from '@/components/kanban/KanbanBoard'
import { useToast } from '@/app/providers/toast-context'
import { applicationsService } from '@/services'
import { useAsync } from '@/hooks/useAsync'
import { NEED_META, NEEDS, SECTOR_META, SECTORS, STAGE_META, STAGES, STATUS_META } from '@/data/labels'

const DATE_OPTIONS = [
  { value: '7', label: '7 j' },
  { value: '30', label: '30 j' },
  { value: '90', label: '90 j' },
]

/** Maquette 07 — pipeline Kanban (glisser-déposer = changement de statut). */
export default function AdminPipelinePage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { data, setData, loading } = useAsync(() => applicationsService.listApplications(), [])
  const [q, setQ] = useState('')
  const [sector, setSector] = useState('')
  const [city, setCity] = useState('')
  const [need, setNeed] = useState('')
  const [stage, setStage] = useState('')
  const [days, setDays] = useState('')

  useEffect(() => {
    document.title = 'Pipeline Kanban — OCD Admin'
  }, [])

  const all = data ?? []
  const cities = useMemo(() => Array.from(new Set(all.map((a) => a.city))).sort().map((c) => ({ value: c, label: c })), [all])
  const visible = applicationsService.filterApplications(all, { q, sector, city, need, stage, days: Number(days) || 0 })

  const move = async (id: string, status: ApplicationStatus) => {
    const before = all
    const target = all.find((a) => a.id === id)
    if (!target || target.status === status) return
    // mise à jour optimiste : la carte change de colonne immédiatement
    setData((list) => {
      const rest = (list ?? []).filter((a) => a.id !== id)
      const moved: Application = { ...target, status }
      return [...rest, moved]
    })
    try {
      await applicationsService.moveApplication(id, status)
      toast({ title: `« ${target.title} » → ${STATUS_META[status].column}`, description: `${target.applicant.fullName} est notifié·e par WhatsApp (simulation).` })
    } catch {
      setData(before)
      toast({ title: 'Déplacement annulé', description: 'Le statut n’a pas pu être enregistré.', tone: 'error' })
    }
  }

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col lg:min-h-dvh">
      <AdminHeader title="Pipeline Kanban" subtitle="Glisse les cartes pour changer de statut · le candidat est notifié par WhatsApp" actions={<ExamplePill />}>
        <div className="mt-4 flex flex-wrap items-center gap-2 pb-1">
          <label className="flex w-full items-center gap-2 rounded-xl border border-ocd-border bg-ocd-card px-3 py-2 focus-within:border-ocd-orange sm:w-64">
            <Icon.Search className="text-ocd-muted" />
            <span className="sr-only">Rechercher un projet</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un projet…" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
          </label>
          <FilterPill label="Secteur" value={sector} onChange={setSector} options={SECTORS.map((s) => ({ value: s, label: SECTOR_META[s].short }))} />
          <FilterPill label="Ville" value={city} onChange={setCity} options={cities} />
          <FilterPill label="Besoin" value={need} onChange={setNeed} options={NEEDS.map((n) => ({ value: n, label: NEED_META[n].label }))} />
          <FilterPill label="Stade" value={stage} onChange={setStage} options={STAGES.map((s) => ({ value: s, label: STAGE_META[s].label }))} />
          <FilterPill label="Date" value={days} onChange={setDays} options={DATE_OPTIONS} allLabel="Tout" />
        </div>
      </AdminHeader>

      <div className="flex-1 overflow-x-auto p-4 sm:p-6">
        {loading && !data ? (
          <div className="flex gap-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-80 w-64 shrink-0" />
            ))}
          </div>
        ) : (
          <KanbanBoard applications={visible} onMove={(id, s) => void move(id, s)} onOpen={(id) => navigate(`/admin/projets/${id}`)} />
        )}
        <p className="mt-4 text-[10px] text-ocd-muted/60">* Accra inclus à titre d'exemple géo élargi · chiffres &amp; projets fictifs pour maquette. Sur mobile : appui long sur une carte pour la déplacer.</p>
      </div>
    </div>
  )
}
