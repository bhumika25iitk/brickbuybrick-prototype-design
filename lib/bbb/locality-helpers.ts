import type { LastMileSafety, NearbyAttraction, Profile, Property } from './types'

export function getNearbyAttractions(p: Property): NearbyAttraction[] {
  if (p.nearbyAttractions?.length) return p.nearbyAttractions

  const hasPark = !p.parkFit.toLowerCase().includes('no park')
  return [
    {
      category: 'Cafes & Hangouts',
      name: `${p.locality} Local Cafes & Market`,
      walkMin: Math.min(8, Math.max(3, Math.round(p.metro.walkMin / 2))),
      detail: 'Neighborhood coffee spots, bakeries, and daily groceries nearby',
    },
    {
      category: 'Evening Park & Pet Loop',
      name: hasPark ? p.parkFit.split(',')[0] : 'Nearest Neighborhood Green',
      walkMin: hasPark ? 4 : 12,
      detail: hasPark ? p.parkFit : 'No dedicated park within a 10-minute walk',
    },
    {
      category: 'Metro & Market Stretch',
      name: `${p.metro.station} Metro (${p.metro.line})`,
      walkMin: p.metro.walkMin,
      detail: p.safetyCue,
    },
  ]
}

export function getLastMileSafety(p: Property, profile?: Profile): LastMileSafety {
  const isInclusiveProfile =
    profile?.gender === 'Queer / Non-Binary' ||
    profile?.gender === 'Trans / Gender-Diverse' ||
    profile?.gender === 'Female'

  if (p.lastMileSafety) {
    return {
      ...p.lastMileSafety,
      inclusivityNote: isInclusiveProfile ? p.lastMileSafety.inclusivityNote : p.inclusiveCue,
    }
  }

  const hasCctvOrGate = p.amenities.some(
    (a) => a.available && (a.label.toLowerCase().includes('cctv') || a.label.toLowerCase().includes('gate')),
  )

  const tone: 'good' | 'warn' | 'bad' =
    p.legalScore >= 3 ? 'good' : p.legalScore === 2 ? 'warn' : 'bad'

  return {
    attractionPill: `${p.parkFit.split(',')[0]} (${p.metro.walkMin}m to metro)`,
    safetyPill:
      tone === 'good'
        ? `${p.metro.walkMin}m metro walk, verified access`
        : tone === 'warn'
          ? 'Verify evening lane & RWA rules'
          : 'Unlit approach & unverified access',
    safetyTone: tone,
    metroWalk: `${p.metro.walkMin} min walk to ${p.metro.station} metro (${p.metro.line}). ${p.safetyCue}`,
    metroWalkTone: p.metro.walkMin <= 10 ? 'good' : 'warn',
    buildingAccess: hasCctvOrGate
      ? 'Gated lane or building CCTV verified on site'
      : 'Standard residential entry; confirm gate CCTV on visit',
    buildingAccessTone: hasCctvOrGate ? 'good' : 'warn',
    inclusivityNote: p.inclusiveCue,
    safetyUnknown: 'Streetlight reliability after 11 PM on inner approach lane',
    safetyChecklistPrompt: 'How reliable are the streetlights on the inner approach lane after 11 PM?',
  }
}
