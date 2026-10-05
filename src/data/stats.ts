import type { DashboardStats } from '@/types'

/** Chiffres d'exemple de la maquette 06 — non représentatifs de données réelles. */
export const DASHBOARD_STATS: DashboardStats = {
  weekLabel: 'Semaine du 29 sept. – 5 oct. 2026',
  kpis: [
    { id: 'total', label: 'Total candidatures', value: '1 247', caption: '+12% vs mois précédent*', tone: 'cream', captionTone: 'green' },
    { id: 'week', label: 'Nouvelles cette semaine', value: '86', caption: "dont 24 aujourd'hui*", tone: 'orange' },
    { id: 'rate', label: 'Taux de présélection', value: '68%', caption: 'sur dossiers traités*', tone: 'yellow' },
    { id: 'active', label: 'Accompagnements actifs', value: '142', caption: 'en cours*', tone: 'green' },
  ],
  geo: [
    { city: 'Cotonou', count: 312, percent: 78, tone: 'orange' },
    { city: 'Abidjan', count: 248, percent: 62, tone: 'soft' },
    { city: 'Lomé', count: 186, percent: 46, tone: 'yellow' },
    { city: 'Dakar', count: 164, percent: 41, tone: 'green' },
    { city: 'Porto-Novo', count: 98, percent: 24, tone: 'muted' },
    { city: 'Abomey-Calavi', count: 87, percent: 22, tone: 'muted' },
  ],
  sectorsTotal: '1,2k',
  sectors: [
    { label: 'Commerce', percent: 28, color: '#F15A24' },
    { label: 'Tech', percent: 20, color: '#2DD4A8' },
    { label: 'Mode', percent: 20, color: '#F5C518' },
    { label: 'Services', percent: 14, color: '#8B5CF6' },
    { label: 'Artisanat', percent: 12, color: '#60A5FA' },
    { label: 'Autre', percent: 6, color: '#A1A1AA' },
  ],
  pipeline: [
    { status: 'soumis', label: 'Soumis', count: 214, percent: 35 },
    { status: 'en_etude', label: 'En étude', count: 298, percent: 48 },
    { status: 'preselectionne', label: 'Présélection', count: 176, percent: 28 },
    { status: 'accompagne', label: 'Accompagné', count: 142, percent: 23 },
    { status: 'cloture', label: 'Clôturé', count: 417, percent: 67 },
  ],
}
