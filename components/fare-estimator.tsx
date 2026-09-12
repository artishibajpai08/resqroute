'use client'

import { useState } from 'react'
import { Car, Truck, Bus, Bike, Calculator } from 'lucide-react'
import { cn } from '@/lib/utils'

type VehicleId = 'bike' | 'sedan' | 'suv' | 'van'

type Vehicle = {
  id: VehicleId
  label: string
  icon: typeof Car
  /** flat pickup fee for a tow */
  towBase: number
  /** tow cost per km */
  towPerKm: number
  /** cab base fare */
  cabBase: number
  /** cab cost per km */
  cabPerKm: number
}

const VEHICLES: Vehicle[] = [
  { id: 'bike', label: 'Two-Wheeler', icon: Bike, towBase: 25, towPerKm: 1.5, cabBase: 4, cabPerKm: 0.9 },
  { id: 'sedan', label: 'Sedan / Hatchback', icon: Car, towBase: 45, towPerKm: 2.4, cabBase: 6, cabPerKm: 1.4 },
  { id: 'suv', label: 'SUV / Pickup', icon: Truck, towBase: 65, towPerKm: 3.2, cabBase: 9, cabPerKm: 1.9 },
  { id: 'van', label: 'Van / Minibus', icon: Bus, towBase: 85, towPerKm: 4.1, cabBase: 12, cabPerKm: 2.6 },
]

function money(n: number) {
  return `$${n.toFixed(0)}`
}

export function FareEstimator() {
  const [vehicleId, setVehicleId] = useState<VehicleId>('sedan')
  const [distance, setDistance] = useState(15)

  const vehicle = VEHICLES.find((v) => v.id === vehicleId) as Vehicle
  const nightSurcharge = 1.15 // typical late-night highway multiplier

  const towLow = vehicle.towBase + vehicle.towPerKm * distance
  const towHigh = towLow * nightSurcharge
  const cabLow = vehicle.cabBase + vehicle.cabPerKm * distance
  const cabHigh = cabLow * nightSurcharge

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Calculator className="size-5" aria-hidden />
        </span>
        <div>
          <h3 className="font-display text-xl font-extrabold tracking-tight">
            Towing &amp; Cab Fare Estimator
          </h3>
          <p className="text-sm text-muted-foreground">
            Ballpark rates before you book — no surprises on the shoulder.
          </p>
        </div>
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm font-semibold text-foreground">
          Select your vehicle
        </legend>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {VEHICLES.map((v) => {
            const Icon = v.icon
            const active = v.id === vehicleId
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setVehicleId(v.id)}
                aria-pressed={active}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-xl border p-3 text-center text-xs font-semibold transition-colors',
                  active
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-border bg-secondary/40 text-muted-foreground hover:border-primary/40 hover:text-foreground',
                )}
              >
                <Icon className="size-6" aria-hidden />
                {v.label}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <label htmlFor="distance" className="text-sm font-semibold">
            Distance to destination
          </label>
          <span className="font-display text-lg font-extrabold text-primary">
            {distance} km
          </span>
        </div>
        <input
          id="distance"
          type="range"
          min={1}
          max={120}
          value={distance}
          onChange={(e) => setDistance(Number(e.target.value))}
          className="mt-3 w-full accent-primary"
          aria-valuetext={`${distance} kilometers`}
        />
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>1 km</span>
          <span>120 km</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-secondary/40 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Truck className="size-4 text-primary" aria-hidden />
            Tow truck
          </div>
          <p className="mt-2 font-display text-2xl font-extrabold tracking-tight">
            {money(towLow)}
            <span className="text-muted-foreground"> – </span>
            {money(towHigh)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {money(vehicle.towBase)} pickup + {money(vehicle.towPerKm)}/km
          </p>
        </div>
        <div className="rounded-xl border border-border bg-secondary/40 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Car className="size-4 text-primary" aria-hidden />
            Emergency cab
          </div>
          <p className="mt-2 font-display text-2xl font-extrabold tracking-tight">
            {money(cabLow)}
            <span className="text-muted-foreground"> – </span>
            {money(cabHigh)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {money(vehicle.cabBase)} base + {money(vehicle.cabPerKm)}/km
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Estimates include a typical 15% late-night highway surcharge on the
        upper range. Final fares vary by provider and road conditions.
      </p>
    </div>
  )
}
