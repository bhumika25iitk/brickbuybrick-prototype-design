'use client'

import { useCallback, useState } from 'react'
import { ArrowUpDown, Check, ChevronDown, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DECISION_ORDER, PROPERTIES } from '@/lib/bbb/data'
import { capCost, formatINR, formatRent } from '@/lib/bbb/finance'
import type { Profile, Property } from '@/lib/bbb/types'
import { useDismiss } from '@/hooks/use-dismiss'
import { GuideBar } from './guide-bar'
import { PropertyCard } from './property-card'
import { TradeoffSimulator } from './tradeoff-simulator'

type SortKey = 'decision' | 'cost' | 'commute' | 'verification'

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'decision', label: 'Best Decision Fit (Default)' },
  { key: 'cost', label: 'Lowest All-In Cost' },
  { key: 'commute', label: 'Shortest Metro Walk' },
  { key: 'verification', label: 'Highest Verification Score' },
]

function effectiveCost(p: Property, profile: Profile) {
  if (profile.intent === 'Rent') return p.localRent
  if (profile.intent === 'Lease') return Math.round(p.localRent * 1.15)
  return capCost(p, profile.includeStamp)
}

function sortProperties(props: Property[], key: SortKey, profile: Profile): Property[] {
  const list = [...props]
  switch (key) {
    case 'cost':
      return list.sort((a, b) => effectiveCost(a, profile) - effectiveCost(b, profile))
    case 'commute':
      return list.sort((a, b) => a.metro.walkMin - b.metro.walkMin)
    case 'verification':
      return list.sort((a, b) => b.legalScore - a.legalScore)
    default:
      return list.sort((a, b) => {
        const aReq = a.matches.includes(profile.requirement) ? 0 : 1
        const bReq = b.matches.includes(profile.requirement) ? 0 : 1
        if (aReq !== bReq) return aReq - bReq
        return DECISION_ORDER.indexOf(a.decision) - DECISION_ORDER.indexOf(b.decision)
      })
  }
}

function supportsIntent(p: Property, intent: Profile['intent']) {
  const effectiveIntent = intent || 'Buy'
  if (!p.intents) return effectiveIntent === 'Buy'
  return p.intents.includes(effectiveIntent)
}

function filterProperties(profile: Profile): { items: Property[]; outOfScope: boolean } {
  const city = profile.city || 'New Delhi'
  const byCity = PROPERTIES.filter((p) => (p.city ?? 'New Delhi') === city)

  if (byCity.length === 0) {
    const benchmark = PROPERTIES.filter((p) => (p.city ?? 'New Delhi') === 'New Delhi').slice(0, 4)
    return { items: benchmark, outOfScope: true }
  }

  let pool = byCity

  if (city === 'New Delhi') {
    const zonePrefix = profile.location.split(' (')[0]
    if (zonePrefix && zonePrefix !== 'All Delhi Zones') {
      const zoneMatches = pool.filter((p) => p.zone === zonePrefix)
      if (zoneMatches.length > 0) pool = zoneMatches
    }
  } else {
    const loc = profile.location
    if (loc && !loc.startsWith('All ')) {
      const locMatches = pool.filter((p) => p.locality.toLowerCase().includes(loc.toLowerCase()))
      if (locMatches.length > 0) pool = locMatches
    }
  }

  const intentMatches = pool.filter((p) => supportsIntent(p, profile.intent))
  if (intentMatches.length > 0) {
    return { items: intentMatches, outOfScope: false }
  }

  const cityIntentMatches = byCity.filter((p) => supportsIntent(p, profile.intent))
  return { items: cityIntentMatches.length > 0 ? cityIntentMatches : pool, outOfScope: false }
}

function SortDropdown({ value, onChange }: { value: SortKey; onChange: (v: SortKey) => void }) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const ref = useDismiss<HTMLDivElement>(open, close)
  const current = SORT_OPTIONS.find((o) => o.key === value)!

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-foreground transition-all hover:border-primary/50 hover:shadow-sm',
          open && 'border-primary shadow-sm',
        )}
      >
        <ArrowUpDown aria-hidden className="size-3.5 text-muted-foreground" />
        <span>Sorted by: {current.label}</span>
        <ChevronDown
          aria-hidden
          className={cn('size-3.5 text-muted-foreground transition-transform', open && 'rotate-180')}
        />
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label="Sort homes by"
          className="absolute right-0 top-full z-50 mt-2 min-w-64 overflow-hidden rounded-xl border border-border bg-popover p-1 text-left text-sm shadow-lg animate-in fade-in zoom-in-95 duration-150"
        >
          {SORT_OPTIONS.map((opt) => {
            const selected = opt.key === value
            return (
              <li
                key={opt.key}
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(opt.key)
                  setOpen(false)
                }}
                className={cn(
                  'flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-foreground hover:bg-muted',
                  selected && 'font-medium text-primary-strong',
                )}
              >
                <span>{opt.label}</span>
                {selected && <Check aria-hidden className="size-4 text-primary-strong" />}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

interface DecisionRoomProps {
  profile: Profile
  flags: Record<string, string[]>
  updating: boolean
  onOpen: (id: string) => void
  onBookCall: () => void
  onSwitchToDelhi: () => void
}

export function DecisionRoom({ profile, flags, updating, onOpen, onBookCall, onSwitchToDelhi }: DecisionRoomProps) {
  const [sortKey, setSortKey] = useState<SortKey>('decision')
  const effectiveBudget = profile.budget ?? 11_500_000
  const effectiveIntent = profile.intent || 'Buy'
  const { items: visible, outOfScope } = filterProperties(profile)
  const withinCap = visible.filter((p) => effectiveCost(p, profile) <= effectiveBudget)
  const greeting = profile.name.trim() ? `${profile.name.trim()}, here` : 'Here'
  const sorted = sortProperties(visible, sortKey, profile)
  const isBuy = effectiveIntent === 'Buy'
  const capLabel = isBuy
    ? `${formatINR(effectiveBudget)} ${profile.includeStamp ? 'all-in cap' : 'cap (before stamp duty)'}`
    : `${formatRent(effectiveBudget)} monthly ${effectiveIntent.toLowerCase()} cap`

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-20 pt-6 sm:px-6 animate-in fade-in duration-300">
      <GuideBar onBookCall={onBookCall} />

      <div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground">
          {greeting} is your Decision Room
        </h1>
        <p className="mt-2 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          {withinCap.length} of {visible.length} homes fit your {capLabel}. We sorted them by what you should do next, not by
          price. Change any slot above and everything recalculates immediately.
        </p>
      </div>

      {outOfScope && (
        <div
          role="status"
          className="flex flex-col gap-3 rounded-2xl border border-primary/30 bg-primary-soft p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="flex items-start gap-3 text-sm leading-relaxed text-foreground">
            <Info aria-hidden className="mt-0.5 size-5 shrink-0 text-primary-strong" />
            <span>
              Live RERA and neighborhood verification is currently active for New Delhi in this prototype. Showing New Delhi benchmark homes below, or switch back to New Delhi to explore South, West, Central, North, and East Delhi.
            </span>
          </p>
          <button
            type="button"
            onClick={onSwitchToDelhi}
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-strong"
          >
            Switch back to New Delhi
          </button>
        </div>
      )}

      {!outOfScope && withinCap.length === 0 && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning-soft p-4 text-sm leading-relaxed text-foreground"
        >
          <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-warning" />
          <span>
            No homes fit under {capLabel}. Raise your budget slider above or review the closest homes below with their over-cap difference.
          </span>
        </div>
      )}

      <section aria-label="Evaluated properties">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-5 py-3">
          <p aria-live="polite" className="text-sm font-medium text-foreground">
            {updating ? (
              <span className="text-primary-strong">Updating shortlist...</span>
            ) : (
              `${visible.length} ${visible.length === 1 ? 'home' : 'homes'} evaluated for your criteria`
            )}
          </p>
          <SortDropdown value={sortKey} onChange={setSortKey} />
        </div>

        <div
          className={cn(
            'grid grid-cols-1 gap-6 transition-opacity duration-200 md:grid-cols-2',
            updating ? 'opacity-60' : 'opacity-100',
          )}
        >
          {sorted.map((p) => {
            const cost = effectiveCost(p, profile)
            const overCapBy = cost > effectiveBudget ? cost - effectiveBudget : undefined
            return (
              <PropertyCard
                key={p.id}
                property={p}
                profile={profile}
                flaggedCount={flags[p.id]?.length ?? 0}
                overCapBy={overCapBy}
                onOpen={() => onOpen(p.id)}
              />
            )
          })}
        </div>
      </section>

      <TradeoffSimulator profile={profile} />
    </div>
  )
}
