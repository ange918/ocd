import { m } from 'framer-motion'
import { LogoMark } from '@/components/ui'
import { cn } from '@/lib/tones'

export const STEP_LABELS = ['Activité', 'Besoin', 'Médias'] as const

export function FormHeader({ step, onBack }: { step: number; onBack: () => void }) {
  return (
    <header className="sticky top-0 z-20 border-b border-ocd-border bg-ocd-black/95 px-5 pt-5 pb-4 backdrop-blur-xl md:rounded-t-[32px]">
      <div className="mb-3 flex justify-center">
        <LogoMark className="h-5 opacity-90" title="OCD" />
      </div>
      <div className="flex items-center justify-between">
        <button type="button" onClick={onBack} className="text-sm text-ocd-muted transition-colors hover:text-ocd-cream">
          {step === 1 ? 'Annuler' : 'Retour'}
        </button>
        <h1 className="font-display text-sm font-medium">Nouveau projet</h1>
        <span className="text-sm font-medium text-ocd-orange" aria-label={`Étape ${step} sur 3`}>
          {step}/3
        </span>
      </div>
      <div className="mt-4 flex gap-2" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={step} aria-valuetext={`Étape ${step} sur 3 : ${STEP_LABELS[step - 1]}`}>
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="h-1 flex-1 overflow-hidden rounded-full bg-ocd-border">
            <m.div className="h-full origin-left rounded-full bg-ocd-orange" initial={false} animate={{ scaleX: i < step ? 1 : 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} />
          </div>
        ))}
      </div>
      <ol className="mt-2 flex justify-between text-[10px] text-ocd-muted">
        {STEP_LABELS.map((label, i) => (
          <li key={label} className={cn(i < step && 'font-medium text-ocd-orange')} aria-current={i === step - 1 ? 'step' : undefined}>
            {label}
          </li>
        ))}
      </ol>
    </header>
  )
}
