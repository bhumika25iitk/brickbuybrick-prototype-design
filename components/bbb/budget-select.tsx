'use client'

import { useCallback, useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDismiss } from '@/hooks/use-dismiss'
import {
  BUDGET_MAX,
  BUDGET_MIN,
  BUDGET_PRESETS,
  LEASE_BUDGET_MAX,
  LEASE_BUDGET_MIN,
  LEASE_BUDGET_PRESETS,
  RENT_BUDGET_MAX,
  RENT_BUDGET_MIN,
  RENT_BUDGET_PRESETS,
} from '@/lib/bbb/data'
import { CRORE, formatINR, formatRent, LAKH } from '@/lib/bbb/finance'
import type { Intent } from '@/lib/bbb/types'
import { SlotHint, slotTriggerClass, type SlotVariant } from './inline-select'

interface BudgetSelectProps {
  budget: number | null
  includeStamp: boolean
  intent: Intent | ''
  placeholder?: string
  onBudgetChange: (v: number) => void
  onIncludeStampChange: (v: boolean) => void
  variant?: SlotVariant
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function budgetConfig(intent: Intent | '') {
  if (intent === 'Rent') return { min: RENT_BUDGET_MIN, max: RENT_BUDGET_MAX, presets: RENT_BUDGET_PRESETS, step: 5_000, fallback: 45_000 }
  if (intent === 'Lease') return { min: LEASE_BUDGET_MIN, max: LEASE_BUDGET_MAX, presets: LEASE_BUDGET_PRESETS, step: 5_000, fallback: 50_000 }
  return { min: BUDGET_MIN, max: BUDGET_MAX, presets: BUDGET_PRESETS, step: LAKH, fallback: 1.15 * CRORE }
}

function displayBudget(value: number, intent: Intent | '') {
  if (intent === 'Rent' || intent === 'Lease') return formatRent(value)
  return formatINR(value)
}

export function BudgetSelect({
  budget,
  includeStamp,
  intent,
  placeholder = 'Max budget',
  onBudgetChange,
  onIncludeStampChange,
  variant = 'sentence',
  open: controlledOpen,
  onOpenChange,
}: BudgetSelectProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = useCallback(
    (next: boolean) => {
      if (onOpenChange) onOpenChange(next)
      else setInternalOpen(next)
    },
    [onOpenChange],
  )
  const close = useCallback(() => setOpen(false), [setOpen])
  const ref = useDismiss<HTMLSpanElement>(open, close)
  const id = useId()
  const sliderId = useId()
  const toggleId = useId()
  const isBuy = intent === 'Buy' || intent === ''
  const config = budgetConfig(intent)
  const filled = budget !== null
  const activeValue = budget ?? config.fallback
  const labelText = filled ? displayBudget(budget, intent) : placeholder

  return (
    <span ref={ref} className="relative inline-block align-baseline">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={id}
        aria-label={`Budget: ${labelText}`}
        onClick={() => setOpen(!open)}
        className={slotTriggerClass(variant, open, filled)}
      >
        <span className="whitespace-nowrap">{labelText}</span>
        <ChevronDown
          aria-hidden
          className={cn('size-3.5 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')}
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
              {isBuy ? 'Maximum budget' : `Max ${intent.toLowerCase()} budget`}
            </label>
            <span className="text-lg font-semibold tabular-nums text-foreground">
              {displayBudget(activeValue, intent)}
            </span>
          </div>
          <input
            id={sliderId}
            type="range"
            min={config.min}
            max={config.max}
            step={config.step}
            value={Math.min(config.max, Math.max(config.min, activeValue))}
            onChange={(e) => onBudgetChange(Number(e.target.value))}
            aria-valuetext={displayBudget(activeValue, intent)}
            className="bbb-range mt-3 w-full cursor-pointer"
          />
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>{displayBudget(config.min, intent)}</span>
            <span>{displayBudget(config.max, intent)}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {config.presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  onBudgetChange(p)
                  setOpen(false)
                }}
                aria-pressed={budget === p}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  budget === p
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-foreground hover:border-primary/60',
                )}
              >
                {displayBudget(p, intent)}
              </button>
            ))}
          </div>
          {isBuy && (
            <div className="mt-4 flex items-start justify-between gap-3 border-t border-border pt-4">
              <label htmlFor={toggleId} className="text-sm leading-snug text-foreground">
                Include stamp duty and registration in all-in cap
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
          )}
        </div>
      )}
    </span>
  )
}
