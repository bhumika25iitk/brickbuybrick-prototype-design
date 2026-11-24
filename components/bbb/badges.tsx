import { CircleAlert, CircleCheck, CircleSlash, Flag, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DECISION_META } from '@/lib/bbb/data'
import type { Decision } from '@/lib/bbb/types'

const TONE_CLASS = {
  good: 'bg-success-soft text-success',
  info: 'bg-primary-soft text-primary-strong',
  warn: 'bg-warning-soft text-warning',
  bad: 'bg-danger-soft text-danger',
}

const DECISION_ICON = {
  shortlist: CircleCheck,
  investigate: Search,
  stretch: CircleAlert,
  walk: CircleSlash,
}

export function DecisionBadge({ decision, className }: { decision: Decision; className?: string }) {
  const meta = DECISION_META[decision]
  const Icon = DECISION_ICON[decision]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
        TONE_CLASS[meta.tone],
        className,
      )}
    >
      <Icon aria-hidden className="size-3.5" />
      {meta.label}
    </span>
  )
}

export function FlaggedBadge({ count, className }: { count: number; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-danger/30 bg-danger-soft px-2.5 py-1 text-xs font-semibold text-danger',
        className,
      )}
    >
      <Flag aria-hidden className="size-3.5" />
      Community Flagged, Under Review
      {count > 1 && <span className="font-normal">({count} reports)</span>}
    </span>
  )
}

export function toneText(tone?: 'good' | 'warn' | 'bad') {
  if (tone === 'good') return 'text-success'
  if (tone === 'warn') return 'text-warning'
  if (tone === 'bad') return 'text-danger'
  return 'text-foreground'
}
