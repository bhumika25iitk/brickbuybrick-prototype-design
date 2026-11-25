import type { LucideIcon } from 'lucide-react'

export type Decision = 'shortlist' | 'investigate' | 'stretch' | 'walk'

export type Intent = 'Buy' | 'Rent' | 'Lease'

export type DelhiZone =
  | 'South Delhi'
  | 'West Delhi'
  | 'Central Delhi'
  | 'North Delhi'
  | 'East Delhi'

export interface Profile {
  name: string
  age: string
  gender: string
  intent: Intent | ''
  requirement: string
  city: string
  location: string
  budget: number | null
  includeStamp: boolean
}

export interface Photo {
  room: string
  src: string
  verification: 'real' | 'render'
  caption: string
}

export interface Amenity {
  label: string
  icon: LucideIcon
  available: boolean
  note?: string
}

export interface LedgerItem {
  label: string
  value: string
  tone?: 'good' | 'warn' | 'bad'
}

export interface Representative {
  name: string
  type: 'Direct Owner' | 'Builder Channel Partner' | 'Resale Broker'
  firm?: string
  lastActive: string
  responseRate: string
  brokeragePct: number
  note: string
}

export interface NearbyAttraction {
  category: 'Cafes & Hangouts' | 'Evening Park & Pet Loop' | 'Metro & Market Stretch'
  name: string
  walkMin: number
  detail: string
}

export interface LastMileSafety {
  attractionPill: string
  safetyPill: string
  safetyTone: 'good' | 'warn' | 'bad'
  metroWalk: string
  metroWalkTone?: 'good' | 'warn' | 'bad'
  buildingAccess: string
  buildingAccessTone?: 'good' | 'warn' | 'bad'
  inclusivityNote: string
  safetyUnknown?: string
  safetyChecklistPrompt?: string
}

export interface RentalTerms {
  depositMonths: number
  term: string
  landlordNote: string
}

export interface Property {
  id: string
  decision: Decision
  title: string
  layout: string
  matches: string[]
  city?: string
  intents?: Intent[]
  rentalTerms?: RentalTerms
  zone: DelhiZone
  locality: string
  address: string
  metro: { line: string; station: string; walkMin: number; commuteMin: number }
  basePrice: number
  otherCharges: number
  otherChargesLabel: string
  carpetArea: number
  superBuiltUp: number
  floor: string
  pastOccupants: string
  titleStatus: string
  photoStatus: string
  ageOfBuilding: string
  maintenance: number
  localRent: number
  summary: string
  highlights: string[]
  tradeoffs: string[]
  inclusiveCue: string
  safetyCue: string
  catFit: string
  parkFit: string
  legalScore: 0 | 1 | 2 | 3
  legalLabel: string
  biggestUnknown: string
  photos: Photo[]
  amenities: Amenity[]
  rep: Representative
  verified: LedgerItem[]
  assumptions: string[]
  unknowns: string[]
  gapAlert?: string
  checklist: string[]
  nearbyAttractions?: NearbyAttraction[]
  lastMileSafety?: LastMileSafety
}
