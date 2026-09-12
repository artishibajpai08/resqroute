'use client'

import { Wrench, Truck, Car } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SHOPS, CATEGORY_LABELS, type ServiceCategory } from '@/lib/shops'
import { ShopCard } from '@/components/shop-card'

const TABS: { id: ServiceCategory; icon: typeof Wrench }[] = [
  { id: 'mechanics', icon: Wrench },
  { id: 'towing', icon: Truck },
  { id: 'rentals', icon: Car },
]

export function ServiceDirectory({
  active,
  onChange,
}: {
  active: ServiceCategory
  onChange: (c: ServiceCategory) => void
}) {
  const shops = SHOPS.filter((s) => s.category === active)

  return (
    <div>
      <div
        role="tablist"
        aria-label="Service categories"
        className="grid grid-cols-1 gap-2 rounded-xl border border-border bg-card p-1.5 sm:grid-cols-3"
      >
        {TABS.map(({ id, icon: Icon }) => {
          const selected = active === id
          return (
            <button
              key={id}
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(id)}
              className={cn(
                'flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-colors',
                selected
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
              )}
            >
              <Icon className="size-4" aria-hidden />
              {CATEGORY_LABELS[id]}
            </button>
          )
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {shops.map((shop) => (
          <ShopCard key={shop.id} shop={shop} />
        ))}
      </div>
    </div>
  )
}
