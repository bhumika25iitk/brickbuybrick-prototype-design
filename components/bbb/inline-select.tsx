'use client'

import { useCallback, useId, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDismiss } from '@/hooks/use-dismiss'

export type SlotVariant = 'sentence' | 'compact'

export function slotTriggerClass(variant: SlotVariant, open: boolean, filled = true) {
  return cn(
    'group inline-flex w-auto items-center gap-1.5 rounded-full border bg-card font-medium outline-none transition-all hover:border-primary/50 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-ring',
    filled ? 'border-border text-foreground' : 'border-dashed border-muted-foreground/45 text-muted-foreground',
    variant === 'sentence' ? 'px-3.5 py-1.5 text-sm md:text-base' : 'px-3 py-1 text-sm',
    open && 'border-solid border-primary shadow-sm',
  )
}

export function SlotHint(_props: { hint: string; variant: SlotVariant }) {
  return null
}

interface InlineSelectProps {
  hint: string
  value: string
  placeholder?: string
  emptyHint?: string
  options: string[]
  onChange: (value: string) => void
  variant?: SlotVariant
  display?: (value: string) => string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function InlineSelect({
  hint,
  value,
  placeholder,
  emptyHint = 'No options available',
  options,
  onChange,
  variant = 'sentence',
  display = (v) => v,
  open: controlledOpen,
  onOpenChange,
}: InlineSelectProps) {
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
  const listRef = useRef<HTMLUListElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const id = useId()

  const filled = Boolean(value)
  const labelText = filled ? display(value) : (placeholder ?? hint)

  function focusOption(index: number) {
    const items = listRef.current?.querySelectorAll<HTMLLIElement>('[role="option"]')
    if (!items?.length) return
    items[(index + items.length) % items.length].focus()
  }

  function openList() {
    setOpen(true)
    if (options.length > 0) {
      requestAnimationFrame(() => focusOption(Math.max(0, options.indexOf(value))))
    }
  }

  function choose(v: string) {
    onChange(v)
    setOpen(false)
    triggerRef.current?.focus()
  }

  return (
    <span ref={ref} className="relative inline-block align-baseline">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        aria-label={`${hint}: ${labelText}`}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && !open) {
            e.preventDefault()
            openList()
          }
        }}
        className={slotTriggerClass(variant, open, filled)}
      >
        <span className="whitespace-nowrap">{labelText}</span>
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
          {options.length === 0 ? (
            <li className="px-3 py-2.5 text-xs text-muted-foreground">{emptyHint}</li>
          ) : (
            options.map((opt, i) => {
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
                    } else if (e.key === 'Escape') {
                      e.preventDefault()
                      setOpen(false)
                      triggerRef.current?.focus()
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
            })
          )}
        </ul>
      )}
    </span>
  )
}
