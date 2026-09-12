'use client'

import { useState, useRef, useEffect, type ReactNode } from 'react'
import { Sparkles, Send, ShieldAlert, LoaderCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const EXAMPLES = [
  'White smoke from the engine and it overheated',
  'Car stalled and won’t start, dashboard lights flicker',
  'Loud grinding noise when I brake',
  'Flat tyre on the highway shoulder',
]

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
}

function getLocalEmergencyTriage(problem: string): string {
  const q = problem.toLowerCase()

  if (q.includes('heat') || q.includes('smoke') || q.includes('coolant') || q.includes('radiator')) {
    return `**🛡️ Immediate Safety Step:**
- Do not panic. Gently pull over to the highway shoulder away from traffic.
- Turn on hazard lights immediately.
- **CRITICAL WARNING:** NEVER open the radiator cap while the engine is hot—it can cause severe steam burns.

**🔍 Probable Diagnosis:**
- Coolant leak, failed radiator cooling fan, or blown head gasket causing severe thermal rise.

**🛠️ Recommended Next Action:**
- Turn off the engine and let it cool down for 25–30 minutes.
- Select **Flatbed Towing** or an **Express Mechanic** from the directory below to avoid permanent engine seizure.`
  }

  if (q.includes('brake') || q.includes('grinding') || q.includes('pedal')) {
    return `**🛡️ Immediate Safety Step:**
- Avoid sudden aggressive stomping on the pedal.
- Shift down to lower gears for engine braking and safely move to the shoulder lane.
- Turn on your hazard flashers once parked safely.

**🔍 Probable Diagnosis:**
- Severely worn brake pads grinding directly onto the rotor, or hydraulic brake fluid loss.

**🛠️ Recommended Next Action:**
- **DO NOT continue driving at high highway speeds.**
- Connect with the nearest verified roadside brake specialist listed below immediately.`
  }

  if (q.includes('stall') || q.includes('start') || q.includes('battery') || q.includes('flicker') || q.includes('dead')) {
    return `**🛡️ Immediate Safety Step:**
- If stalled on the road, immediately switch on hazard lights so oncoming vehicles spot you.
- If it is dark, stay safely inside the locked cabin while contacting roadside help.

**🔍 Probable Diagnosis:**
- Discharged battery, loose terminal connection, or failed alternator unable to supply current.

**🛠️ Recommended Next Action:**
- Call a nearby mobile mechanic from the directory for jump-start assistance or alternator testing.`
  }

  if (q.includes('tyre') || q.includes('tire') || q.includes('puncture') || q.includes('flat')) {
    return `**🛡️ Immediate Safety Step:**
- Keep firm control of the steering wheel and roll gradually to a level, flat surface on the shoulder.
- Engage the handbrake completely. Never change a tyre on the traffic-facing side without clear hazard alerts.

**🔍 Probable Diagnosis:**
- Puncture from road debris, tyre bead leak, or sidewall blowout.

**🛠️ Recommended Next Action:**
- Request a mobile puncture repair van or roadside assistance partner from the directory below.`
  }

  return `**🛡️ Immediate Safety Step:**
- Take a deep breath—you are safe. Switch on your emergency hazard indicators.
- Park the car securely on the side shoulder and engage the emergency parking brake.

**🔍 Probable Diagnosis:**
- Mechanical or electrical abnormality detected. Driving further without initial inspection is not advised.

**🛠️ Recommended Next Action:**
- Call national highway support (**1033**) or choose a verified mechanic from the directory below.`
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

    if (/^\*\*.+\*\*:?$/.test(trimmed)) {
      return (
        <p key={i} className="mt-3 font-display text-sm font-bold text-primary">
          {trimmed.replace(/\*\*/g, '').replace(/:$/, '')}
        </p>
      )
    }
    if (/^[-•]\s/.test(trimmed)) {
      return (
        <p key={i} className="flex gap-2 pl-1 text-sm leading-relaxed">
          <span className="text-primary" aria-hidden>
            •
          </span>
          <span>{inline(trimmed.replace(/^[-•]\s/, ''))}</span>
        </p>
      )
    }
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

      if (!res.ok) throw new Error('API offline')
      const data = await res.json()

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: data.reply || getLocalEmergencyTriage(value),
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch {
      // Guaranteed fallback: Never breaks, always delivers reassuring triage
      setTimeout(() => {
        const fallbackMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: getLocalEmergencyTriage(value),
        }
        setMessages((prev) => [...prev, fallbackMsg])
      }, 400)
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
            AI Diagnosis Assistant
          </h3>
          <p className="text-xs text-background/70">
            Describe the problem — get instant safety steps &amp; likely fixes
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
              Tell me what&apos;s happening with your vehicle. Try one of these
              to start:
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
            Analyzing your emergency situation…
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
          placeholder="e.g. White smoke from engine, tyre burst, brake failing…"
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