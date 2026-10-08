import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { useAuth } from '@/app/providers/auth-context'
import { Hero } from '@/components/landing/Hero'
import { StickyCta } from '@/components/landing/StickyCta'
import { Faq, FinalCta, HowItWorks, Philosophy, Sectors, StatsBand, Testimonials, VideoBlock } from '@/components/landing/Sections'

/** Maquettes 01 (desktop 1440) + 02 (mobile 390) — une seule route responsive. */
export default function LandingPage() {
  const { session } = useAuth()
  const { hash } = useLocation()

  useEffect(() => {
    document.title = "OCD — Les opportunités, c'est dehors"
    if (!hash) return
    const t = window.setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 350)
    return () => window.clearTimeout(t)
  }, [hash])

  const accountTo = session ? (session.role === 'admin' ? '/admin' : '/espace') : '/connexion'
  const accountLabel = session ? 'Mon espace' : 'Se connecter'

  return (
    <>
      <Hero accountTo={accountTo} accountLabel={accountLabel} />
      <StatsBand />
      <Philosophy />
      <VideoBlock />
      <HowItWorks />
      <Sectors />
      <Testimonials />
      <Faq />
      <FinalCta />
      <StickyCta />
    </>
  )
}
