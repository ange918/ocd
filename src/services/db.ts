import type { AppNotification, Application, ChatMessage } from '@/types'
import { createSeedApplications } from '@/data/applications'
import { createSeedMessages, createSeedNotifications } from '@/data/messages'

/**
 * Mini base de données en mémoire, persistée dans localStorage pour que
 * les changements (Kanban, statut, messages…) survivent à un rechargement.
 * À supprimer quand Supabase sera branché.
 */
interface MockDb {
  version: number
  applications: Application[]
  messages: ChatMessage[]
  notifications: AppNotification[]
}

const KEY = 'ocd.mockdb'
const VERSION = 1

function seed(): MockDb {
  const now = new Date()
  return {
    version: VERSION,
    applications: createSeedApplications(now),
    messages: createSeedMessages(now),
    notifications: createSeedNotifications(now),
  }
}

function load(): MockDb {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as MockDb
      if (parsed.version === VERSION) return parsed
    }
  } catch {
    /* stockage indisponible : on repart des données d'exemple */
  }
  return seed()
}

let db: MockDb = load()

export function getDb(): MockDb {
  return db
}

export function commit(): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(db))
  } catch {
    /* quota / mode privé : on reste en mémoire */
  }
}

/** Réinitialise les données d'exemple (utile en démo). */
export function resetDb(): void {
  db = seed()
  commit()
}
