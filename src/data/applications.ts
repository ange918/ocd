import type { Application, ApplicationStatus, HistoryEvent } from '@/types'
import { IMG, unsplash } from './images'

/** Données d'exemple reprises des maquettes 06 / 07 / 08 (projets fictifs). */

const at = (iso: string) => new Date(iso).toISOString()

function todayAt(h: number, m: number, now: Date): string {
  const d = new Date(now)
  d.setHours(h, m, 0, 0)
  return d.toISOString()
}

function baseHistory(submittedAt: string, who: string, status: ApplicationStatus, statusAt?: string): HistoryEvent[] {
  const events: HistoryEvent[] = [
    { id: `h-${who}-sub`, kind: 'submitted', label: 'Dossier soumis', at: submittedAt, meta: who, status: 'soumis' },
  ]
  if (status !== 'soumis') {
    events.unshift({
      id: `h-${who}-st`,
      kind: 'status',
      label: `Statut → ${statusLabel(status)}`,
      at: statusAt ?? submittedAt,
      meta: 'Système',
      status,
    })
  }
  return events
}

function statusLabel(s: ApplicationStatus): string {
  return {
    soumis: 'Soumis',
    en_etude: "En cours d'étude",
    preselectionne: 'Présélectionné / Contacté',
    accompagne: 'Accompagnement validé',
    cloture: 'Clôturé',
  }[s]
}

export const DEMO_CANDIDATE_PHONE = '+22997124588'
export const DEMO_APPLICATION_ID = 'saveurs-du-plateau'

export function createSeedApplications(now: Date = new Date()): Application[] {
  return [
    {
      id: DEMO_APPLICATION_ID,
      title: 'Saveurs du Plateau',
      applicant: { id: 'u-yao', fullName: 'Yao Adjoa', phone: DEMO_CANDIDATE_PHONE, avatarUrl: unsplash(IMG.avatarYao, 128, 128, true), avatarTone: 'orange' },
      sector: 'commerce',
      stage: 'demarre',
      needs: ['visibilite', 'mentoring'],
      city: 'Abomey-Calavi',
      country: 'Bénin',
      description:
        "Je prépare et vends des snacks à base de produits locaux (gari, arachide, plantain) auprès des étudiants d'Abomey-Calavi. Objectif : ouvrir un second point de vente près du campus et professionnaliser le branding.",
      status: 'en_etude',
      submittedAt: at('2026-09-28T14:22:00'),
      media: [
        { id: 'm1', kind: 'image', name: 'Stand', url: unsplash(IMG.foodStand, 500, 400) },
        { id: 'm2', kind: 'image', name: 'Produits', url: unsplash(IMG.foodProduct, 500, 400) },
        { id: 'm3', kind: 'video', name: 'pitch-30s.mp4', sizeLabel: '4,2 Mo' },
      ],
      pendingRequest: 'Photo nette du stand + devis 2ᵉ point de vente',
      notes: [
        {
          id: 'n1',
          author: 'Aminata K.',
          body: 'Profil solide, présence locale claire. Manque une preuve visuelle du stand et une estimation budgétaire pour le scale. Mentoring branding + photo shoot potentiellement pertinents.',
          createdAt: at('2026-10-02T09:14:00'),
        },
        {
          id: 'n2',
          author: 'Jean-Paul B.',
          body: 'Cohérent avec la vague « commerce campus ». À croiser avec le mentor food de Cotonou.',
          createdAt: at('2026-10-01T16:40:00'),
        },
      ],
      history: [
        { id: 'h-yao-req', kind: 'request', label: 'Demande de pièce complémentaire envoyée', at: todayAt(7, 14, now), meta: 'WhatsApp · Aminata K.' },
        { id: 'h-yao-st', kind: 'status', label: "Statut → En cours d'étude", at: at('2026-09-29T10:02:00'), meta: 'Système', status: 'en_etude' },
        { id: 'h-yao-sub', kind: 'submitted', label: 'Dossier soumis', at: at('2026-09-28T14:22:00'), meta: 'Yao Adjoa', status: 'soumis' },
      ],
      seed: true,
    },
    app('wax-atelier-siya', 'Wax Atelier Siya', 'Siya Traoré', '+2250701020304', 'mode', 'Abidjan', "Côte d'Ivoire", ['equipement'], 'soumis', '2026-10-05T09:10:00', { avatarUrl: unsplash(IMG.avatarSiya, 128, 128, true), avatarTone: 'yellow' }, 'demarre',
      'Atelier de couture wax sur mesure à Yopougon. Besoin de deux machines industrielles pour honorer les commandes de boutiques partenaires.'),
    app('jolof-print', 'Jolof Print', 'Jean Mendy', '+221771234567', 'services', 'Dakar', 'Sénégal', ['visibilite'], 'soumis', '2026-10-04T11:30:00', { avatarTone: 'blue' }, 'demarre',
      'Impression textile et supports événementiels pour associations et PME dakaroises.'),
    app('ekpe-crafts', 'Ekpê Crafts', 'Esi Koffi', '+22966554433', 'artisanat', 'Porto-Novo', 'Bénin', ['mentoring'], 'soumis', '2026-10-03T15:05:00', { avatarTone: 'orange' }, 'idee',
      'Objets de décoration en bois recyclé et perles, vendus aux touristes et en ligne.'),
    app('biomarche-cotonou', 'BioMarché Cotonou', 'Béatrice Agbo', '+22995112233', 'commerce', 'Cotonou', 'Bénin', ['financement'], 'en_etude', '2026-10-01T08:45:00', { avatarTone: 'green' }, 'demarre',
      'Panier hebdomadaire de légumes bio livrés à domicile depuis des maraîchers de Sèmè-Podji.'),
    app('rhythms-studio', 'Rhythms Studio', 'Raoul Okou', '+22890112233', 'art_culture', 'Lomé', 'Togo', ['visibilite'], 'en_etude', '2026-09-30T17:20:00', { avatarTone: 'purple' }, 'demarre',
      "Studio d'enregistrement et de production pour jeunes artistes urbains de Lomé."),
    app('livro-togo', 'Livro Togo', 'Kodjo Mensah', '+22891223344', 'tech', 'Lomé', 'Togo', ['mentoring'], 'preselectionne', '2026-09-27T10:00:00', { avatarUrl: unsplash(IMG.avatarKodjo, 128, 128, true), avatarTone: 'green' }, 'demarre',
      'Application de livraison locale qui relie commerçants de quartier et livreurs à moto.'),
    app('nana-beauty-lab', 'Nana Beauty Lab', 'Nana Asante', '+233241234567', 'services', 'Accra*', 'Ghana', ['equipement'], 'preselectionne', '2026-09-25T13:15:00', { avatarTone: 'yellow' }, 'demarre',
      'Salon de beauté et cosmétiques naturels à base de karité.'),
    app('depot-teranga', 'Dépôt Teranga', 'Fatou Diallo', '+221781112233', 'commerce', 'Dakar', 'Sénégal', ['financement'], 'accompagne', '2026-09-22T09:30:00', { avatarTone: 'green' }, 'scale',
      'Dépôt de produits de première nécessité qui approvisionne les boutiques de Pikine.'),
    app('atelier-aicha', 'Atelier Aïcha', 'Aïcha K.', '+22997001122', 'mode', 'Porto-Novo', 'Bénin', ['mentoring'], 'accompagne', '2026-09-15T16:00:00', { avatarTone: 'orange' }, 'demarre',
      'Atelier de mode qui structure sa production et vend hors de Porto-Novo.'),
    app('pagne-and-co', 'Pagne & Co', 'Paul Kouassi', '+2250504030201', 'mode', 'Abidjan', "Côte d'Ivoire", ['visibilite'], 'cloture', '2026-08-02T12:00:00', { avatarTone: 'muted' }, 'scale',
      'Marque de prêt-à-porter en pagne tissé.'),
  ]
}

function app(
  id: string,
  title: string,
  fullName: string,
  phone: string,
  sector: Application['sector'],
  city: string,
  country: string,
  needs: Application['needs'],
  status: ApplicationStatus,
  submitted: string,
  avatar: Pick<Application['applicant'], 'avatarUrl' | 'avatarTone'>,
  stage: Application['stage'],
  description: string,
): Application {
  const submittedAt = at(submitted)
  const statusAt = new Date(new Date(submitted).getTime() + 26 * 3600 * 1000).toISOString()
  return {
    id,
    title,
    applicant: { id: `u-${id}`, fullName, phone, ...avatar },
    sector,
    stage,
    needs,
    city,
    country,
    description,
    status,
    submittedAt,
    media: [],
    notes: [],
    history: baseHistory(submittedAt, fullName, status, statusAt),
    seed: true,
  }
}

/** Ordre exact du tableau « Dernières candidatures » de la maquette 06. */
export const FEATURED_RECENT_IDS = [DEMO_APPLICATION_ID, 'livro-togo', 'wax-atelier-siya', 'depot-teranga']
