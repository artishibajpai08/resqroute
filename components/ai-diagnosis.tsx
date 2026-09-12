'use client'

import { useState, useRef, useEffect, type ReactNode } from 'react'
import { Sparkles, Send, ShieldAlert, LoaderCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const EXAMPLES = [
  'Engine se achanak dhuan nikal raha hai aur car ruk gayi',
  'Dashboard lights flicker kar rahi hain aur gaadi start nahi ho rahi',
  'Car ke brakes lagane par loud grinding awaz aa rahi hai',
  'Tyre flat ho gaya highway par, safe kaise rahu?',
]

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
}

function renderText(text: string): ReactNode {
  return text.split('\n').map((line, i) => {
    const trimmed = line.trim()
    if (!trimmed) return <div key={i} className="h-2" />

    const inline = (s: string) =>
      s.split(/(\*\*[^*]+\*\*)/g).map((seg, j) =>
        seg.startsWith('**') && seg.endsWith('**') ? (
          <strong key={j} className="font-semibold text-foreground">
            {seg.slice(2, -2)}
          </strong>
        ) : (
          <span key={j}>{seg}</span>
        ),
      )

    return (
      <p key={i} className="text-sm leading-relaxed">
        {inline(trimmed)}
      </p>
    )
  })
}

export function AiDiagnosis() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, busy])

  async function submit(text: string) {
    const value = text.trim()
    if (!value || busy) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: value }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setBusy(true)

    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: value }),
      })

      const data = await res.json()
      const replyContent = data.reply || (typeof data === 'string' ? data : null)

      if (!res.ok || !replyContent) {
        throw new Error(data.error || 'Server error')
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: replyContent,
        },
      ])
    } catch {
      // Natural human-like triage fallback
      const fallbackText = value.match(/[a-zA-Z]/) && !value.toLowerCase().includes('bhai') && !value.toLowerCase().includes('gadi')
        ? "Please remain calm. Immediately pull over to the safety lane or shoulder, turn on your emergency hazard lights, and stay away from oncoming traffic. Do not attempt to force-drive the vehicle. You can request instant mechanical dispatch or towing from the emergency options below."
        : "Pareshan mat hoiye, sab theek ho jayega. Sabse pehle gaadi ko highway ke safe left shoulder par laga lijiye aur hazard lights (charo indicators) on kar lijiye. Gadi se bahar nikal kar traffic se safe distance banaye rakhein. Niche diye gaye directory se turant mechanic ya tow service ko call kar sakte hain.";

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: fallbackText,
        },
      ])
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-3 border-b border-border bg-foreground px-5 py-4 text-background">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary">
          <Sparkles className="size-5 text-primary-foreground" aria-hidden />
        </span>
        <div>
          <h3 className="font-display text-base font-bold leading-tight">
            ResQRoute AI Emergency Assistant
          </h3>
          <p className="text-xs text-background/70">
            Bilingual • Real-time Safety &amp; Breakdown Guidance
          </p>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="h-80 space-y-4 overflow-y-auto px-5 py-4"
        aria-live="polite"
      >
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <ShieldAlert className="size-8 text-primary" aria-hidden />
            <p className="max-w-xs text-sm text-muted-foreground text-balance">
              Gaadi me kya issue aa raha hai? Hindi ya English kisi me bhi puchiye:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => submit(ex)}
                  className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
          >
            <div
              className={
                m.role === 'user'
                  ? 'max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground'
                  : 'max-w-[92%] rounded-2xl rounded-bl-sm bg-secondary px-4 py-3 text-secondary-foreground'
              }
            >
              {renderText(m.text)}
            </div>
          </div>
        ))}

        {busy && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <LoaderCircle className="size-4 animate-spin" aria-hidden />
            AI diagnosing your situation…
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit(input)
        }}
        className="flex items-end gap-2 border-t border-border p-3"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              submit(input)
            }
          }}
          rows={1}
          placeholder="Hindi ya English me apni pareshani batayein..."
          className="max-h-32 min-h-11 flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
        />
        <Button
          type="submit"
          disabled={busy || !input.trim()}
          className="h-11 gap-2 px-4 font-semibold"
        >
          <Send className="size-4" aria-hidden />
          <span className="sr-only sm:not-sr-only">Send</span>
        </Button>
      </form>
    </div>
  )
}
