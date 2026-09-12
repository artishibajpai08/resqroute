import { Phone, Star, MapPin, Clock, MessageCircle } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { distanceKm, type Shop } from '@/lib/shops'

export function ShopCard({ shop }: { shop: Shop }) {
  const km = distanceKm(shop.offset)
  const waText = encodeURIComponent(
    `Hi ${shop.name}, I have a vehicle breakdown and need emergency assistance. Can you help?`,
  )

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-lg font-bold leading-tight text-card-foreground text-pretty">
            {shop.name}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5 text-primary" aria-hidden />
              {km.toFixed(1)} km away
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5 text-primary" aria-hidden />
              {shop.eta}
            </span>
          </div>
        </div>
        <span
          className={cn(
            'shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold',
            shop.open
              ? 'bg-primary/10 text-primary'
              : 'bg-muted text-muted-foreground',
          )}
        >
          {shop.open ? 'Open now' : 'Closed'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5" aria-hidden>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                'size-4',
                i < Math.round(shop.rating)
                  ? 'fill-accent text-accent'
                  : 'text-border',
              )}
            />
          ))}
        </div>
        <span className="text-sm font-medium text-card-foreground">
          {shop.rating.toFixed(1)}
        </span>
        <span className="text-sm text-muted-foreground">
          ({shop.reviews} reviews)
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {shop.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2 pt-1">
        <a
          href={`tel:${shop.phone}`}
          className={cn(
            buttonVariants({ variant: 'default' }),
            'h-11 gap-2 text-sm font-semibold',
          )}
        >
          <Phone className="size-4" aria-hidden />
          Call Now
        </a>
        <a
          href={`https://wa.me/${shop.whatsapp}?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'h-11 gap-2 border-primary/30 text-sm font-semibold text-primary hover:bg-primary/5',
          )}
        >
          <MessageCircle className="size-4" aria-hidden />
          WhatsApp
        </a>
      </div>
    </article>
  )
}
