'use client'

import { useState } from 'react'
import { Calendar, CheckCircle2, LogIn, PhoneCall, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Modal } from './modal'

export interface UserSession {
  name: string
  contact: string
}

interface AuthModalProps {
  open: boolean
  defaultName: string
  reason?: string
  onClose: () => void
  onSuccess: (user: UserSession) => void
}

export function AuthModal({ open, defaultName, reason, onClose, onSuccess }: AuthModalProps) {
  const [name, setName] = useState(defaultName || 'Aarav')
  const [contact, setContact] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const cleanName = name.trim() || 'Aarav'
    const cleanContact = contact.trim() || 'aarav@example.com'
    onSuccess({ name: cleanName, contact: cleanContact })
  }

  function handleDemoLogin() {
    onSuccess({ name: defaultName.trim() || 'Aarav', contact: 'aarav@example.com' })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Sign in to BrickBuyBrick"
      description={reason || 'Sign in to save your shortlist and book advisor calls.'}
      icon={<LogIn className="size-5" />}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="auth-name" className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Your name
          </label>
          <input
            id="auth-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Aarav"
            className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>
        <div>
          <label htmlFor="auth-contact" className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Email or phone number
          </label>
          <input
            id="auth-contact"
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="name@example.com or +91 98XXXXXXXX"
            className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-col gap-2.5 pt-2">
          <button
            type="submit"
            className="w-full rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-strong"
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/60"
          >
            <User aria-hidden className="size-4 text-primary-strong" />
            Continue as {defaultName.trim() || 'Aarav'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

const CALL_SLOTS = [
  { id: 'slot-1', day: 'Tomorrow', time: '11:00 AM' },
  { id: 'slot-2', day: 'Tomorrow', time: '4:30 PM' },
  { id: 'slot-3', day: 'Saturday', time: '11:30 AM' },
  { id: 'slot-4', day: 'Saturday', time: '3:00 PM' },
]

interface BookingModalProps {
  open: boolean
  user: UserSession | null
  onClose: () => void
}

export function BookingModal({ open, user, onClose }: BookingModalProps) {
  const [selectedSlot, setSelectedSlot] = useState(CALL_SLOTS[0].id)
  const [notes, setNotes] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  const slot = CALL_SLOTS.find((s) => s.id === selectedSlot) ?? CALL_SLOTS[0]

  function handleClose() {
    setConfirmed(false)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={confirmed ? 'Consultation booked' : 'Book a consultant call'}
      description={
        confirmed
          ? 'A BrickBuyBrick advisor will call you at your chosen slot.'
          : 'Pick a 20-minute slot to review paperwork, loans, or your shortlist.'
      }
      icon={<PhoneCall className="size-5" />}
    >
      {confirmed ? (
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl border border-success/30 bg-success-soft p-4">
            <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-success" />
            <div className="text-sm">
              <p className="font-semibold text-foreground">
                Confirmed for {slot.day} at {slot.time}
              </p>
              <p className="mt-1 text-muted-foreground">
                Booked under {user?.name ?? 'Aarav'} ({user?.contact ?? 'aarav@example.com'}). No broker will be copied on this call.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-full rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-strong"
          >
            Back to Decision Room
          </button>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setConfirmed(true)
          }}
          className="space-y-4"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Available slots</p>
            <div className="mt-2 grid grid-cols-2 gap-2.5">
              {CALL_SLOTS.map((s) => {
                const active = s.id === selectedSlot
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedSlot(s.id)}
                    aria-pressed={active}
                    className={cn(
                      'flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-left text-sm transition-colors',
                      active
                        ? 'border-primary bg-primary-soft font-medium text-primary-strong'
                        : 'border-border bg-card text-foreground hover:border-primary/50',
                    )}
                  >
                    <Calendar aria-hidden className="size-4 shrink-0" />
                    <span>
                      {s.day}, {s.time}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label htmlFor="call-notes" className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              What would you like help with? (optional)
            </label>
            <textarea
              id="call-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Checking DDA conveyance deed or bank loan pre-approval"
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-strong"
          >
            Confirm call for {slot.day}, {slot.time}
          </button>
        </form>
      )}
    </Modal>
  )
}
