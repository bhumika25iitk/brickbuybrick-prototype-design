'use client'

import { useCallback, useState } from 'react'
import { ArrowUpDown, Check, ChevronDown } from 'lucide-react'
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
  { key: 'commute', label: 'Shortest Metro Commute' },
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
      return list.sort((a, b) => a.metro.commuteMin - b.metro.commuteMin)
    case 'verification':
      return list.sort((a, b) => b.legalScore - a.legalScore)
    default:
      return list.sort((a, b) => DECISION_ORDER.indexOf(a.decision) - DECISION_ORDER.indexOf(b.decision))
  }
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
  onOpen: (id: string) => void
}

export function DecisionRoom({ profile, flags, onOpen }: DecisionRoomProps) {
  const [sortKey, setSortKey] = useState<SortKey>('decision')
  const withinCap = PROPERTIES.filter((p) => effectiveCost(p, profile) <= profile.budget)
  const greeting = profile.name.trim() ? `${profile.name.trim()}, here` : 'Here'
  const sorted = sortProperties(PROPERTIES, sortKey, profile)
  const isBuy = profile.intent === 'Buy'
  const capLabel = isBuy
    ? `${formatINR(profile.budget)} ${profile.includeStamp ? 'all-in cap' : 'cap (before stamp duty)'}`
    : `${formatRent(profile.budget)} monthly ${profile.intent.toLowerCase()} cap`

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-20 pt-6 sm:px-6 animate-in fade-in duration-300">
      <GuideBar />

      <div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground">
          {greeting} is your Decision Room
        </h1>
        <p className="mt-2 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          {withinCap.length} of {PROPERTIES.length} homes fit your {capLabel}. We sorted them by what you should do next, not by
          price. Change any slot above and click Update Results to recalculate.
        </p>
      </div>

      <section aria-label="Evaluated properties">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-5 py-3">
          <p className="text-sm font-medium text-foreground">
            {PROPERTIES.length} homes evaluated for your criteria
          </p>
          <SortDropdown value={sortKey} onChange={setSortKey} />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {sorted.map((p) => {
            const cost = effectiveCost(p, profile)
            const overCapBy = cost > profile.budget ? cost - profile.budget : undefined
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
