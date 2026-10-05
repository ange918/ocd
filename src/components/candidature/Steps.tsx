import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { Check, Play, Upload, X } from 'lucide-react'
import type { ApplicationDraft, MediaFile, Need, Sector, Stage } from '@/types'
import { FieldError, FieldLabel, TextAreaField, TextField } from '@/components/ui'
import { NEED_META, NEEDS, SECTOR_META, SECTORS, STAGE_META, STAGES } from '@/data/labels'
import { uid } from '@/lib/format'
import { cn } from '@/lib/tones'
import { MAX_FILE_MB, MAX_FILES, type DraftErrors } from './validation'

interface StepProps {
  draft: ApplicationDraft
  errors: DraftErrors
  update: (patch: Partial<ApplicationDraft>) => void
}

const tap = { scale: 0.96 }

export function StepActivity({ draft, errors, update }: StepProps) {
  return (
    <div>
      <h2 className="font-display text-2xl font-medium">Infos sur ton activité</h2>
      <p className="mt-1 text-sm text-ocd-muted">Dis-nous qui tu es et où tu opères.</p>

      <TextField
        label="Titre du projet"
        name="title"
        containerClassName="mt-6"
        placeholder="Saveurs du Plateau — snacks locaux"
        value={draft.title}
        maxLength={80}
        onChange={(e) => update({ title: e.target.value })}
        error={errors.title}
      />
      <TextField
        label="Ville"
        name="city"
        containerClassName="mt-5"
        placeholder="Abomey-Calavi, Bénin"
        autoComplete="address-level2"
        value={draft.city}
        maxLength={60}
        onChange={(e) => update({ city: e.target.value })}
        error={errors.city}
      />

      <fieldset className="mt-5">
        <FieldLabel as="legend">Secteur</FieldLabel>
        <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Secteur">
          {SECTORS.map((s: Sector) => {
            const active = draft.sector === s
            return (
              <m.button
                key={s}
                type="button"
                role="radio"
                aria-checked={active}
                whileTap={tap}
                onClick={() => update({ sector: s })}
                className={cn(
                  'rounded-full px-3.5 py-1.5 text-xs transition-colors',
                  active ? 'bg-ocd-orange font-semibold text-ocd-black' : 'border border-ocd-border bg-ocd-card text-ocd-muted hover:text-ocd-cream',
                )}
              >
                {SECTOR_META[s].label}
              </m.button>
            )
          })}
        </div>
        <FieldError message={errors.sector} />
      </fieldset>

      <fieldset className="mt-5">
        <FieldLabel as="legend">Stade du projet</FieldLabel>
        <div className="mt-2 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Stade du projet">
          {STAGES.map((s: Stage) => {
            const active = draft.stage === s
            const StageIcon = STAGE_META[s].icon
            return (
              <m.button
                key={s}
                type="button"
                role="radio"
                aria-checked={active}
                whileTap={tap}
                whileHover={{ y: -2 }}
                onClick={() => update({ stage: s })}
                className={cn('rounded-2xl p-3 text-center transition-colors', active ? 'border-2 border-ocd-orange bg-ocd-orange/10' : 'border border-ocd-border bg-ocd-card')}
              >
                <m.span className="flex justify-center text-ocd-orange" animate={active ? { scale: [1, 1.15, 1] } : { scale: 1 }} aria-hidden>
                  <StageIcon className="size-5" strokeWidth={1.75} />
                </m.span>
                <span className={cn('mt-1 block text-xs', active ? 'font-semibold text-ocd-orange' : 'text-ocd-muted')}>{STAGE_META[s].label}</span>
              </m.button>
            )
          })}
        </div>
        <FieldError message={errors.stage} />
      </fieldset>
    </div>
  )
}

export function StepNeeds({ draft, errors, update }: StepProps) {
  const toggle = (n: Need) => update({ needs: draft.needs.includes(n) ? draft.needs.filter((x) => x !== n) : [...draft.needs, n] })
  return (
    <div>
      <h2 className="font-display text-2xl font-medium">Description &amp; besoin</h2>
      <p className="mt-1 text-sm text-ocd-muted">Explique ton activité et ce dont tu as le plus besoin.</p>

      <TextAreaField
        label="Description"
        name="description"
        containerClassName="mt-6"
        placeholder="Je prépare et vends des snacks à base de produits locaux (gari, arachide, plantain) auprès des étudiants d'Abomey-Calavi…"
        value={draft.description}
        maxLength={1200}
        onChange={(e) => update({ description: e.target.value })}
        error={errors.description}
        hint={`${draft.description.trim().length}/1200 caractères`}
      />

      <fieldset className="mt-5">
        <FieldLabel as="legend">
          Nature du besoin <span className="font-medium text-ocd-muted/60 normal-case">(plusieurs possibles)</span>
        </FieldLabel>
        <div className="mt-3 space-y-2.5">
          {NEEDS.map((n) => {
            const active = draft.needs.includes(n)
            const meta = NEED_META[n]
            const NeedIcon = meta.icon
            return (
              <m.button
                key={n}
                type="button"
                role="checkbox"
                aria-checked={active}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggle(n)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-colors',
                  active ? 'border-2 border-ocd-orange bg-ocd-orange/10' : 'border border-ocd-border bg-ocd-card hover:border-ocd-muted/50',
                )}
              >
                <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-xs font-extrabold', active ? 'bg-ocd-orange text-ocd-black' : 'border border-ocd-border')} aria-hidden>
                  <AnimatePresence>
                    {active && (
                      <m.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 600, damping: 25 }}>
                        <Check className="size-3.5" strokeWidth={3} />
                      </m.span>
                    )}
                  </AnimatePresence>
                </span>
                <span className="flex-1">
                  <span className={cn('block text-sm', active ? 'font-semibold' : 'text-ocd-muted')}>{meta.label}</span>
                  <span className="block text-[11px] text-ocd-muted">{meta.hint}</span>
                </span>
                <NeedIcon className={cn('size-5 shrink-0 text-ocd-orange', !active && 'opacity-50')} strokeWidth={1.75} aria-hidden />
              </m.button>
            )
          })}
        </div>
        <FieldError message={errors.needs} />
      </fieldset>
    </div>
  )
}

interface MediaStepProps extends StepProps {
  previews: Record<string, string>
  onAddFiles: (files: File[]) => void
  onRemove: (id: string) => void
}

export function StepMedia({ draft, errors, previews, onAddFiles, onRemove }: MediaStepProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const full = draft.media.length >= MAX_FILES
  const projectName = draft.title.split(' — ')[0]?.trim() || '—'
  const city = draft.city.split(',')[0]?.trim() || '—'

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    onAddFiles(Array.from(e.target.files ?? []))
    e.target.value = ''
  }
  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    onAddFiles(Array.from(e.dataTransfer.files))
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-medium">Photos &amp; vidéo</h2>
      <p className="mt-1 text-sm text-ocd-muted">Montre ton activité — stand, produits, équipe. Max 5 fichiers.</p>

      <m.label
        htmlFor="media-input"
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        whileHover={full ? undefined : { scale: 1.01 }}
        whileTap={full ? undefined : { scale: 0.99 }}
        className={cn(
          'mt-6 block rounded-2xl border-2 border-dashed p-6 text-center transition-colors',
          dragOver ? 'border-ocd-orange bg-ocd-orange/10' : 'border-ocd-border bg-ocd-card/50',
          full && 'cursor-not-allowed opacity-50',
        )}
      >
        <m.span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-ocd-orange/15 text-ocd-orange" animate={dragOver ? { y: -4 } : { y: 0 }} aria-hidden>
          <Upload className="size-5" strokeWidth={1.75} />
        </m.span>
        <span className="mt-3 block text-sm font-semibold">{full ? 'Limite atteinte' : 'Ajouter des médias'}</span>
        <span className="mt-1 block text-xs text-ocd-muted">JPG, PNG ou MP4 · {MAX_FILE_MB} Mo max</span>
        <input ref={inputRef} id="media-input" type="file" accept="image/jpeg,image/png,image/webp,video/mp4" multiple disabled={full} onChange={onChange} className="sr-only" />
      </m.label>
      <FieldError message={errors.media} />

      {draft.media.length > 0 && (
        <ul className="mt-4 grid grid-cols-3 gap-2" aria-label="Médias ajoutés">
          <AnimatePresence initial={false}>
            {draft.media.map((f: MediaFile) => (
              <m.li
                key={f.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square overflow-hidden rounded-xl border border-ocd-border bg-ocd-anthra"
              >
                {f.kind === 'image' && previews[f.id] ? (
                  <img src={previews[f.id]} alt={f.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center px-1">
                    <Play className="size-4 text-ocd-orange" strokeWidth={1.75} aria-hidden />
                    <span className="mt-1 max-w-full truncate text-[10px] text-ocd-muted">{f.name}</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => onRemove(f.id)}
                  aria-label={`Retirer ${f.name}`}
                  className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-ocd-black/70 hover:bg-ocd-orange hover:text-ocd-black"
                >
                  <X className="size-3.5" strokeWidth={2} />
                </button>
              </m.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      <div className="mt-6 rounded-2xl border border-ocd-border bg-ocd-card p-4">
        <p className="text-xs font-bold tracking-wider text-ocd-muted uppercase">Récap</p>
        <dl className="mt-3 space-y-2 text-sm">
          <Row label="Projet" value={projectName} />
          <Row label="Secteur" value={draft.sector ? SECTOR_META[draft.sector].short : '—'} />
          <Row label="Ville" value={city} />
          <Row label="Besoin" value={draft.needs.map((n) => NEED_META[n].label).join(', ') || '—'} />
        </dl>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ocd-muted">{label}</dt>
      <dd className="max-w-[200px] text-right font-medium">{value}</dd>
    </div>
  )
}

/** Crée les entrées MediaFile + URLs d'aperçu locales (révoquées au retrait). */
export function useMediaPreviews() {
  const [previews, setPreviews] = useState<Record<string, string>>({})
  const ref = useRef(previews)
  ref.current = previews
  useEffect(() => () => Object.values(ref.current).forEach((u) => URL.revokeObjectURL(u)), [])

  const add = (files: File[]): { added: MediaFile[]; rejected: string[] } => {
    const added: MediaFile[] = []
    const rejected: string[] = []
    const next: Record<string, string> = {}
    for (const file of files) {
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type === 'video/mp4'
      if (!isImage && !isVideo) {
        rejected.push(`${file.name} : format non accepté`)
        continue
      }
      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        rejected.push(`${file.name} : plus de ${MAX_FILE_MB} Mo`)
        continue
      }
      const id = uid('media')
      const sizeLabel = `${(file.size / 1024 / 1024).toFixed(1).replace('.', ',')} Mo`
      if (isImage) next[id] = URL.createObjectURL(file)
      added.push({ id, kind: isImage ? 'image' : 'video', name: file.name, sizeLabel, url: next[id] })
    }
    setPreviews((p) => ({ ...p, ...next }))
    return { added, rejected }
  }

  const remove = (id: string) => {
    setPreviews((p) => {
      const url = p[id]
      if (url) URL.revokeObjectURL(url)
      const { [id]: _removed, ...rest } = p
      void _removed
      return rest
    })
  }

  return { previews, add, remove }
}
