/**
 * Couche « faux backend ».
 * Chaque service expose des fonctions async typées. Pour brancher Supabase plus tard,
 * il suffit de remplacer le corps de ces fonctions (ex. `supabase.from('applications').select()`)
 * sans toucher aux pages ni aux composants.
 */

/** Latence simulée (réseau mobile). */
export function delay(ms = 450): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export class ApiError extends Error {
  readonly code: string
  constructor(code: string, message: string) {
    super(message)
    this.code = code
    this.name = 'ApiError'
  }
}

export function clone<T>(value: T): T {
  return structuredClone(value)
}
