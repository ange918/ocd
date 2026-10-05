import { useState, type ImgHTMLAttributes } from 'react'
import { cn } from '@/lib/tones'

type ImgProps = ImgHTMLAttributes<HTMLImageElement> & {
  /** Classes appliquées au bloc de remplacement si l'image ne charge pas (réseau lent / hors ligne). */
  fallbackClassName?: string
  priority?: boolean
}

/** Image légère : lazy-loading par défaut + dégradé de secours si le réseau échoue. */
export function Img({ className, fallbackClassName = 'bg-gradient-to-br from-ocd-orange/40 to-ocd-card', priority, alt = '', ...rest }: ImgProps) {
  const [failed, setFailed] = useState(false)
  if (failed) return <div role={alt ? 'img' : undefined} aria-label={alt || undefined} className={cn(className, fallbackClassName)} />
  return (
    <img
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  )
}
