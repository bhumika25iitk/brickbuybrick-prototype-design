'use client'

import { DECISION_META, DECISION_ORDER, PROPERTIES } from '@/lib/bbb/data'
import { capCost, formatINR } from '@/lib/bbb/finance'
import type { Profile } from '@/lib/bbb/types'
import { GuideBar } from './guide-bar'
import { PropertyCard } from './property-card'
import { TradeoffSimulator } from './tradeoff-simulator'

interface DecisionRoomProps {
  profile: Profile
  flags: Record<string, string[]>
  onOpen: (id: string) => void
}

export function DecisionRoom({ profile, flags, onOpen }: DecisionRoomProps) {
  const withinCap = PROPERTIES.filter((p) => capCost(p, profile.includeStamp) <= profile.budget)
  const overCap = PROPERTIES.filter((p) => capCost(p, profile.includeStamp) > profile.budget)
  const greeting = profile.name.trim() ? `${profile.name.trim()}, here` : 'Here'

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-20 pt-6 sm:px-6 animate-in fade-in duration-300">
      <GuideBar />

      <div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground">
          {greeting} is your Decision Room
        </h1>
        <p className="mt-2 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          {withinCap.length} of {PROPERTIES.length} homes fit your {formatINR(profile.budget)}{' '}
          {profile.includeStamp ? 'all-in cap' : 'cap (before stamp duty)'}. We sorted them by what you should do next, not by
          price. Change any slot above and everything recalculates.
        </p>
      </div>

      {DECISION_ORDER.map((decision) => {
        const items = PROPERTIES.filter((p) => p.decision === decision)
        if (!items.length) return null
        const meta = DECISION_META[decision]
        return (
          <section key={decision} aria-labelledby={`group-${decision}`}>
            <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 id={`group-${decision}`} className="text-lg font-semibold text-foreground">
                {meta.label}
              </h2>
              <p className="text-sm text-muted-foreground">{meta.blurb}</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {items.map((p) => (
                <div key={p.id} className="relative">
                  {overCap.includes(p) && (
                    <p className="mb-2 text-xs font-medium text-warning">
                      Over your cap by {formatINR(capCost(p, profile.includeStamp) - profile.budget)}
                    </p>
                  )}
                  <PropertyCard
                    property={p}
                    profile={profile}
                    flaggedCount={flags[p.id]?.length ?? 0}
                    onOpen={() => onOpen(p.id)}
                  />
                </div>
              ))}
            </div>
          </section>
        )
      })}

      <TradeoffSimulator profile={profile} />
    </div>
  )
}
