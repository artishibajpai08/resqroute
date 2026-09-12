'use client'

import { useState, useRef, useEffect, type ReactNode } from 'react'
import { Sparkles, Send, ShieldAlert, LoaderCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const EXAMPLES = [
  'Bhai mai rasta bhatak gayi hu sunsaan jagah par',
  'Engine se achanak dhuan nikalne laga aur awaz aa rahi hai',
  'Car start nahi ho rahi, dashboard lights flicker kar rahi hain',
  'My steering wheel is shaking violently, what should I do?',
]

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
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

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: value }
    const updatedHistory = [...messages, userMsg]
    setMessages(updatedHistory)
    setInput('')
    setBusy(true)

    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: value,
          history: updatedHistory.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.reply) {
        throw new Error(data.error || 'Network error')
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.reply,
        },
      ])
    } catch {
      // Dynamic conversational fallback agar internet ya API drop ho jaye
      const isHindi = /[\u0900-\u097F]|mai|bhatak|gayi|gaya|bhai|gadi|dhuan|kya|nahi|raha|madad|sunsaan/i.test(value)
      let customReply = ''

      if (/bhatak|lost|route|rasta|sunsaan/i.test(value)) {
        customReply = isHindi
          ? "Ghabrayiye mat, bilkul shaant rahiye. Sabse pehle apni gaadi ke saare doors lock kar lijiye aur kisi well-lit spot (jaise petrol pump, toll plaza ya dhabe) ki taraf gaadi slow speed me badhayein. Kisi anjaan sunsaan jagah par gaadi rok kar niche mat utariye. Turant WhatsApp ya Google Maps se apni live location kisi family member ko bhej dijiye, aur zaroorat pade toh upar diye gaye Emergency 112 button par tap karein."
          : "Stay calm and don't panic. Lock all vehicle doors immediately and keep moving slowly towards a well-lit area like a toll booth, fuel station, or highway eatery. Avoid stopping in dark or isolated spots. Share your live GPS location with a trusted contact right now, or tap the Emergency 112 button above if you feel unsafe."
      } else if (/smoke|dhuan|heat|garam/i.test(value)) {
        customReply = isHindi
          ? "Gaadi ko turant left shoulder par safely rokiye aur hazard flashers on kar lijiye. Engine band karein aur kam se kam 25 minute thanda hone dein—bonnet ya radiator cap bilkul mat kholna, steam se haath jal sakta hai. Niche list me se tow truck ya mechanic ko call kar lijiye."
          : "Pull over to the left shoulder immediately and turn on your hazards. Turn off the engine and let it cool for at least 25 minutes. Never open the radiator cap while hot. Call a tow service from the directory below."
      } else {
        customReply = isHindi
          ? "Main aapki pareshani samajh sakta hoon. Kripya thoda detail me batayein ki aapke sath abhi kya ho raha hai—kya gaadi me mechanical fault hai, ya aap kisi unsafe jagah par fas gaye hain? Main turant sahi solution batata hoon."
          : "I understand your concern. Could you please share a bit more detail about what's happening? Let me know if it is a vehicle breakdown or a safety/navigation issue so I can guide you right away."
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: customReply,
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
            Real-time Conversational Roadside &amp; Highway Support
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
              Kuch bhi pareshani ho, seedhe batayein. Hindi ya English me baat karein:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => submit(ex)}
                  className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:border-primary/40 hover:text-primary text-left"
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
              {renderText(m.content)}
            </div>
          </div>
        ))}

        {busy && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <LoaderCircle className="size-4 animate-spin" aria-hidden />
            ResQRoute AI is typing…
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
          placeholder="Hindi ya English me type karein (e.g. Mai rasta bhatak gayi hu...)"
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
