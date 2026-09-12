export type ServiceCategory = 'mechanics' | 'towing' | 'rentals'

export type Shop = {
  id: string
  name: string
  category: ServiceCategory
  rating: number
  reviews: number
  phone: string
  whatsapp: string
  open: boolean
  eta: string
  tags: string[]
  /** offset in km relative to the user, used to place markers "nearby" */
  offset: { north: number; east: number }
}

export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  mechanics: 'Mechanics & Garages',
  towing: 'Towing Services',
  rentals: 'Emergency Rental Cars',
}

export const SHOPS: Shop[] = [
  {
    id: 'm1',
    name: 'Highway Auto Care',
    category: 'mechanics',
    rating: 4.8,
    reviews: 214,
    phone: '+18005550111',
    whatsapp: '18005550111',
    open: true,
    eta: '12 min',
    tags: ['Engine', 'Battery', 'Tyres'],
    offset: { north: 1.2, east: 0.8 },
  },
  {
    id: 'm2',
    name: 'MilePost Garage 24/7',
    category: 'mechanics',
    rating: 4.6,
    reviews: 158,
    phone: '+18005550112',
    whatsapp: '18005550112',
    open: true,
    eta: '18 min',
    tags: ['Diagnostics', 'Brakes'],
    offset: { north: -0.9, east: 1.6 },
  },
  {
    id: 'm3',
    name: 'RoadFix Mobile Mechanic',
    category: 'mechanics',
    rating: 4.9,
    reviews: 92,
    phone: '+18005550113',
    whatsapp: '18005550113',
    open: false,
    eta: '25 min',
    tags: ['Comes to you', 'Electrical'],
    offset: { north: 2.1, east: -1.3 },
  },
  {
    id: 't1',
    name: 'RapidTow Recovery',
    category: 'towing',
    rating: 4.7,
    reviews: 341,
    phone: '+18005550211',
    whatsapp: '18005550211',
    open: true,
    eta: '9 min',
    tags: ['Flatbed', 'Heavy duty'],
    offset: { north: -1.4, east: -0.6 },
  },
  {
    id: 't2',
    name: 'Guardian Towing Co.',
    category: 'towing',
    rating: 4.5,
    reviews: 187,
    phone: '+18005550212',
    whatsapp: '18005550212',
    open: true,
    eta: '15 min',
    tags: ['Winch out', 'Accident'],
    offset: { north: 0.7, east: 2.2 },
  },
  {
    id: 't3',
    name: 'InterState Wreckers',
    category: 'towing',
    rating: 4.3,
    reviews: 76,
    phone: '+18005550213',
    whatsapp: '18005550213',
    open: true,
    eta: '22 min',
    tags: ['Long distance'],
    offset: { north: -2.3, east: 1.1 },
  },
  {
    id: 'r1',
    name: 'PitStop Rentals',
    category: 'rentals',
    rating: 4.6,
    reviews: 129,
    phone: '+18005550311',
    whatsapp: '18005550311',
    open: true,
    eta: '20 min',
    tags: ['Instant pickup', 'SUV'],
    offset: { north: 1.9, east: 1.4 },
  },
  {
    id: 'r2',
    name: 'Detour Car Hire',
    category: 'rentals',
    rating: 4.4,
    reviews: 88,
    phone: '+18005550312',
    whatsapp: '18005550312',
    open: true,
    eta: '28 min',
    tags: ['Economy', 'One-way'],
    offset: { north: -0.5, east: -1.9 },
  },
  {
    id: 'r3',
    name: 'FastLane Emergency Cars',
    category: 'rentals',
    rating: 4.7,
    reviews: 64,
    phone: '+18005550313',
    whatsapp: '18005550313',
    open: false,
    eta: '32 min',
    tags: ['24/7 desk', 'Van'],
    offset: { north: 2.4, east: -0.4 },
  },
]

/** Default map center used before the user shares GPS (Kansas City area). */
export const DEFAULT_CENTER = { lat: 39.0997, lng: -94.5786 }

const KM_PER_DEG_LAT = 111

export function offsetToLatLng(
  center: { lat: number; lng: number },
  offset: { north: number; east: number },
) {
  const lat = center.lat + offset.north / KM_PER_DEG_LAT
  const kmPerDegLng = KM_PER_DEG_LAT * Math.cos((center.lat * Math.PI) / 180)
  const lng = center.lng + offset.east / kmPerDegLng
  return { lat, lng }
}

export function distanceKm(offset: { north: number; east: number }) {
  return Math.sqrt(offset.north ** 2 + offset.east ** 2)
}
