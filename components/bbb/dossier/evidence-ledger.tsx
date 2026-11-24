import { BadgeCheck, Calculator, CircleHelp, Lightbulb } from 'lucide-react'
import { costBreakdown, downPaymentFor, emiFor, formatINR, formatRupees, tenureForAge } from '@/lib/bbb/finance'
import type { Profile, Property } from '@/lib/bbb/types'
import { FlaggedBadge, toneText } from '../badges'

interface EvidenceLedgerProps {
  property: Property
  profile: Profile
  flagReasons: string[]
}

export function EvidenceLedger({ property: p, profile, flagReasons }: EvidenceLedgerProps) {
  const c = costBreakdown(p)
  const emi = emiFor(p, profile.age)
  const years = tenureForAge(profile.age)
  const rentGap = emi + p.maintenance - p.localRent

  const costRows: [string, number][] = [
    ['Base price', c.base],
    ['Stamp duty (6%)', c.stampDuty],
    ['Registration (1%)', c.registration],
    [`Brokerage (${p.rep.brokeragePct * 100}%)`, c.brokerage],
    ['GST on brokerage (18%)', c.gst],
  ]
  if (c.other > 0) costRows.push(['PLC, parking, clubhouse', c.other])

  return (
    <section aria-labelledby="ledger-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="ledger-heading" className="text-2xl font-semibold tracking-tight text-foreground">
          Evidence & reality ledger
        </h2>
        {flagReasons.length > 0 && <FlaggedBadge count={flagReasons.length} />}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Every claim is sorted by how sure we are. Read the bottom two before the top two.
      </p>

      {flagReasons.length > 0 && (
        <div className="mt-4 rounded-xl border border-danger/30 bg-danger-soft p-4 text-sm">
          <p className="font-semibold text-danger">Reported by buyers</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-foreground">
            {flagReasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Tier icon={BadgeCheck} title="Verified facts" tone="text-success">
          <dl className="space-y-2.5 text-sm">
            {p.verified.map((v) => (
              <div key={v.label} className="grid grid-cols-[7rem_1fr] gap-3">
                <dt className="text-muted-foreground">{v.label}</dt>
                <dd className={toneText(v.tone)}>{v.value}</dd>
              </div>
            ))}
          </dl>
        </Tier>

        <Tier icon={Calculator} title="Estimates" tone="text-primary-strong">
          <dl className="space-y-1.5 text-sm">
            {costRows.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="tabular-nums text-foreground">{formatINR(v)}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-3 border-t border-border pt-2 font-semibold">
              <dt className="text-foreground">All-in cost</dt>
              <dd className="tabular-nums text-foreground">{formatINR(c.allIn)}</dd>
            </div>
          </dl>
          <dl className="mt-4 space-y-1.5 rounded-lg bg-muted p-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Down payment needed</dt>
              <dd className="tabular-nums text-foreground">{formatINR(downPaymentFor(p))}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">EMI ({years} yrs, 75% loan)</dt>
              <dd className="tabular-nums text-foreground">{formatRupees(emi)}/mo</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Rent for similar home</dt>
              <dd className="tabular-nums text-foreground">{formatRupees(p.localRent)}/mo</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Owning costs about <span className="font-semibold text-foreground">{formatRupees(rentGap)}</span> more each
            month than renting, including maintenance. That is the price of building equity here.
          </p>
        </Tier>

        <Tier icon={Lightbulb} title="Assumptions" tone="text-warning">
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-foreground">
            {p.assumptions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </Tier>

        <Tier icon={CircleHelp} title="Unknowns" tone="text-danger">
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-foreground">
            {p.unknowns.map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ul>
        </Tier>
      </div>
    </section>
  )
}

function Tier({
  icon: Icon,
  title,
  tone,
  children,
}: {
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  title: string
  tone: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className={`mb-3 flex items-center gap-2 text-sm font-semibold ${tone}`}>
        <Icon aria-hidden className="size-4" />
        {title}
      </h3>
      {children}
    </div>
  )
}
