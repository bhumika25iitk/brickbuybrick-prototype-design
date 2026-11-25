'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { LogIn } from 'lucide-react'
import { EMPTY_PROFILE, PROPERTIES } from '@/lib/bbb/data'
import type { Profile } from '@/lib/bbb/types'
import { Landing } from './landing'
import { Onboarding } from './onboarding'
import { DecisionRoom } from './decision-room'
import { Dossier } from './dossier/dossier'
import { ConstraintSentence } from './constraint-sentence'
import { Wordmark } from './wordmark'
import { AuthModal, BookingModal, type UserSession } from './auth-booking-modals'
import { SellModal } from './sell-modal'

type View = 'landing' | 'onboarding' | 'room'

const SEED_FLAGS: Record<string, string[]> = {
  'neb-sarai': ['Photos are 3D renders, not the actual flat'],
}

export function AppShell() {
  const [view, setView] = useState<View>('landing')
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE)
  const [openId, setOpenId] = useState<string | null>(null)
  const [flags, setFlags] = useState<Record<string, string[]>>(SEED_FLAGS)
  const [updating, setUpdating] = useState(false)
  const [user, setUser] = useState<UserSession | null>(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [authReason, setAuthReason] = useState<string | undefined>(undefined)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [pendingBooking, setPendingBooking] = useState(false)
  const [sellOpen, setSellOpen] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  const patch = useCallback((p: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...p }))
    setUpdating(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setUpdating(false)
    }, 250)
  }, [])

  function go(next: View, id: string | null = null) {
    setView(next)
    setOpenId(id)
    window.scrollTo({ top: 0 })
  }

  function report(id: string, reasons: string[]) {
    setFlags((f) => ({ ...f, [id]: Array.from(new Set([...(f[id] ?? []), ...reasons])) }))
  }

  function handleBookCall() {
    if (!user) {
      setPendingBooking(true)
      setAuthReason('Please sign in first so we can confirm your consultation slot.')
      setAuthOpen(true)
      return
    }
    setBookingOpen(true)
  }

  function handleOpenLogin() {
    setPendingBooking(false)
    setAuthReason(undefined)
    setAuthOpen(true)
  }

  function handleAuthSuccess(session: UserSession) {
    setUser(session)
    setAuthOpen(false)
    if (pendingBooking) {
      setPendingBooking(false)
      setBookingOpen(true)
    }
  }

  function handleSwitchToDelhi() {
    patch({ city: 'New Delhi', location: 'All Delhi Zones' })
  }

  if (view === 'landing') return <Landing onStart={() => go('onboarding')} />
  if (view === 'onboarding')
    return <Onboarding profile={profile} onChange={patch} onSearch={() => go('room')} onHome={() => go('landing')} />

  const property = openId ? PROPERTIES.find((p) => p.id === openId) : undefined

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6">
          {/* Row 1: Top Utility Bar */}
          <div className="flex items-center justify-between gap-4">
            <Wordmark onClick={() => go('landing')} />
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setSellOpen(true)}
                className="text-sm font-medium text-foreground underline-offset-4 transition-colors hover:text-primary-strong hover:underline"
              >
                Want to sell?
              </button>
              {user ? (
                <button
                  type="button"
                  onClick={() => setUser(null)}
                  title="Signed in (click to sign out)"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary/60"
                >
                  <span className="grid size-5 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary-strong">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span>{user.name}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleOpenLogin}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary/60 hover:shadow-sm"
                >
                  <LogIn aria-hidden className="size-3.5 text-muted-foreground" />
                  Log in
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Constraint Filter Dock (auto-refreshes on any change) */}
          <div className="flex flex-wrap items-center border-t border-border/60 pt-2.5">
            <ConstraintSentence profile={profile} onChange={patch} variant="compact" />
          </div>
        </div>
      </header>
      <main>
        {property ? (
          <Dossier
            property={property}
            profile={profile}
            flagReasons={flags[property.id] ?? []}
            onReport={(r) => report(property.id, r)}
            onBack={() => go('room')}
          />
        ) : (
          <DecisionRoom
            profile={profile}
            flags={flags}
            updating={updating}
            onOpen={(id) => go('room', id)}
            onBookCall={handleBookCall}
            onSwitchToDelhi={handleSwitchToDelhi}
          />
        )}
      </main>

      <AuthModal
        open={authOpen}
        defaultName={profile.name}
        reason={authReason}
        onClose={() => {
          setAuthOpen(false)
          setPendingBooking(false)
        }}
        onSuccess={handleAuthSuccess}
      />

      <BookingModal
        open={bookingOpen}
        user={user}
        onClose={() => setBookingOpen(false)}
      />

      <SellModal
        open={sellOpen}
        onClose={() => setSellOpen(false)}
      />
    </div>
  )
}
