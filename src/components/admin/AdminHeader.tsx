import type { ReactNode } from 'react'

/** En-tête de page back-office (h-16, bordure basse). */
export function AdminHeader({ title, subtitle, actions, children }: { title?: ReactNode; subtitle?: ReactNode; actions?: ReactNode; children?: ReactNode }) {
  return (
    <header className="border-b border-ocd-border px-4 py-3 sm:px-6 lg:px-8">
      <div className="flex min-h-10 flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          {title && <h1 className="font-display text-lg font-medium">{title}</h1>}
          {subtitle && <p className="text-xs text-ocd-muted">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
      {children}
    </header>
  )
}
