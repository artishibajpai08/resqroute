'use client'

import { useState } from 'react'
import { LoaderCircle, Siren } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/** Broadcast helpline that receives the SOS with a live location pin. */
const SOS_WHATSAPP = '18005550999'

type Props = {
  size?: 'sm' | 'lg'
  className?: string
}

export function SosButton({ size = 'sm', className }: Props) {
  const [status, setStatus] = useState<'idle' | 'locating'>('idle')

  function openWhatsApp(locationLine: string) {
    const message = [
      'EMERGENCY SOS - I need roadside assistance now.',
      locationLine,
      'Please send help to my location.',
    ].join('\n')
    const url = `https://wa.me/${SOS_WHATSAPP}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  function handleSos() {
    if (!('geolocation' in navigator)) {
      openWhatsApp('My live location is unavailable — I will share it by phone.')
      return
    }
    setStatus('locating')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`
        openWhatsApp(`My live location: ${mapsLink}`)
        setStatus('idle')
      },
      () => {
        openWhatsApp(
          'My live location is blocked — I will share it by phone.',
        )
        setStatus('idle')
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  const isLg = size === 'lg'

  return (
    <Button
      onClick={handleSos}
      disabled={status === 'locating'}
      variant="destructive"
      aria-label="Emergency WhatsApp SOS — share live location"
      className={cn(
        'animate-sos-pulse gap-2 font-bold',
        isLg ? 'h-14 px-7 text-base' : 'h-9 px-3 text-sm',
        className,
      )}
    >
      {status === 'locating' ? (
        <LoaderCircle
          className={cn('animate-spin', isLg ? 'size-5' : 'size-4')}
          aria-hidden
        />
      ) : (
        <Siren className={isLg ? 'size-5' : 'size-4'} aria-hidden />
      )}
      <span className={isLg ? '' : 'hidden sm:inline'}>
        Emergency WhatsApp SOS
      </span>
      <span className={isLg ? 'hidden' : 'sm:hidden'}>SOS</span>
    </Button>
  )
}
