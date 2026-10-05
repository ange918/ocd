import { AnimatedOutlet } from '../AnimatedOutlet'

/** Écrans plein écran mobile (connexion, OTP, formulaire) — colonne centrée sur desktop. */
export default function AuthLayout() {
  return (
    <div className="relative min-h-dvh overflow-x-hidden">
      <div aria-hidden className="pointer-events-none fixed -top-40 left-1/2 hidden h-[520px] w-[720px] -translate-x-1/2 grad-orb opacity-40 md:block" />
      <main id="contenu" className="relative mx-auto flex min-h-dvh w-full max-w-[440px] flex-col md:py-8">
        <AnimatedOutlet kind="slide" className="flex flex-1 flex-col md:rounded-[32px] md:border md:border-ocd-border md:bg-ocd-black md:shadow-card" />
      </main>
    </div>
  )
}
