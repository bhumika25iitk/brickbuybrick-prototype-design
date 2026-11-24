import { formatRupees } from '@/lib/bbb/finance'
import type { Property } from '@/lib/bbb/types'

export function SpecLedger({ property: p }: { property: Property }) {
  const groups: { title: string; rows: [string, string][] }[] = [
    {
      title: 'Layout',
      rows: [
        ['Configuration', p.layout],
        ['Carpet area', `${p.carpetArea} sq ft`],
        ['Super built-up', `${p.superBuiltUp} sq ft`],
        ['Floor', p.floor],
        ['Age of building', p.ageOfBuilding],
      ],
    },
    {
      title: 'History',
      rows: [
        ['Past occupants', p.pastOccupants],
        ['Title status', p.titleStatus],
        ['Photos', p.photoStatus],
      ],
    },
    {
      title: 'Running costs',
      rows: [
        ['Maintenance', `${formatRupees(p.maintenance)} / month`],
        ['Comparable rent', `${formatRupees(p.localRent)} / month`],
        ['Extra charges', p.otherChargesLabel],
      ],
    },
    {
      title: 'Commute',
      rows: [
        ['Nearest metro', `${p.metro.station} (${p.metro.line})`],
        ['Walk to metro', `${p.metro.walkMin} min`],
        ['Door to Saket office', `${p.metro.commuteMin} min`],
      ],
    },
  ]

  return (
    <section aria-labelledby="spec-heading">
      <h2 id="spec-heading" className="text-2xl font-semibold tracking-tight text-foreground">
        Spec ledger
      </h2>
      <div className="mt-6 grid gap-8 sm:grid-cols-2">
        {groups.map((g) => (
          <div key={g.title}>
            <h3 className="text-base font-semibold text-foreground">{g.title}</h3>
            <dl className="mt-3 grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-x-4 gap-y-2 text-sm">
              {g.rows.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  )
}
