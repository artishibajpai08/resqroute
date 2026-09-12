'use client'

import { useState } from 'react'
import {
  TriangleAlert,
  Droplets,
  CircleDot,
  CarFront,
  Construction,
  Cctv,
  ThumbsUp,
  MapPin,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type HazardType = {
  id: string
  label: string
  icon: typeof Droplets
}

const HAZARD_TYPES: HazardType[] = [
  { id: 'puncture', label: 'Puncture trap', icon: CircleDot },
  { id: 'water', label: 'Waterlogging', icon: Droplets },
  { id: 'accident', label: 'Accident', icon: CarFront },
  { id: 'roadwork', label: 'Roadwork', icon: Construction },
  { id: 'speedtrap', label: 'Speed camera', icon: Cctv },
]

type Alert = {
  id: number
  typeId: string
  location: string
  minutesAgo: number
  confirmations: number
  confirmedByMe: boolean
}

const INITIAL_ALERTS: Alert[] = [
  { id: 1, typeId: 'puncture', location: 'NH-48, Marker 112 (northbound)', minutesAgo: 8, confirmations: 23, confirmedByMe: false },
  { id: 2, typeId: 'water', location: 'Ring Rd underpass, Exit 4', minutesAgo: 21, confirmations: 41, confirmedByMe: false },
  { id: 3, typeId: 'accident', location: 'I-70 near Blue Springs ramp', minutesAgo: 35, confirmations: 67, confirmedByMe: false },
  { id: 4, typeId: 'roadwork', location: 'SH-7, lane closure past toll', minutesAgo: 52, confirmations: 12, confirmedByMe: false },
]

function typeMeta(typeId: string) {
  return HAZARD_TYPES.find((t) => t.id === typeId) ?? HAZARD_TYPES[0]
}

function timeAgo(mins: number) {
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const h = Math.floor(mins / 60)
  return `${h} hr ago`
}

export function HazardAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS)
  const [selectedType, setSelectedType] = useState<string>('puncture')
  const [location, setLocation] = useState('')

  function confirm(id: number) {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              confirmedByMe: !a.confirmedByMe,
              confirmations: a.confirmations + (a.confirmedByMe ? -1 : 1),
            }
          : a,
      ),
    )
  }

  function report(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = location.trim()
    if (!trimmed) return
    setAlerts((prev) => [
      {
        id: Date.now(),
        typeId: selectedType,
        location: trimmed,
        minutesAgo: 0,
        confirmations: 1,
        confirmedByMe: true,
      },
      ...prev,
    ])
    setLocation('')
  }

  const sorted = [...alerts].sort((a, b) => a.minutesAgo - b.minutesAgo)

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Report form */}
      <form
        onSubmit={report}
        className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm"
      >
        <div className="flex items-center gap-2 text-primary">
          <TriangleAlert className="size-5" aria-hidden />
          <h3 className="font-display text-lg font-extrabold tracking-tight text-foreground">
            Report a hazard
          </h3>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Warn drivers behind you. Alerts are shared with everyone on this
          stretch.
        </p>

        <fieldset className="mt-4">
          <legend className="text-sm font-semibold">Hazard type</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {HAZARD_TYPES.map((t) => {
              const Icon = t.icon
              const active = t.id === selectedType
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedType(t.id)}
                  aria-pressed={active}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                    active
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-secondary/40 text-muted-foreground hover:border-primary/40 hover:text-foreground',
                  )}
                >
                  <Icon className="size-3.5" aria-hidden />
                  {t.label}
                </button>
              )
            })}
          </div>
        </fieldset>

        <div className="mt-4">
          <label htmlFor="hazard-location" className="text-sm font-semibold">
            Location / landmark
          </label>
          <input
            id="hazard-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. NH-48, Marker 112 northbound"
            className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <Button
          type="submit"
          variant="destructive"
          disabled={!location.trim()}
          className="mt-4 w-full gap-2 font-semibold"
        >
          <TriangleAlert className="size-4" aria-hidden />
          Post hazard alert
        </Button>
      </form>

      {/* Live feed */}
      <div className="lg:col-span-3">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-lg font-extrabold tracking-tight">
            Live alerts nearby
          </h3>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            <span className="size-1.5 animate-pulse rounded-full bg-primary" aria-hidden />
            {sorted.length} active
          </span>
        </div>
        <ul className="space-y-3">
          {sorted.map((a) => {
            const meta = typeMeta(a.typeId)
            const Icon = meta.icon
            return (
              <li
                key={a.id}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold leading-tight">{meta.label}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-muted-foreground">
                    <MapPin className="size-3.5 shrink-0" aria-hidden />
                    {a.location}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {timeAgo(a.minutesAgo)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => confirm(a.id)}
                  aria-pressed={a.confirmedByMe}
                  aria-label={`Confirm ${meta.label} — ${a.confirmations} confirmations`}
                  className={cn(
                    'flex shrink-0 flex-col items-center gap-0.5 rounded-lg border px-3 py-2 text-xs font-bold transition-colors',
                    a.confirmedByMe
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-secondary/40 text-muted-foreground hover:border-primary/40 hover:text-foreground',
                  )}
                >
                  <ThumbsUp className="size-4" aria-hidden />
                  {a.confirmations}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
