import type { AppNotification, ChatMessage } from '@/types'
import { DEMO_APPLICATION_ID } from './applications'

function todayAt(h: number, m: number, now: Date): string {
  const d = new Date(now)
  d.setHours(h, m, 0, 0)
  return d.toISOString()
}

export function createSeedMessages(now: Date = new Date()): ChatMessage[] {
  return [
    {
      id: 'msg-1',
      applicationId: DEMO_APPLICATION_ID,
      author: 'team',
      body: 'Bonjour Yao ! Pour finaliser l’étude de Saveurs du Plateau, peux-tu nous envoyer une photo nette de ton stand actuel + un devis approximatif pour le 2ᵉ point de vente ?',
      sentAt: todayAt(7, 14, now),
    },
    { id: 'msg-2', applicationId: DEMO_APPLICATION_ID, author: 'candidate', body: 'Bien reçu, je prépare ça aujourd’hui 👍', sentAt: todayAt(7, 22, now) },
  ]
}

export function createSeedNotifications(now: Date = new Date()): AppNotification[] {
  return [
    {
      id: 'notif-1',
      applicationId: DEMO_APPLICATION_ID,
      icon: 'paperclip',
      title: 'Pièce complémentaire demandée',
      meta: 'Voir la messagerie',
      createdAt: new Date(now.getTime() - 2 * 3600 * 1000).toISOString(),
      read: false,
      highlight: true,
    },
    {
      id: 'notif-2',
      applicationId: DEMO_APPLICATION_ID,
      icon: 'inbox',
      title: 'Dossier reçu — confirmation',
      meta: 'WhatsApp',
      createdAt: new Date('2026-09-28T14:25:00').toISOString(),
      read: true,
    },
  ]
}
