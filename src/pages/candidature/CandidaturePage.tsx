import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { AnimatePresence, m, useReducedMotion, type Variants } from 'framer-motion'
import { PartyPopper } from 'lucide-react'
import type { ApplicationDraft } from '@/types'
import { Button } from '@/components/ui'
import { FormHeader } from '@/components/candidature/FormHeader'
import { StepActivity, StepMedia, StepNeeds, useMediaPreviews } from '@/components/candidature/Steps'
import { EMPTY_DRAFT, firstInvalidStep, MAX_FILES, validateStep, type DraftErrors } from '@/components/candidature/validation'
import { useAuth } from '@/app/providers/auth-context'
import { useToast } from '@/app/providers/toast-context'
import { applicationsService } from '@/services'

const DRAFT_KEY = 'ocd.draft'

function loadDraft(): ApplicationDraft {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (raw) return { ...EMPTY_DRAFT, ...(JSON.parse(raw) as Partial<ApplicationDraft>), media: [] }
  } catch {
    /* ignore */
  }
  return EMPTY_DRAFT
}

const slide: Variants = {
  enter: (dir: number) => ({ x: dir * 48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -48, opacity: 0 }),
}
const fade: Variants = { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } }

/** Maquettes 04a / 04b / 04c — soumission en 3 étapes, étape dans l'URL (?etape=1|2|3). */
export default function CandidaturePage() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const { session } = useAuth()
  const toast = useToast()
  const reduce = useReducedMotion()
  const raw = Number(params.get('etape') ?? '1')
  const step = raw >= 1 && raw <= 3 ? Math.floor(raw) : 1

  const [draft, setDraft] = useState<ApplicationDraft>(loadDraft)
  const [errors, setErrors] = useState<DraftErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const prevStep = useRef(step)
  const direction = step >= prevStep.current ? 1 : -1
  const media = useMediaPreviews()
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    prevStep.current = step
    document.title = `Nouveau projet · Étape ${step}/3 — OCD`
    window.scrollTo({ top: 0 })
  }, [step])

  // Interdit d'arriver sur une étape si les précédentes sont incomplètes.
  useEffect(() => {
    const invalid = firstInvalidStep(draft, step)
    if (invalid) setParams({ etape: String(invalid) }, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  // Brouillon sauvegardé localement (connexion instable).
  useEffect(() => {
    try {
      const { media: _m, ...rest } = draft
      void _m
      localStorage.setItem(DRAFT_KEY, JSON.stringify(rest))
    } catch {
      /* ignore */
    }
  }, [draft])

  const update = (patch: Partial<ApplicationDraft>) => {
    setDraft((d) => ({ ...d, ...patch }))
    setErrors((e) => {
      const next = { ...e }
      for (const k of Object.keys(patch)) delete next[k as keyof DraftErrors]
      return next
    })
  }

  const goTo = (s: number) => setParams({ etape: String(s) })

  const focusFirstError = () => {
    window.setTimeout(() => {
      const el = bodyRef.current?.querySelector<HTMLElement>('[aria-invalid="true"], [role="alert"]')
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) el.focus()
    }, 50)
  }

  const next = async () => {
    const e = validateStep(step, draft)
    setErrors(e)
    if (Object.keys(e).length) {
      focusFirstError()
      return
    }
    if (step < 3) {
      goTo(step + 1)
      return
    }
    if (!session) return
    setSubmitting(true)
    try {
      await applicationsService.submitApplication(draft, session.phone, session.fullName)
      localStorage.removeItem(DRAFT_KEY)
      toast({
        title: (
          <span className="inline-flex items-center gap-1.5">
            Projet soumis
            <PartyPopper className="size-3.5" strokeWidth={1.75} aria-hidden />
          </span>
        ),
        description: 'Tu recevras une confirmation par WhatsApp.',
      })
      navigate('/espace', { replace: true })
    } catch (err) {
      toast({ title: 'Envoi impossible', description: err instanceof Error ? err.message : 'Réessaie dans un instant.', tone: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const back = () => {
    if (step === 1) {
      toast({ title: 'Brouillon enregistré', description: 'Tu pourras reprendre ta candidature plus tard.', tone: 'info' })
      navigate('/')
    } else goTo(step - 1)
  }

  const addFiles = (files: File[]) => {
    const room = MAX_FILES - draft.media.length
    const { added, rejected } = media.add(files.slice(0, Math.max(0, room)))
    if (files.length > room) rejected.push(`${MAX_FILES} fichiers maximum`)
    if (added.length) update({ media: [...draft.media, ...added] })
    if (rejected.length) toast({ title: 'Certains fichiers ont été ignorés', description: rejected.join(' · '), tone: 'error' })
  }

  const removeFile = (id: string) => {
    media.remove(id)
    update({ media: draft.media.filter((f) => f.id !== id) })
  }

  return (
    <div className="flex flex-1 flex-col">
      <FormHeader step={step} onBack={back} />
      <form
        className="flex flex-1 flex-col"
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          void next()
        }}
      >
        <div ref={bodyRef} className="relative flex-1 overflow-hidden px-5 py-6">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <m.div
              key={step}
              custom={direction}
              variants={reduce ? fade : slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 1 && <StepActivity draft={draft} errors={errors} update={update} />}
              {step === 2 && <StepNeeds draft={draft} errors={errors} update={update} />}
              {step === 3 && <StepMedia draft={draft} errors={errors} update={update} previews={media.previews} onAddFiles={addFiles} onRemove={removeFile} />}
            </m.div>
          </AnimatePresence>
        </div>

        <div className="sticky bottom-0 bg-gradient-to-t from-ocd-black via-ocd-black to-transparent px-5 pt-2 pb-8 md:rounded-b-[32px]">
          {step === 2 ? (
            <div className="flex gap-3">
              <Button variant="outline" size="xl" className="flex-1" onClick={back}>
                Retour
              </Button>
              <Button type="submit" size="xl" className="flex-[1.4]">
                Continuer
              </Button>
            </div>
          ) : (
            <Button type="submit" size="xl" fullWidth glow={step === 3} loading={submitting}>
              {step === 3 ? 'Soumettre mon projet' : 'Continuer'}
            </Button>
          )}
          {step === 3 && <p className="mt-3 text-center text-[11px] text-ocd-muted">Tu recevras une confirmation par WhatsApp.</p>}
        </div>
      </form>
    </div>
  )
}
