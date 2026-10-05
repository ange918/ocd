import { useNavigate } from 'react-router'
import { m } from 'framer-motion'
import type { Application } from '@/types'
import { Avatar, NeedBadge, StatusBadge } from '@/components/ui'
import { SECTOR_META } from '@/data/labels'
import { formatShortDate } from '@/lib/format'

/** Tableau « Dernières candidatures » (maquette 06) — lignes cliquables vers la fiche. */
export function ApplicationsTable({ items }: { items: Application[] }) {
  const navigate = useNavigate()
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-sm">
        <thead className="border-b border-ocd-border text-xs tracking-wider text-ocd-muted uppercase">
          <tr>
            <th scope="col" className="px-6 py-3 text-left font-medium">
              Projet
            </th>
            <th scope="col" className="px-4 py-3 text-left font-medium">
              Secteur
            </th>
            <th scope="col" className="px-4 py-3 text-left font-medium">
              Ville
            </th>
            <th scope="col" className="px-4 py-3 text-left font-medium">
              Besoin
            </th>
            <th scope="col" className="px-4 py-3 text-left font-medium">
              Statut
            </th>
            <th scope="col" className="px-4 py-3 text-left font-medium">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ocd-border">
          {items.map((a, i) => (
            <m.tr
              key={a.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              onClick={() => navigate(`/admin/projets/${a.id}`)}
              className="cursor-pointer transition-colors hover:bg-ocd-anthra/60"
            >
              <td className="px-6 py-3.5">
                <div className="flex items-center gap-3">
                  <Avatar person={a.applicant} size="sm" />
                  <div>
                    <a
                      href={`/admin/projets/${a.id}`}
                      onClick={(e) => {
                        e.preventDefault()
                        navigate(`/admin/projets/${a.id}`)
                      }}
                      className="font-medium hover:text-ocd-soft"
                    >
                      {a.title}
                    </a>
                    <p className="text-xs text-ocd-muted">{a.applicant.fullName}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3.5 text-ocd-muted">{SECTOR_META[a.sector].short}</td>
              <td className="px-4 py-3.5 text-ocd-muted">{a.city}</td>
              <td className="px-4 py-3.5">{a.needs[0] && <NeedBadge need={a.needs[0]} />}</td>
              <td className="px-4 py-3.5">
                <StatusBadge status={a.status} variant="short" />
              </td>
              <td className="px-4 py-3.5 text-xs text-ocd-muted">{formatShortDate(a.submittedAt)}</td>
            </m.tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-10 text-center text-sm text-ocd-muted">
                Aucune candidature ne correspond.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
