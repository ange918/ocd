import { useEffect, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { ButtonLink } from '@/components/ui'

/** CTA collant mobile : visible une fois le hero passé, masqué devant le CTA final. */
export function StickyCta() {
  const [pastHero, setPastHero] = useState(false)
  const [atEnd, setAtEnd] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('hero-title')
    const end = document.getElementById('cta-title')
    if (!hero || !end) return
    const heroObs = new IntersectionObserver(([e]) => e && setPastHero(!e.isIntersecting && e.boundingClientRect.top < 0))
    const endObs = new IntersectionObserver(([e]) => e && setAtEnd(e.isIntersecting || e.boundingClientRect.top < 0), { rootMargin: '0px 0px 25% 0px' })
    heroObs.observe(hero)
    endObs.observe(end)
    return () => {
      heroObs.disconnect()
      endObs.disconnect()
    }
  }, [])

  const show = pastHero && !atEnd
  return (
    <AnimatePresence>
      {show && (
        <m.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] glass md:hidden"
        >
          <ButtonLink to="/candidature" size="lg" glow fullWidth className="min-h-12 text-[15px]">
            Soumettre mon projet
          </ButtonLink>
        </m.div>
      )}
    </AnimatePresence>
  )
}
