import { createContext, useContext, type ReactNode } from 'react'

export type ToastTone = 'success' | 'info' | 'error'

export interface ToastInput {
  title: ReactNode
  description?: ReactNode
  tone?: ToastTone
  /** ms, défaut 3800 */
  duration?: number
}

export interface ToastItem extends Required<Omit<ToastInput, 'description'>> {
  id: number
  description?: ReactNode
}

export const ToastContext = createContext<((t: ToastInput) => void) | null>(null)

export function useToast(): (t: ToastInput) => void {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast doit être utilisé dans <ToastProvider>')
  return ctx
}
