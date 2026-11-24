'use client'

import { useId } from 'react'
import { cn } from '@/lib/utils'
import {
  AGE_OPTIONS,
  BUDGET_PRESETS,
  GENDER_OPTIONS,
  INTENT_OPTIONS,
  LEASE_BUDGET_PRESETS,
  LOCATION_OPTIONS,
  RENT_BUDGET_PRESETS,
  REQUIREMENT_OPTIONS,
} from '@/lib/bbb/data'
import { CRORE } from '@/lib/bbb/finance'
import type { Intent, Profile } from '@/lib/bbb/types'
import { InlineSelect, SlotHint, type SlotVariant } from './inline-select'
import { BudgetSelect } from './budget-select'

interface ConstraintSentenceProps {
  profile: Profile
  onChange: (patch: Partial<Profile>) => void
  variant?: SlotVariant
}

const shortLocation = (v: string) => v.split(' - ')[1] ?? v

function defaultBudgetForIntent(intent: Intent, currentBudget: number) {
  if (intent === 'Rent') {
    return currentBudget > 500_000 ? RENT_BUDGET_PRESETS[1] : currentBudget
  }
  if (intent === 'Lease') {
    return currentBudget > 500_000 ? LEASE_BUDGET_PRESETS[1] : currentBudget
  }
  return currentBudget < 500_000 ? 1.15 * CRORE : currentBudget
}

export function ConstraintSentence({ profile, onChange, variant = 'sentence' }: ConstraintSentenceProps) {
  const nameId = useId()
  const sentence = variant === 'sentence'

  function handleIntentChange(next: string) {
    const intent = next as Intent
    const nextBudget = defaultBudgetForIntent(intent, profile.budget)
    onChange({ intent, budget: nextBudget })
  }

  return (
    <p
      className={cn(
        'text-foreground',
        sentence
          ? 'text-balance text-2xl font-semibold leading-[2.8] sm:text-3xl sm:leading-[2.6]'
          : 'flex flex-wrap items-center gap-x-2 gap-y-2 text-sm leading-relaxed text-muted-foreground',
      )}
    >
      <span>I am</span>{' '}
      <span className="relative inline-block align-baseline">
        <label htmlFor={nameId} className="sr-only">
          Your name
        </label>
        <input
          id={nameId}
          value={profile.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Name"
          maxLength={24}
          autoComplete="given-name"
          style={{ width: sentence ? `${Math.max(5, profile.name.length + 2)}ch` : `${Math.max(5, profile.name.length + 2)}ch` }}
          className={cn(
            'inline-flex min-w-20 max-w-44 rounded-full border border-border bg-card text-center font-medium text-foreground outline-none transition-all placeholder:text-muted-foreground/60 hover:border-primary/50 hover:shadow-sm focus:border-primary focus:shadow-sm',
            sentence ? 'px-4 py-2 text-base' : 'px-3.5 py-1.5 text-sm',
          )}
        />
        <SlotHint hint="name" variant={variant} />
      </span>
      <span>, a</span>{' '}
      <InlineSelect
        hint="age"
        value={profile.age}
        options={AGE_OPTIONS}
        onChange={(age) => onChange({ age })}
        variant={variant}
      />{' '}
      <span>year old</span>{' '}
      <InlineSelect
        hint="gender"
        value={profile.gender}
        options={GENDER_OPTIONS}
        onChange={(gender) => onChange({ gender })}
        variant={variant}
      />
      <span>,</span>
      {sentence && <br className="hidden sm:block" />}{' '}
      <span>looking to</span>{' '}
      <InlineSelect
        hint="intent"
        value={profile.intent}
        options={INTENT_OPTIONS}
        onChange={handleIntentChange}
        variant={variant}
      />{' '}
      <span>a</span>{' '}
      <InlineSelect
        hint="requirement"
        value={profile.requirement}
        options={REQUIREMENT_OPTIONS}
        onChange={(requirement) => onChange({ requirement })}
        variant={variant}
      />
      {sentence && <br className="hidden sm:block" />}{' '}
      <span>around</span>{' '}
      <InlineSelect
        hint="locality"
        value={profile.location}
        options={LOCATION_OPTIONS}
        onChange={(location) => onChange({ location })}
        variant={variant}
        display={shortLocation}
      />{' '}
      <span>under</span>{' '}
      <BudgetSelect
        budget={profile.budget}
        includeStamp={profile.includeStamp}
        intent={profile.intent}
        onBudgetChange={(budget) => onChange({ budget })}
        onIncludeStampChange={(includeStamp) => onChange({ includeStamp })}
        variant={variant}
      />
      <span>.</span>
    </p>
  )
}
