import {
  ArrowUpDown,
  Car,
  Cctv,
  Coffee,
  CookingPot,
  Droplets,
  FileCheck2,
  Footprints,
  Lock,
  PawPrint,
  ShieldCheck,
  Snowflake,
  Sun,
  TrainFront,
  Trees,
  WashingMachine,
  Wifi,
  Zap,
} from 'lucide-react'
import type { Decision, Profile, Property } from './types'
import { CRORE, LAKH } from './finance'

export const AGE_OPTIONS = ['22-24', '25-27', '28-30', '31-35', '35+']
export const GENDER_OPTIONS = [
  'Female',
  'Male',
  'Queer / Non-Binary',
  'Trans / Gender-Diverse',
  'Prefer not to say',
]
export const REQUIREMENT_OPTIONS = [
  '1 BHK Flat',
  '1.5 BHK Studio-Loft',
  '2 BHK Builder Floor',
  '2 BHK Society Flat',
  '3 BHK Flat',
]
export const LOCATION_OPTIONS = [
  'South Delhi - Saket & Malviya Nagar',
  'South Delhi - Hauz Khas & Green Park',
  'South Delhi - Greater Kailash',
  'West Delhi - Rajouri Garden',
  'Bengaluru - Indiranagar',
]
export const BUDGET_MIN = 60 * LAKH
export const BUDGET_MAX = 2.5 * CRORE
export const BUDGET_PRESETS = [85 * LAKH, 1.05 * CRORE, 1.15 * CRORE, 1.5 * CRORE]

export const DEFAULT_PROFILE: Profile = {
  name: 'Aarav',
  age: '25-27',
  gender: 'Queer / Non-Binary',
  requirement: '2 BHK Builder Floor',
  location: 'South Delhi - Saket & Malviya Nagar',
  budget: 1.15 * CRORE,
  includeStamp: true,
}

export function wantsInclusiveCues(gender: string) {
  return gender === 'Queer / Non-Binary' || gender === 'Trans / Gender-Diverse'
}

export const DECISION_META: Record<
  Decision,
  { label: string; blurb: string; tone: 'good' | 'info' | 'warn' | 'bad' }
> = {
  shortlist: {
    label: 'Shortlist & Visit',
    blurb: 'Facts check out. Book a site visit this week.',
    tone: 'good',
  },
  investigate: {
    label: 'Investigate First',
    blurb: 'Strong fit, but key claims are unverified. Ask before you visit.',
    tone: 'info',
  },
  stretch: {
    label: 'Alternative Stretch',
    blurb: 'Cheaper and characterful, with real compromises to weigh.',
    tone: 'warn',
  },
  walk: {
    label: 'Walk Away',
    blurb: 'Looks cheap on paper. The paperwork says otherwise.',
    tone: 'bad',
  },
}

export const DECISION_ORDER: Decision[] = ['shortlist', 'investigate', 'stretch', 'walk']

export const BUYER_STEPS = [
  {
    title: 'Loan Pre-Approval',
    detail:
      'Get an in-principle sanction from two banks first. It tells you your real ceiling and makes owners take you seriously.',
  },
  {
    title: 'Shortlist',
    detail:
      'You are here. Narrow to two homes that pass title, commute, and pet checks. Ignore anything that only looks good in photos.',
  },
  {
    title: 'Legal & RERA Check',
    detail:
      'Have a property lawyer read the chain of title, conveyance deed, and RERA status. Budget around Rs 15,000 for this.',
  },
  {
    title: 'Site Visit',
    detail:
      'Visit twice: once on a weekday evening, once after rain if you can. Check seepage, water pressure, and the lane at night.',
  },
  {
    title: 'Agreement & Registration',
    detail:
      'Sign the agreement to sell, pay stamp duty, and register at the Sub-Registrar office. Never pay cash outside the deed.',
  },
]

export const PROPERTIES: Property[] = [
  {
    id: 'malviya-nagar',
    decision: 'shortlist',
    title: '2 BHK Builder Floor, Malviya Nagar',
    layout: '2 BHK Builder Floor',
    matches: ['2 BHK Builder Floor', '2 BHK Society Flat'],
    locality: 'Malviya Nagar',
    address: 'Second floor, C-118, Shivalik Road, Malviya Nagar, New Delhi 110017',
    metro: { line: 'Yellow Line', station: 'Malviya Nagar', walkMin: 7, commuteMin: 12 },
    basePrice: 96 * LAKH,
    otherCharges: 0,
    otherChargesLabel: 'No extra charges declared',
    carpetArea: 780,
    superBuiltUp: 1020,
    floor: '2nd of 4 (no lift)',
    pastOccupants: '1 owner since 2014',
    titleStatus: 'Freehold, A-grade chain of title',
    photoStatus: 'All 5 photos match site visit, Nov 2026',
    ageOfBuilding: '12 years',
    maintenance: 2500,
    localRent: 32000,
    summary:
      'A quiet, well-kept builder floor with clean paperwork, a short metro ride to Saket, and a park you can walk to after work.',
    highlights: [
      'Verified freehold title',
      '300 m to District Park',
      '2 specialty cafes within a 5 min walk',
    ],
    tradeoffs: ['Lift access'],
    inclusiveCue:
      'Young, mixed pocket near Shivalik Road. Two queer-owned studios and a community library nearby.',
    safetyCue: 'Main road is well lit till 11 pm. 7 min walk to metro on a busy footpath.',
    catFit: 'Owner allows pets. Balcony netting already fitted.',
    parkFit: 'District Park 300 m, evening walking track',
    legalScore: 3,
    legalLabel: 'Clean freehold, bank-approved',
    biggestUnknown: 'Monsoon waterlogging on Shivalik Road',
    photos: [
      { room: 'Living & Dining', src: '/images/p1-living.png', verification: 'real', caption: 'East-facing, good morning light. Marble floor in fair condition.' },
      { room: 'Bedroom', src: '/images/p1-bedroom.png', verification: 'real', caption: 'Main bedroom fits a queen bed and a desk. Wardrobe is built in.' },
      { room: 'Balcony', src: '/images/p1-balcony.png', verification: 'real', caption: 'Faces a tree-lined lane. Netting is fitted, which matters with a cat.' },
      { room: 'Kitchen', src: '/images/p1-kitchen.png', verification: 'real', caption: 'Modular kitchen redone in 2022. Chimney works.' },
      { room: 'Building Approach', src: '/images/p1-exterior.png', verification: 'real', caption: 'Gated entry, stilt parking for one car. Stairs only.' },
    ],
    amenities: [
      { label: 'Modular kitchen', icon: CookingPot, available: true },
      { label: 'Fibre broadband ready', icon: Wifi, available: true },
      { label: 'Stilt parking, 1 car', icon: Car, available: true },
      { label: 'Park within 300 m', icon: Trees, available: true },
      { label: 'Pet-friendly owner', icon: PawPrint, available: true },
      { label: 'Power backup for lights and fans', icon: Zap, available: true },
      { label: 'Lift access', icon: ArrowUpDown, available: false, note: 'Stairs only, 2nd floor' },
      { label: 'CCTV at gate', icon: Cctv, available: false, note: 'Not installed' },
    ],
    rep: {
      name: 'Meenakshi Arora',
      type: 'Direct Owner',
      lastActive: '2 hours ago',
      responseRate: 'Replies within a day',
      brokeragePct: 0.01,
      note: 'Owner listed directly but uses a local agent for paperwork. The agent charges 1% to the buyer, disclosed upfront.',
    },
    verified: [
      { label: 'Title', value: 'Freehold, conveyance deed sighted', tone: 'good' },
      { label: 'RERA', value: 'Not required (resale builder floor)', tone: 'good' },
      { label: 'Carpet vs brochure area', value: '780 sq ft carpet, 1,020 sq ft super built-up', tone: 'good' },
      { label: 'Past occupancy', value: '1 owner-occupier since 2014', tone: 'good' },
      { label: 'Metro walk', value: '7 min to Malviya Nagar station', tone: 'good' },
      { label: 'Photo verification', value: 'All photos match site, Nov 2026', tone: 'good' },
    ],
    assumptions: [
      'Home loan interest at 8.6% floating for the full tenure.',
      'Owner keeps existing balcony netting after sale.',
      'Bank values the flat at or above asking price.',
    ],
    unknowns: [
      'Monsoon waterlogging on Shivalik Road approach.',
      'Future society maintenance hikes (no formal RWA fund).',
    ],
    checklist: [
      'Can I see the original conveyance deed and the last 3 sale deeds in the chain?',
      'Does the lane flood during heavy monsoon rain, and for how long?',
      'Will the balcony netting and fixtures stay with the flat?',
      'Is the 1% agent fee the only brokerage, with GST on a proper invoice?',
      'Who maintains the terrace and water tank, and what does it cost each year?',
    ],
  },
  {
    id: 'hauz-khas',
    decision: 'investigate',
    title: '2 BHK DDA-Converted Flat, Hauz Khas Enclave',
    layout: '2 BHK Society Flat',
    matches: ['2 BHK Society Flat', '2 BHK Builder Floor'],
    locality: 'Hauz Khas Enclave',
    address: 'First floor, Pocket B, Flat 41, Hauz Khas Enclave, New Delhi 110016',
    metro: { line: 'Yellow & Magenta Line', station: 'Hauz Khas', walkMin: 9, commuteMin: 10 },
    basePrice: 1.035 * CRORE,
    otherCharges: 0,
    otherChargesLabel: 'No extra charges declared',
    carpetArea: 850,
    superBuiltUp: 1050,
    floor: '1st of 3 (no lift needed)',
    pastOccupants: '3 tenants in 4 years',
    titleStatus: 'DDA freehold conversion done in 2009',
    photoStatus: '4 of 5 photos match. Living room photo predates repaint.',
    ageOfBuilding: '38 years',
    maintenance: 3200,
    localRent: 38000,
    summary:
      'The best location on the board, next to Deer Park, but the pet claim is unverified and frequent tenant turnover needs explaining.',
    highlights: ['Next to Deer Park', 'Vibrant third spaces in Hauz Khas Village', '10 min to Saket'],
    tradeoffs: ['Verified RWA pet policy', 'Balcony netting approval'],
    inclusiveCue:
      'Hauz Khas has a visible queer community, inclusive cafes, and an active arts scene. RWA stance on residents is unknown.',
    safetyCue: 'Busy evenings near the Village. Pocket B lanes are dim after 10 pm.',
    catFit: 'Listing says pet-friendly. RWA bylaws not seen.',
    parkFit: 'Deer Park gate 150 m, best walk on the board',
    legalScore: 2,
    legalLabel: 'Freehold, but RWA bylaws unseen',
    biggestUnknown: 'RWA pet and netting rules, cause of tenant turnover',
    gapAlert:
      "Missing Verification: The listing claims 'pet-friendly', but RWA bylaws are unverified and 3 tenants vacated in 4 years.",
    photos: [
      { room: 'Living & Dining', src: '/images/p2-living.png', verification: 'real', caption: 'Large window to the trees. Note the damp patch near the ceiling corner.' },
      { room: 'Bedroom', src: '/images/p1-bedroom.png', verification: 'real', caption: 'Similar size to Malviya Nagar. Older wiring.' },
      { room: 'Balcony', src: '/images/p1-balcony.png', verification: 'real', caption: 'No netting. RWA approval needed before installing any.' },
      { room: 'Kitchen', src: '/images/p1-kitchen.png', verification: 'real', caption: 'Recently redone. Ask about plumbing behind the tiles.' },
      { room: 'Building Approach', src: '/images/p2-exterior.png', verification: 'real', caption: 'Classic DDA brick block. Shared stairwell, three floors.' },
    ],
    amenities: [
      { label: 'Kitchen', icon: CookingPot, available: true },
      { label: 'Fibre broadband ready', icon: Wifi, available: true },
      { label: 'Deer Park at 150 m', icon: Trees, available: true },
      { label: 'Cafes and third spaces', icon: Coffee, available: true },
      { label: 'Open parking in pocket', icon: Car, available: true },
      { label: 'Split AC in both rooms', icon: Snowflake, available: true },
      { label: 'Verified RWA pet policy', icon: PawPrint, available: false, note: 'Bylaws not shared' },
      { label: 'Seepage-free bathrooms', icon: Droplets, available: false, note: 'Unverified' },
    ],
    rep: {
      name: 'Rohit Malhotra',
      type: 'Resale Broker',
      firm: 'Malhotra Estates, Green Park',
      lastActive: '20 minutes ago',
      responseRate: 'Very fast, pushes for token',
      brokeragePct: 0.01,
      note: 'Broker is quick to reply and asking for a token amount before a second visit. Do not pay a token until bylaws are in hand.',
    },
    verified: [
      { label: 'Title', value: 'DDA freehold conversion deed, 2009', tone: 'good' },
      { label: 'RERA', value: 'Not applicable (DDA resale)', tone: 'good' },
      { label: 'Carpet vs brochure area', value: '850 sq ft carpet, 1,050 sq ft super built-up', tone: 'good' },
      { label: 'Past occupancy', value: '3 tenants in 4 years', tone: 'warn' },
      { label: 'Metro walk', value: '9 min to Hauz Khas station', tone: 'good' },
      { label: 'Photo verification', value: '4 of 5 match. Living room predates repaint.', tone: 'warn' },
    ],
    assumptions: [
      'Home loan interest at 8.6% floating for the full tenure.',
      'RWA approves cat balcony netting for a new owner.',
      'Seepage, if any, is limited to cosmetic damp.',
    ],
    unknowns: [
      'Actual RWA bylaws on pets and residents.',
      'Why 3 tenants left in 4 years.',
      'Undisclosed society maintenance hikes.',
      'Monsoon waterlogging near Pocket B.',
    ],
    checklist: [
      'Can I read the RWA bylaws, and do they allow cats and balcony netting for owners?',
      'Do the RWA rules treat single, unmarried, or queer residents any differently from families?',
      'Have there been bathroom or ceiling seepage repairs, and can I see the plumber bills?',
      'Can I see the original Freehold Conveyance Deed from DDA, not a photocopy?',
      'What is the exact brokerage: 1% plus 18% GST, invoiced, with nothing extra in cash?',
    ],
  },
  {
    id: 'champa-gali',
    decision: 'stretch',
    title: '1.5 BHK Studio-Loft, Champa Gali',
    layout: '1.5 BHK Studio-Loft',
    matches: ['1.5 BHK Studio-Loft', '1 BHK Flat'],
    locality: 'Champa Gali, Saidulajab',
    address: 'Top floor, House 287, Lane 3, Champa Gali, Saidulajab, New Delhi 110030',
    metro: { line: 'Yellow Line', station: 'Saket', walkMin: 14, commuteMin: 8 },
    basePrice: 85 * LAKH,
    otherCharges: 0,
    otherChargesLabel: 'No extra charges declared',
    carpetArea: 560,
    superBuiltUp: 640,
    floor: '3rd of 3 (top floor, no lift)',
    pastOccupants: '2 owners since 2017',
    titleStatus: 'Lal Dora area, land conversion pending',
    photoStatus: 'All 3 photos match site, Nov 2026',
    ageOfBuilding: '9 years',
    maintenance: 1500,
    localRent: 28000,
    summary:
      'A characterful loft in a creative lane, cheapest on the shortlist, but bank loan approval depends on land paperwork that is still pending.',
    highlights: ['Creative community hub', 'Great cafes on the lane', '8 min to Saket office'],
    tradeoffs: ['Car access to door', 'Confirmed bank loan eligibility'],
    inclusiveCue:
      'One of the most openly inclusive pockets in South Delhi. Artist studios and queer-friendly cafes on the same lane.',
    safetyCue: 'Lane is busy till late. Last 100 m to the door is narrow and unlit.',
    catFit: 'Owner fine with pets. Terrace access, needs netting.',
    parkFit: 'Garden of Five Senses 1.2 km, no park on foot',
    legalScore: 1,
    legalLabel: 'Loan eligibility estimated, not confirmed',
    biggestUnknown: 'Whether banks accept the land status',
    photos: [
      { room: 'Living & Loft', src: '/images/p3-loft.png', verification: 'real', caption: 'Mezzanine sleeping loft. Ceiling is low on the upper level.' },
      { room: 'Bedroom', src: '/images/p3-loft.png', verification: 'real', caption: 'The half room is a sleeping loft, not a closed bedroom.' },
      { room: 'Balcony', src: '/images/p1-balcony.png', verification: 'real', caption: 'Small terrace ledge. Would need netting for a cat.' },
      { room: 'Kitchen', src: '/images/p1-kitchen.png', verification: 'real', caption: 'Compact galley kitchen along one wall.' },
      { room: 'Building Approach', src: '/images/p3-lane.png', verification: 'real', caption: 'Narrow lane. Two-wheelers only past the main road.' },
    ],
    amenities: [
      { label: 'Galley kitchen', icon: CookingPot, available: true },
      { label: 'Fibre broadband ready', icon: Wifi, available: true },
      { label: 'Cafes on the lane', icon: Coffee, available: true },
      { label: 'Morning sun, top floor', icon: Sun, available: true },
      { label: 'Pet-friendly owner', icon: PawPrint, available: true },
      { label: 'Walkable to metro', icon: Footprints, available: true },
      { label: 'Car access to door', icon: Car, available: false, note: 'Lane too narrow' },
      { label: 'Bank loan pre-cleared', icon: FileCheck2, available: false, note: 'Estimated only' },
    ],
    rep: {
      name: 'Kabir Sethi',
      type: 'Direct Owner',
      lastActive: 'Yesterday',
      responseRate: 'Replies in 1 to 2 days',
      brokeragePct: 0.01,
      note: 'Owner is an architect selling to move abroad. A facilitator charges 1% for documentation help.',
    },
    verified: [
      { label: 'Title', value: 'Registered sale deed, Lal Dora land', tone: 'warn' },
      { label: 'RERA', value: 'Not applicable (independent house)', tone: 'good' },
      { label: 'Carpet vs brochure area', value: '560 sq ft carpet, 640 sq ft claimed', tone: 'good' },
      { label: 'Past occupancy', value: '2 owners since 2017', tone: 'good' },
      { label: 'Metro walk', value: '14 min to Saket station', tone: 'warn' },
      { label: 'Photo verification', value: 'All photos match site, Nov 2026', tone: 'good' },
    ],
    assumptions: [
      'Home loan interest at 8.6% floating for the full tenure.',
      'At least one bank lends against Lal Dora land with conversion papers.',
      'Owner allows terrace netting for a cat.',
    ],
    unknowns: [
      'Final land conversion approval timeline.',
      'Fire safety access in the narrow lane.',
      'Undisclosed maintenance for the shared stairwell.',
    ],
    checklist: [
      'Which banks have already lent on houses in this lane, and can I see one sanction letter?',
      'Where is the land conversion application, and who is following up on it?',
      'Can a fire tender or ambulance reach the door?',
      'Will you allow netting on the terrace for a cat?',
      'Is the 1% facilitator fee invoiced with GST, and does it cover registration help?',
    ],
  },
  {
    id: 'neb-sarai',
    decision: 'walk',
    title: '2 BHK Unit, Neb Sarai',
    layout: '2 BHK Society Flat',
    matches: ['2 BHK Society Flat'],
    locality: 'Neb Sarai',
    address: 'Fourth floor, Plot 64, Khasra 312, Neb Sarai Extension, New Delhi 110068',
    metro: { line: 'Yellow Line', station: 'Saket', walkMin: 18, commuteMin: 22 },
    basePrice: 78 * LAKH,
    otherCharges: 10.7 * LAKH,
    otherChargesLabel: 'Floor-rise PLC, covered parking, and clubhouse (revealed on call)',
    carpetArea: 610,
    superBuiltUp: 1100,
    floor: '4th of 5 (lift promised, not installed)',
    pastOccupants: 'New construction, unsold since 2024',
    titleStatus: 'Unverified GPA, unauthorised colony',
    photoStatus: 'Listing photos are 3D renders. Site does not match.',
    ageOfBuilding: 'Under construction',
    maintenance: 4000,
    localRent: 22000,
    summary:
      'Lowest sticker price on the board, but the title is a GPA, banks will refuse the loan, and the photos are renders.',
    highlights: ['Lowest base price', 'Large super built-up claim'],
    tradeoffs: ['Bank-approved title', 'Real site photos', 'Lift access'],
    inclusiveCue: 'No community signals available. Broker avoided questions about residents.',
    safetyCue: 'Congested lane, 18 min walk to metro through an unlit stretch.',
    catFit: 'Broker said pets "should be fine". Nothing in writing.',
    parkFit: 'No park within 1 km',
    legalScore: 0,
    legalLabel: 'GPA title, banks will reject loan',
    biggestUnknown: 'Whether the building can ever be regularised',
    photos: [
      { room: 'Living & Dining', src: '/images/p4-render.png', verification: 'render', caption: 'This is a builder render. No flat in this building looks like this.' },
      { room: 'Bedroom', src: '/images/p4-render.png', verification: 'render', caption: 'Same render reused with a different crop.' },
      { room: 'Balcony', src: '/images/p4-site.png', verification: 'real', caption: 'Actual balcony: bare cement, no railing yet.' },
      { room: 'Kitchen', src: '/images/p4-site.png', verification: 'real', caption: 'No kitchen fitted. Wiring exposed.' },
      { room: 'Building Approach', src: '/images/p4-site.png', verification: 'real', caption: 'Real site photo. Lane is congested and overhead wiring is low.' },
    ],
    amenities: [
      { label: 'Clubhouse (charged extra)', icon: Coffee, available: true },
      { label: 'Covered parking (charged extra)', icon: Car, available: true },
      { label: 'Lift access', icon: ArrowUpDown, available: false, note: 'Promised, not installed' },
      { label: 'Bank-approved title', icon: ShieldCheck, available: false, note: 'GPA only' },
      { label: 'Gated security', icon: Lock, available: false, note: 'No gate yet' },
      { label: 'Power backup', icon: Zap, available: false, note: 'Unverified' },
      { label: 'Laundry area', icon: WashingMachine, available: false, note: 'Not in plan' },
      { label: 'Under 15 min to metro', icon: TrainFront, available: false, note: '18 min walk' },
    ],
    rep: {
      name: 'Sunny Bhati',
      type: 'Builder Channel Partner',
      firm: 'Prime Homes Realty',
      lastActive: '5 minutes ago',
      responseRate: 'Calls repeatedly, high pressure',
      brokeragePct: 0.02,
      note: 'Listed as "zero brokerage" but asked for 2% on the phone. Pushing a "last unit" deadline. That deadline has been repeated since 2024.',
    },
    verified: [
      { label: 'Title', value: 'General Power of Attorney only', tone: 'bad' },
      { label: 'RERA', value: 'No registration found', tone: 'bad' },
      { label: 'Carpet vs brochure area', value: '610 sq ft carpet vs 1,100 sq ft claimed (45% loading)', tone: 'bad' },
      { label: 'Past occupancy', value: 'Unsold since 2024', tone: 'warn' },
      { label: 'Metro walk', value: '18 min to Saket station', tone: 'warn' },
      { label: 'Photo verification', value: 'Interior photos are 3D renders', tone: 'bad' },
    ],
    assumptions: [
      'Home loan interest at 8.6%, if any bank lends at all (unlikely).',
      'PLC and clubhouse charges are final as quoted on the call.',
    ],
    unknowns: [
      'Whether the colony will ever be regularised.',
      'Actual possession date.',
      'Undisclosed society maintenance and corpus fund.',
      'Monsoon waterlogging on the approach lane.',
    ],
    checklist: [
      'Can you show a registered sale deed, not a GPA or agreement to sell?',
      'What is the DDA or MCD sanction number for this building plan?',
      'Why does the listing say zero brokerage when you are asking for 2%?',
      'Which bank has approved this project for home loans? Please name one.',
      'Can I see an actual finished flat, not a render?',
    ],
  },
]

export const REPORT_REASONS = [
  'Photos are 3D renders or do not match the actual flat condition',
  'RERA number is invalid, expired, or property is unapproved GPA / B-Khata',
  'Misleading carpet area or hidden floor-rise / PLC / clubhouse charges',
  'Listing is already sold (broker bait-and-switch tactic)',
  'Undisclosed brokerage demand on a "zero brokerage" listing',
  'Discriminatory RWA restrictions (bachelor, queer, or pet bans hidden in description)',
]

export const TRADEOFF_PRESETS = [
  'Should I stretch Rs 8L more for Hauz Khas Deer Park access, or pick Malviya Nagar with verified title and save Rs 8L?',
  'Is the Champa Gali studio worth it if the bank loan might not clear?',
  'Neb Sarai is the cheapest. Why not just take it over Champa Gali?',
]
