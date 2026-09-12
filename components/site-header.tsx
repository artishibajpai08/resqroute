import { Navigation, PhoneCall } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <a href="#" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Navigation className="size-5" aria-hidden />
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight">
            ResQ<span className="text-primary">Route</span>
          </span>
        </a>
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <a href="#map" className="hover:text-foreground">
            Nearby Help
          </a>
          <a href="#services" className="hover:text-foreground">
            Services
          </a>
          <a href="#assistant" className="hover:text-foreground">
            AI Assistant
          </a>
        </nav>
        <Button
          render={<a href="tel:911" />}
          nativeButton={false}
          variant="destructive"
          className="h-9 gap-2 font-semibold"
        >
          <PhoneCall className="size-4" aria-hidden />
          Emergency 911
        </Button>
      </div>
    </header>
  )
}
