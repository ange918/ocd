/* Types métier OCD — calqués sur un futur schéma Supabase (tables applications, messages, notifications…). */

export type ApplicationStatus = 'soumis' | 'en_etude' | 'preselectionne' | 'accompagne' | 'cloture'

export type Sector = 'commerce' | 'artisanat' | 'tech' | 'services' | 'mode' | 'art_culture' | 'autre'

export type Stage = 'idee' | 'demarre' | 'scale'

export type Need = 'visibilite' | 'mentoring' | 'equipement' | 'financement'

export type Tone = 'orange' | 'soft' | 'green' | 'yellow' | 'blue' | 'purple' | 'muted'

export type Role = 'candidate' | 'admin'

export interface Applicant {
  id: string
  fullName: string
  /** Format E.164, ex. +22997124588 */
  phone: string
  avatarUrl?: string
  avatarTone: Tone
}

export interface MediaFile {
  id: string
  kind: 'image' | 'video'
  name: string
  url?: string
  sizeLabel?: string
}

export interface InternalNote {
  id: string
  author: string
  body: string
  createdAt: string
}

export type HistoryKind = 'submitted' | 'status' | 'request' | 'note'

export interface HistoryEvent {
  id: string
  kind: HistoryKind
  label: string
  at: string
  /** Ex. « WhatsApp · Aminata K. » ou « Système » */
  meta: string
  status?: ApplicationStatus
}

export interface Application {
  id: string
  title: string
  applicant: Applicant
  sector: Sector
  stage: Stage
  needs: Need[]
  city: string
  country: string
  description: string
  status: ApplicationStatus
  submittedAt: string
  media: MediaFile[]
  pendingRequest?: string
  notes: InternalNote[]
  history: HistoryEvent[]
  /** true = donnée de démo (maquette), false = créée depuis le formulaire */
  seed: boolean
}

/** Clé d'icône Lucide persistée (le composant est résolu à l'affichage). */
export type NotificationIconName = 'paperclip' | 'inbox' | 'bell'

export interface AppNotification {
  id: string
  applicationId: string
  icon: NotificationIconName
  title: string
  /** Ex. « Voir la messagerie » ou « WhatsApp » */
  meta: string
  createdAt: string
  read: boolean
  highlight?: boolean
}

export interface ChatMessage {
  id: string
  applicationId: string
  author: 'candidate' | 'team'
  body: string
  sentAt: string
}

export interface Session {
  phone: string
  role: Role
  fullName?: string
  token: string
}

export interface Country {
  code: string
  dial: string
  name: string
  /** nombre de chiffres du numéro national accepté */
  minDigits: number
  maxDigits: number
}

export interface ApplicationDraft {
  title: string
  city: string
  sector: Sector | ''
  stage: Stage | ''
  description: string
  needs: Need[]
  media: MediaFile[]
}

export interface DashboardStats {
  kpis: { id: string; label: string; value: string; caption: string; tone: Tone | 'cream'; captionTone?: Tone }[]
  geo: { city: string; count: number; percent: number; tone: Tone }[]
  sectors: { label: string; percent: number; color: string }[]
  sectorsTotal: string
  pipeline: { status: ApplicationStatus; label: string; count: number; percent: number }[]
  weekLabel: string
}
