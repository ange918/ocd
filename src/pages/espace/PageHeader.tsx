import { LogoMark } from '@/components/ui'

export function EspacePageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="px-5 pt-6 pb-4">
      <LogoMark className="h-5 opacity-90" title="OCD" />
      <h1 className="mt-3 font-display text-2xl font-medium">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-ocd-muted">{subtitle}</p>}
    </header>
  )
}
