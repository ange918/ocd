import { cn } from '@/lib/tones'

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn('animate-pulse rounded-2xl bg-ocd-card', className)} />
}
