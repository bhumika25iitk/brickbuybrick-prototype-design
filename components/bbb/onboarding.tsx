'use client'

import Image from 'next/image'
import { assetPath } from '@/lib/utils'
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
  const isComplete = Boolean(
    profile.name.trim() &&
      profile.age &&
      profile.gender &&
      profile.intent &&
      profile.requirement &&
      profile.city &&
      profile.location &&
      profile.budget !== null,
  )

  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.14]">
        <Image
          src={assetPath('/images/skyline.png')}
          alt=""
          fill
          priority
          sizes="100vw"
          className="bbb-bg-zoom will-change-transform object-cover object-bottom mix-blend-multiply"
        />
      </div>

      <header className="relative z-10 flex justify-center pt-8">
        <Wordmark onClick={onHome} />
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (isComplete) onSearch()
        }}
        className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 pb-16 text-center animate-in fade-in slide-in-from-bottom-3 duration-500"
      >
        <h1 className="mb-8 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Tell us what you need
        </h1>
        <ConstraintSentence profile={profile} onChange={onChange} />

        {!isComplete && (
          <p className="mt-8 text-xs font-medium text-muted-foreground">
            Fill in the fields above to see matching homes
          </p>
        )}

        <button
          type="submit"
          disabled={!isComplete}
          className="mt-6 rounded-full bg-primary px-14 py-3 text-base font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
        >
          Search
        </button>
      </form>
    </main>
  )
}
