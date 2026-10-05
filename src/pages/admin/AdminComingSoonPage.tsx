import { useEffect } from 'react'
import { m } from 'framer-motion'
import { Wrench } from 'lucide-react'
import { ButtonLink } from '@/components/ui'
import { AdminHeader } from '@/components/admin/AdminHeader'

export default function AdminComingSoonPage({ title }: { title: string }) {
  useEffect(() => {
    document.title = `${title} — OCD Admin`
  }, [title])
  return (
    <>
      <AdminHeader title={title} subtitle="Module en préparation" />
      <m.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="m-4 rounded-2xl border border-dashed border-ocd-border bg-ocd-card/60 p-10 text-center sm:m-8">
        <Wrench className="mx-auto size-8 text-ocd-orange" strokeWidth={1.75} aria-hidden />
        <h2 className="mt-3 font-display text-xl font-medium">Bientôt disponible</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-ocd-muted">Cet écran n'a pas encore de maquette. Il sera branché sur Supabase avec le reste du back-office.</p>
        <ButtonLink to="/admin/pipeline" variant="secondary" className="mt-5">
          Aller au pipeline
        </ButtonLink>
      </m.div>
    </>
  )
}
