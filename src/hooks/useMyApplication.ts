import { useAuth } from '@/app/providers/auth-context'
import { applicationsService } from '@/services'
import { useAsync } from './useAsync'

/** Dossier du candidat connecté. */
export function useMyApplication() {
  const { session } = useAuth()
  const phone = session?.phone ?? ''
  return useAsync(() => (phone ? applicationsService.getMyApplication(phone) : Promise.resolve(null)), [phone])
}
