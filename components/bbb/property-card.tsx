import Image from 'next/image'
import { BedDouble, Heart, Ruler, Sparkles, TrainFront } from 'lucide-react'
import { cn } from '@/lib/utils'
import { wantsInclusiveCues } from '@/lib/bbb/data'
import { capCost, formatINR, formatRent } from '@/lib/bbb/finance'
import type { Profile, Property } from '@/lib/bbb/types'
import { DecisionBadge, FlaggedBadge } from './badges'

interface PropertyCardProps {
  property: Property
  profile: Profile
  flaggedCount: number
  overCapBy?: number
  onOpen: () => void
}

function priceDisplay(p: Property, profile: Profile) {
  if (profile.intent === 'Rent') {
    return { amount: formatRent(p.localRent), sub: 'per month' }
  }
  if (profile.intent === 'Lease') {
    return { amount: formatRent(Math.round(p.localRent * 1.15)), sub: 'per month (lease)' }
  }
  const cost = capCost(p, profile.includeStamp)
  return { amount: formatINR(cost), sub: profile.includeStamp ? 'all-in' : 'excl. stamp duty' }
}

function formatOverCap(amount: number, profile: Profile) {
  if (profile.intent === 'Rent' || profile.intent === 'Lease') {
    return formatRent(amount)
  }
  return formatINR(amount)
}

export function PropertyCard({ property: p, profile, flaggedCount, overCapBy, onOpen }: PropertyCardProps) {
  const matches = p.matches.includes(profile.requirement)
  const inclusive = wantsInclusiveCues(profile.gender)
  const cover = p.photos[0]
  const price = priceDisplay(p, profile)

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen()
        }
      }}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/60 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={cover.src || '/placeholder.svg'}
          alt={`${cover.room} at ${p.title}`}
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <DecisionBadge decision={p.decision} className="shadow-sm" />
        </div>
        {cover.verification === 'render' && (
          <span className="absolute bottom-3 left-3 rounded-full bg-foreground/80 px-2.5 py-1 text-xs font-medium text-background">
            3D render, not a real photo
          </span>
        )}
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Save ${p.title}`}
          className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-card/90 text-foreground transition-colors hover:bg-card"
        >
          <Heart aria-hidden className="size-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap gap-2 empty:hidden">
          {flaggedCount > 0 && <FlaggedBadge count={flaggedCount} />}
          {overCapBy !== undefined && overCapBy > 0 && (
            <span className="inline-flex items-center rounded-full bg-warning-soft px-2.5 py-1 text-xs font-medium text-warning">
              Over your cap by {formatOverCap(overCapBy, profile)}
            </span>
          )}
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold leading-snug text-foreground">{p.title}</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">{p.locality}, New Delhi</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-base font-semibold tabular-nums text-foreground">{price.amount}</p>
            <p className="text-xs text-muted-foreground">{price.sub}</p>
          </div>
        </div>

        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <li className="flex items-center gap-1.5">
            <BedDouble aria-hidden className="size-3.5" />
            {p.layout}
          </li>
          <li className="flex items-center gap-1.5">
            <Ruler aria-hidden className="size-3.5" />
            {p.carpetArea} sq ft carpet
          </li>
          <li className="flex items-center gap-1.5">
            <TrainFront aria-hidden className="size-3.5" />
            {p.metro.commuteMin} min to Saket
          </li>
        </ul>

        <ul className="mt-4 space-y-1.5 text-sm">
          {p.highlights.map((h) => (
            <li key={h} className="text-foreground">
              {h}
            </li>
          ))}
          {p.tradeoffs.map((t) => (
            <li key={t} className="text-muted-foreground line-through decoration-muted-foreground/70">
              <span className="sr-only">Missing: </span>
              {t}
            </li>
          ))}
        </ul>

        <div
          className={cn(
            'mt-4 flex gap-2 rounded-lg px-3 py-2 text-xs leading-relaxed',
            inclusive ? 'bg-primary-soft text-primary-strong' : 'bg-muted text-muted-foreground',
          )}
        >
          <Sparkles aria-hidden className="mt-0.5 size-3.5 shrink-0" />
          <span>{inclusive ? p.inclusiveCue : p.safetyCue}</span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className={cn('text-xs font-medium', matches ? 'text-success' : 'text-muted-foreground')}>
            {matches ? `Matches your ${profile.requirement} ask` : `Different layout: ${p.layout}`}
          </span>
          <span className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors group-hover:border-primary group-hover:bg-primary-soft">
            Open dossier
          </span>
        </div>
      </div>
    </article>
  )
}
