'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Loader2, RefreshCw } from 'lucide-react'
import { DEFAULT_PROFILE, PROPERTIES } from '@/lib/bbb/data'
import type { Profile } from '@/lib/bbb/types'
import { Landing } from './landing'
import { Onboarding } from './onboarding'
import { DecisionRoom } from './decision-room'
import { Dossier } from './dossier/dossier'
import { ConstraintSentence } from './constraint-sentence'
import { Wordmark } from './wordmark'

type View = 'landing' | 'onboarding' | 'room'

const SEED_FLAGS: Record<string, string[]> = {
  'neb-sarai': ['Photos are 3D renders, not the actual flat'],
}

export function AppShell() {
  const [view, setView] = useState<View>('landing')
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE)
  const [appliedProfile, setAppliedProfile] = useState<Profile>(DEFAULT_PROFILE)
  const [openId, setOpenId] = useState<string | null>(null)
  const [flags, setFlags] = useState<Record<string, string[]>>(SEED_FLAGS)
  const [refreshing, setRefreshing] = useState(false)
  const [roomKey, setRoomKey] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  const patch = useCallback((p: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...p }))
  }, [])

  function go(next: View, id: string | null = null) {
    if (next === 'room' && !id) {
      setAppliedProfile(profile)
    }
    setView(next)
    setOpenId(id)
    window.scrollTo({ top: 0 })
  }

  function report(id: string, reasons: string[]) {
    setFlags((f) => ({ ...f, [id]: Array.from(new Set([...(f[id] ?? []), ...reasons])) }))
  }

  function handleUpdate() {
    setRefreshing(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setAppliedProfile(profile)
      setRoomKey((k) => k + 1)
      setRefreshing(false)
    }, 450)
  }

  if (view === 'landing') return <Landing onStart={() => go('onboarding')} />
  if (view === 'onboarding')
    return <Onboarding profile={profile} onChange={patch} onSearch={() => go('room')} onHome={() => go('landing')} />

  const property = openId ? PROPERTIES.find((p) => p.id === openId) : undefined

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <Wordmark onClick={() => go('landing')} />
          <div className="flex flex-wrap items-center justify-between gap-3 lg:flex-1 lg:justify-end">
            <ConstraintSentence profile={profile} onChange={patch} variant="compact" />
            <button
              type="button"
              onClick={handleUpdate}
              disabled={refreshing}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
            >
              {refreshing ? (
                <Loader2 aria-hidden className="size-3.5 animate-spin" />
              ) : (
                <RefreshCw aria-hidden className="size-3.5" />
              )}
              Update Results
            </button>
          </div>
        </div>
      </header>
      <main>
        {property ? (
          <Dossier
            property={property}
            profile={appliedProfile}
            flagReasons={flags[property.id] ?? []}
            onReport={(r) => report(property.id, r)}
            onBack={() => go('room')}
          />
        ) : (
          <div
            key={roomKey}
            className={refreshing ? 'opacity-50 transition-opacity duration-300' : 'transition-opacity duration-300'}
          >
            <DecisionRoom profile={appliedProfile} flags={flags} onOpen={(id) => go('room', id)} />
          </div>
        )}
      </main>
    </div>
  )
}
