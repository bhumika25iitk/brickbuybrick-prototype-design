'use client'

import { useState } from 'react'
import { Check, ClipboardCheck, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Property } from '@/lib/bbb/types'
import { Modal } from '../modal'

interface ChecklistModalProps {
  property: Property
  open: boolean
  onClose: () => void
}

export function ChecklistModal({ property, open, onClose }: ChecklistModalProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set())
  const [copied, setCopied] = useState(false)

  function toggle(i: number) {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  async function copy() {
    const text = [`Site visit checklist: ${property.title}`, property.address, '', ...property.checklist.map((q, i) => `${i + 1}. ${q}`)].join('\n')
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
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-muted-foreground" aria-live="polite">
            {checked.size} of {property.checklist.length} answered
          </span>
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-strong"
          >
            {copied ? <Check aria-hidden className="size-4" /> : <Copy aria-hidden className="size-4" />}
            {copied ? 'Copied' : 'Copy for WhatsApp'}
          </button>
        </div>
      }
    >
      <ol className="space-y-2">
        {property.checklist.map((q, i) => {
          const done = checked.has(i)
          return (
            <li key={q}>
              <label
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition-colors',
                  done ? 'border-success/40 bg-success-soft' : 'border-border hover:border-primary/60',
                )}
              >
                <input type="checkbox" checked={done} onChange={() => toggle(i)} className="mt-0.5 size-4 accent-[var(--success)]" />
                <span className="flex-1">
                  <span className="mr-1 font-semibold text-muted-foreground">{i + 1}.</span>
                  <span className={cn('text-foreground', done && 'text-muted-foreground line-through')}>{q}</span>
                </span>
              </label>
            </li>
          )
        })}
      </ol>
    </Modal>
  )
}
