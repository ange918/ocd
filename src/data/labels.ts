import type { LucideIcon } from 'lucide-react'
import { Banknote, Compass, Hammer, Handshake, Laptop, Lightbulb, Megaphone, Palette, Rocket, Shirt, ShoppingCart, Sparkles, TrendingUp, Wrench } from 'lucide-react'
import type { ApplicationStatus, Need, Sector, Stage, Tone } from '@/types'

export const STATUS_ORDER: ApplicationStatus[] = ['soumis', 'en_etude', 'preselectionne', 'accompagne', 'cloture']

interface StatusMeta {
  /** Libellé complet (timeline candidat, actions admin) */
  long: string
  /** Titre de colonne Kanban */
  column: string
  /** Badge court (tableaux) */
  short: string
  /** Libellé graphique « Pipeline par statut » */
  chart: string
  tone: Tone
  /** Phrase affichée quand c'est l'étape en cours */
  current: string
}

export const STATUS_META: Record<ApplicationStatus, StatusMeta> = {
  soumis: { long: 'Soumis', column: 'Soumis', short: 'Soumis', chart: 'Soumis', tone: 'muted', current: 'Dossier reçu — en attente d’étude' },
  en_etude: { long: "En cours d'étude", column: "En cours d'étude", short: 'En étude', chart: 'En étude', tone: 'yellow', current: "L'équipe OCD examine ton dossier" },
  preselectionne: { long: 'Présélectionné / Contacté', column: 'Présélectionné', short: 'Présélectionné', chart: 'Présélection', tone: 'soft', current: "L'équipe OCD va te contacter" },
  accompagne: { long: 'Accompagnement validé', column: 'Accompagnement', short: 'Accompagné', chart: 'Accompagné', tone: 'green', current: 'Ton accompagnement démarre' },
  cloture: { long: 'Clôturé', column: 'Clôturé', short: 'Clôturé', chart: 'Clôturé', tone: 'muted', current: 'Dossier clôturé' },
}

export const SECTOR_META: Record<Sector, { label: string; short: string; icon: LucideIcon; hint: string }> = {
  commerce: { label: 'Commerce', short: 'Commerce', icon: ShoppingCart, hint: 'Boutiques, e-commerce, distribution' },
  artisanat: { label: 'Artisanat', short: 'Artisanat', icon: Hammer, hint: 'Création, savoir-faire locaux' },
  tech: { label: 'Tech', short: 'Tech', icon: Laptop, hint: 'Apps, SaaS, digital' },
  services: { label: 'Services', short: 'Services', icon: Handshake, hint: 'Consulting, logistique, care' },
  mode: { label: 'Mode / Stylisme', short: 'Mode', icon: Shirt, hint: 'Prêt-à-porter, wax, design' },
  art_culture: { label: 'Art & Culture', short: 'Art & Culture', icon: Palette, hint: 'Création, médias, événements' },
  autre: { label: 'Autre', short: 'Autre', icon: Sparkles, hint: 'Ton projet ne rentre dans aucune case ? Dis-nous.' },
}

export const SECTORS = Object.keys(SECTOR_META) as Sector[]

export const STAGE_META: Record<Stage, { label: string; icon: LucideIcon }> = {
  idee: { label: 'Idée', icon: Lightbulb },
  demarre: { label: 'Démarré', icon: Rocket },
  scale: { label: 'Scale', icon: TrendingUp },
}

export const STAGES = Object.keys(STAGE_META) as Stage[]

export const NEED_META: Record<Need, { label: string; hint: string; icon: LucideIcon; tone: Tone }> = {
  visibilite: { label: 'Visibilité', hint: 'Mise en avant, réseaux, storytelling', icon: Megaphone, tone: 'soft' },
  mentoring: { label: 'Mentoring', hint: 'Conseil business, produit, ops', icon: Compass, tone: 'green' },
  equipement: { label: 'Équipement', hint: 'Matériel, outillage, stock', icon: Wrench, tone: 'purple' },
  financement: { label: 'Financement', hint: 'Orientation, pitch, partenaires', icon: Banknote, tone: 'blue' },
}

export const NEEDS = Object.keys(NEED_META) as Need[]
