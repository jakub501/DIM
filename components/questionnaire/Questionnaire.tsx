'use client'

import { useCallback } from 'react'
import { useQuestionnaire } from './useQuestionnaire'
import { Intro } from './Intro'
import { StepView } from './StepView'
import { Result } from '@/components/result/Result'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/Button'

export function Questionnaire() {
  const q = useQuestionnaire()

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Enter advances when allowed, but not while typing in a textarea.
      if (e.key === 'Enter' && !e.shiftKey && q.canProceed) {
        const target = e.target as HTMLElement
        if (target.tagName !== 'TEXTAREA') {
          e.preventDefault()
          q.next()
        }
      }
    },
    [q],
  )

  if (q.phase === 'loading') {
    // First paint before hydration reads sessionStorage. Show the wordmark
    // rather than a blank page (server and client agree on this branch).
    return (
      <div className="flex min-h-dvh items-center justify-center px-5">
        <p className="font-display text-2xl font-extrabold tracking-tighter2 text-accent/70">DIM</p>
      </div>
    )
  }

  if (q.phase === 'intro') {
    return <Intro onStart={q.start} />
  }

  if (q.phase === 'complete') {
    return (
      <Result
        answers={q.answers}
        startedAt={q.startedAt}
        completedAt={q.completedAt}
        onRestart={q.reset}
      />
    )
  }

  // question phase
  return (
    <div className="flex min-h-dvh flex-col" onKeyDown={onKeyDown}>
      <header className="mx-auto w-full max-w-prose px-5 pt-6">
        <ProgressBar current={q.index + 1} total={q.total} />
      </header>

      {/* Polite announcement of position for screen readers. */}
      <div aria-live="polite" className="sr-only">
        Otázka {q.index + 1} z {q.total}
      </div>

      <main className="mx-auto flex w-full max-w-prose flex-1 flex-col justify-center px-5 py-10">
        {q.step ? (
          <StepView
            key={q.step.id}
            step={q.step}
            value={q.currentAnswer}
            onAnswer={(v) => q.setAnswer(q.step!.id, v)}
          />
        ) : null}
      </main>

      <footer className="sticky bottom-0 border-t border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-prose items-center justify-between px-5 py-4">
          <Button variant="ghost" onClick={q.back} disabled={!q.canGoBack}>
            <span aria-hidden>←</span> Späť
          </Button>
          <Button onClick={q.next} disabled={!q.canProceed}>
            {q.index + 1 === q.total ? 'Dokončiť' : 'Ďalej'} <span aria-hidden>→</span>
          </Button>
        </div>
      </footer>
    </div>
  )
}
