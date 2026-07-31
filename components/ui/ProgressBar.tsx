import { cn } from '@/lib/cn'

// Single progress rail with a cobalt gradient fill and one ochre "you are here"
// spark at the leading edge, plus a tabular count.
export function ProgressBar({
  current,
  total,
  className,
}: {
  current: number
  total: number
  className?: string
}) {
  const pct = total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : 0
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className="relative h-[5px] flex-1 rounded-full bg-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-label="Priebeh dotazníka"
      >
        <div
          className="grad-bar glow-soft absolute inset-y-0 left-0 rounded-full"
          style={{ width: `${pct}%` }}
        >
          <span
            aria-hidden
            className="absolute right-[-3px] top-1/2 h-[9px] w-[9px] -translate-y-1/2 rounded-full bg-spark"
            style={{ boxShadow: '0 0 0 3px var(--spark-wash)' }}
          />
        </div>
      </div>
      <span className="tnum whitespace-nowrap font-mono text-xs text-faint">
        {current} / {total}
      </span>
    </div>
  )
}
