import type { Country } from '@/types'

/** Indicatifs proposés à la connexion — +229 Bénin par défaut. */
export const COUNTRIES: Country[] = [
  { code: 'BJ', dial: '+229', name: 'Bénin', minDigits: 8, maxDigits: 10 },
  { code: 'TG', dial: '+228', name: 'Togo', minDigits: 8, maxDigits: 8 },
  { code: 'CI', dial: '+225', name: "Côte d'Ivoire", minDigits: 10, maxDigits: 10 },
  { code: 'SN', dial: '+221', name: 'Sénégal', minDigits: 9, maxDigits: 9 },
  { code: 'BF', dial: '+226', name: 'Burkina Faso', minDigits: 8, maxDigits: 8 },
  { code: 'ML', dial: '+223', name: 'Mali', minDigits: 8, maxDigits: 8 },
  { code: 'NE', dial: '+227', name: 'Niger', minDigits: 8, maxDigits: 8 },
  { code: 'GH', dial: '+233', name: 'Ghana', minDigits: 9, maxDigits: 9 },
]

export const DEFAULT_COUNTRY: Country = COUNTRIES[0]!
