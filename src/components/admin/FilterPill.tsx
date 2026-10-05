import { cn } from '@/lib/tones'

interface Option {
  value: string
  label: string
}

/** Filtre en pastille (« Secteur · Tous ▾ ») basé sur un <select> natif accessible. */
export function FilterPill({ label, value, options, onChange, allLabel = 'Tous' }: { label: string; value: string; options: Option[]; onChange: (v: string) => void; allLabel?: string }) {
  const active = value !== ''
  const current = options.find((o) => o.value === value)?.label ?? allLabel
  return (
    <label
      className={cn(
        'relative inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-within:ring-2 focus-within:ring-ocd-soft',
        active ? 'border-ocd-orange bg-ocd-orange/10 text-ocd-orange' : 'border-ocd-border text-ocd-muted hover:text-ocd-cream',
      )}
    >
      <span aria-hidden>
        {label} · {current} ▾
      </span>
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 cursor-pointer appearance-none opacity-0">
        <option value="">{allLabel}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}
