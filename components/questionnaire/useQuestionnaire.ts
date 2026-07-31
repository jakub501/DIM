'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { buildSequence, newSeed, type Step } from '@/lib/sequence'
import {
  createSession,
  loadSession,
  saveSession,
  clearSession,
  type AnswerValue,
  type SessionState,
} from '@/lib/session'

export type Phase = 'loading' | 'intro' | 'question' | 'complete'

// Steps whose answer is optional (may be left blank and still advance).
function isOptional(step: Step): boolean {
  return step.kind === 'open' || step.kind === 'overclaim'
}

function hasAnswer(answers: SessionState['answers'], step: Step): boolean {
  return Object.prototype.hasOwnProperty.call(answers, step.id)
}

export function useQuestionnaire() {
  // null = not yet hydrated (avoids SSR/client mismatch).
  const [state, setState] = useState<SessionState | null>(null)

  useEffect(() => {
    setState(loadSession() ?? createSession(newSeed()))
  }, [])

  useEffect(() => {
    if (state) saveSession(state)
  }, [state])

  const steps = useMemo<Step[]>(
    () => (state ? buildSequence(state.seed) : []),
    [state?.seed],
  )

  const phase: Phase = useMemo(() => {
    if (!state) return 'loading'
    if (state.startedAt === null) return 'intro'
    if (state.currentIndex >= steps.length) return 'complete'
    return 'question'
  }, [state, steps.length])

  const step: Step | null =
    state && phase === 'question' ? (steps[state.currentIndex] ?? null) : null

  const start = useCallback(() => {
    setState((s) => (s && s.startedAt === null ? { ...s, startedAt: Date.now() } : s))
  }, [])

  const setAnswer = useCallback((id: string, value: AnswerValue) => {
    setState((s) => (s ? { ...s, answers: { ...s.answers, [id]: value } } : s))
  }, [])

  const next = useCallback(() => {
    setState((s) => {
      if (!s) return s
      const nextIndex = s.currentIndex + 1
      // Stamp completion the instant the last step is finished, so a refresh on
      // the end screen doesn't inflate the elapsed time used by the fog check.
      const reachedEnd = nextIndex >= buildSequence(s.seed).length
      return {
        ...s,
        currentIndex: nextIndex,
        completedAt: reachedEnd && s.completedAt === null ? Date.now() : s.completedAt,
      }
    })
  }, [])

  const back = useCallback(() => {
    setState((s) => {
      if (!s) return s
      if (s.currentIndex > 0) return { ...s, currentIndex: s.currentIndex - 1 }
      // First question: return to intro without discarding answers or progress.
      if (s.startedAt !== null) return { ...s, startedAt: null }
      return s
    })
  }, [])

  const reset = useCallback(() => {
    clearSession()
    setState(createSession(newSeed()))
  }, [])

  const currentAnswer: AnswerValue | undefined =
    state && step ? state.answers[step.id] : undefined

  const canProceed = !!step && (isOptional(step) || hasAnswer(state!.answers, step))
  const canGoBack =
    !!state && state.startedAt !== null && state.currentIndex < steps.length

  return {
    phase,
    step,
    index: state?.currentIndex ?? 0,
    total: steps.length,
    answers: state?.answers ?? {},
    currentAnswer,
    canProceed,
    canGoBack,
    seed: state?.seed ?? 0,
    startedAt: state?.startedAt ?? null,
    completedAt: state?.completedAt ?? null,
    start,
    setAnswer,
    next,
    back,
    reset,
  }
}
