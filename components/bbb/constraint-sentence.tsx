'use client'

import { useId } from 'react'
import { cn } from '@/lib/utils'
import {
  AGE_OPTIONS,
  GENDER_OPTIONS,
  LOCATION_OPTIONS,
  REQUIREMENT_OPTIONS,
} from '@/lib/bbb/data'
import type { Profile } from '@/lib/bbb/types'
import { InlineSelect, SlotHint, type SlotVariant } from './inline-select'
import { BudgetSelect } from './budget-select'

interface ConstraintSentenceProps {
  profile: Profile
  onChange: (patch: Partial<Profile>) => void
  variant?: SlotVariant
}

const shortLocation = (v: string) => v.split(' - ')[1] ?? v

export function ConstraintSentence({ profile, onChange, variant = 'sentence' }: ConstraintSentenceProps) {
  const nameId = useId()
  const sentence = variant === 'sentence'

  return (
    <p
      className={cn(
        'text-foreground',
        sentence
          ? 'text-balance text-2xl font-semibold leading-[2.6] sm:text-3xl sm:leading-[2.4]'
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
          className={cn(
            'bg-transparent text-center text-foreground outline-none placeholder:text-muted-foreground/60',
            sentence
              ? 'w-36 border-b-2 border-foreground/70 px-1 pb-0.5 font-semibold focus:border-primary'
              : 'w-24 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium focus:border-primary',
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
      <span>looking to buy a</span>{' '}
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
        onBudgetChange={(budget) => onChange({ budget })}
        onIncludeStampChange={(includeStamp) => onChange({ includeStamp })}
        variant={variant}
      />
      <span>.</span>
    </p>
  )
}
