import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { Hand, Paperclip, Send, ThumbsUp } from 'lucide-react'
import type { ChatMessage } from '@/types'
import { useToast } from '@/app/providers/toast-context'
import { messagingService } from '@/services'
import { useAsync } from '@/hooks/useAsync'
import { formatDateTime, formatTime } from '@/lib/format'
import { cn } from '@/lib/tones'
import { Skeleton } from '@/components/ui/Skeleton'

interface Props {
  applicationId: string
  /** hauteur max de la zone de messages (page Messages) */
  tall?: boolean
}

function MessageBody({ body }: { body: string }) {
  const marks: ReactNode[] = []
  if (body.includes('👍')) marks.push(<ThumbsUp key="up" className="ml-1 inline size-3.5 align-[-2px]" strokeWidth={1.75} aria-hidden />)
  if (body.includes('🙌')) marks.push(<Hand key="hands" className="ml-1 inline size-3.5 align-[-2px]" strokeWidth={1.75} aria-hidden />)
  const text = body.replace(/👍|🙌/g, '').replace(/[ \t]{2,}/g, ' ').trim()
  return (
    <p className="text-xs leading-relaxed whitespace-pre-line">
      {text}
      {marks}
    </p>
  )
}

/** Messagerie de suivi candidat ↔ équipe OCD (maquette 05). */
export function ChatPanel({ applicationId, tall }: Props) {
  const toast = useToast()
  const { data, loading, setData } = useAsync(() => messagingService.listMessages(applicationId), [applicationId])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [typing, setTyping] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const messages = data ?? []

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages.length, typing])

  const send = async (e: FormEvent) => {
    e.preventDefault()
    const body = text.trim()
    if (!body || sending) return
    setSending(true)
    setText('')
    try {
      const msg = await messagingService.sendMessage(applicationId, body)
      setData((list) => [...(list ?? []), msg])
      setTyping(true)
      const reply = await messagingService.simulateTeamReply(applicationId)
      setData((list) => [...(list ?? []), reply])
    } catch {
      toast({ title: 'Message non envoyé', description: 'Vérifie ta connexion.', tone: 'error' })
      setText(body)
    } finally {
      setSending(false)
      setTyping(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-ocd-border bg-ocd-card">
      <div className="flex items-center gap-3 border-b border-ocd-border px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ocd-orange text-xs font-extrabold text-ocd-black" aria-hidden>
          O
        </div>
        <div>
          <p className="text-sm font-semibold">Équipe OCD</p>
          <p className="text-[10px] text-ocd-green">En ligne · réponse habituelle &lt; 24h</p>
        </div>
      </div>
      <div ref={listRef} className={cn('space-y-3 overflow-y-auto px-4 py-4', tall ? 'max-h-[calc(100dvh-260px)] min-h-[300px]' : 'max-h-[420px]')} aria-live="polite" aria-label="Messages">
        {loading && (
          <>
            <Skeleton className="h-16 w-4/5" />
            <Skeleton className="ml-auto h-10 w-2/3" />
          </>
        )}
        <AnimatePresence initial={false}>
          {messages.map((msg: ChatMessage) => {
            const mine = msg.author === 'candidate'
            return (
              <m.div
                key={msg.id}
                layout
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                className={cn(
                  'max-w-[85%] border px-3.5 py-2.5',
                  mine ? 'ml-auto rounded-2xl rounded-tr-md border-ocd-orange/30 bg-ocd-orange/20' : 'rounded-2xl rounded-tl-md border-ocd-border bg-ocd-anthra',
                )}
              >
                <MessageBody body={msg.body} />
                <p className={cn('mt-1.5 text-[10px] text-ocd-muted', mine && 'text-right')}>{mine ? formatTime(msg.sentAt) : formatDateTime(msg.sentAt)}</p>
              </m.div>
            )
          })}
        </AnimatePresence>
        <AnimatePresence>
          {typing && (
            <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-1 rounded-2xl rounded-tl-md border border-ocd-border bg-ocd-anthra px-3.5 py-3" aria-label="L'équipe OCD écrit">
              {[0, 1, 2].map((i) => (
                <m.span key={i} className="h-1.5 w-1.5 rounded-full bg-ocd-muted" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }} />
              ))}
            </m.div>
          )}
        </AnimatePresence>
      </div>
      <form onSubmit={send} className="flex items-center gap-2 border-t border-ocd-border px-3 py-3">
        <m.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={() => toast({ title: 'Pièces jointes bientôt disponibles', description: 'En attendant, envoie tes photos via WhatsApp.', tone: 'info' })}
          aria-label="Ajouter une pièce jointe"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ocd-border text-ocd-muted hover:text-ocd-cream"
        >
          <Paperclip className="size-4" strokeWidth={1.75} />
        </m.button>
        <label htmlFor={`chat-${applicationId}`} className="sr-only">
          Écrire un message
        </label>
        <input
          id={`chat-${applicationId}`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Écrire un message…"
          maxLength={1000}
          className="min-w-0 flex-1 rounded-full border border-ocd-border bg-ocd-anthra px-4 py-2 text-xs outline-none focus:border-ocd-orange focus:ring-2 focus:ring-ocd-orange/30"
        />
        <m.button
          type="submit"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.06 }}
          disabled={!text.trim() || sending}
          aria-label="Envoyer"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ocd-orange text-ocd-black disabled:opacity-50"
        >
          <Send className="size-4" strokeWidth={1.75} />
        </m.button>
      </form>
    </div>
  )
}
