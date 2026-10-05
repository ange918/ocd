import { Suspense } from 'react'
import { useLocation, useOutlet } from 'react-router'
import { AnimatePresence, m, useReducedMotion, type Variants } from 'framer-motion'
import { PageLoader } from '@/components/ui'

export type TransitionKind = 'fade' | 'rise' | 'slide'

const VARIANTS: Record<TransitionKind, Variants> = {
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
  rise: { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } },
  slide: { initial: { opacity: 0, x: 28 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -28 } },
}
const REDUCED: Variants = VARIANTS.fade

interface Props {
  /** Clé d'animation : par défaut le pathname (une transition par page). */
  getKey?: (pathname: string) => string
  kind?: TransitionKind
  className?: string
}

/**
 * <Outlet /> animé : AnimatePresence sur le changement de route.
 * Garde l'ancienne page montée pendant sa sortie (mode « wait »).
 */
export function AnimatedOutlet({ getKey, kind = 'rise', className }: Props) {
  const location = useLocation()
  const outlet = useOutlet()
  const reduce = useReducedMotion()
  const key = getKey ? getKey(location.pathname) : location.pathname

  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        key={key}
        className={className}
        variants={reduce ? REDUCED : VARIANTS[kind]}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <Suspense fallback={<PageLoader />}>{outlet}</Suspense>
      </m.div>
    </AnimatePresence>
  )
}
