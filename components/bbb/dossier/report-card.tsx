'use client'

import { useState } from 'react'
import { Check, Flag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { REPORT_REASONS } from '@/lib/bbb/data'
import { Modal } from '../modal'

const RED_FLAGS = [
  'Photos are 3D renders or do not match the flat',
  'RERA number is invalid, or the title is only a GPA',
  'Carpet area is misleading or there are hidden PLC or clubhouse charges',
  'The listing is already sold and the broker is pushing another flat',
]

interface ReportCardProps {
  alreadyReported: string[]
  onReport: (reasons: string[]) => void
}

export function ReportCard({ alreadyReported, onReport }: ReportCardProps) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [details, setDetails] = useState('')

  function toggle(r: string) {
    setSelected((s) => (s.includes(r) ? s.filter((x) => x !== r) : [...s, r]))
  }

  function submit() {
    if (!selected.length) return
    onReport(selected)
    setOpen(false)
    setSelected([])
    setDetails('')
  }

  const reported = alreadyReported.length > 0

  return (
    <section aria-labelledby="report-heading" className="overflow-hidden rounded-lg border border-border bg-card">
      <h2 id="report-heading" className="flex items-center gap-3 border-b border-border bg-muted px-6 py-4 text-lg text-foreground">
        <Flag aria-hidden className="size-5" strokeWidth={1.5} />
        Report this listing
      </h2>
      <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="text-sm leading-relaxed text-muted-foreground">
          <p>
            Real people review flagged listings 7 days a week. If something here does not match what you saw, tell us.
            For example, if
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            {RED_FLAGS.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex shrink-0 items-center gap-2 self-end rounded-full border border-border px-6 py-2.5 text-sm text-foreground transition-colors hover:border-foreground/40"
        >
          {reported ? <Check aria-hidden className="size-4 text-success" /> : <Flag aria-hidden className="size-4" strokeWidth={1.5} />}
          {reported ? 'Reported, add more' : 'Report this listing'}
        </button>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Report this listing"
        description="Pick everything that applies. Your report adds a public review badge to this dossier."
        icon={<Flag className="size-5" strokeWidth={1.5} />}
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={!selected.length}
              className="rounded-full bg-danger px-5 py-2.5 text-sm font-medium text-background disabled:opacity-40"
            >
              Submit report
            </button>
          </div>
        }
      >
        <fieldset>
          <legend className="sr-only">Reasons</legend>
          <div className="space-y-2">
            {REPORT_REASONS.map((r) => {
              const on = selected.includes(r)
              return (
                <label
                  key={r}
                  className={cn(
                    'flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition-colors',
                    on ? 'border-danger/40 bg-danger-soft' : 'border-border hover:border-foreground/30',
                  )}
                >
                  <input type="checkbox" checked={on} onChange={() => toggle(r)} className="mt-0.5 size-4 accent-[var(--danger)]" />
                  <span className="text-foreground">{r}</span>
                </label>
              )
            })}
          </div>
        </fieldset>
        <label className="mt-4 block text-sm font-medium text-foreground">
          Anything else? (optional)
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={3}
            placeholder="e.g. The broker asked for Rs 50,000 cash as a token on the first call."
            className="mt-1.5 w-full rounded-xl border border-border bg-background p-3 text-sm font-normal outline-none focus:border-primary"
          />
        </label>
      </Modal>
    </section>
  )
}
