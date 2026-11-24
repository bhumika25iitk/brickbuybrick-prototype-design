import { cn } from '@/lib/utils'
import type { Amenity } from '@/lib/bbb/types'

export function AmenitiesGrid({ amenities }: { amenities: Amenity[] }) {
  return (
    <section aria-labelledby="amenities-heading">
      <h2 id="amenities-heading" className="text-2xl font-semibold tracking-tight text-foreground">
        What this home offers
      </h2>
      <ul className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2">
        {amenities.map(({ label, icon: Icon, available, note }) => (
          <li key={label} className="flex items-start gap-4">
            <Icon aria-hidden strokeWidth={1.5} className={cn('size-6 shrink-0', available ? 'text-foreground' : 'text-muted-foreground')} />
            <div>
              <p className={cn('text-base', available ? 'text-foreground' : 'text-muted-foreground line-through')}>
                {!available && <span className="sr-only">Not available: </span>}
                {label}
              </p>
              {note && <p className="mt-0.5 text-xs text-muted-foreground">{note}</p>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
