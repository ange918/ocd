import { useEffect, useRef, type ClipboardEvent, type KeyboardEvent } from 'react'
import { m, useAnimationControls, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/tones'

interface Props {
  value: string
  onChange: (value: string) => void
  length?: number
  /** Incrémenter pour déclencher l'animation « shake » (code faux). */
  shakeSignal?: number
  invalid?: boolean
  disabled?: boolean
  onComplete?: (value: string) => void
}

export function OtpInput({ value, onChange, length = 6, shakeSignal = 0, invalid, disabled, onComplete }: Props) {
  const refs = useRef<Array<HTMLInputElement | null>>([])
  const controls = useAnimationControls()
  const reduce = useReducedMotion()
  const digits = Array.from({ length }, (_, i) => value[i] ?? '')
  // Valeur la plus récente, mise à jour de façon synchrone (frappe rapide / saisie auto).
  const valueRef = useRef(value)
  valueRef.current = value

  const emit = (next: string) => {
    valueRef.current = next
    onChange(next)
  }

  useEffect(() => {
    // Focus initial ; on réessaie après la transition de page (l'élément peut être encore masqué).
    const focusFirst = () => {
      const active = document.activeElement
      if (!active || active === document.body) refs.current[0]?.focus()
    }
    refs.current[0]?.focus()
    const raf = requestAnimationFrame(focusFirst)
    const t1 = window.setTimeout(focusFirst, 350)
    const t2 = window.setTimeout(focusFirst, 800)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [])

  useEffect(() => {
    if (!shakeSignal) return
    if (!reduce) void controls.start({ x: [0, -12, 12, -9, 9, -4, 4, 0], transition: { duration: 0.5 } })
    refs.current[0]?.focus()
  }, [shakeSignal, controls, reduce])

  const setAt = (index: number, digit: string) => {
    const cur = valueRef.current
    const next = (cur.slice(0, index) + digit + cur.slice(index + 1)).slice(0, length)
    emit(next)
    if (next.length === length && !next.includes(' ')) onComplete?.(next)
  }

  const handleInput = (index: number, raw: string) => {
    const clean = raw.replace(/\D/g, '')
    if (!clean) return
    if (clean.length > 1) {
      // saisie automatique SMS / collage
      const cur = valueRef.current
      const next = (cur.slice(0, Math.min(index, cur.length)) + clean).slice(0, length)
      emit(next)
      refs.current[Math.min(next.length, length - 1)]?.focus()
      if (next.length === length) onComplete?.(next)
      return
    }
    // on remplit toujours la première case libre (pas de « trous » dans le code)
    const pos = Math.min(index, valueRef.current.length)
    setAt(pos, clean)
    if (pos < length - 1) refs.current[pos + 1]?.focus()
  }

  const handleKey = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      const cur = valueRef.current
      if (cur[index]) {
        emit(cur.slice(0, index) + cur.slice(index + 1))
      } else if (index > 0) {
        emit(cur.slice(0, index - 1) + cur.slice(index))
        refs.current[index - 1]?.focus()
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      refs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      refs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!text) return
    e.preventDefault()
    emit(text)
    refs.current[Math.min(text.length, length - 1)]?.focus()
    if (text.length === length) onComplete?.(text)
  }

  return (
    <m.div animate={controls} className="flex justify-between gap-2" role="group" aria-label={`Code à ${length} chiffres`}>
      {digits.map((d, i) => {
        const filled = Boolean(d)
        const isNext = i === value.length
        return (
          <m.input
            key={i}
            ref={(el) => {
              refs.current[i] = el
            }}
            value={d}
            onChange={(e) => handleInput(i, e.target.value)}
            onKeyDown={(e) => handleKey(i, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.currentTarget.select()}
            disabled={disabled}
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            maxLength={length}
            aria-label={`Chiffre ${i + 1}`}
            aria-invalid={invalid || undefined}
            whileFocus={reduce ? undefined : { scale: 1.06 }}
            animate={filled && !reduce ? { scale: [1, 1.08, 1] } : undefined}
            transition={{ duration: 0.2 }}
            className={cn(
              'h-14 w-12 min-w-0 flex-1 rounded-2xl bg-ocd-card text-center font-display text-2xl caret-ocd-orange outline-none transition-colors sm:flex-none',
              invalid ? 'border-2 border-red-400 text-red-200' : filled ? 'border-2 border-ocd-orange' : isNext ? 'border border-ocd-border focus:border-ocd-orange' : 'border border-ocd-border bg-ocd-anthra',
              'focus:ring-2 focus:ring-ocd-orange/30',
            )}
          />
        )
      })}
    </m.div>
  )
}
