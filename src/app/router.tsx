import { lazy } from 'react'
import { createBrowserRouter } from 'react-router'
import RootLayout from './layouts/RootLayout'
import PublicLayout from './layouts/PublicLayout'
import AuthLayout from './layouts/AuthLayout'
import { RequireAuth } from './RequireAuth'
import RouteError from '@/pages/RouteError'

/* Découpage par route (React.lazy) : chaque écran est un chunk séparé. */
const LandingPage = lazy(() => import('@/pages/public/LandingPage'))
const NotFoundPage = lazy(() => import('@/pages/public/NotFoundPage'))
const PhoneLoginPage = lazy(() => import('@/pages/auth/PhoneLoginPage'))
const OtpPage = lazy(() => import('@/pages/auth/OtpPage'))
const CandidaturePage = lazy(() => import('@/pages/candidature/CandidaturePage'))

const CandidateLayout = lazy(() => import('./layouts/CandidateLayout'))
const CandidateDashboardPage = lazy(() => import('@/pages/espace/CandidateDashboardPage'))
const CandidateDossierPage = lazy(() => import('@/pages/espace/CandidateDossierPage'))
const CandidateMessagesPage = lazy(() => import('@/pages/espace/CandidateMessagesPage'))
const CandidateProfilePage = lazy(() => import('@/pages/espace/CandidateProfilePage'))

const AdminLayout = lazy(() => import('./layouts/AdminLayout'))
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'))
const AdminPipelinePage = lazy(() => import('@/pages/admin/AdminPipelinePage'))
const AdminApplicationsPage = lazy(() => import('@/pages/admin/AdminApplicationsPage'))
const AdminProjectPage = lazy(() => import('@/pages/admin/AdminProjectPage'))
const AdminComingSoonPage = lazy(() => import('@/pages/admin/AdminComingSoonPage'))

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { index: true, element: <LandingPage /> }, // 01 + 02
          { path: '*', element: <NotFoundPage /> },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          { path: 'connexion', element: <PhoneLoginPage /> }, // 03a
          { path: 'connexion/code', element: <OtpPage /> }, // 03b
          {
            path: 'candidature', // 04a / 04b / 04c (?etape=1|2|3)
            element: (
              <RequireAuth>
                <CandidaturePage />
              </RequireAuth>
            ),
          },
        ],
      },
      {
        path: 'espace', // 05
        element: (
          <RequireAuth>
            <CandidateLayout />
          </RequireAuth>
        ),
        children: [
          { index: true, element: <CandidateDashboardPage /> },
          { path: 'dossier', element: <CandidateDossierPage /> },
          { path: 'messages', element: <CandidateMessagesPage /> },
          { path: 'profil', element: <CandidateProfilePage /> },
        ],
      },
      {
        path: 'admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> }, // 06
          { path: 'pipeline', element: <AdminPipelinePage /> }, // 07
          { path: 'candidatures', element: <AdminApplicationsPage /> },
          { path: 'projets/:id', element: <AdminProjectPage /> }, // 08
          { path: 'candidats', element: <AdminComingSoonPage title="Candidats" /> },
          { path: 'messagerie', element: <AdminComingSoonPage title="Messagerie" /> },
          { path: 'parametres', element: <AdminComingSoonPage title="Paramètres" /> },
        ],
      },
    ],
  },
], { basename: import.meta.env.BASE_URL })
