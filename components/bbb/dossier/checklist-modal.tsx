'use client'

import { useState } from 'react'
import { Check, ClipboardCheck, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getLastMileSafety } from '@/lib/bbb/locality-helpers'
import type { Property } from '@/lib/bbb/types'
import { Modal } from '../modal'

interface ChecklistModalProps {
  property: Property
  open: boolean
  onClose: () => void
}

export function ChecklistModal({ property, open, onClose }: ChecklistModalProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set())
  const [otherChecked, setOtherChecked] = useState(false)
  const [otherText, setOtherText] = useState('')
  const [copied, setCopied] = useState(false)

  const safetyPrompt = getLastMileSafety(property).safetyChecklistPrompt
  const items = safetyPrompt && !property.checklist.includes(safetyPrompt)
    ? [...property.checklist, safetyPrompt]
    : property.checklist

  function toggle(i: number) {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  async function copy() {
    const list = items.map((q, i) => `${i + 1}. ${q}`)
    if (otherText.trim()) {
      list.push(`${items.length + 1}. ${otherText.trim()}`)
    }
    const text = [`Site visit checklist: ${property.title}`, property.address, '', ...list].join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Site-visit checklist"
      description={`Ask these at ${property.locality}. Tick each one off once you have it in writing.`}
      icon={<ClipboardCheck className="size-5" />}
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-strong"
          >
            {copied ? <Check aria-hidden className="size-4" /> : <Copy aria-hidden className="size-4" />}
            {copied ? 'Copied' : 'Copy to clipboard'}
          </button>
        </div>
      }
    >
      <ol className="space-y-2">
        {items.map((q, i) => {
          const done = checked.has(i)
          return (
            <li key={q}>
              <label
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition-colors',
                  done ? 'border-success/40 bg-success-soft' : 'border-border hover:border-primary/60',
                )}
              >
                <input
                  type="checkbox"
                  checked={done}
                  onChange={() => toggle(i)}
                  className="mt-0.5 size-4 accent-[var(--success)]"
                />
                <span className="flex-1">
                  <span className="mr-1 font-semibold text-muted-foreground">{i + 1}.</span>
                  <span className={cn('text-foreground', done && 'text-muted-foreground line-through')}>{q}</span>
                </span>
              </label>
            </li>
          )
        })}
        <li>
          <div
            className={cn(
              'flex items-start gap-3 rounded-xl border p-3 text-sm transition-colors',
              otherChecked ? 'border-success/40 bg-success-soft' : 'border-border focus-within:border-primary/60',
            )}
          >
            <input
              type="checkbox"
              checked={otherChecked}
              onChange={() => setOtherChecked((v) => !v)}
              aria-label="Others custom question"
              className="mt-1 size-4 accent-[var(--success)]"
            />
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-muted-foreground">{items.length + 1}.</span>
                <span className="font-medium text-foreground">Others</span>
              </div>
              <input
                type="text"
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
                placeholder="Write your own question for the owner or broker..."
                className={cn(
                  'mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-primary',
                  otherChecked && 'text-muted-foreground line-through',
                )}
              />
            </div>
          </div>
        </li>
      </ol>
    </Modal>
  )
}
