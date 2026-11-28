'use client'

import { useState } from 'react'
import Image from 'next/image'
import { BadgeCheck, TriangleAlert } from 'lucide-react'
import { assetPath, cn } from '@/lib/utils'
import type { Photo } from '@/lib/bbb/types'

export function PhotoTour({ photos, title }: { photos: Photo[]; title: string }) {
  const [index, setIndex] = useState(0)
  const current = photos[index]

  return (
    <section aria-labelledby="photo-tour-heading">
      <h2 id="photo-tour-heading" className="text-2xl font-semibold tracking-tight text-foreground">
        Photo tour
      </h2>
      <div role="tablist" aria-label="Rooms" className="no-scrollbar mt-5 flex gap-4 overflow-x-auto pb-1">
        {photos.map((photo, i) => (
          <button
            key={photo.room}
            type="button"
            role="tab"
            aria-selected={i === index}
            onClick={() => setIndex(i)}
            className="group w-36 shrink-0 text-left sm:w-44"
          >
            <span
              className={cn(
                'relative block aspect-[3/2] overflow-hidden rounded-md bg-muted ring-offset-2 ring-offset-background transition',
                i === index ? 'ring-2 ring-foreground' : 'opacity-80 group-hover:opacity-100',
              )}
            >
              <Image src={assetPath(photo.src || '/placeholder.svg')} alt="" fill sizes="176px" className="object-cover" />
            </span>
            <span className={cn('mt-2 block text-sm', i === index ? 'font-semibold text-foreground' : 'text-foreground')}>
              {photo.room}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_2fr]">
        <div>
          <h3 className="text-xl font-semibold text-foreground">{current.room}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{current.caption}</p>
          {current.verification === 'real' ? (
            <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success">
              <BadgeCheck aria-hidden className="size-3.5" />
              Matches site visit
            </p>
          ) : (
            <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-danger-soft px-2.5 py-1 text-xs font-semibold text-danger">
              <TriangleAlert aria-hidden className="size-3.5" />
              3D render, not the actual flat
            </p>
          )}
        </div>
        <div key={current.room + index} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted animate-in fade-in duration-300">
          <Image
            src={assetPath(current.src || '/placeholder.svg')}
            alt={`${current.room}, ${title}. ${current.caption}`}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}
