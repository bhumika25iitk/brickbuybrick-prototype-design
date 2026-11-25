'use client'

import { useState } from 'react'
import { Check, ChevronDown, Compass, PhoneCall } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BUYER_STEPS } from '@/lib/bbb/data'

const CURRENT_STEP = 1

interface GuideBarProps {
  onBookCall: () => void
}

export function GuideBar({ onBookCall }: GuideBarProps) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(CURRENT_STEP)

  return (
    <section aria-label="First-time buyer guide" className="rounded-2xl border border-border bg-card">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left transition-colors hover:bg-muted/40"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Compass aria-hidden className="size-4 text-primary-strong" />
          First time buyer?
        </span>
        <ChevronDown
          aria-hidden
          className={cn('size-4 text-muted-foreground transition-transform', open && 'rotate-180')}
        />
      </button>
      {open && (
        <div className="border-t border-border px-5 pb-5 pt-4 animate-in fade-in duration-200">
          <ol className="no-scrollbar flex gap-2 overflow-x-auto">
            {BUYER_STEPS.map((step, i) => {
              const done = i < CURRENT_STEP
              const current = i === CURRENT_STEP
              return (
                <li key={step.title} className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-current={current ? 'step' : undefined}
                    aria-pressed={active === i}
                    className={cn(
                      'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                      active === i
                        ? 'border-primary bg-primary-soft text-primary-strong'
                        : 'border-border text-foreground hover:border-primary/60',
                    )}
                  >
                    <span
                      className={cn(
                        'grid size-5 place-items-center rounded-full text-[10px] font-semibold',
                        done
                          ? 'bg-success text-background'
                          : current
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground',
                      )}
                    >
                      {done ? <Check aria-hidden className="size-3" /> : i + 1}
                    </span>
                    {step.title}
                  </button>
                  {i < BUYER_STEPS.length - 1 && <span aria-hidden className="h-px w-4 bg-border" />}
                </li>
              )
            })}
          </ol>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">{BUYER_STEPS[active].detail}</p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/50 px-4 py-3">
            <p className="text-sm text-foreground">
              Still confused? Contact our consultants to help you go through the process.
            </p>
            <button
              type="button"
              onClick={onBookCall}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <PhoneCall aria-hidden className="size-3.5" />
              Book a call
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
