import type { AppNotification, ChatMessage } from '@/types'
import { uid } from '@/lib/format'
import { clone, delay } from './client'
import { commit, getDb } from './db'

/** TODO Supabase : table `messages` + abonnement realtime sur application_id */
export async function listMessages(applicationId: string): Promise<ChatMessage[]> {
  await delay(300)
  return clone(getDb().messages.filter((m) => m.applicationId === applicationId).sort((a, b) => a.sentAt.localeCompare(b.sentAt)))
}

export async function sendMessage(applicationId: string, body: string, author: ChatMessage['author'] = 'candidate'): Promise<ChatMessage> {
  await delay(400)
  const message: ChatMessage = { id: uid('msg'), applicationId, author, body: body.trim(), sentAt: new Date().toISOString() }
  getDb().messages.push(message)
  commit()
  return clone(message)
}

/** Réponse automatique simulée de l'équipe (démo uniquement). */
export async function simulateTeamReply(applicationId: string): Promise<ChatMessage> {
  await delay(1800)
  return sendMessage(applicationId, 'Merci, c’est bien noté ! L’équipe OCD revient vers toi très vite. 🙌', 'team')
}

/** TODO Supabase : table `notifications` filtrée sur l'utilisateur connecté */
export async function listNotifications(applicationId: string): Promise<AppNotification[]> {
  await delay(300)
  return clone(getDb().notifications.filter((n) => n.applicationId === applicationId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
}

export async function markAllNotificationsRead(applicationId: string): Promise<void> {
  await delay(250)
  getDb().notifications.forEach((n) => {
    if (n.applicationId === applicationId) {
      n.read = true
      n.highlight = false
    }
  })
  commit()
}
