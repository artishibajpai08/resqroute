import { Navigation, Phone } from 'lucide-react'

const HELPLINES = [
  { label: 'Police / Fire / Medical', number: '911', note: 'Life-threatening emergencies' },
  { label: 'Highway Patrol', number: '1-800-525-5555', note: 'Accidents & road hazards' },
  { label: 'National Roadside Assist', number: '1-800-222-4357', note: '24/7 breakdown line' },
  { label: 'Poison / Hazmat Spill', number: '1-800-424-8802', note: 'Chemical & fuel spills' },
]

export function EmergencyFooter() {
  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-2">
          <span className="font-display text-sm font-bold uppercase tracking-widest text-accent">
            Emergency Road Helplines
          </span>
          <h2 className="font-display text-2xl font-extrabold text-balance">
            Save these numbers before you hit the road
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HELPLINES.map((h) => (
            <a
              key={h.number}
              href={`tel:${h.number.replace(/[^0-9+]/g, '')}`}
              className="group flex flex-col gap-1 rounded-xl border border-background/15 bg-background/5 p-4 transition-colors hover:border-accent/60 hover:bg-background/10"
            >
              <span className="text-xs font-medium text-background/60">
                {h.label}
              </span>
              <span className="flex items-center gap-2 font-display text-xl font-bold text-background group-hover:text-accent">
                <Phone className="size-4 text-primary" aria-hidden />
                {h.number}
              </span>
              <span className="text-xs text-background/50">{h.note}</span>
            </a>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-background/15 pt-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Navigation className="size-4" aria-hidden />
            </span>
            <span className="font-display text-lg font-extrabold">
              ResQ<span className="text-primary">Route</span>
            </span>
          </div>
          <p className="text-xs text-background/50 text-pretty">
            ResQRoute helps you find help fast. In any life-threatening
            emergency, always call your local emergency number first.
          </p>
        </div>
      </div>
    </footer>
  )
}
