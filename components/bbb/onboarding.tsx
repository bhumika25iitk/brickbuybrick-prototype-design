'use client'

import Image from 'next/image'
import type { Profile } from '@/lib/bbb/types'
import { ConstraintSentence } from './constraint-sentence'
import { Wordmark } from './wordmark'

interface OnboardingProps {
  profile: Profile
  onChange: (patch: Partial<Profile>) => void
  onSearch: () => void
  onHome: () => void
}

export function Onboarding({ profile, onChange, onSearch, onHome }: OnboardingProps) {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.12]">
        <Image src="/images/skyline.png" alt="" fill sizes="100vw" className="object-cover object-bottom mix-blend-multiply" />
      </div>

      <header className="relative z-10 flex justify-center pt-8">
        <Wordmark onClick={onHome} />
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSearch()
        }}
        className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 pb-16 text-center animate-in fade-in slide-in-from-bottom-3 duration-500"
      >
        <p className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Tell us what you need
        </p>
        <ConstraintSentence profile={profile} onChange={onChange} />
        <button
          type="submit"
          className="mt-14 rounded-full bg-primary px-14 py-3 text-base font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Search
        </button>
        <p className="mt-4 max-w-sm text-xs leading-relaxed text-muted-foreground">
          Every slot stays editable inside the Decision Room. Nothing is locked, and exact addresses are always shown.
        </p>
      </form>
    </main>
  )
}
