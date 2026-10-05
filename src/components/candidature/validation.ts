import type { ApplicationDraft } from '@/types'

export type DraftErrors = Partial<Record<'title' | 'city' | 'sector' | 'stage' | 'description' | 'needs' | 'media', string>>

export const MAX_FILES = 5
export const MAX_FILE_MB = 20

export function validateStep(step: number, d: ApplicationDraft): DraftErrors {
  const e: DraftErrors = {}
  if (step === 1) {
    if (d.title.trim().length < 3) e.title = 'Donne un titre à ton projet (3 caractères min.).'
    if (d.city.trim().length < 2) e.city = 'Indique ta ville.'
    if (!d.sector) e.sector = 'Choisis un secteur.'
    if (!d.stage) e.stage = 'Choisis le stade de ton projet.'
  }
  if (step === 2) {
    if (d.description.trim().length < 30) e.description = 'Décris ton activité en quelques phrases (30 caractères min.).'
    if (d.needs.length === 0) e.needs = 'Sélectionne au moins un besoin.'
  }
  if (step === 3) {
    if (d.media.length > MAX_FILES) e.media = `${MAX_FILES} fichiers maximum.`
  }
  return e
}

export function firstInvalidStep(d: ApplicationDraft, upTo: number): number | null {
  for (let s = 1; s < upTo; s++) if (Object.keys(validateStep(s, d)).length) return s
  return null
}

export const EMPTY_DRAFT: ApplicationDraft = { title: '', city: '', sector: '', stage: '', description: '', needs: [], media: [] }
