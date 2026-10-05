import { useState, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { useAuth } from './providers/auth-context'

/** Redirige vers /connexion si aucune session (mock aujourd'hui, Supabase Auth demain). */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { session } = useAuth()
  const location = useLocation()
  // Figé au montage : pendant l'animation de sortie, ce composant peut être re-rendu
  // avec la nouvelle URL — il ne faut pas reconstruire `next` (sinon boucle de redirection).
  const [from] = useState(() => location.pathname + location.search)
  if (!session) {
    return <Navigate to={`/connexion?next=${encodeURIComponent(from)}`} replace />
  }
  return <>{children}</>
}
