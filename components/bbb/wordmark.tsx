import { cn } from '@/lib/utils'

export function Wordmark({ className, onClick }: { className?: string; onClick?: () => void }) {
  const content = <span className={cn('text-lg font-bold tracking-tight text-foreground', className)}>BRICKBUYBRICK</span>
  if (!onClick) return content
  return (
    <button type="button" onClick={onClick} className="rounded-sm" aria-label="BRICKBUYBRICK, back to start">
      {content}
    </button>
  )
}
