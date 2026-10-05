import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { m } from 'framer-motion'
import type { Country } from '@/types'
import { Button, Icon, LogoBaseline, LogoMark } from '@/components/ui'
import { PhoneInput, validatePhone } from '@/components/ui/PhoneInput'
import { DEFAULT_COUNTRY } from '@/data/countries'
import { useAuth } from '@/app/providers/auth-context'
import { useToast } from '@/app/providers/toast-context'
import { authService, ApiError } from '@/services'
import { fadeUp, staggerContainer } from '@/lib/motion'
import { BackButton } from './BackButton'

/** Maquette 03a — connexion / inscription par téléphone. */
export default function PhoneLoginPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { setPendingPhone } = useAuth()
  const toast = useToast()
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY)
  const [digits, setDigits] = useState('')
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    document.title = 'Connexion — OCD'
  }, [])

  useEffect(() => {
    if (touched) setError(validatePhone(country, digits))
  }, [country, digits, touched])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setTouched(true)
    const err = validatePhone(country, digits)
    setError(err)
    if (err) return
    setLoading(true)
    try {
      const phone = `${country.dial}${digits}`
      await authService.requestOtp(phone, 'sms')
      setPendingPhone(phone)
      const next = params.get('next')
      navigate(`/connexion/code${next ? `?next=${encodeURIComponent(next)}` : ''}`)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Impossible d’envoyer le code. Réessaie.')
    } finally {
      setLoading(false)
    }
  }

  const google = async () => {
    try {
      await authService.signInWithGoogle()
    } catch (err) {
      toast({ title: err instanceof Error ? err.message : 'Indisponible', description: 'Utilise ton numéro WhatsApp / SMS en attendant.', tone: 'info' })
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="px-5 pt-6">
        <BackButton to="/" label="Retour à l'accueil" />
      </div>
      <m.form onSubmit={submit} noValidate className="flex-1 px-6 pt-10 pb-8" initial="hidden" animate="show" variants={staggerContainer(0.07, 0.05)}>
        <m.div variants={fadeUp} className="flex flex-col items-start">
          <LogoMark className="h-10" />
          <LogoBaseline className="mt-2" />
        </m.div>
        <m.h1 variants={fadeUp} className="mt-6 font-display text-3xl leading-tight font-medium">
          Connexion
          <br />
          ou inscription
        </m.h1>
        <m.p variants={fadeUp} className="mt-3 text-sm leading-relaxed text-ocd-muted">
          Entre ton numéro WhatsApp / SMS. On t'envoie un code à 6 chiffres pour te connecter.
        </m.p>

        <m.div variants={fadeUp} className="mt-8">
          <PhoneInput country={country} onCountryChange={setCountry} digits={digits} onDigitsChange={setDigits} error={error} />
        </m.div>

        <m.div variants={fadeUp}>
          <Button type="submit" size="xl" fullWidth glow loading={loading} className="mt-8">
            Continuer
          </Button>
        </m.div>

        <m.div variants={fadeUp} className="my-8 flex items-center gap-4" aria-hidden>
          <div className="h-px flex-1 bg-ocd-border" />
          <span className="text-xs text-ocd-muted">ou</span>
          <div className="h-px flex-1 bg-ocd-border" />
        </m.div>

        <m.div variants={fadeUp}>
          <Button variant="secondary" fullWidth size="lg" onClick={google} className="gap-3 py-3.5 text-sm">
            <Icon.Google />
            Continuer avec Google
          </Button>
        </m.div>

        <m.p variants={fadeUp} className="mt-8 text-center text-[11px] leading-relaxed text-ocd-muted">
          En continuant, tu acceptes les{' '}
          <Link to="/" className="text-ocd-cream underline">
            Conditions
          </Link>{' '}
          et la{' '}
          <Link to="/" className="text-ocd-cream underline">
            Confidentialité
          </Link>
          .
        </m.p>

        <m.p variants={fadeUp} className="mt-6 rounded-xl border border-dashed border-ocd-border px-3 py-2 text-center text-[10px] leading-relaxed text-ocd-muted/80">
          Mode démo : code <strong className="text-ocd-cream">123456</strong> · compte candidat démo +229 97 12 45 88 · admin +229 01 00 00 00 00
        </m.p>
      </m.form>
    </div>
  )
}
