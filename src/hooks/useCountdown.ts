import { useEffect, useState } from 'react'

/** Compte à rebours en secondes (renvoi du code OTP). */
export function useCountdown(initial: number): [number, (s: number) => void] {
  const [left, setLeft] = useState(initial)
  useEffect(() => {
    if (left <= 0) return
    const t = setTimeout(() => setLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [left])
  return [left, setLeft]
}
