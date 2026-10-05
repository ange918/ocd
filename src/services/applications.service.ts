import type { Application, ApplicationDraft, ApplicationStatus, HistoryEvent, InternalNote } from '@/types'
import { FEATURED_RECENT_IDS } from '@/data/applications'
import { STATUS_META } from '@/data/labels'
import { uid } from '@/lib/format'
import { ApiError, clone, delay } from './client'
import { commit, getDb } from './db'

export interface ApplicationFilters {
  q?: string
  sector?: string
  city?: string
  need?: string
  stage?: string
  /** nombre de jours (0 = tout) */
  days?: number
}

/** TODO Supabase : supabase.from('applications').select('*, applicant:profiles(*)') */
export async function listApplications(): Promise<Application[]> {
  await delay(350)
  return clone(getDb().applications)
}

export async function getApplication(id: string): Promise<Application | null> {
  await delay(300)
  const found = getDb().applications.find((a) => a.id === id)
  return found ? clone(found) : null
}

/** Dossier du candidat connecté (le plus récent). */
export async function getMyApplication(phone: string): Promise<Application | null> {
  await delay(400)
  const mine = getDb()
    .applications.filter((a) => a.applicant.phone === phone)
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
  return mine[0] ? clone(mine[0]) : null
}

/** « Dernières candidatures » : nouvelles soumissions puis la sélection de la maquette. */
export async function listRecentApplications(limit = 4): Promise<Application[]> {
  await delay(300)
  const all = getDb().applications
  const created = all.filter((a) => !a.seed).sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
  const featured = FEATURED_RECENT_IDS.map((id) => all.find((a) => a.id === id)).filter((a): a is Application => Boolean(a))
  return clone([...created, ...featured].slice(0, limit))
}

export async function submitApplication(draft: ApplicationDraft, phone: string, fullName?: string): Promise<Application> {
  await delay(900)
  if (!draft.sector || !draft.stage) throw new ApiError('invalid_draft', 'Formulaire incomplet.')
  const now = new Date().toISOString()
  const [city = draft.city, country = 'Bénin'] = draft.city.split(',').map((s) => s.trim())
  const name = fullName?.trim() || 'Candidat·e OCD'
  const application: Application = {
    id: uid('app'),
    title: draft.title.trim(),
    applicant: { id: uid('u'), fullName: name, phone, avatarTone: 'orange' },
    sector: draft.sector,
    stage: draft.stage,
    needs: [...draft.needs],
    city,
    country,
    description: draft.description.trim(),
    status: 'soumis',
    submittedAt: now,
    media: draft.media.map((m) => ({ ...m, url: m.url?.startsWith('blob:') ? undefined : m.url })),
    notes: [],
    history: [{ id: uid('h'), kind: 'submitted', label: 'Dossier soumis', at: now, meta: name, status: 'soumis' }],
    seed: false,
  }
  const db = getDb()
  db.applications.unshift(application)
  db.notifications.unshift({
    id: uid('notif'),
    applicationId: application.id,
    icon: 'inbox',
    title: 'Dossier reçu — confirmation',
    meta: 'WhatsApp',
    createdAt: now,
    read: false,
  })
  commit()
  return clone(application)
}

/** Change le statut (Kanban ou fiche projet) et journalise l'événement. */
export async function updateApplicationStatus(id: string, status: ApplicationStatus, actor = 'Aminata K.'): Promise<Application> {
  await delay(350)
  const db = getDb()
  const target = db.applications.find((a) => a.id === id)
  if (!target) throw new ApiError('not_found', 'Projet introuvable.')
  if (target.status !== status) {
    target.status = status
    const event: HistoryEvent = {
      id: uid('h'),
      kind: 'status',
      label: `Statut → ${STATUS_META[status].long}`,
      at: new Date().toISOString(),
      meta: `WhatsApp · ${actor}`,
      status,
    }
    target.history.unshift(event)
    db.notifications.unshift({
      id: uid('notif'),
      applicationId: id,
      icon: 'bell',
      title: `Statut mis à jour : ${STATUS_META[status].long}`,
      meta: 'WhatsApp',
      createdAt: event.at,
      read: false,
      highlight: true,
    })
    commit()
  }
  return clone(target)
}

/** Déplace une carte dans le Kanban (statut + position dans la liste). */
export async function moveApplication(id: string, status: ApplicationStatus, beforeId?: string): Promise<Application> {
  const updated = await updateApplicationStatus(id, status)
  const list = getDb().applications
  const from = list.findIndex((a) => a.id === id)
  if (from >= 0) {
    const [item] = list.splice(from, 1)
    const to = beforeId ? list.findIndex((a) => a.id === beforeId) : -1
    if (item) list.splice(to >= 0 ? to : list.length, 0, item)
    commit()
  }
  return updated
}

export async function addInternalNote(id: string, body: string, author = 'Aminata K.'): Promise<InternalNote> {
  await delay(300)
  const target = getDb().applications.find((a) => a.id === id)
  if (!target) throw new ApiError('not_found', 'Projet introuvable.')
  const note: InternalNote = { id: uid('note'), author, body: body.trim(), createdAt: new Date().toISOString() }
  target.notes.unshift(note)
  commit()
  return clone(note)
}

export async function sendWhatsAppReminder(id: string, actor = 'Aminata K.'): Promise<HistoryEvent> {
  await delay(500)
  const target = getDb().applications.find((a) => a.id === id)
  if (!target) throw new ApiError('not_found', 'Projet introuvable.')
  const event: HistoryEvent = { id: uid('h'), kind: 'request', label: 'Relance WhatsApp envoyée', at: new Date().toISOString(), meta: `WhatsApp · ${actor}` }
  target.history.unshift(event)
  commit()
  return clone(event)
}

export function filterApplications(list: Application[], f: ApplicationFilters, now = new Date()): Application[] {
  const q = f.q?.trim().toLowerCase()
  return list.filter((a) => {
    if (q && !`${a.title} ${a.applicant.fullName} ${a.city}`.toLowerCase().includes(q)) return false
    if (f.sector && a.sector !== f.sector) return false
    if (f.city && a.city !== f.city) return false
    if (f.need && !a.needs.includes(f.need as Application['needs'][number])) return false
    if (f.stage && a.stage !== f.stage) return false
    if (f.days && now.getTime() - new Date(a.submittedAt).getTime() > f.days * 86400 * 1000) return false
    return true
  })
}

export function toCsv(list: Application[]): string {
  const header = ['id', 'projet', 'candidat', 'telephone', 'secteur', 'ville', 'pays', 'stade', 'besoins', 'statut', 'date']
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`
  const rows = list.map((a) =>
    [a.id, a.title, a.applicant.fullName, a.applicant.phone, a.sector, a.city, a.country, a.stage, a.needs.join('|'), a.status, a.submittedAt].map(esc).join(';'),
  )
  return '\uFEFF' + [header.join(';'), ...rows].join('\r\n')
}
