import type { LucideIcon } from 'lucide-react'

export type Decision = 'shortlist' | 'investigate' | 'stretch' | 'walk'

export interface Profile {
  name: string
  age: string
  gender: string
  requirement: string
  location: string
  budget: number
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

export interface Property {
  id: string
  decision: Decision
  title: string
  layout: string
  matches: string[]
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
}
