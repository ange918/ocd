import { useCallback, useMemo, useState, type ReactNode } from 'react'
import type { Session } from '@/types'
import { authService } from '@/services'
import { AuthContext, type AuthContextValue } from './auth-context'

const PENDING_KEY = 'ocd.pendingPhone'

function readPending(): string | null {
  try {
    return sessionStorage.getItem(PENDING_KEY)
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => authService.readSession())
  const [pendingPhone, setPending] = useState<string | null>(readPending)

  const setPendingPhone = useCallback((phone: string | null) => {
    setPending(phone)
    try {
      if (phone) sessionStorage.setItem(PENDING_KEY, phone)
      else sessionStorage.removeItem(PENDING_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  const signIn = useCallback((s: Session) => {
    setSession(s)
    authService.saveSession(s)
  }, [])

  const signOut = useCallback(async () => {
    await authService.signOut()
    setSession(null)
  }, [])

  const updateProfile = useCallback((patch: Partial<Pick<Session, 'fullName'>>) => {
    setSession((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...patch }
      authService.saveSession(next)
      return next
    })
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ session, pendingPhone, setPendingPhone, signIn, signOut, updateProfile }),
    [session, pendingPhone, setPendingPhone, signIn, signOut, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
