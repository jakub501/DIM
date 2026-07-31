'use client'

import { useEffect, useMemo } from 'react'
import { computeResult, buildSessionResult } from '@/lib/result'
import { persistence } from '@/lib/persistence'
import type { Answers } from '@/lib/session'
import {
  DIMENSION_COPY,
  OPEN_QUESTIONS,
  FOG_HAZE_NOTE,
  FOG_DENSE_TITLE,
  FOG_DENSE_BODY,
  RESULT_CAUTION,
} from '@/lib/content'
import { Button } from '@/components/ui/Button'
import { OverviewRadar } from './OverviewRadar'
import { DimensionBars } from './DimensionBars'
import { StressArrows } from './StressArrows'
import { Tensions } from './Tensions'
import { SecondPass } from './SecondPass'

function Kicker({ label, title }: { label: string; title: string }) {
  return (
    <div className="mb-4">
      <p className="mb-1 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-faint">
        {label}
      </p>
      <h2 className="font-display text-lg font-extrabold tracking-tightish">{title}</h2>
    </div>
  )
}

function Caution() {
  return (
    <div className="space-y-3 border-t border-line pt-6 text-[0.88rem] leading-relaxed text-muted">
      {RESULT_CAUTION.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  )
}

// The open questions with whatever the person wrote — the only thing shown when
// fog is dense, and never accusatory.
function OpenReflection({ answers }: { answers: Answers }) {
  return (
    <div className="space-y-6">
      {OPEN_QUESTIONS.map((q) => {
        const a = answers[q.id]
        const text = typeof a === 'string' ? a.trim() : ''
        return (
          <div key={q.id}>
            <p className="font-serif text-[1.05rem] italic leading-snug">{q.text}</p>
            {text ? (
              <p className="mt-2 border-l-2 border-line pl-4 text-[0.95rem] leading-relaxed text-muted">
                {text}
              </p>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

export function Result({
  answers,
  startedAt,
  completedAt,
  onRestart,
}: {
  answers: Answers
  startedAt: number | null
  completedAt: number | null
  onRestart: () => void
}) {
  const model = useMemo(
    () => computeResult({ answers, startedAt, completedAt }),
    [answers, startedAt, completedAt],
  )

  // Single funnel through which data would ever leave the client (noop default).
  useEffect(() => {
    void persistence.save(buildSessionResult({ answers, startedAt, completedAt }, model))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const dense = model.fog.band === 'dense'
  const haze = model.fog.band === 'haze'

  const narrow = model.dimensions.find((d) => d.dimension === model.narrowest)!
  const copy = DIMENSION_COPY[model.narrowest]
  const dominant = narrow.a === narrow.b ? null : narrow.a > narrow.b ? copy.poleA : copy.poleB

  return (
    <div className="step-enter mx-auto max-w-prose px-5 py-14 sm:py-16">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-accent">
        Tvoj profil
      </p>

      {dense ? (
        <div className="mt-10 space-y-10">
          <div>
            <h1 className="font-display text-2xl font-extrabold leading-tight tracking-tightish">
              {FOG_DENSE_TITLE}
            </h1>
            <p className="mt-4 text-[1rem] leading-relaxed text-muted">{FOG_DENSE_BODY}</p>
          </div>
          <OpenReflection answers={answers} />
          <Caution />
        </div>
      ) : (
        <div className="mt-6 space-y-12">
          {/* 1 — direction, not a number */}
          <div className="rounded-2xl border border-accent-line bg-gradient-to-b from-accent-wash to-surface p-5 shadow-[0_20px_40px_-18px_rgba(26,40,170,0.30)]">
            <p className="mb-2 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-accent">
              Smer, nie číslo
            </p>
            <p className="font-serif text-[1.18rem] italic leading-snug">
              Tvoje vnútorné usporiadanie je najužšie v tom, {copy.domain}
              {dominant ? (
                <>
                  {' '}— a tam sa nakláňaš k tomu, čo tu voláme{' '}
                  <span
                    className="font-semibold not-italic text-accent-strong"
                    style={{ boxShadow: 'inset 0 -0.5em 0 var(--spark-wash)' }}
                  >
                    „{dominant}“
                  </span>
                  .
                </>
              ) : (
                ' — a tam je zatiaľ v rovnováhe.'
              )}
            </p>
          </div>

          {haze ? (
            <p className="-mt-8 border-l-2 border-spark pl-4 text-[0.9rem] leading-relaxed text-muted">
              {FOG_HAZE_NOTE}
            </p>
          ) : null}

          {/* 2 — overview shape */}
          <section>
            <Kicker label="Prehľad" title="Tvar profilu" />
            <OverviewRadar dimensions={model.dimensions} narrowest={model.narrowest} />
          </section>

          {/* 3 — five institutions, two bars each */}
          <section>
            <Kicker label="Inštitúcie" title="Päť inštitúcií" />
            <DimensionBars dimensions={model.dimensions} narrowest={model.narrowest} />
          </section>

          {/* 4 — resilience */}
          <StressArrows model={model} />

          {/* 5 — tensions */}
          <Tensions tensions={model.tensions} />

          {/* 6 — second pass */}
          <SecondPass items={model.secondPass} />

          {/* 7 — overall index */}
          <div className="flex items-end justify-between gap-4 border-t border-line pt-6">
            <div className="grad-text tnum font-display text-[2.7rem] font-extrabold leading-none tracking-tighter2">
              {model.dim.toFixed(1).replace('.', ',')}
              <span
                className="align-baseline text-base font-semibold text-faint"
                style={{ WebkitTextFillColor: 'var(--faint)' }}
              >
                {' '}
                / 10
              </span>
            </div>
            <p className="text-right font-mono text-[0.66rem] leading-relaxed text-faint">
              celkový index
              <br />
              0,6 × priemer + 0,4 × min
              <br />
              ipsatívne, bez noriem
            </p>
          </div>

          <Caution />
        </div>
      )}

      <div className="mt-12">
        <Button variant="ghost" onClick={onRestart}>
          Začať odznova
        </Button>
      </div>
    </div>
  )
}
