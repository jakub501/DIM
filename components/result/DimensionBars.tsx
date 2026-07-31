import type { Dimension } from '@/lib/types'
import type { DimensionResult } from '@/lib/result'
import { DIMENSIONS, DIMENSION_COPY } from '@/lib/content'
import { cn } from '@/lib/cn'

const fmt = (x: number) => x.toFixed(1).replace('.', ',')

function Bar({ label, value }: { label: string; value: number }) {
  const pct = Math.max(0, Math.min(100, (value / 10) * 100))
  return (
    <div className="grid gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[0.82rem] text-muted">{label}</span>
        <span className="tnum font-mono text-xs text-faint">{fmt(value)}</span>
      </div>
      <div className="relative h-2.5 w-full rounded-full bg-track">
        {/* hranica 3 (active threshold) */}
        <span aria-hidden className="absolute inset-y-[-2px] left-[30%] w-px bg-ink/15" />
        <div
          className="grad-bar glow-soft h-full rounded-full transition-[width] duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// Five institutions, each with two independent bars (pole A and pole B). Never
// one number per dimension — the shape is the point. The narrowest institution
// is highlighted so it doesn't read as just another identical row.
export function DimensionBars({
  dimensions,
  narrowest,
}: {
  dimensions: DimensionResult[]
  narrowest: Dimension
}) {
  const byId = new Map(dimensions.map((d) => [d.dimension, d]))
  return (
    <div>
      <div className="divide-y divide-line">
        {DIMENSIONS.map((meta) => {
          const d = byId.get(meta.id)
          const copy = DIMENSION_COPY[meta.id]
          if (!d) return null
          const isNarrow = meta.id === narrowest
          return (
            <div
              key={meta.id}
              className={cn(
                'py-5',
                isNarrow &&
                  'my-1 rounded-2xl border border-accent-line bg-accent-wash px-4 py-4',
              )}
            >
              <div className="mb-3 flex items-baseline justify-between gap-2">
                <h3 className="text-[0.98rem] font-bold">{meta.name}</h3>
                {isNarrow ? (
                  <span className="rounded-[3px] bg-accent px-1.5 py-0.5 font-mono text-[0.62rem] uppercase tracking-wider text-white">
                    najužšia
                  </span>
                ) : null}
              </div>
              <p className="mb-3 text-[0.76rem] text-faint">{meta.question}</p>
              <div className="grid gap-3">
                <Bar label={copy.poleA} value={d.a} />
                <Bar label={copy.poleB} value={d.b} />
              </div>
            </div>
          )
        })}
      </div>
      <p className="mt-3 font-mono text-[0.62rem] text-faint">
        Zvislá ryska = hranica aktívneho pásma (3).
      </p>
    </div>
  )
}
