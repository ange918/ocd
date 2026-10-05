import { useId } from 'react'
import type { Country } from '@/types'
import { COUNTRIES } from '@/data/countries'
import { groupDigits } from '@/lib/format'
import { cn } from '@/lib/tones'
import { FieldError, FieldLabel } from './Field'
import { Flag } from './Flag'
import { ChevronDown } from './Icons'

interface Props {
  country: Country
  onCountryChange: (c: Country) => void
  digits: string
  onDigitsChange: (digits: string) => void
  error?: string
}

/** Sélecteur d'indicatif (Bénin +229 par défaut) + numéro national formaté par paires. */
export function PhoneInput({ country, onCountryChange, digits, onDigitsChange, error }: Props) {
  const id = useId()
  const errId = `${id}-err`
  return (
    <div>
      <FieldLabel htmlFor={`${id}-num`}>Numéro de téléphone</FieldLabel>
      <div className="mt-2 flex gap-2">
        <div className="relative flex items-center gap-2 rounded-2xl border border-ocd-border bg-ocd-card px-3 py-3.5 focus-within:border-ocd-orange focus-within:ring-2 focus-within:ring-ocd-orange/30">
          <Flag code={country.code} className="h-4 w-6 shrink-0 overflow-hidden rounded-[3px] ring-1 ring-white/15" />
          <span className="text-sm font-medium">{country.dial}</span>
          <ChevronDown className="text-ocd-muted" />
          <label htmlFor={`${id}-cc`} className="sr-only">
            Indicatif pays
          </label>
          <select
            id={`${id}-cc`}
            value={country.code}
            onChange={(e) => onCountryChange(COUNTRIES.find((c) => c.code === e.target.value) ?? country)}
            className="absolute inset-0 cursor-pointer appearance-none opacity-0"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} · {c.name} ({c.dial})
              </option>
            ))}
          </select>
        </div>
        <input
          id={`${id}-num`}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder={country.code === 'BJ' ? '97 12 45 88' : groupDigits('0'.repeat(country.minDigits))}
          value={groupDigits(digits)}
          onChange={(e) => onDigitsChange(e.target.value.replace(/\D/g, '').slice(0, country.maxDigits))}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? errId : `${id}-hint`}
          className={cn(
            'min-w-0 flex-1 rounded-2xl border bg-ocd-card px-4 py-3.5 text-sm font-medium tracking-wide outline-none transition-[border-color,box-shadow] focus:border-ocd-orange focus:ring-2 focus:ring-ocd-orange/30',
            error ? 'border-red-400/70' : 'border-ocd-border',
          )}
        />
      </div>
      {!error && (
        <p id={`${id}-hint`} className="mt-2 text-[11px] text-ocd-muted">
          Indicatifs disponibles : +229 · +228 · +225 · +221…
        </p>
      )}
      <FieldError id={errId} message={error} />
    </div>
  )
}

export function validatePhone(country: Country, digits: string): string | undefined {
  if (!digits) return 'Entre ton numéro de téléphone.'
  if (digits.length < country.minDigits || digits.length > country.maxDigits) {
    const n = country.minDigits === country.maxDigits ? `${country.minDigits}` : `${country.minDigits} à ${country.maxDigits}`
    return `Un numéro ${country.name} compte ${n} chiffres.`
  }
  return undefined
}
