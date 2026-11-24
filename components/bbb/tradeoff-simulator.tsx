'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { ArrowRight, Loader2, Scale } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TRADEOFF_PRESETS } from '@/lib/bbb/data'
import { compare, type Comparison } from '@/lib/bbb/tradeoff'
import type { Profile } from '@/lib/bbb/types'

export function TradeoffSimulator({ profile }: { profile: Profile }) {
  const [query, setQuery] = useState('')
  const [asked, setAsked] = useState<string | null>(null)
  const [result, setResult] = useState<Comparison | null>(null)
  const [thinking, setThinking] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(null)
  const inputId = useId()

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  useEffect(() => {
    if (asked) setResult(compare(asked, profile))
  }, [profile, asked])

  function run(q: string) {
    const text = q.trim()
    if (!text) return
    setQuery(text)
    setThinking(true)
    setResult(null)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setAsked(text)
      setThinking(false)
    }, 900)
  }

  return (
    <section aria-labelledby="tradeoff-heading" className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-soft text-primary-strong">
          <Scale aria-hidden className="size-4" />
        </span>
        <div>
          <h2 id="tradeoff-heading" className="text-lg font-semibold text-foreground">
            Decision Co-Pilot
          </h2>
          <p className="text-sm text-muted-foreground">
            Ask a trade-off in plain words. Answers use your budget, age, and the verified facts on each dossier.
          </p>
        </div>
      </div>

      <form
        className="mt-4 flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault()
          run(query)
        }}
      >
        <label htmlFor={inputId} className="sr-only">
          Ask a trade-off question
        </label>
        <input
          id={inputId}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Is Hauz Khas worth the extra EMI over Malviya Nagar?"
          className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
        />
        <button
          type="submit"
          disabled={thinking || !query.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-strong disabled:opacity-50"
        >
          {thinking ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <ArrowRight aria-hidden className="size-4" />}
          Compare
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {TRADEOFF_PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => run(p)}
            className="rounded-full border border-border bg-background px-3 py-1.5 text-left text-xs text-foreground transition-colors hover:border-primary/60"
          >
            {p}
          </button>
        ))}
      </div>

      <div aria-live="polite">
        {thinking && (
          <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 aria-hidden className="size-4 animate-spin" />
            Weighing title, EMI, commute, and your cat...
          </p>
        )}
        {result && !thinking && <ComparisonTable result={result} />}
      </div>
    </section>
  )
}

function ComparisonTable({ result }: { result: Comparison }) {
  const { a, b, rows, advice, note } = result
  return (
    <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {note && <p className="mb-3 text-xs text-muted-foreground">{note}</p>}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[560px] text-left text-sm">
          <caption className="sr-only">
            Comparison of {a.title} and {b.title}
          </caption>
          <thead className="bg-muted">
            <tr>
              <th scope="col" className="w-1/4 px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Factor
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-foreground">
                {a.locality}
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-foreground">
                {b.locality}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-t border-border align-top">
                <th scope="row" className="px-4 py-3 text-xs font-medium text-muted-foreground">
                  {r.label}
                </th>
                <td className={cn('px-4 py-3 text-foreground', r.winner === 'a' && 'font-semibold text-success')}>{r.a}</td>
                <td className={cn('px-4 py-3 text-foreground', r.winner === 'b' && 'font-semibold text-success')}>{r.b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 rounded-xl bg-primary-soft p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-strong">Recommended next step</p>
        <p className="mt-1 text-sm leading-relaxed text-foreground">{advice}</p>
      </div>
    </div>
  )
}
