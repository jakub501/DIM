import type { ResultModel } from '@/lib/result'
import { DIMENSIONS, DIMENSION_COPY, STRESS_READING_COPY } from '@/lib/content'

// One track per dimension: pole A on the left, pole B on the right. A dot marks
// the calm lean; an ochre arrow shows where stress pushes it. No arrow when
// there is no shift. A reversal (stress crossing to the opposite pole) is bolder.
function Track({
  leanN,
  stressLean,
  reversal,
}: {
  leanN: number
  stressLean: 'A' | 'B' | 'none'
  reversal: boolean
}) {
  const calmX = 50 - (Math.max(-10, Math.min(10, leanN)) / 10) * 46
  const delta = 16
  const stressX =
    stressLean === 'A'
      ? Math.max(4, calmX - delta)
      : stressLean === 'B'
        ? Math.min(96, calmX + delta)
        : calmX

  return (
    <svg viewBox="0 0 100 16" className="h-4 w-full" role="img" aria-hidden>
      <line x1="4" y1="8" x2="96" y2="8" stroke="var(--line)" strokeWidth="1" />
      <line x1="50" y1="4" x2="50" y2="12" stroke="var(--line)" strokeWidth="1" />
      {stressLean !== 'none' && (
        <>
          <line
            x1={calmX}
            y1="8"
            x2={stressX}
            y2="8"
            stroke="var(--spark)"
            strokeWidth={reversal ? 2.2 : 1.5}
          />
          <polygon
            points={
              stressLean === 'B'
                ? `${stressX},8 ${stressX - 3},5.5 ${stressX - 3},10.5`
                : `${stressX},8 ${stressX + 3},5.5 ${stressX + 3},10.5`
            }
            fill="var(--spark)"
          />
        </>
      )}
      <circle cx={calmX} cy="8" r="2.6" fill="var(--surface)" stroke="var(--accent)" strokeWidth="1.6" />
    </svg>
  )
}

export function StressArrows({ model }: { model: ResultModel }) {
  const stressByDim = new Map(model.stress.perDimension.map((s) => [s.dimension, s]))
  const leanByDim = new Map(model.dimensions.map((d) => [d.dimension, d.lean]))
  const reading = STRESS_READING_COPY[model.stress.reading]

  return (
    <section aria-labelledby="resilience-h" className="rounded-2xl border border-line bg-panel p-5">
      <p className="mb-1 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-faint">
        Odolnosť
      </p>
      <h2 id="resilience-h" className="font-display text-lg font-extrabold tracking-tightish">
        Kam sa hýbeš pod tlakom
      </h2>

      <div className="mt-5 space-y-4">
        {DIMENSIONS.map((meta) => {
          const s = stressByDim.get(meta.id)
          const copy = DIMENSION_COPY[meta.id]
          const leanN = leanByDim.get(meta.id) ?? 0
          if (!s) return null
          return (
            <div key={meta.id}>
              <div className="mb-1 flex items-baseline justify-between gap-3">
                <span className="text-[0.9rem]">{meta.name}</span>
                {s.reversal ? (
                  <span className="font-mono text-[0.66rem] uppercase tracking-wider text-spark-deep">
                    obrat
                  </span>
                ) : null}
              </div>
              <div className="flex items-center gap-2 font-mono text-[0.68rem] text-faint sm:gap-3 sm:text-[0.7rem]">
                <span className="w-[4.5rem] shrink-0 text-right leading-tight sm:w-24">
                  {copy.poleA}
                </span>
                <Track leanN={leanN} stressLean={s.lean} reversal={s.reversal} />
                <span className="w-[4.5rem] shrink-0 leading-tight sm:w-24">{copy.poleB}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-5 border-l-2 border-spark pl-4">
        <p className="font-display text-base font-bold">{reading.title}</p>
        <p className="mt-1 text-[0.9rem] leading-relaxed text-muted">{reading.body}</p>
      </div>
    </section>
  )
}
