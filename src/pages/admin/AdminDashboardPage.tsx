import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { m } from 'framer-motion'
import { Button, ExamplePill } from '@/components/ui'
import { Skeleton } from '@/components/ui/Skeleton'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { ApplicationsTable } from '@/components/admin/ApplicationsTable'
import { GeoBars, PipelineBars, SectorDonut } from '@/components/admin/Charts'
import { useToast } from '@/app/providers/toast-context'
import { applicationsService, statsService } from '@/services'
import { useAsync } from '@/hooks/useAsync'
import { fadeUp, staggerContainer } from '@/lib/motion'
import { cn } from '@/lib/tones'

const KPI_TONE = { cream: 'text-ocd-cream', orange: 'text-ocd-orange', yellow: 'text-ocd-yellow', green: 'text-ocd-green' } as Record<string, string>

/** Maquette 06 — dashboard back-office. */
export default function AdminDashboardPage() {
  const toast = useToast()
  const stats = useAsync(() => statsService.getDashboardStats(), [])
  const recent = useAsync(() => applicationsService.listRecentApplications(4), [])
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    document.title = 'Dashboard — OCD Admin'
  }, [])

  const exportCsv = async () => {
    setExporting(true)
    try {
      const all = await applicationsService.listApplications()
      const blob = new Blob([applicationsService.toCsv(all)], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ocd-candidatures-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
      toast({ title: 'Export CSV prêt', description: `${all.length} candidatures exportées (données d'exemple).` })
    } finally {
      setExporting(false)
    }
  }

  const s = stats.data

  return (
    <>
      <AdminHeader
        title="Dashboard"
        subtitle={`Vue d'ensemble · ${s?.weekLabel ?? 'Semaine en cours'}`}
        actions={
          <>
            <ExamplePill />
            <Button variant="solid" size="sm" className="px-4 text-xs font-semibold" loading={exporting} onClick={() => void exportCsv()}>
              Exporter CSV
            </Button>
          </>
        }
      />
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        {!s ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        ) : (
          <>
            <m.div className="grid grid-cols-2 gap-4 lg:grid-cols-4" initial="hidden" animate="show" variants={staggerContainer(0.07)}>
              {s.kpis.map((k) => (
                <m.div key={k.id} variants={fadeUp} whileHover={{ y: -3 }} className="rounded-2xl border border-ocd-border bg-ocd-card p-4 sm:p-5">
                  <p className="eyebrow text-[9px] text-ocd-muted sm:text-[10px]">{k.label}</p>
                  <p className={cn('mt-2 font-display text-2xl font-medium sm:text-3xl', KPI_TONE[k.tone])}>{k.value}</p>
                  <p className={cn('mt-1 text-xs', k.captionTone === 'green' ? 'text-ocd-green' : 'text-ocd-muted')}>{k.caption}</p>
                </m.div>
              ))}
            </m.div>

            <div className="grid gap-4 lg:grid-cols-12">
              <section aria-labelledby="geo-title" className="rounded-2xl border border-ocd-border bg-ocd-card p-6 lg:col-span-5">
                <div className="flex items-center justify-between">
                  <h2 id="geo-title" className="font-display font-medium">
                    Répartition géographique
                  </h2>
                  <span className="text-[10px] text-ocd-muted">exemple</span>
                </div>
                <GeoBars items={s.geo} />
              </section>
              <section aria-labelledby="sector-title" className="rounded-2xl border border-ocd-border bg-ocd-card p-6 lg:col-span-3">
                <h2 id="sector-title" className="font-display font-medium">
                  Par secteur
                </h2>
                <SectorDonut items={s.sectors} total={s.sectorsTotal} />
              </section>
              <section aria-labelledby="pipe-title" className="rounded-2xl border border-ocd-border bg-ocd-card p-6 lg:col-span-4">
                <div className="flex items-center justify-between">
                  <h2 id="pipe-title" className="font-display font-medium">
                    Pipeline par statut
                  </h2>
                  <Link to="/admin/pipeline" className="text-[11px] text-ocd-orange hover:underline">
                    Kanban →
                  </Link>
                </div>
                <PipelineBars items={s.pipeline} />
              </section>
            </div>
          </>
        )}

        <section aria-labelledby="recent-title" className="overflow-hidden rounded-2xl border border-ocd-border bg-ocd-card">
          <div className="flex items-center justify-between border-b border-ocd-border px-6 py-4">
            <h2 id="recent-title" className="font-display font-medium">
              Dernières candidatures
            </h2>
            <Link to="/admin/candidatures" className="text-xs font-medium text-ocd-orange hover:underline">
              Voir tout →
            </Link>
          </div>
          {recent.data ? <ApplicationsTable items={recent.data} /> : <Skeleton className="m-6 h-40" />}
          <p className="border-t border-ocd-border px-6 py-3 text-[10px] text-ocd-muted/70">* Chiffres d'exemple pour maquette — non représentatifs de données réelles.</p>
        </section>
      </div>
    </>
  )
}
