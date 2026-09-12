export type ServiceCategory = 'mechanics' | 'towing' | 'rentals'

export type Shop = {
  id: string
  name: string
  category: ServiceCategory
  rating: number
  reviews: number
  /** dialable number, e.g. +91-98XXXXXXXX (dashes are valid in tel: links) */
  phone: string
  /** WhatsApp target, digits only with country code, e.g. 9198XXXXXXXX */
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
    name: 'Sharma Highway Garage & Towing',
    category: 'mechanics',
    rating: 4.8,
    reviews: 214,
    phone: '+91-9876543210',
    whatsapp: '919876543210',
    open: true,
    eta: '12 min',
    tags: ['Engine', 'Battery', 'Tyres'],
    offset: { north: 1.2, east: 0.8 },
  },
  {
    id: 'm2',
    name: 'Rajput Auto Works 24x7',
    category: 'mechanics',
    rating: 4.6,
    reviews: 158,
    phone: '+91-9812345670',
    whatsapp: '919812345670',
    open: true,
    eta: '18 min',
    tags: ['Diagnostics', 'Brakes'],
    offset: { north: -0.9, east: 1.6 },
  },
  {
    id: 'm3',
    name: 'National Puncture & Tyre Care',
    category: 'mechanics',
    rating: 4.9,
    reviews: 92,
    phone: '+91-9898765432',
    whatsapp: '919898765432',
    open: false,
    eta: '25 min',
    tags: ['Doorstep repair', 'Electrical'],
    offset: { north: 2.1, east: -1.3 },
  },
  {
    id: 't1',
    name: 'Balaji Crane & Towing Recovery',
    category: 'towing',
    rating: 4.7,
    reviews: 341,
    phone: '+91-8765432109',
    whatsapp: '918765432109',
    open: true,
    eta: '9 min',
    tags: ['Flatbed', 'Heavy duty'],
    offset: { north: -1.4, east: -0.6 },
  },
  {
    id: 't2',
    name: 'NH-19 Highway Towing Service',
    category: 'towing',
    rating: 4.5,
    reviews: 187,
    phone: '+91-8790654321',
    whatsapp: '918790654321',
    open: true,
    eta: '15 min',
    tags: ['Winch out', 'Accident'],
    offset: { north: 0.7, east: 2.2 },
  },
  {
    id: 't3',
    name: 'Yadav 24x7 Vehicle Recovery',
    category: 'towing',
    rating: 4.3,
    reviews: 76,
    phone: '+91-8712345678',
    whatsapp: '918712345678',
    open: true,
    eta: '22 min',
    tags: ['Long distance'],
    offset: { north: -2.3, east: 1.1 },
  },
  {
    id: 'r1',
    name: 'Krishna Self-Drive Rentals',
    category: 'rentals',
    rating: 4.6,
    reviews: 129,
    phone: '+91-9765432108',
    whatsapp: '919765432108',
    open: true,
    eta: '20 min',
    tags: ['Instant pickup', 'SUV'],
    offset: { north: 1.9, east: 1.4 },
  },
  {
    id: 'r2',
    name: 'Highway Emergency Cabs India',
    category: 'rentals',
    rating: 4.4,
    reviews: 88,
    phone: '+91-9954321087',
    whatsapp: '919954321087',
    open: true,
    eta: '28 min',
    tags: ['Economy', 'One-way'],
    offset: { north: -0.5, east: -1.9 },
  },
  {
    id: 'r3',
    name: 'Apna Ride Rent-a-Car',
    category: 'rentals',
    rating: 4.7,
    reviews: 64,
    phone: '+91-8654321098',
    whatsapp: '918654321098',
    open: false,
    eta: '32 min',
    tags: ['24x7 desk', 'Tempo'],
    offset: { north: 2.4, east: -0.4 },
  },
]

/**
 * Default map center used before the user shares GPS.
 * Set to the Yamuna Expressway (Delhi–Agra / NH-19 corridor), near Jewar.
 */
export const DEFAULT_CENTER = { lat: 28.156, lng: 77.657 }

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
