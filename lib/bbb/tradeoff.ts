import { PROPERTIES, wantsInclusiveCues } from './data'
import { capCost, emiFor, formatINR, formatRupees, tenureForAge } from './finance'
import type { Profile, Property } from './types'

const KEYWORDS: Record<string, string[]> = {
  'malviya-nagar': ['malviya', 'builder floor', 'verified title'],
  'hauz-khas': ['hauz', 'deer park', 'dda'],
  'champa-gali': ['champa', 'saidulajab', 'studio', 'loft'],
  'neb-sarai': ['neb', 'sarai', 'cheapest'],
}

const PAIR_ADVICE: Record<string, string> = {
  'hauz-khas|malviya-nagar':
    'Pick Malviya Nagar today and keep Hauz Khas as a live option only if the broker shares RWA bylaws in writing within a week. The extra money buys you Deer Park, but right now it also buys an unanswered pet question and an unexplained tenant churn.',
  'champa-gali|malviya-nagar':
    'Apply for loan pre-approval on Champa Gali before you fall for it. If no bank sanctions it in writing, Malviya Nagar is the safer home and the extra cost is the price of a clean title and a park for your cat.',
  'champa-gali|neb-sarai':
    'Walk away from Neb Sarai. Its low sticker price disappears once PLC, parking, and clubhouse charges are added, and a GPA title means you would need to pay in cash. Champa Gali has real risk too, but it is a risk you can check with one bank call.',
  'malviya-nagar|neb-sarai':
    'Malviya Nagar costs more on paper but you can actually get a loan for it. Neb Sarai would need almost the full amount in cash and the title may never be fixed.',
  'hauz-khas|neb-sarai':
    'Hauz Khas needs questions answered. Neb Sarai needs a miracle. Spend your energy on getting the Hauz Khas bylaws and drop Neb Sarai.',
  'champa-gali|hauz-khas':
    'Both need homework. Hauz Khas needs RWA bylaws, Champa Gali needs a bank sanction. Ask for both this week and let whichever answers first decide.',
}

export interface Comparison {
  a: Property
  b: Property
  note?: string
  rows: { label: string; a: string; b: string; winner?: 'a' | 'b' }[]
  advice: string
}

export function pickPair(query: string): { pair: [Property, Property]; note?: string } {
  const q = query.toLowerCase()
  const found = PROPERTIES.filter((p) => KEYWORDS[p.id].some((k) => q.includes(k)))
  if (found.length >= 2) return { pair: [found[0], found[1]] }
  const fallback = PROPERTIES[0]
  if (found.length === 1) {
    const other = found[0].id === fallback.id ? PROPERTIES[1] : fallback
    return { pair: [found[0], other], note: `You named one home, so I compared it with ${other.locality}.` }
  }
  return {
    pair: [PROPERTIES[0], PROPERTIES[1]],
    note: 'No specific home was named, so I compared your top two.',
  }
}

export function compare(query: string, profile: Profile): Comparison {
  const { pair, note } = pickPair(query)
  const [a, b] = pair
  const costA = capCost(a, profile.includeStamp)
  const costB = capCost(b, profile.includeStamp)
  const emiA = emiFor(a, profile.age)
  const emiB = emiFor(b, profile.age)
  const diff = Math.abs(emiA - emiB)
  const cheaper = emiA < emiB ? a : b
  const years = tenureForAge(profile.age)
  const inclusive = wantsInclusiveCues(profile.gender)
  const key = [a.id, b.id].sort().join('|')

  return {
    a,
    b,
    note,
    rows: [
      { label: profile.includeStamp ? 'All-in cost' : 'Cost excl. stamp duty', a: formatINR(costA), b: formatINR(costB), winner: costA <= costB ? 'a' : 'b' },
      { label: `Monthly EMI (${years} yrs, 8.6%)`, a: formatRupees(emiA), b: formatRupees(emiB), winner: emiA <= emiB ? 'a' : 'b' },
      {
        label: 'EMI difference',
        a: cheaper.id === a.id ? `Saves ${formatRupees(diff)}/mo` : `+${formatRupees(diff)}/mo`,
        b: cheaper.id === b.id ? `Saves ${formatRupees(diff)}/mo` : `+${formatRupees(diff)}/mo`,
      },
      { label: 'Commute to Saket', a: `${a.metro.commuteMin} min`, b: `${b.metro.commuteMin} min`, winner: a.metro.commuteMin <= b.metro.commuteMin ? 'a' : 'b' },
      { label: 'Cat fit', a: a.catFit, b: b.catFit },
      { label: 'Park access', a: a.parkFit, b: b.parkFit },
      { label: inclusive ? 'Inclusive cues' : 'Evening safety', a: inclusive ? a.inclusiveCue : a.safetyCue, b: inclusive ? b.inclusiveCue : b.safetyCue },
      { label: 'Legal safety', a: a.legalLabel, b: b.legalLabel, winner: a.legalScore === b.legalScore ? undefined : a.legalScore > b.legalScore ? 'a' : 'b' },
      { label: 'Biggest unknown', a: a.biggestUnknown, b: b.biggestUnknown },
    ],
    advice:
      PAIR_ADVICE[key] ??
      `${a.legalScore >= b.legalScore ? a.locality : b.locality} has the stronger paperwork. Start there and only move to the other if its open questions get answered in writing.`,
  }
}
