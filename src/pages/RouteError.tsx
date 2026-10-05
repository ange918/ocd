import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import { LogoMark } from '@/components/ui'

/** Erreur inattendue (chunk non chargé hors ligne, exception…). */
export default function RouteError() {
  const error = useRouteError()
  const offline = typeof navigator !== 'undefined' && !navigator.onLine
  const message = isRouteErrorResponse(error) ? `${error.status} — ${error.statusText}` : error instanceof Error ? error.message : 'Erreur inconnue'
  return (
    <main id="contenu" className="flex min-h-dvh flex-col items-center justify-center gap-5 px-6 text-center">
      <LogoMark className="h-10" />
      <h1 className="font-display text-3xl font-medium">{offline ? 'Connexion perdue' : 'Oups, quelque chose a coincé'}</h1>
      <p className="max-w-sm text-sm text-ocd-muted">
        {offline ? 'Vérifie ta connexion internet puis réessaie.' : 'Recharge la page. Si le problème persiste, contacte l’équipe OCD.'}
      </p>
      <p className="text-[11px] text-ocd-muted/60">{message}</p>
      <div className="flex gap-3">
        <button type="button" onClick={() => window.location.reload()} className="rounded-full bg-ocd-grad px-6 py-3 text-sm font-medium text-ocd-black">
          Recharger
        </button>
        <Link to="/" className="rounded-full border border-ocd-border px-6 py-3 text-sm">
          Accueil
        </Link>
      </div>
    </main>
  )
}
