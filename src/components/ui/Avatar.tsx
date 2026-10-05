import type { Applicant } from '@/types'
import { initials } from '@/lib/format'
import { cn, toneAvatar, toneDot } from '@/lib/tones'
import { Img } from './Img'

const SIZE = {
  xs: 'h-7 w-7 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-xs',
  lg: 'h-12 w-12 text-sm',
  xl: 'h-16 w-16 text-lg',
}

export function Avatar({ person, size = 'sm', square, className }: { person: Pick<Applicant, 'fullName' | 'avatarUrl' | 'avatarTone'>; size?: keyof typeof SIZE; square?: boolean; className?: string }) {
  const shape = square ? 'rounded-2xl' : 'rounded-full'
  if (person.avatarUrl) {
    return <Img src={person.avatarUrl} alt="" className={cn(SIZE[size], shape, 'shrink-0 object-cover', className)} fallbackClassName={toneDot[person.avatarTone]} />
  }
  return (
    <span aria-hidden className={cn(SIZE[size], shape, 'flex shrink-0 items-center justify-center font-bold', toneAvatar[person.avatarTone], className)}>
      {initials(person.fullName)}
    </span>
  )
}
