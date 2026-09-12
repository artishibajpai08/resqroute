'use client'

import { useState, useRef, useEffect, type ReactNode } from 'react'
import { Sparkles, Send, ShieldAlert, LoaderCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const EXAMPLES = [
  'Engine se achanak dhuan nikal raha hai aur car ruk gayi',
  'Dashboard lights flicker kar rahi hain aur car start nahi ho rahi',
  'Brakes dabane par loud grinding noise aa rahi hai',
  'Highway par puncture ho gaya hai, safety steps kya hain?',
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

      if (!res.ok || !data.reply) {
        throw new Error(data.error || 'API failed')
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: data.reply,
        },
      ])
    } catch {
      // Natural conversational fallback in case of connection drop
      const isHindi = /[\u0900-\u097F]|bhai|gadi|dhuan|kya|nahi|raha|madad/i.test(value)
      const isGreeting = /^(hi|hello|hey|namaste|salaam)/i.test(value.trim())

      let fallbackText = ''
      if (isGreeting) {
        fallbackText = isHindi
          ? "Namaste! Main ResQRoute Assistant hoon. Aapki gaadi me kya pareshani aa rahi hai? Mujhe batayein, main madad karta hoon."
          : "Hello! I am your ResQRoute roadside assistant. How can I help you with your vehicle today?"
      } else {
        fallbackText = isHindi
          ? "Ghabrayiye mat. Sabse pehle gaadi ko highway ke safe left side (shoulder) par rok lijiye aur hazard lights on kar lijiye. Gaadi ka bonnet abhi mat kholiye. Niche di gayi list se nearest mechanic ya towing ko turant call kar sakte hain."
          : "Please stay safe. Gently steer your vehicle onto the road shoulder and turn on your emergency hazard flashers. Avoid opening hot components. You can instantly reach nearest emergency mechanics or towing from the directory below."
      }

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
            ResQRoute Emergency AI Assistant
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
              Gaadi me kya pareshani hai? Hindi ya English kisi me bhi puchiye:
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
