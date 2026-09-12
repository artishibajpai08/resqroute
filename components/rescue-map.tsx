'use client'

import { useEffect, useRef } from 'react'
import type { Map as LeafletMap, Marker, LayerGroup } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { SHOPS, offsetToLatLng, type ServiceCategory } from '@/lib/shops'

const CATEGORY_COLOR: Record<ServiceCategory, string> = {
  mechanics: 'var(--color-primary)',
  towing: 'var(--color-chart-3)',
  rentals: 'var(--color-accent)',
}

const CATEGORY_GLYPH: Record<ServiceCategory, string> = {
  mechanics: 'M',
  towing: 'T',
  rentals: 'R',
}

export function RescueMap({
  center,
  hasLocation,
  activeCategory,
}: {
  center: { lat: number; lng: number }
  hasLocation: boolean
  activeCategory: ServiceCategory
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const layerRef = useRef<LayerGroup | null>(null)
  const userMarkerRef = useRef<Marker | null>(null)

  useEffect(() => {
    let cancelled = false

    async function init() {
      const L = await import('leaflet')
      if (cancelled || !containerRef.current || mapRef.current) return

      const map = L.map(containerRef.current, {
        center: [center.lat, center.lng],
        zoom: 13,
        zoomControl: true,
      })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map)

      layerRef.current = L.layerGroup().addTo(map)
      mapRef.current = map
      renderMarkers(L)
    }

    async function renderMarkers(L: typeof import('leaflet')) {
      const map = mapRef.current
      const layer = layerRef.current
      if (!map || !layer) return
      layer.clearLayers()

      if (userMarkerRef.current) {
        userMarkerRef.current.remove()
        userMarkerRef.current = null
      }

      const userIcon = L.divIcon({
        className: '',
        html: `<div style="width:22px;height:22px;border-radius:9999px;background:var(--color-primary);border:3px solid white;box-shadow:0 0 0 6px color-mix(in oklab, var(--color-primary) 25%, transparent)"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      })
      userMarkerRef.current = L.marker([center.lat, center.lng], {
        icon: userIcon,
        zIndexOffset: 1000,
      })
        .addTo(map)
        .bindPopup(hasLocation ? 'You are here' : 'Approximate area')

      SHOPS.forEach((shop) => {
        const pos = offsetToLatLng(center, shop.offset)
        const dimmed = shop.category !== activeCategory
        const icon = L.divIcon({
          className: '',
          html: `<div style="display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:9999px 9999px 9999px 2px;transform:rotate(-45deg);background:${CATEGORY_COLOR[shop.category]};color:white;font-weight:800;font-size:12px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.3);opacity:${dimmed ? 0.4 : 1}"><span style="transform:rotate(45deg)">${CATEGORY_GLYPH[shop.category]}</span></div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 28],
        })
        L.marker([pos.lat, pos.lng], { icon })
          .addTo(layer)
          .bindPopup(`<strong>${shop.name}</strong><br/>${shop.eta} away`)
      })

      map.setView([center.lat, center.lng], hasLocation ? 14 : 13, {
        animate: true,
      })
    }

    if (!mapRef.current) {
      init()
    } else {
      import('leaflet').then((mod) => renderMarkers(mod))
    }

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center.lat, center.lng, hasLocation, activeCategory])

  useEffect(() => {
    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <div
      ref={containerRef}
      role="application"
      aria-label="Map of nearby emergency road services"
      className="h-full w-full"
    />
  )
}
