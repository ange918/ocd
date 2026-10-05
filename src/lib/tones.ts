import type { Tone } from '@/types'

/** Classes Tailwind écrites en toutes lettres pour que le compilateur les détecte. */
export const toneText: Record<Tone, string> = {
  orange: 'text-ocd-orange',
  soft: 'text-ocd-soft',
  green: 'text-ocd-green',
  yellow: 'text-ocd-yellow',
  blue: 'text-blue-300',
  purple: 'text-purple-300',
  muted: 'text-ocd-muted',
}

export const toneSoftBg: Record<Tone, string> = {
  orange: 'bg-ocd-orange/15 text-ocd-soft',
  soft: 'bg-ocd-soft/15 text-ocd-soft',
  green: 'bg-ocd-green/15 text-ocd-green',
  yellow: 'bg-ocd-yellow/15 text-ocd-yellow',
  blue: 'bg-blue-500/15 text-blue-300',
  purple: 'bg-purple-500/15 text-purple-300',
  muted: 'bg-ocd-border text-ocd-muted',
}

export const toneAvatar: Record<Tone, string> = {
  orange: 'bg-ocd-orange/20 text-ocd-orange',
  soft: 'bg-ocd-soft/20 text-ocd-soft',
  green: 'bg-ocd-green/20 text-ocd-green',
  yellow: 'bg-ocd-yellow/20 text-ocd-yellow',
  blue: 'bg-blue-500/20 text-blue-300',
  purple: 'bg-purple-500/20 text-purple-300',
  muted: 'bg-ocd-border text-ocd-muted',
}

export const toneDot: Record<Tone, string> = {
  orange: 'bg-ocd-orange',
  soft: 'bg-ocd-soft',
  green: 'bg-ocd-green',
  yellow: 'bg-ocd-yellow',
  blue: 'bg-blue-400',
  purple: 'bg-purple-500',
  muted: 'bg-ocd-muted',
}

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
