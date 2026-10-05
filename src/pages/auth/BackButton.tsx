import { useNavigate } from 'react-router'
import { m } from 'framer-motion'
import { Icon } from '@/components/ui'

export function BackButton({ to, label = 'Retour' }: { to?: string; label?: string }) {
  const navigate = useNavigate()
  return (
    <m.button
      type="button"
      whileTap={{ scale: 0.92 }}
      onClick={() => {
        if (to) navigate(to)
        else if ((window.history.state as { idx?: number } | null)?.idx) navigate(-1)
        else navigate('/')
      }}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-ocd-border text-ocd-muted transition-colors hover:text-ocd-cream"
    >
      <Icon.ChevronLeft />
    </m.button>
  )
}
