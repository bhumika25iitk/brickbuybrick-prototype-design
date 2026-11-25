'use client'

import { useState } from 'react'
import { CheckCircle2, ImagePlus, Plus, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { INTENT_OPTIONS } from '@/lib/bbb/data'
import type { Intent } from '@/lib/bbb/types'
import { Modal } from './modal'

interface SellModalProps {
  open: boolean
  onClose: () => void
}

export function SellModal({ open, onClose }: SellModalProps) {
  const [step, setStep] = useState<'intro' | 'form' | 'submitted'>('intro')
  const [title, setTitle] = useState('')
  const [locality, setLocality] = useState('')
  const [intent, setIntent] = useState<Intent>('Buy')
  const [titleStatus, setTitleStatus] = useState('Freehold / RERA Registered')
  const [price, setPrice] = useState('')
  const [photoNames, setPhotoNames] = useState<string[]>([])

  function resetAndClose() {
    setStep('intro')
    setTitle('')
    setLocality('')
    setIntent('Buy')
    setTitleStatus('Freehold / RERA Registered')
    setPrice('')
    setPhotoNames([])
    onClose()
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStep('submitted')
  }

  return (
    <Modal
      open={open}
      onClose={resetAndClose}
      title={
        step === 'submitted'
          ? 'Advertisement submitted'
          : step === 'form'
            ? 'Post your property'
            : 'Want to sell?'
      }
      description={
        step === 'submitted'
          ? 'Your listing is queued for title and photo verification.'
          : step === 'form'
            ? 'Share verified details so buyers can evaluate your home without broker noise.'
            : 'Direct owners list with verified title papers and real site photos.'
      }
      icon={<User className="size-5" />}
    >
      {step === 'intro' && (
        <div className="space-y-5">
          <p className="text-sm leading-relaxed text-muted-foreground">
            BrickBuyBrick verifies conveyance deeds, carpet area, and real room photos before a home appears in the Decision Room.
          </p>
          <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-border bg-muted/40 p-4 sm:flex-row sm:items-center">
            <p className="text-sm font-medium text-foreground">
              Post your property advertisement for FREE.
            </p>
            <button
              type="button"
              onClick={() => setStep('form')}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-strong"
            >
              <Plus aria-hidden className="size-4" />
              ADD POST
            </button>
          </div>
        </div>
      )}

      {step === 'form' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="sell-title" className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Property Title
            </label>
            <input
              id="sell-title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 2 BHK Builder Floor, Malviya Nagar"
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="sell-locality" className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Locality
              </label>
              <input
                id="sell-locality"
                required
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="e.g. Saket, New Delhi"
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>

            <div>
              <span className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Listing Type
              </span>
              <div className="mt-1.5 flex gap-1.5">
                {INTENT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setIntent(opt)}
                    aria-pressed={intent === opt}
                    className={cn(
                      'flex-1 rounded-full border py-2 text-xs font-medium transition-colors',
                      intent === opt
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-card text-foreground hover:border-primary/60',
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="sell-rera" className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                RERA / Title Status
              </label>
              <select
                id="sell-rera"
                value={titleStatus}
                onChange={(e) => setTitleStatus(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground outline-none focus:border-primary"
              >
                <option value="Freehold / RERA Registered">Freehold / RERA Registered</option>
                <option value="DDA Freehold Conversion">DDA Freehold Conversion</option>
                <option value="BBMP A-Khata with OC">BBMP A-Khata with OC</option>
                <option value="Leasehold / Society Transfer">Leasehold / Society Transfer</option>
              </select>
            </div>

            <div>
              <label htmlFor="sell-price" className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {intent === 'Buy' ? 'Expected Price' : 'Expected Monthly Rent'}
              </label>
              <input
                id="sell-price"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={intent === 'Buy' ? 'e.g. Rs 96 L' : 'e.g. Rs 35,000/mo'}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <span className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Real Room Photos (No 3D renders)
            </span>
            <label className="mt-1.5 flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-4 text-center transition-colors hover:border-primary/60">
              <ImagePlus aria-hidden className="size-5 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">
                {photoNames.length > 0
                  ? `${photoNames.length} photo(s) selected: ${photoNames.join(', ')}`
                  : 'Click to attach real room photos (JPG or PNG)'}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? [])
                  setPhotoNames(files.map((f) => f.name))
                }}
              />
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setStep('intro')}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Back
            </button>
            <button
              type="submit"
              className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary-strong"
            >
              Submit Free Ad
            </button>
          </div>
        </form>
      )}

      {step === 'submitted' && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl border border-success/30 bg-success-soft p-4">
            <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-success" />
            <div className="text-sm">
              <p className="font-semibold text-foreground">
                {title || 'Property listing'} ({intent}) received
              </p>
              <p className="mt-1 text-muted-foreground">
                Locality: {locality || 'New Delhi'}. Price: {price || 'Submitted'}. Status: {titleStatus}. Our verification team will review your documents and photos within 24 hours.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            className="w-full rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-strong"
          >
            Done
          </button>
        </div>
      )}
    </Modal>
  )
}
