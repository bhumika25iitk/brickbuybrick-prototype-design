'use client'

import { useId, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  AGE_OPTIONS,
  GENDER_OPTIONS,
  INTENT_OPTIONS,
  LEASE_BUDGET_PRESETS,
  localitiesForCity,
  RENT_BUDGET_PRESETS,
  REQUIREMENT_OPTIONS,
} from '@/lib/bbb/data'
import { CRORE } from '@/lib/bbb/finance'
import type { Intent, Profile } from '@/lib/bbb/types'
import { InlineSelect, SlotHint, type SlotVariant } from './inline-select'
import { BudgetSelect } from './budget-select'
import { CitySelect } from './city-select'

interface ConstraintSentenceProps {
  profile: Profile
  onChange: (patch: Partial<Profile>) => void
  variant?: SlotVariant
}

type SlotKey = 'age' | 'gender' | 'intent' | 'requirement' | 'city' | 'locality' | 'budget'

const shortZone = (v: string) => v.split(' (')[0] ?? v

function defaultBudgetForIntent(intent: Intent, currentBudget: number | null) {
  if (currentBudget === null) return null
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
  const [openSlot, setOpenSlot] = useState<SlotKey | null>(null)
  const sentence = variant === 'sentence'
  const localityOptions = localitiesForCity(profile.city)
  const nameFilled = Boolean(profile.name.trim())

  function handleIntentChange(next: string) {
    const intent = next as Intent
    const nextBudget = defaultBudgetForIntent(intent, profile.budget)
    onChange({ intent, budget: nextBudget })
  }

  function handleCityChange(city: string) {
    const nextLocalities = localitiesForCity(city)
    onChange({ city, location: nextLocalities[0] ?? '' })
  }

  function bindSlot(key: SlotKey) {
    return {
      open: openSlot === key,
      onOpenChange: (isOpen: boolean) => setOpenSlot(isOpen ? key : null),
    }
  }

  return (
    <div
      className={cn(
        'text-foreground',
        sentence
          ? 'flex flex-wrap items-center justify-center gap-x-1.5 gap-y-2.5 text-lg font-medium leading-relaxed md:text-xl'
          : 'flex flex-wrap items-center gap-x-1.5 gap-y-2 text-sm leading-relaxed text-muted-foreground',
      )}
    >
      <span>I am</span>
      <span className="relative inline-block align-baseline">
        <label htmlFor={nameId} className="sr-only">
          Your name
        </label>
        <input
          id={nameId}
          value={profile.name}
          onFocus={() => setOpenSlot(null)}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Your name"
          maxLength={24}
          autoComplete="given-name"
          style={{ width: `${Math.max(10, (profile.name || 'Your name').length + 2)}ch` }}
          className={cn(
            'inline-flex min-w-24 max-w-48 cursor-text rounded-full border bg-card text-center font-medium text-foreground outline-none transition-all placeholder:text-muted-foreground hover:border-primary/50 hover:shadow-sm focus:border-solid focus:border-primary focus:shadow-sm',
            nameFilled ? 'border-border' : 'border-dashed border-muted-foreground/45',
            sentence ? 'px-3.5 py-1.5 text-sm md:text-base' : 'px-3 py-1 text-sm',
          )}
        />
        <SlotHint hint="name" variant={variant} />
      </span>
      <span>, a</span>
      <InlineSelect
        hint="age"
        placeholder="Age"
        value={profile.age}
        options={AGE_OPTIONS}
        onChange={(age) => onChange({ age })}
        variant={variant}
        {...bindSlot('age')}
      />
      <span>year old</span>
      <span className="inline-flex items-center">
        <InlineSelect
          hint="gender"
          placeholder="Gender"
          value={profile.gender}
          options={GENDER_OPTIONS}
          onChange={(gender) => onChange({ gender })}
          variant={variant}
          {...bindSlot('gender')}
        />
        <span>,</span>
      </span>
      {sentence && <span className="basis-full h-0" aria-hidden />}
      <span>looking to</span>
      <InlineSelect
        hint="intent"
        placeholder="Buy / Rent / Lease"
        value={profile.intent}
        options={INTENT_OPTIONS}
        onChange={handleIntentChange}
        variant={variant}
        {...bindSlot('intent')}
      />
      <span>a</span>
      <InlineSelect
        hint="requirement"
        placeholder="Property type"
        value={profile.requirement}
        options={REQUIREMENT_OPTIONS}
        onChange={(requirement) => onChange({ requirement })}
        variant={variant}
        {...bindSlot('requirement')}
      />
      {sentence && <span className="basis-full h-0" aria-hidden />}
      <span>in</span>
      <CitySelect
        value={profile.city}
        placeholder="City"
        onChange={handleCityChange}
        variant={variant}
        {...bindSlot('city')}
      />
      <span>around</span>
      <InlineSelect
        hint="locality"
        placeholder="Locality"
        emptyHint="Select a city first"
        value={profile.location}
        options={localityOptions}
        onChange={(location) => onChange({ location })}
        variant={variant}
        display={shortZone}
        {...bindSlot('locality')}
      />
      <span>under</span>
      <span className="inline-flex items-center">
        <BudgetSelect
          budget={profile.budget}
          placeholder="Max budget"
          includeStamp={profile.includeStamp}
          intent={profile.intent}
          onBudgetChange={(budget) => onChange({ budget })}
          onIncludeStampChange={(includeStamp) => onChange({ includeStamp })}
          variant={variant}
          {...bindSlot('budget')}
        />
        <span>.</span>
      </span>
    </div>
  )
}
