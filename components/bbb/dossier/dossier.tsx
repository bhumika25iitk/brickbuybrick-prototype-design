'use client'

import { useState } from 'react'
import { ArrowLeft, ClipboardCheck, Coffee, ExternalLink, Info, MapPin, TrainFront, Trees } from 'lucide-react'
import { DECISION_META } from '@/lib/bbb/data'
import { getNearbyAttractions } from '@/lib/bbb/locality-helpers'
import type { Profile, Property } from '@/lib/bbb/types'
import { DecisionBadge, FlaggedBadge } from '../badges'
import { PhotoTour } from './photo-tour'
import { EvidenceLedger } from './evidence-ledger'
import { AmenitiesGrid } from './amenities-grid'
import { SpecLedger } from './spec-ledger'
import { RepCard } from './rep-card'
import { ReportCard } from './report-card'
import { ChecklistModal } from './checklist-modal'

interface DossierProps {
  property: Property
  profile: Profile
  flagReasons: string[]
  onReport: (reasons: string[]) => void
  onBack: () => void
}

export function Dossier({ property: p, profile, flagReasons, onReport, onBack }: DossierProps) {
  const [checklistOpen, setChecklistOpen] = useState(false)
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.address)}`

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-6 sm:px-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft aria-hidden className="size-4" />
        Back to Decision Room
      </button>

      <header className="mt-4">
        <div className="flex flex-wrap items-center gap-2">
          <DecisionBadge decision={p.decision} />
          {flagReasons.length > 0 && <FlaggedBadge count={flagReasons.length} />}
        </div>
        <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{p.title}</h1>
        <p className="mt-2 max-w-3xl text-pretty leading-relaxed text-muted-foreground">{p.summary}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p className="flex items-start gap-2 text-sm text-foreground">
            <MapPin aria-hidden className="mt-0.5 size-4 shrink-0" />
            {p.address}
          </p>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground hover:border-primary"
          >
            View on map
            <ExternalLink aria-hidden className="size-3" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{DECISION_META[p.decision].blurb}</p>
      </header>

      {p.gapAlert && (
        <div role="note" className="mt-6 flex flex-col gap-4 rounded-2xl border border-primary/30 bg-primary-soft p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-3 text-sm leading-relaxed text-foreground">
            <Info aria-hidden className="mt-0.5 size-5 shrink-0 text-primary-strong" />
            <span>
              <span className="font-semibold">Missing Verification:</span> {p.gapAlert.replace('Missing Verification: ', '')}
            </span>
          </p>
          <button
            type="button"
            onClick={() => setChecklistOpen(true)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-strong"
          >
            <ClipboardCheck aria-hidden className="size-4" />
            Generate Site-Visit Checklist
          </button>
        </div>
      )}

      <div className="mt-10">
        <PhotoTour photos={p.photos} title={p.title} />
      </div>

      <section aria-labelledby="nearby-heading" className="mt-10">
        <h2 id="nearby-heading" className="text-lg font-semibold tracking-tight text-foreground">
          Nearby attractions within a 10-minute walk
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          {getNearbyAttractions(p).map((item) => {
            const Icon =
              item.category === 'Cafes & Hangouts'
                ? Coffee
                : item.category === 'Evening Park & Pet Loop'
                  ? Trees
                  : TrainFront
            return (
              <div key={item.category} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary-strong">
                    <Icon aria-hidden className="size-3.5" />
                    {item.category}
                  </span>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground">
                    {item.walkMin} min walk
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-foreground">{item.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.detail}</p>
              </div>
            )
          })}
        </div>
      </section>

      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex flex-col gap-14">
          <EvidenceLedger property={p} profile={profile} flagReasons={flagReasons} />
          <AmenitiesGrid amenities={p.amenities} />
          <SpecLedger property={p} />
          {!p.gapAlert && (
            <button
              type="button"
              onClick={() => setChecklistOpen(true)}
              className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground hover:border-primary"
            >
              <ClipboardCheck aria-hidden className="size-4" />
              Generate Site-Visit Checklist
            </button>
          )}
        </div>
        <aside aria-label="Contact" className="lg:sticky lg:top-24 lg:self-start">
          <RepCard rep={p.rep} />
        </aside>
      </div>

      <div className="mt-16">
        <ReportCard alreadyReported={flagReasons} onReport={onReport} />
      </div>

      <ChecklistModal property={p} open={checklistOpen} onClose={() => setChecklistOpen(false)} />
    </div>
  )
}
