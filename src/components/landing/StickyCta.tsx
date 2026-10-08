import { useEffect, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { ButtonLink } from '@/components/ui'

/** CTA collant mobile : visible une fois le hero passé, masqué devant le CTA final. */
export function StickyCta() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('hero-title')
    const end = document.getElementById('cta-title')
    if (!hero || !end) return
    let raf = 0
    const update = () => {
      raf = 0
      const pastHero = hero.getBoundingClientRect().bottom < 0
      const atEnd = end.getBoundingClientRect().top < window.innerHeight * 0.75
      setShow(pastHero && !atEnd)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

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
