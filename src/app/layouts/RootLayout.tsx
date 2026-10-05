import { ScrollRestoration } from 'react-router'
import { AnimatedOutlet } from '../AnimatedOutlet'

/** Regroupe les routes par « univers » pour animer seulement quand on change de layout. */
function groupOf(pathname: string): string {
  if (pathname.startsWith('/admin')) return 'admin'
  if (pathname.startsWith('/espace')) return 'espace'
  if (pathname.startsWith('/connexion') || pathname.startsWith('/candidature')) return 'auth'
  return 'public'
}

export default function RootLayout() {
  return (
    <>
      <a href="#contenu" className="sr-only z-[200] rounded-full bg-ocd-cream px-4 py-2 text-sm font-semibold text-ocd-black focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Aller au contenu
      </a>
      <AnimatedOutlet getKey={groupOf} kind="fade" />
      <ScrollRestoration />
    </>
  )
}
