'use client'

import { useState, useRef, useEffect, type ReactNode } from 'react'
import { Sparkles, Send, ShieldAlert, LoaderCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const EXAMPLES = [
  'Engine se white smoke nikal raha hai aur car overheat ho gayi',
  'Gadi start nahi ho rahi, dashboard lights flicker kar rahi hain',
  'Brake lagane par bahut tez grinding aawaz aa rahi hai',
  'Highway par tyre puncture / flat ho gaya hai',
]

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
}

function getLocalEmergencyTriage(problem: string): string {
  const q = problem.toLowerCase()

  if (q.includes('heat') || q.includes('smoke') || q.includes('dhua') || q.includes('coolant') || q.includes('radiator')) {
    return `Pareshan mat hoiye, sab theek ho jayega. Bas sabse pehle gaadi ko highway ke left side (shoulder lane) par safely slow karke park kar lijiye aur hazard lights (4 indicators) turant on kar dein.

**Galti se bhi abhi bonnet ya radiator cap mat kholna**—andar ka coolant bohot garam aur pressurized hota hai, jisse steam se haath jalne ka khatra rehta hai. 

Gaadi ka engine band karke kam se kam 25-30 minute thanda hone dein. Zyada chances hain ki radiator fan ruk gaya hai ya coolant leak hua hai. Is halat me car chalana engine seize kar sakta hai, isliye niche di gayi list me se **Flatbed Towing** ya **Mobile Mechanic** ko request bhej dijiye.`
  }

  if (q.includes('brake') || q.includes('grinding') || q.includes('pedal') || q.includes('awaz') || q.includes('noise')) {
    return `Pehle relax ho jaiye aur speed dheere kijiye. Achanak zordar brake mat dabaiye, dheere-dheere engine braking (lower gear) use karke gaadi ko roadside safe jagah par rok lijiye.

Aisi grinding aawaz tab aati hai jab brake pads poori tarah ghis jaate hain aur metal-to-metal contact hone lagta hai. Is halat me tez raftaar par gaadi chalana bilkul safe nahi hai.

Car ko safe side khadi karein aur niche directory me se kisi **Brake Specialist / Mechanic** ko call karke check karwa lijiye tabhi aage badhein.`
  }

  if (q.includes('stall') || q.includes('start') || q.includes('battery') || q.includes('flicker') || q.includes('band') || q.includes('dead')) {
    return `Ghabrayiye mat! Agar gaadi beech sadak par band ho gayi hai, toh turant hazard light on kijiye taaki peeche se aane wale traffic ko pata chale. Agar raat ka samay hai, toh gaadi ke andar hi lock hokar rahiye.

Dashboard lights flicker hona aur engine ka crank na hona aamtaur par **battery discharge** ya terminal ke loose hone ki nishani hai. 

Aapko bas ek quick jump-start ya battery check ki zaroorat hai. Niche diye gaye directory se **Mobile Mechanic** ko connect karein, wo jump cables ke sath jaldi pahuch jayenge.`
  }

  if (q.includes('tyre') || q.includes('tire') || q.includes('puncture') || q.includes('flat') || q.includes('hawa')) {
    return `Sabse pehle steering wheel par pakad majboot rakhein aur achanak se hard brake na maarein. Gaadi ko dheere-dheere kisi flat aur safe shoulder lane par le jaakar rokein.

Handbrake poori tarah kheench lijiye. Agar traffic side wala tyre flat hai, toh sadak par khade hokar khud change karne ka risk mat lijiye.

Niche emergency directory me se **Mobile Puncture Van / Mechanic** ko contact karein, wo proper safety reflectors aur jack ke sath aakar 10 minute me fix kar denge.`
  }

  return `Pehle relax ho jaiye, aap bilkul safe hain. Agar aap highway par hain, toh hazard lights on karke gaadi ko safe left side shoulder par laga lijiye aur handbrake kheench lijiye.

Gaadi me jo issue lag raha hai, uske sath bina check karwaye aage lambi journey continue karna theek nahi hoga. 

Agar urgent help chahiye toh highway helpline **1033** dial kar sakte hain, ya phir niche di gayi list me se nearest verified mechanic ko direct call mila lijiye.`
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

      if (!res.ok) throw new Error('API offline')
      const data = await res.json()

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: data.reply || getLocalEmergencyTriage(value),
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch {
      setTimeout(() => {
        const fallbackMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: getLocalEmergencyTriage(value),
        }
        setMessages((prev) => [...prev, fallbackMsg])
      }, 350)
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
            Hindi &amp; English • Real-time Safety &amp; Breakdown Guidance
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
              Gaadi me kya pareshani aa rahi hai? Aap Hindi ya English kisi me bhi bata sakte hain:
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
            Analyzing your situation…
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
          placeholder="Apni pareshani likhein (e.g. Engine garam ho raha hai, brake se aawaz aa rahi hai...)"
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
