import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { Navigate, useNavigate, useSearchParams } from 'react-router'
import { AnimatePresence, m } from 'framer-motion'
import { Hand } from 'lucide-react'
import { Button, Icon } from '@/components/ui'
import { OtpInput } from '@/components/ui/OtpInput'
import { useAuth } from '@/app/providers/auth-context'
import { useToast } from '@/app/providers/toast-context'
import { authService, ApiError } from '@/services'
import type { OtpChannel } from '@/services/auth.service'
import { useCountdown } from '@/hooks/useCountdown'
import { formatPhone } from '@/lib/format'
import { fadeUp, staggerContainer } from '@/lib/motion'
import { BackButton } from './BackButton'

const LENGTH = 6

/** Maquette 03b — saisie du code OTP (SMS ou WhatsApp). */
export default function OtpPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { pendingPhone, signIn } = useAuth()
  const toast = useToast()
  const [code, setCode] = useState('')
  const [error, setError] = useState<string>()
  const [shake, setShake] = useState(0)
  const [loading, setLoading] = useState(false)
  const [channel, setChannel] = useState<OtpChannel>('sms')
  const [left, setLeft] = useCountdown(45)

  useEffect(() => {
    document.title = 'Vérification du code — OCD'
  }, [])

  if (!pendingPhone) return <Navigate to="/connexion" replace />

  const verify = async (value = code) => {
    if (value.length !== LENGTH || loading) return
    setLoading(true)
    setError(undefined)
    try {
      const session = await authService.verifyOtp(pendingPhone, value)
      // On applique la session avant de naviguer, sinon la garde de route la verrait encore vide.
      flushSync(() => signIn(session))
      toast({
        title: 'Connexion réussie',
        description: (
          <span className="inline-flex items-center gap-1">
            Bienvenue sur OCD
            <Hand className="size-3.5" strokeWidth={1.75} aria-hidden />
          </span>
        ),
      })
      const next = params.get('next')
      navigate(next ?? (session.role === 'admin' ? '/admin' : '/espace'), { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Vérification impossible, réessaie.')
      setShake((s) => s + 1)
      setCode('')
    } finally {
      setLoading(false)
    }
  }

  const resend = async (via: OtpChannel) => {
    try {
      const res = await authService.requestOtp(pendingPhone, via)
      setChannel(via)
      setLeft(res.resendIn)
      setCode('')
      setError(undefined)
      toast({ title: via === 'whatsapp' ? 'Code envoyé sur WhatsApp' : 'Nouveau code envoyé par SMS', description: formatPhone(pendingPhone), tone: 'info' })
    } catch {
      toast({ title: 'Envoi impossible', description: 'Vérifie ta connexion puis réessaie.', tone: 'error' })
    }
  }

  const mm = Math.floor(left / 60)
  const ss = String(left % 60).padStart(2, '0')

  return (
    <div className="flex flex-1 flex-col">
      <div className="px-5 pt-6">
        <BackButton to={`/connexion${params.get('next') ? `?next=${encodeURIComponent(params.get('next') ?? '')}` : ''}`} label="Modifier le numéro" />
      </div>
      <m.form
        className="flex-1 px-6 pt-10 pb-8"
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          void verify()
        }}
        initial="hidden"
        animate="show"
        variants={staggerContainer(0.07, 0.05)}
      >
        <m.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-ocd-border bg-ocd-card px-3 py-1.5 text-[11px] font-medium text-ocd-green">
          <Icon.WhatsApp />
          {channel === 'whatsapp' ? 'Via WhatsApp' : 'SMS ou WhatsApp'}
        </m.div>
        <m.h1 variants={fadeUp} className="mt-5 font-display text-3xl leading-tight font-medium">
          Entre le code
        </m.h1>
        <m.p variants={fadeUp} className="mt-3 text-sm leading-relaxed text-ocd-muted">
          Code à 6 chiffres envoyé au <span className="font-medium text-ocd-cream">{formatPhone(pendingPhone)}</span>
        </m.p>

        <m.div variants={fadeUp} className="mt-10">
          <OtpInput value={code} onChange={(v) => { setCode(v); if (error) setError(undefined) }} length={LENGTH} shakeSignal={shake} invalid={Boolean(error)} disabled={loading} onComplete={(v) => void verify(v)} />
          <AnimatePresence>
            {error && (
              <m.p role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 text-center text-xs text-red-300">
                {error}
              </m.p>
            )}
          </AnimatePresence>
        </m.div>

        <m.div variants={fadeUp}>
          <Button type="submit" size="xl" fullWidth disabled={code.length !== LENGTH} loading={loading} glow={code.length === LENGTH} className="mt-10">
            Vérifier
          </Button>
        </m.div>

        <m.p variants={fadeUp} className="mt-8 text-center text-sm text-ocd-muted" aria-live="polite">
          Pas reçu ?{' '}
          {left > 0 ? (
            <span className="font-semibold text-ocd-orange">
              Renvoyer dans {mm}:{ss}
            </span>
          ) : (
            <button type="button" onClick={() => void resend(channel)} className="font-semibold text-ocd-orange underline-offset-2 hover:underline">
              Renvoyer le code
            </button>
          )}
        </m.p>
        <m.p variants={fadeUp} className="mt-3 text-center text-xs text-ocd-muted">
          Recevoir via{' '}
          <button type="button" onClick={() => void resend(channel === 'sms' ? 'whatsapp' : 'sms')} className="font-medium text-ocd-cream underline">
            {channel === 'sms' ? 'WhatsApp' : 'SMS'}
          </button>{' '}
          à la place
        </m.p>

        <m.div variants={fadeUp} className="mt-12 flex gap-3 rounded-2xl border border-ocd-border bg-ocd-card p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ocd-green/15 text-sm text-ocd-green" aria-hidden>
            ✓
          </div>
          <div>
            <p className="text-sm font-medium">Astuce sécurité</p>
            <p className="mt-0.5 text-xs text-ocd-muted">OCD ne te demandera jamais ton code par appel. Ne le partage avec personne.</p>
          </div>
        </m.div>
      </m.form>
    </div>
  )
}
