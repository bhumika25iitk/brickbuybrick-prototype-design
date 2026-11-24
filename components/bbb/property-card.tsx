import Image from 'next/image'
import { BedDouble, Heart, Ruler, Sparkles, TrainFront } from 'lucide-react'
import { cn } from '@/lib/utils'
import { wantsInclusiveCues } from '@/lib/bbb/data'
import { capCost, formatINR } from '@/lib/bbb/finance'
import type { Profile, Property } from '@/lib/bbb/types'
import { DecisionBadge, FlaggedBadge } from './badges'

interface PropertyCardProps {
  property: Property
  profile: Profile
  flaggedCount: number
  onOpen: () => void
}

export function PropertyCard({ property: p, profile, flaggedCount, onOpen }: PropertyCardProps) {
  const cost = capCost(p, profile.includeStamp)
  const matches = p.matches.includes(profile.requirement)
  const inclusive = wantsInclusiveCues(profile.gender)
  const cover = p.photos[0]

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md">
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
        <span className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-card/90 text-foreground">
          <Heart aria-hidden className="size-4" />
          <span className="sr-only">Save</span>
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        {flaggedCount > 0 && <FlaggedBadge count={flaggedCount} className="mb-3 self-start" />}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold leading-snug text-foreground">{p.title}</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">{p.locality}, New Delhi</p>
          </div>
          <div className="text-right">
            <p className="text-base font-semibold tabular-nums text-foreground">{formatINR(cost)}</p>
            <p className="text-xs text-muted-foreground">{profile.includeStamp ? 'all-in' : 'excl. stamp duty'}</p>
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
          <button
            type="button"
            onClick={onOpen}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-primary-soft"
          >
            Open dossier
            <span className="sr-only"> for {p.title}</span>
          </button>
        </div>
      </div>
    </article>
  )
}
