import { useEffect } from 'react'
import { ButtonLink, Card } from '@/components/ui'
import { Skeleton } from '@/components/ui/Skeleton'
import { ChatPanel } from '@/components/espace/ChatPanel'
import { useMyApplication } from '@/hooks/useMyApplication'
import { EspacePageHeader } from './PageHeader'

export default function CandidateMessagesPage() {
  const { data: app, loading } = useMyApplication()
  useEffect(() => {
    document.title = 'Messages — OCD'
  }, [])
  return (
    <div>
      <EspacePageHeader title="Messages" subtitle={app ? `À propos de « ${app.title} »` : undefined} />
      <div className="px-5">
        {loading && <Skeleton className="h-80" />}
        {!loading && !app && (
          <Card className="text-center">
            <p className="text-sm text-ocd-muted">La messagerie s'ouvre dès que ton projet est soumis.</p>
            <ButtonLink to="/candidature" className="mt-4" glow>
              Soumettre mon projet
            </ButtonLink>
          </Card>
        )}
        {app && <ChatPanel applicationId={app.id} tall />}
      </div>
    </div>
  )
}
