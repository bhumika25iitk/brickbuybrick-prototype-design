import Image from 'next/image'
import { Wordmark } from './wordmark'

export function Landing({ onStart }: { onStart: () => void }) {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-background">
      <header className="flex justify-center pt-8">
        <Wordmark />
      </header>

      <section className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-44 text-center sm:pb-60 animate-in fade-in slide-in-from-bottom-2 duration-700">
        <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
          Looking for a home?
          <br />
          Let us help you find one
        </h1>
        <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-muted-foreground">
          A quiet room to weigh real facts, honest costs, and clear walk-away signals before you sign anything.
        </p>
        <button
          type="button"
          onClick={onStart}
          className="mt-8 rounded-full bg-primary px-10 py-3 text-base font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Get Started
        </button>
        <a
          href="#sell"
          onClick={(e) => e.preventDefault()}
          className="mt-5 text-sm font-semibold text-foreground underline-offset-4 hover:underline"
        >
          Want to Sell?
        </a>
      </section>

      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-36 sm:h-52">
        <Image
          src="/images/skyline.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-bottom mix-blend-multiply"
        />
      </div>
    </main>
  )
}
