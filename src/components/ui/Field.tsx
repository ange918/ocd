import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { cn } from '@/lib/tones'

/** Libellé en capitales des formulaires (« TITRE DU PROJET »). */
export function FieldLabel({ htmlFor, children, className, as: Tag = 'label' }: { htmlFor?: string; children: ReactNode; className?: string; as?: 'label' | 'p' | 'legend' }) {
  return (
    <Tag {...(Tag === 'label' ? { htmlFor } : {})} className={cn('block text-xs font-bold tracking-wider text-ocd-muted uppercase', className)}>
      {children}
    </Tag>
  )
}

export function FieldError({ id, message }: { id?: string; message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <m.p
          id={id}
          role="alert"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-1.5 overflow-hidden text-[11px] text-red-300"
        >
          {message}
        </m.p>
      )}
    </AnimatePresence>
  )
}

const inputBase =
  'w-full rounded-2xl border bg-ocd-card px-4 py-3.5 text-sm text-ocd-cream outline-none transition-[border-color,box-shadow] duration-200 focus:border-ocd-orange focus:ring-2 focus:ring-ocd-orange/30'

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: string; containerClassName?: string }

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField({ label, error, hint, id, className, containerClassName, ...rest }, ref) {
  const auto = useId()
  const inputId = id ?? auto
  const errId = `${inputId}-err`
  return (
    <div className={containerClassName}>
      <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? errId : undefined}
        className={cn(inputBase, 'mt-2', error ? 'border-red-400/70' : 'border-ocd-border', className)}
        {...rest}
      />
      {hint && !error && <p className="mt-1.5 text-[11px] text-ocd-muted">{hint}</p>}
      <FieldError id={errId} message={error} />
    </div>
  )
})

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string; hint?: string; containerClassName?: string }

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextAreaField({ label, error, hint, id, className, containerClassName, ...rest }, ref) {
  const auto = useId()
  const inputId = id ?? auto
  const errId = `${inputId}-err`
  return (
    <div className={containerClassName}>
      <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
      <textarea
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? errId : undefined}
        className={cn(inputBase, 'mt-2 min-h-[120px] resize-y leading-relaxed [field-sizing:content]', error ? 'border-red-400/70' : 'border-ocd-border', className)}
        {...rest}
      />
      {hint && !error && <p className="mt-1.5 text-[11px] text-ocd-muted">{hint}</p>}
      <FieldError id={errId} message={error} />
    </div>
  )
})
