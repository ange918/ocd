/**
 * Informations légales de l'éditeur — À COMPLÉTER par OCD avant mise en production.
 * Les valeurs « [à compléter] » sont volontairement non renseignées : ne pas les inventer.
 */
export const LEGAL_ENTITY = {
  name: 'OCD — Les Opportunités, C\'est Dehors',
  form: '[forme juridique à compléter]',
  address: '[adresse du siège à compléter]',
  registration: '[n° RCCM / IFU ou équivalent à compléter]',
  publisher: '[nom du directeur de la publication à compléter]',
  email: 'hello@ocd-app.example',
  whatsapp: '+229 ··· ··· ···',
  host: 'Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis',
}

export type LegalSlug = 'mentions-legales' | 'confidentialite' | 'conditions'

export interface LegalDoc {
  title: string
  intro: string
  sections: { title: string; body: string[] }[]
}

export const LEGAL_LINKS: { slug: LegalSlug; label: string }[] = [
  { slug: 'mentions-legales', label: 'Mentions légales' },
  { slug: 'confidentialite', label: 'Confidentialité' },
  { slug: 'conditions', label: 'Conditions d\'utilisation' },
]

const E = LEGAL_ENTITY

export const LEGAL_DOCS: Record<LegalSlug, LegalDoc> = {
  'mentions-legales': {
    title: 'Mentions légales',
    intro: 'Informations légales relatives au site et à la plateforme OCD.',
    sections: [
      { title: 'Éditeur du site', body: [`${E.name}`, `Forme juridique : ${E.form}`, `Siège : ${E.address}`, `Immatriculation : ${E.registration}`, `Directeur de la publication : ${E.publisher}`, `Contact : ${E.email} · WhatsApp ${E.whatsapp}`] },
      { title: 'Hébergement', body: [`Le site est hébergé par ${E.host}.`] },
      { title: 'Propriété intellectuelle', body: ['Le nom OCD, le logo, les textes, visuels et l\'ensemble des contenus de la plateforme sont protégés. Toute reproduction ou réutilisation sans autorisation écrite préalable est interdite.', 'Les projets et visuels soumis par les candidats restent la propriété de leurs auteurs.'] },
      { title: 'Responsabilité', body: ['OCD s\'efforce de fournir des informations exactes mais ne garantit pas l\'absence d\'erreurs. Les chiffres et témoignages affichés sur la page d\'accueil sont des exemples tant qu\'ils sont marqués d\'un astérisque.', 'Soumettre un projet ne garantit pas l\'obtention d\'un accompagnement.'] },
      { title: 'Contact', body: [`Pour toute question juridique : ${E.email}.`] },
    ],
  },
  confidentialite: {
    title: 'Politique de confidentialité',
    intro: 'Comment OCD collecte, utilise et protège tes données personnelles.',
    sections: [
      { title: 'Données collectées', body: ['Numéro de téléphone (connexion par code), informations de ton profil et de ton projet (titre, secteur, stade, besoin, photos ou vidéo), messages échangés avec l\'équipe OCD.'] },
      { title: 'Finalités', body: ['Étudier ta candidature, te contacter (notamment via WhatsApp), suivre l\'avancement de ton dossier et améliorer la plateforme. Tes données ne sont jamais revendues.'] },
      { title: 'Conservation', body: ['Les données sont conservées pendant la durée nécessaire à l\'étude et au suivi de ton dossier, puis supprimées ou anonymisées. [Durée précise à compléter.]'] },
      { title: 'Partage', body: ['Seule l\'équipe OCD habilitée y accède. Nos prestataires techniques (hébergement, envoi de codes) traitent les données uniquement pour notre compte.'] },
      { title: 'Tes droits', body: [`Tu peux demander l'accès, la rectification ou la suppression de tes données en écrivant à ${E.email}. Tu peux aussi retirer ton consentement à tout moment.`] },
      { title: 'Cookies', body: ['La plateforme n\'utilise que le stockage technique nécessaire à son fonctionnement (session de connexion). Aucun cookie publicitaire.'] },
    ],
  },
  conditions: {
    title: 'Conditions d\'utilisation',
    intro: 'Règles d\'usage de la plateforme OCD.',
    sections: [
      { title: 'Objet', body: ['OCD est une plateforme gratuite qui permet de soumettre un projet entrepreneurial en vue d\'un accompagnement (visibilité, mentoring, équipement, orientation financement).'] },
      { title: 'Compte et candidature', body: ['Tu t\'engages à fournir des informations exactes et à ne soumettre que des contenus dont tu détiens les droits. Un compte est lié à ton numéro de téléphone.'] },
      { title: 'Sélection', body: ['L\'équipe OCD étudie chaque dossier librement. La présélection ou l\'accompagnement ne sont pas garantis et OCD n\'a pas à motiver un refus.'] },
      { title: 'Comportements interdits', body: ['Contenus illicites, trompeurs ou portant atteinte à des tiers, usurpation d\'identité, tentative d\'accès non autorisé à la plateforme.'] },
      { title: 'Évolution', body: ['OCD peut modifier ces conditions ; la version en vigueur est celle publiée sur cette page.'] },
    ],
  },
}
