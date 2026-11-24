'use client'

import { useCallback, useState } from 'react'
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
  const [openId, setOpenId] = useState<string | null>(null)
  const [flags, setFlags] = useState<Record<string, string[]>>(SEED_FLAGS)

  const patch = useCallback((p: Partial<Profile>) => setProfile((prev) => ({ ...prev, ...p })), [])

  function go(next: View, id: string | null = null) {
    setView(next)
    setOpenId(id)
    window.scrollTo({ top: 0 })
  }

  function report(id: string, reasons: string[]) {
    setFlags((f) => ({ ...f, [id]: Array.from(new Set([...(f[id] ?? []), ...reasons])) }))
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
          <ConstraintSentence profile={profile} onChange={patch} variant="compact" />
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
          <DecisionRoom profile={profile} flags={flags} onOpen={(id) => go('room', id)} />
        )}
      </main>
    </div>
  )
}
