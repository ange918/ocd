import { createContext, useContext } from 'react'
import type { Session } from '@/types'

export interface AuthContextValue {
  session: Session | null
  /** Numéro en attente de vérification OTP */
  pendingPhone: string | null
  setPendingPhone: (phone: string | null) => void
  signIn: (session: Session) => void
  signOut: () => Promise<void>
  updateProfile: (patch: Partial<Pick<Session, 'fullName'>>) => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé dans <AuthProvider>')
  return ctx
}
