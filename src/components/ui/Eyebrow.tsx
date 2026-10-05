import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/tones'

/** Sur-titre en capitales espacées (0.32em) hérité de la baseline du logo. */
export function Eyebrow({ as: Tag = 'p', className, children }: { as?: ElementType; className?: string; children: ReactNode }) {
  return <Tag className={cn('eyebrow text-ocd-orange', className)}>{children}</Tag>
}
