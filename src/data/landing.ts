import type { Sector, Tone } from '@/types'
import { IMG, unsplash } from './images'

export const LANDING_STATS: { value: string; label: string; mobileLabel: string; tone: Tone | 'cream' }[] = [
  { value: '1 200+', label: 'Candidatures reçues*', mobileLabel: 'Candidatures*', tone: 'cream' },
  { value: '68%', label: 'Taux de présélection*', mobileLabel: 'Présélection*', tone: 'orange' },
  { value: '5 pays', label: "Présence Afrique de l'Ouest*", mobileLabel: 'Afrique Ouest*', tone: 'green' },
  { value: '48h', label: 'Délai moyen de 1ᵉʳ retour*', mobileLabel: '1ᵉʳ retour*', tone: 'yellow' },
]

export const PHILOSOPHY_POINTS = [
  { title: 'Action avant perfection', text: "Soumets ton projet tel qu'il est — idée, démarrage ou scale." },
  { title: 'Accompagnement concret', text: 'Visibilité, mentoring, équipement ou orientation financement.' },
  { title: 'Communauté ouest-africaine', text: 'Du Bénin au Sénégal, une même énergie entrepreneuriale.' },
]

export const HOW_STEPS: { n: string; title: string; text: string; mobileText: string; tone: Tone }[] = [
  { n: '01', title: 'Soumets ton projet', text: 'Titre, secteur, stade et besoin principal. Ajoute photos ou vidéo pour donner le ton.', mobileText: 'Infos, besoin, photos.', tone: 'orange' },
  { n: '02', title: 'Étude & présélection', text: "L'équipe OCD étudie ton dossier. Tu suis le statut en temps réel et reçois des notifications WhatsApp.", mobileText: 'Suivi WhatsApp en direct.', tone: 'yellow' },
  { n: '03', title: 'Accompagnement', text: 'Visibilité, mentoring, équipement ou orientation financement — selon ton besoin validé.', mobileText: 'Visibilité, mentoring, +.', tone: 'green' },
]

export const LANDING_SECTORS: Sector[] = ['commerce', 'artisanat', 'tech', 'services', 'mode', 'art_culture']

export const TESTIMONIALS = [
  {
    name: 'Aïcha K.',
    meta: 'Mode · Porto-Novo',
    avatar: unsplash(IMG.avatarYao, 96, 96, true),
    tone: 'orange' as Tone,
    quote: "« Grâce au mentoring OCD, j'ai structuré mon atelier et touché une clientèle hors de ma ville. La visibilité a tout changé. »",
    mobileQuote: "« Le mentoring OCD m'a permis de structurer mon atelier et d'élargir ma clientèle. »",
    result: 'Accompagnement validé · Mentoring',
  },
  {
    name: 'Kodjo M.',
    meta: 'Tech · Lomé',
    avatar: unsplash('1506277886164-e25aa3f4ef7f', 96, 96, true),
    tone: 'green' as Tone,
    quote: "« Mon app de livraison locale était une idée. OCD m'a mis en contact avec un mentor produit. On a lancé en 3 mois. »",
    mobileQuote: '« OCD m’a mis en contact avec un mentor produit. On a lancé en 3 mois. »',
    result: 'Accompagnement validé · Mentoring + Visibilité',
  },
  {
    name: 'Fatou D.',
    meta: 'Commerce · Dakar',
    avatar: unsplash('1488426862026-3ee34a7d66df', 96, 96, true),
    tone: 'yellow' as Tone,
    quote: "« J'avais besoin d'équipement pour mon dépôt. Le suivi WhatsApp et l'orientation financement m'ont débloquée rapidement. »",
    mobileQuote: '« Le suivi WhatsApp et l’orientation financement m’ont débloquée rapidement. »',
    result: 'Accompagnement validé · Équipement',
  },
]

export const JOINED_AVATARS = [IMG.avatarJoin1, IMG.avatarJoin2, IMG.avatarJoin3].map((id) => unsplash(id, 96, 96, true))
