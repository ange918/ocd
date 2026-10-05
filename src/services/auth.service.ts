import type { Role, Session } from '@/types'
import { ApiError, delay } from './client'

/** Code OTP accepté par le mock. */
export const MOCK_OTP = '123456'
/** Numéro qui ouvre une session admin dans le mock (+229 01 00 00 00 00). */
export const MOCK_ADMIN_PHONE = '+2290100000000'

export type OtpChannel = 'sms' | 'whatsapp'

const SESSION_KEY = 'ocd.session'

export interface OtpRequest {
  phone: string
  channel: OtpChannel
  /** secondes avant de pouvoir renvoyer */
  resendIn: number
}

/** TODO Supabase : supabase.auth.signInWithOtp({ phone, options: { channel } }) */
export async function requestOtp(phone: string, channel: OtpChannel = 'sms'): Promise<OtpRequest> {
  await delay(700)
  if (!/^\+\d{10,15}$/.test(phone)) throw new ApiError('invalid_phone', 'Numéro invalide.')
  return { phone, channel, resendIn: 45 }
}

/** TODO Supabase : supabase.auth.verifyOtp({ phone, token, type: 'sms' }) */
export async function verifyOtp(phone: string, code: string): Promise<Session> {
  await delay(650)
  if (code !== MOCK_OTP) throw new ApiError('invalid_otp', 'Code incorrect. Vérifie le SMS et réessaie.')
  const role: Role = phone === MOCK_ADMIN_PHONE ? 'admin' : 'candidate'
  const session: Session = { phone, role, token: `mock-${Date.now()}` }
  saveSession(session)
  return session
}

export async function signInWithGoogle(): Promise<never> {
  await delay(400)
  throw new ApiError('not_available', 'Connexion Google bientôt disponible.')
}

export function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

export function saveSession(session: Session): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } catch {
    /* ignore */
  }
}

export async function signOut(): Promise<void> {
  await delay(200)
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {
    /* ignore */
  }
}
