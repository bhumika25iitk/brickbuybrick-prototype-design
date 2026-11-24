import { Mail, Phone, ShieldCheck, UserRound } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Representative } from '@/lib/bbb/types'

const TYPE_TONE = {
  'Direct Owner': 'bg-success-soft text-success',
  'Resale Broker': 'bg-warning-soft text-warning',
  'Builder Channel Partner': 'bg-danger-soft text-danger',
}

export function RepCard({ rep }: { rep: Representative }) {
  const brokerage = rep.brokeragePct === 0 ? 'None' : `${rep.brokeragePct * 100}% + 18% GST`
  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="h-12 bg-muted" />
        <div className="-mt-8 flex flex-col items-center px-5 pb-5 text-center">
          <span className="grid size-16 place-items-center rounded-full border-4 border-card bg-primary-soft text-primary-strong">
            <UserRound aria-hidden className="size-7" />
          </span>
          <p className="mt-2 text-lg font-semibold text-foreground">{rep.name}</p>
          <span className={cn('mt-1 rounded-full px-2.5 py-0.5 text-xs font-semibold', TYPE_TONE[rep.type])}>{rep.type}</span>
          {rep.firm && <p className="mt-1 text-xs text-muted-foreground">{rep.firm}</p>}

          <dl className="mt-4 w-full space-y-1.5 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Last active</dt>
              <dd className="flex items-center gap-1.5 font-medium text-foreground">
                <span aria-hidden className="size-2 rounded-full bg-success" />
                {rep.lastActive}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Response</dt>
              <dd className="text-right font-medium text-foreground">{rep.responseRate}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Brokerage</dt>
              <dd className="font-medium text-foreground">{brokerage}</dd>
            </div>
          </dl>

          <p className="mt-4 rounded-lg bg-muted px-3 py-2 text-left text-xs leading-relaxed text-muted-foreground">{rep.note}</p>

          <button
            type="button"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-strong"
          >
            <Mail aria-hidden className="size-4" />
            Message
          </button>
          <button
            type="button"
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border py-2.5 text-sm font-medium text-foreground hover:border-primary"
          >
            <Phone aria-hidden className="size-4" />
            Call
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <p className="flex items-center gap-2 border-b border-border bg-muted px-4 py-3 text-sm font-semibold text-foreground">
          <ShieldCheck aria-hidden className="size-4" />
          Stay safe
        </p>
        <p className="px-4 py-3 text-sm leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">TIP:</span> Never pay a token or booking amount before you have
          read the title deed yourself. All payments should go by bank transfer and appear on the sale deed.
        </p>
      </div>
    </div>
  )
}
