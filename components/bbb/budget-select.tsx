'use client'

import { useCallback, useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDismiss } from '@/hooks/use-dismiss'
import { BUDGET_MAX, BUDGET_MIN, BUDGET_PRESETS } from '@/lib/bbb/data'
import { formatINR, LAKH } from '@/lib/bbb/finance'
import { SlotHint, slotTriggerClass, type SlotVariant } from './inline-select'

interface BudgetSelectProps {
  budget: number
  includeStamp: boolean
  onBudgetChange: (v: number) => void
  onIncludeStampChange: (v: boolean) => void
  variant?: SlotVariant
}

export function BudgetSelect({
  budget,
  includeStamp,
  onBudgetChange,
  onIncludeStampChange,
  variant = 'sentence',
}: BudgetSelectProps) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const ref = useDismiss<HTMLSpanElement>(open, close)
  const id = useId()
  const sliderId = useId()
  const toggleId = useId()

  return (
    <span ref={ref} className="relative inline-block align-baseline">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={id}
        aria-label={`Budget: ${formatINR(budget)}`}
        onClick={() => setOpen((o) => !o)}
        className={slotTriggerClass(variant, open)}
      >
        <span>{formatINR(budget)}</span>
        <ChevronDown
          aria-hidden
          className={cn('size-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')}
        />
      </button>
      <SlotHint hint="budget" variant={variant} />
      {open && (
        <div
          id={id}
          role="dialog"
          aria-label="Set maximum budget"
          className="absolute right-0 top-full z-50 mt-3 w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-border bg-popover p-4 text-left text-sm font-normal shadow-lg animate-in fade-in zoom-in-95 duration-150 sm:left-1/2 sm:right-auto sm:-translate-x-1/2"
        >
          <div className="flex items-baseline justify-between">
            <label htmlFor={sliderId} className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Maximum budget
            </label>
            <span className="text-lg font-semibold tabular-nums text-foreground">{formatINR(budget)}</span>
          </div>
          <input
            id={sliderId}
            type="range"
            min={BUDGET_MIN}
            max={BUDGET_MAX}
            step={LAKH}
            value={budget}
            onChange={(e) => onBudgetChange(Number(e.target.value))}
            aria-valuetext={formatINR(budget, { long: true })}
            className="bbb-range mt-3 w-full cursor-pointer"
          />
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>{formatINR(BUDGET_MIN)}</span>
            <span>{formatINR(BUDGET_MAX)}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {BUDGET_PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onBudgetChange(p)}
                aria-pressed={budget === p}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  budget === p
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-foreground hover:border-primary/60',
                )}
              >
                {formatINR(p)}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-start justify-between gap-3 border-t border-border pt-4">
            <label htmlFor={toggleId} className="text-sm leading-snug text-foreground">
              Include stamp duty & registration in all-in cap
              <span className="mt-0.5 block text-xs text-muted-foreground">Adds 7% in Delhi. Most first-time buyers forget this.</span>
            </label>
            <button
              id={toggleId}
              type="button"
              role="switch"
              aria-checked={includeStamp}
              onClick={() => onIncludeStampChange(!includeStamp)}
              className={cn(
                'relative mt-0.5 inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors',
                includeStamp ? 'bg-primary' : 'bg-border',
              )}
            >
              <span
                className={cn(
                  'inline-block size-5 rounded-full bg-card shadow transition-transform',
                  includeStamp ? 'translate-x-[18px]' : 'translate-x-0.5',
                )}
              />
            </button>
          </div>
        </div>
      )}
    </span>
  )
}
