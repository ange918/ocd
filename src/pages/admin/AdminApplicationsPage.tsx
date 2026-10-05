import { useEffect, useState } from 'react'
import { ExamplePill, Icon } from '@/components/ui'
import { Skeleton } from '@/components/ui/Skeleton'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { ApplicationsTable } from '@/components/admin/ApplicationsTable'
import { FilterPill } from '@/components/admin/FilterPill'
import { applicationsService } from '@/services'
import { useAsync } from '@/hooks/useAsync'
import { STATUS_META, STATUS_ORDER } from '@/data/labels'

/** Liste complète des candidatures (entrée « Candidatures » de la sidebar). */
export default function AdminApplicationsPage() {
  const { data } = useAsync(() => applicationsService.listApplications(), [])
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  useEffect(() => {
    document.title = 'Candidatures — OCD Admin'
  }, [])

  const items = applicationsService
    .filterApplications(data ?? [], { q })
    .filter((a) => !status || a.status === status)
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))

  return (
    <>
      <AdminHeader title="Candidatures" subtitle={`${items.length} dossier(s)`} actions={<ExamplePill />}>
        <div className="mt-4 flex flex-wrap items-center gap-2 pb-1">
          <label className="flex w-full items-center gap-2 rounded-xl border border-ocd-border bg-ocd-card px-3 py-2 focus-within:border-ocd-orange sm:w-64">
            <Icon.Search className="text-ocd-muted" />
            <span className="sr-only">Rechercher</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un projet…" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
          </label>
          <FilterPill label="Statut" value={status} onChange={setStatus} options={STATUS_ORDER.map((s) => ({ value: s, label: STATUS_META[s].short }))} />
        </div>
      </AdminHeader>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="overflow-hidden rounded-2xl border border-ocd-border bg-ocd-card">{data ? <ApplicationsTable items={items} /> : <Skeleton className="m-6 h-60" />}</div>
      </div>
    </>
  )
}
