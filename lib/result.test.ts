import { describe, it, expect } from 'vitest'
import { computeResult, buildSessionResult } from './result'
import { CORE_ITEMS } from './content'
import type { Answers } from './session'

// All core items at 0, then override selected ids.
function coreAnswers(overrides: Record<string, number> = {}): Answers {
  const a: Answers = {}
  for (const item of CORE_ITEMS) a[item.id] = overrides[item.id] ?? 0
  return a
}

const TEN_MIN = 10 * 60 * 1000

describe('computeResult', () => {
  it('scores an A-dominant dimension as authoritarian and flags it narrowest', () => {
    const answers = coreAnswers({ 'OBC-A1': 3, 'OBC-A2': 3, 'OBC-A3': 3 })
    const r = computeResult({ answers, startedAt: 0, completedAt: TEN_MIN })

    const obc = r.dimensions.find((d) => d.dimension === 'OBC')!
    expect(obc.a).toBeCloseTo(10, 6)
    expect(obc.b).toBe(0)
    expect(obc.lean).toBeCloseTo(10, 6)
    expect(obc.regime).toBe('authoritarian')
    expect(r.narrowest).toBe('OBC')
  })

  it('a clean, unhurried run reads as clear fog and stable stress', () => {
    const answers = coreAnswers({ 'OBC-A1': 3, 'OBC-A2': 3, 'OBC-A3': 3 })
    const r = computeResult({ answers, startedAt: 0, completedAt: TEN_MIN })
    expect(r.fog.points).toBe(0)
    expect(r.fog.band).toBe('clear')
    expect(r.stress.magnitude).toBe('small')
    expect(r.stress.reading).toBe('stable')
  })

  it('surfaces a tension when a dimension is unstable (both poles active)', () => {
    const answers = coreAnswers({
      'PLU-A1': 3,
      'PLU-A2': 3,
      'PLU-A3': 3,
      'PLU-B1': 3,
      'PLU-B2': 3,
      'PLU-B3': 3,
    })
    const r = computeResult({ answers, startedAt: 0, completedAt: TEN_MIN })
    const plu = r.dimensions.find((d) => d.dimension === 'PLU')!
    expect(plu.regime).toBe('unstable')
    expect(r.tensions.some((t) => t.dimension === 'PLU')).toBe(true)
  })

  it('picks the highest-value own answers for the second pass', () => {
    const answers = coreAnswers({ 'MED-A1': 3, 'PRA-B2': 2, 'EXE-B1': 1 })
    const r = computeResult({ answers, startedAt: 0, completedAt: TEN_MIN })
    expect(r.secondPass[0]?.id).toBe('MED-A1')
    expect(r.secondPass.every((x) => x.value > 0)).toBe(true)
    expect(r.secondPass.length).toBeLessThanOrEqual(4)
  })

  it('fast completion plus keyed overclaim terms tips into dense fog', () => {
    const answers: Answers = { ...coreAnswers({ 'PLU-A1': 3 }), H1: ['oc-09', 'oc-10'] }
    const r = computeResult({ answers, startedAt: 0, completedAt: 2 * 60 * 1000 })
    expect(r.fog.points).toBeGreaterThanOrEqual(4)
    expect(r.fog.band).toBe('dense')
  })

  it('buildSessionResult produces a serialisable funnel object', () => {
    const answers = coreAnswers({ 'OBC-A1': 3 })
    const model = computeResult({ answers, startedAt: 1000, completedAt: 1000 + TEN_MIN })
    const sr = buildSessionResult({ answers, startedAt: 1000, completedAt: 1000 + TEN_MIN }, model)
    expect(sr.durationMs).toBe(TEN_MIN)
    expect(sr.scores.dimensions.OBC.regime).toBeDefined()
    expect(() => JSON.stringify(sr)).not.toThrow()
  })
})
