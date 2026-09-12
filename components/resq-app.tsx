'use client'

import { useState } from 'react'
import {
  Navigation,
  LoaderCircle,
  MapPin,
  TriangleAlert,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RescueMap } from '@/components/rescue-map'
import { ServiceDirectory } from '@/components/service-directory'
import { DEFAULT_CENTER, type ServiceCategory } from '@/lib/shops'

type LocState = 'idle' | 'locating' | 'granted' | 'denied'

export function ResqApp() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [locState, setLocState] = useState<LocState>('idle')
  const [category, setCategory] = useState<ServiceCategory>('mechanics')

  function fetchLocation() {
    if (!('geolocation' in navigator)) {
      setLocState('denied')
      return
    }
    setLocState('locating')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocState('granted')
      },
      () => setLocState('denied'),
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  const center = coords ?? DEFAULT_CENTER
  const hasLocation = locState === 'granted'

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 22px, currentColor 22px, currentColor 44px)',
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest">
            <TriangleAlert className="size-3.5" aria-hidden />
            24/7 Highway Rescue
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-balance md:text-6xl">
            Broken down on the road? Help is minutes away.
          </h1>
          <p className="mt-5 max-w-xl text-base text-primary-foreground/85 md:text-lg text-pretty">
            Share your live location and ResQRoute instantly finds the nearest
            mechanics, tow trucks, and emergency rental cars — plus AI-guided
            safety steps while you wait.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              onClick={fetchLocation}
              disabled={locState === 'locating'}
              className="h-14 gap-2.5 bg-background px-7 text-base font-bold text-foreground hover:bg-background/90"
            >
              {locState === 'locating' ? (
                <LoaderCircle className="size-5 animate-spin" aria-hidden />
              ) : (
                <Navigation className="size-5 text-primary" aria-hidden />
              )}
              {locState === 'granted'
                ? 'Update My GPS Location'
                : 'Fetch My Live GPS Location'}
            </Button>

            <div className="text-sm">
              {locState === 'granted' && coords && (
                <span className="inline-flex items-center gap-2 font-medium">
                  <CheckCircle2 className="size-4" aria-hidden />
                  Located: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                </span>
              )}
              {locState === 'denied' && (
                <span className="inline-flex items-center gap-2 text-primary-foreground/85">
                  <TriangleAlert className="size-4" aria-hidden />
                  Location blocked — showing an approximate area.
                </span>
              )}
              {locState === 'locating' && (
                <span className="text-primary-foreground/85">
                  Pinpointing your position…
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section id="map" className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <span className="font-display text-sm font-bold uppercase tracking-widest text-primary">
              Live Map
            </span>
            <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight md:text-3xl text-balance">
              Repair &amp; rescue services near you
            </h2>
          </div>
        </div>
        <div className="relative h-[420px] overflow-hidden rounded-2xl border border-border shadow-sm">
          <RescueMap
            center={center}
            hasLocation={hasLocation}
            activeCategory={category}
          />
          {!hasLocation && (
            <div className="pointer-events-none absolute bottom-4 left-1/2 z-[500] flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-card/95 px-4 py-2 text-xs font-medium text-muted-foreground shadow-md">
              <MapPin className="size-4 text-primary" aria-hidden />
              Approximate area — share your GPS for exact distances
            </div>
          )}
        </div>
      </section>

      {/* Service directory */}
      <section id="services" className="mx-auto max-w-6xl px-4 pb-16 md:pb-24">
        <div className="mb-6">
          <span className="font-display text-sm font-bold uppercase tracking-widest text-primary">
            Service Directory
          </span>
          <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight md:text-3xl text-balance">
            Choose the help you need
          </h2>
        </div>
        <ServiceDirectory active={category} onChange={setCategory} />
      </section>
    </>
  )
}
