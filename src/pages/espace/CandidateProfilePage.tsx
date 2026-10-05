import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { Button, Card, TextField } from '@/components/ui'
import { useAuth } from '@/app/providers/auth-context'
import { useToast } from '@/app/providers/toast-context'
import { formatPhone } from '@/lib/format'
import { EspacePageHeader } from './PageHeader'

export default function CandidateProfilePage() {
  const { session, updateProfile, signOut } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [name, setName] = useState(session?.fullName ?? '')

  useEffect(() => {
    document.title = 'Profil — OCD'
  }, [])

  const save = (e: FormEvent) => {
    e.preventDefault()
    updateProfile({ fullName: name.trim() || undefined })
    toast({ title: 'Profil mis à jour' })
  }

  return (
    <div>
      <EspacePageHeader title="Profil" subtitle="Tes informations de contact." />
      <div className="space-y-4 px-5">
        <Card padding="sm" className="p-5">
          <form onSubmit={save} className="space-y-4">
            <TextField label="Nom complet" value={name} onChange={(e) => setName(e.target.value)} placeholder="Yao Adjoa" autoComplete="name" />
            <div>
              <p className="text-xs font-bold tracking-wider text-ocd-muted uppercase">Téléphone (WhatsApp / SMS)</p>
              <p className="mt-2 rounded-2xl border border-ocd-border bg-ocd-anthra px-4 py-3.5 text-sm">{session ? formatPhone(session.phone) : '—'}</p>
            </div>
            <Button type="submit" fullWidth size="lg">
              Enregistrer
            </Button>
          </form>
        </Card>
        <Button
          variant="outline"
          fullWidth
          size="lg"
          onClick={async () => {
            navigate('/', { replace: true })
            await signOut()
            toast({ title: 'Déconnecté', tone: 'info' })
          }}
        >
          Se déconnecter
        </Button>
      </div>
    </div>
  )
}
