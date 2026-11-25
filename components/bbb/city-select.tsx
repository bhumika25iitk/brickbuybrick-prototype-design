'use client'

import { useCallback, useId, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDismiss } from '@/hooks/use-dismiss'
import { CITY_OPTIONS } from '@/lib/bbb/data'
import { SlotHint, slotTriggerClass, type SlotVariant } from './inline-select'

interface CitySelectProps {
  value: string
  placeholder?: string
  onChange: (city: string) => void
  variant?: SlotVariant
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CitySelect({
  value,
  placeholder = 'City',
  onChange,
  variant = 'sentence',
  open: controlledOpen,
  onOpenChange,
}: CitySelectProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = useCallback(
    (next: boolean) => {
      if (onOpenChange) onOpenChange(next)
      else setInternalOpen(next)
    },
    [onOpenChange],
  )
  const [query, setQuery] = useState('')
  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
  }, [setOpen])
  const ref = useDismiss<HTMLSpanElement>(open, close)
  const inputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const id = useId()

  const filled = Boolean(value)
  const labelText = filled ? value : placeholder

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return CITY_OPTIONS
    return CITY_OPTIONS.filter((c) => c.toLowerCase().includes(q))
  }, [query])

  function openList() {
    setOpen(true)
    setQuery('')
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  function choose(city: string) {
    onChange(city)
    close()
    triggerRef.current?.focus()
  }

  const trimmed = query.trim()
  const showCustom =
    trimmed.length > 1 && !CITY_OPTIONS.some((c) => c.toLowerCase() === trimmed.toLowerCase())

  return (
    <span ref={ref} className="relative inline-block align-baseline">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        aria-label={`city: ${labelText}`}
        onClick={() => (open ? close() : openList())}
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
      <SlotHint hint="city" variant={variant} />
      {open && (
        <div
          id={id}
          className="absolute left-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-xl border border-border bg-popover p-1.5 text-left text-sm font-normal shadow-lg animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5">
            <Search aria-hidden className="size-3.5 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  if (filtered.length > 0) choose(filtered[0])
                  else if (showCustom) choose(trimmed)
                } else if (e.key === 'Escape') {
                  e.preventDefault()
                  close()
                  triggerRef.current?.focus()
                }
              }}
              placeholder="Search Indian city..."
              aria-label="Search Indian city"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
          <ul role="listbox" aria-label="city" className="mt-1.5 max-h-56 overflow-y-auto">
            {filtered.map((city) => {
              const selected = city === value
              return (
                <li
                  key={city}
                  role="option"
                  aria-selected={selected}
                  onClick={() => choose(city)}
                  className={cn(
                    'flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-foreground hover:bg-muted',
                    selected && 'font-medium text-primary-strong',
                  )}
                >
                  <span>{city}</span>
                  {selected && <Check aria-hidden className="size-4 text-primary-strong" />}
                </li>
              )
            })}
            {showCustom && (
              <li
                role="option"
                aria-selected={false}
                onClick={() => choose(trimmed)}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-primary-strong hover:bg-muted"
              >
                <span>Use &quot;{trimmed}&quot;</span>
              </li>
            )}
            {filtered.length === 0 && !showCustom && (
              <li className="px-3 py-2 text-xs text-muted-foreground">Type a city name to search</li>
            )}
          </ul>
        </div>
      )}
    </span>
  )
}
