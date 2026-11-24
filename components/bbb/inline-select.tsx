'use client'

import { useCallback, useId, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDismiss } from '@/hooks/use-dismiss'

export type SlotVariant = 'sentence' | 'compact'

export function slotTriggerClass(variant: SlotVariant, open: boolean) {
  return cn(
    'group inline-flex w-auto items-center gap-1.5 rounded-full border border-border bg-card font-medium text-foreground outline-none transition-all hover:border-primary/50 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-ring',
    variant === 'sentence' ? 'px-4 py-2 text-base' : 'px-3.5 py-1.5 text-sm',
    open && 'border-primary shadow-sm',
  )
}

export function SlotHint({ hint, variant }: { hint: string; variant: SlotVariant }) {
  if (variant === 'compact') return null
  return (
    <span className="pointer-events-none absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
      ({hint})
    </span>
  )
}

interface InlineSelectProps {
  hint: string
  value: string
  options: string[]
  onChange: (value: string) => void
  variant?: SlotVariant
  display?: (value: string) => string
}

export function InlineSelect({
  hint,
  value,
  options,
  onChange,
  variant = 'sentence',
  display = (v) => v,
}: InlineSelectProps) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const ref = useDismiss<HTMLSpanElement>(open, close)
  const listRef = useRef<HTMLUListElement>(null)
  const id = useId()

  function focusOption(index: number) {
    const items = listRef.current?.querySelectorAll<HTMLLIElement>('[role="option"]')
    if (!items?.length) return
    items[(index + items.length) % items.length].focus()
  }

  function openList() {
    setOpen(true)
    requestAnimationFrame(() => focusOption(Math.max(0, options.indexOf(value))))
  }

  function choose(v: string) {
    onChange(v)
    setOpen(false)
  }

  return (
    <span ref={ref} className="relative inline-block align-baseline">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        aria-label={`${hint}: ${display(value)}`}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && !open) {
            e.preventDefault()
            openList()
          }
        }}
        className={slotTriggerClass(variant, open)}
      >
        <span className="whitespace-nowrap">{display(value)}</span>
        <ChevronDown
          aria-hidden
          className={cn('size-3.5 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')}
        />
      </button>
      <SlotHint hint={hint} variant={variant} />
      {open && (
        <ul
          ref={listRef}
          id={id}
          role="listbox"
          aria-label={hint}
          className="absolute left-0 top-full z-50 mt-3 min-w-56 overflow-hidden rounded-xl border border-border bg-popover p-1 text-left text-sm font-normal shadow-lg animate-in fade-in zoom-in-95 duration-150"
        >
          {options.map((opt, i) => {
            const selected = opt === value
            return (
              <li
                key={opt}
                role="option"
                aria-selected={selected}
                tabIndex={-1}
                onClick={() => choose(opt)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    focusOption(i + 1)
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    focusOption(i - 1)
                  } else if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    choose(opt)
                  }
                }}
                className={cn(
                  'flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-foreground outline-none hover:bg-muted focus:bg-muted',
                  selected && 'font-medium text-primary-strong',
                )}
              >
                <span>{opt}</span>
                {selected && <Check aria-hidden className="size-4 text-primary-strong" />}
              </li>
            )
          })}
        </ul>
      )}
    </span>
  )
}
