'use client'

import { useState, useRef, useEffect, type ReactNode } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Sparkles, Send, ShieldAlert, LoaderCircle, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'

const EXAMPLES = [
  'White smoke from the engine and it overheated',
  'Car stalled and won\u2019t start, dashboard lights flicker',
  'Loud grinding noise when I brake',
  'Flat tyre on the highway shoulder',
]

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
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/diagnose' }),
  })
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const busy = status === 'submitted' || status === 'streaming'

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, status])

  function submit(text: string) {
    const value = text.trim()
    if (!value || busy) return
    sendMessage({ text: value })
    setInput('')
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
              {m.parts.map((part, i) =>
                part.type === 'text' ? (
                  <div key={i}>{renderText(part.text)}</div>
                ) : null,
              )}
            </div>
          </div>
        ))}

        {status === 'submitted' && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <LoaderCircle className="size-4 animate-spin" aria-hidden />
            Analyzing your situation…
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>
              The assistant is temporarily unavailable. Please try again in a
              moment — and in a real emergency, call your roadside helpline
              below right away.
            </span>
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
            if (
              e.key === 'Enter' &&
              !e.shiftKey &&
              !e.nativeEvent.isComposing &&
              e.keyCode !== 229
            ) {
              e.preventDefault()
              submit(input)
            }
          }}
          rows={1}
          placeholder="e.g. Engine is making a knocking sound and losing power…"
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
