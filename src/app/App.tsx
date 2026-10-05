import { RouterProvider } from 'react-router'
import { LazyMotion, MotionConfig } from 'framer-motion'
import { AuthProvider } from './providers/AuthProvider'
import { ToastProvider } from './providers/ToastProvider'
import { router } from './router'

// Les features framer-motion (animations, drag, layout) sont chargées en différé
// pour alléger le premier rendu sur connexion lente.
const loadMotionFeatures = () => import('@/lib/motion-features').then((mod) => mod.default)

export default function App() {
  return (
    <LazyMotion features={loadMotionFeatures} strict>
      {/* reducedMotion="user" : respecte prefers-reduced-motion pour toutes les animations */}
      <MotionConfig reducedMotion="user">
        <AuthProvider>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </AuthProvider>
      </MotionConfig>
    </LazyMotion>
  )
}
