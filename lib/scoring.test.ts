import { describe, it, expect } from 'vitest'
import type { FrequencyValue } from './types'
import {
  poleScore,
  functionality,
  lean,
  dimIndex,
  regime,
  stressMagnitude,
  isReversal,
  dimensionStress,
  stressReading,
  fogScore,
} from './scoring'
import { FOG_CONFIG, overclaimingKeyed } from './content'

const f = (...v: number[]) => v as FrequencyValue[]

describe('poleScore', () => {
  it('sum 0 -> 0', () => {
    expect(poleScore(f(0, 0, 0))).toBe(0)
  })
  it('sum 9 -> exactly 10.0 (verifies ×10/9 conversion)', () => {
    expect(poleScore(f(3, 3, 3))).toBeCloseTo(10.0, 10)
  })
})

describe('functionality F = 10 - sqrt((A²+B²)/2)', () => {
  it('A=0, B=0 -> F=10', () => {
    expect(functionality(0, 0)).toBeCloseTo(10, 10)
  })
  it('A=10, B=0 -> F≈2.93', () => {
    expect(functionality(10, 0)).toBeCloseTo(2.93, 2)
  })
  it('A=B=7 -> F≈3.0', () => {
    expect(functionality(7, 7)).toBeCloseTo(3.0, 10)
  })
})

describe('lean N = A - B', () => {
  it('positive means pole A dominates', () => {
    expect(lean(8, 2)).toBe(6)
    expect(lean(2, 8)).toBe(-6)
  })
})

describe('dimIndex DIM = 0.6·mean(F) + 0.4·min(F)', () => {
  it('four eights and a two -> ≈4.9 (weakest institution drags it down)', () => {
    // spec target ~4.9; plain mean would be 6.8
    expect(dimIndex([8, 8, 8, 8, 2])).toBeCloseTo(4.88, 2)
  })
  it('all equal -> equals that value', () => {
    expect(dimIndex([5, 5, 5, 5, 5])).toBeCloseTo(5, 10)
  })
})

describe('regime (threshold 3)', () => {
  it('both low -> functional', () => expect(regime(2, 2)).toBe('functional'))
  it('A low, B high -> weak-state', () => expect(regime(2, 5)).toBe('weak-state'))
  it('A high, B low -> authoritarian', () => expect(regime(5, 2)).toBe('authoritarian'))
  it('both high -> unstable', () => expect(regime(5, 5)).toBe('unstable'))
})

describe('stressMagnitude (profile-level, threshold 3)', () => {
  it('0-2 shifts -> small', () => {
    expect(stressMagnitude(['none', 'none', 'none', 'none', 'none'])).toBe('small')
    expect(stressMagnitude(['A', 'B', 'none', 'none', 'none'])).toBe('small')
  })
  it('3+ shifts -> large', () => {
    expect(stressMagnitude(['A', 'B', 'A', 'none', 'none'])).toBe('large')
    expect(stressMagnitude(['A', 'B', 'A', 'B', 'A'])).toBe('large')
  })
})

describe('isReversal (stress points opposite the calm lean)', () => {
  it('calm A (N>0), stress -> B is a reversal', () => {
    expect(isReversal(6, 'B')).toBe(true)
  })
  it('calm B (N<0), stress -> A is a reversal', () => {
    expect(isReversal(-6, 'A')).toBe(true)
  })
  it('stress in the same direction is not a reversal', () => {
    expect(isReversal(6, 'A')).toBe(false)
    expect(isReversal(-6, 'B')).toBe(false)
  })
  it('no shift or no calm lean -> no reversal', () => {
    expect(isReversal(6, 'none')).toBe(false)
    expect(isReversal(0, 'A')).toBe(false)
  })
  it('dimensionStress bundles lean + reversal', () => {
    expect(dimensionStress('PLU', 6, 'B')).toEqual({
      dimension: 'PLU',
      lean: 'B',
      reversal: true,
    })
  })
})

describe('stressReading', () => {
  it('small shift is always stable', () => {
    expect(stressReading('small', 'never')).toBe('stable')
  })
  it('large shift with quick recovery -> emergency', () => {
    expect(stressReading('large', 'immediately')).toBe('emergency')
    expect(stressReading('large', 'days')).toBe('emergency')
  })
  it('large shift with slow/absent recovery -> permanent-exception', () => {
    expect(stressReading('large', 'weeks')).toBe('permanent-exception')
    expect(stressReading('large', 'never')).toBe('permanent-exception')
  })
})

describe('fogScore', () => {
  const clean = {
    selectedOverclaimIds: ['oc-01', 'oc-02'], // real terms, no points
    consistency: [
      { claimAffirmed: false, counterCount: 3 as FrequencyValue, triggerAtCount: 2 },
      { claimAffirmed: false, counterCount: 3 as FrequencyValue, triggerAtCount: 1 },
    ],
    coreSum: 45,
    elapsedMs: 10 * 60 * 1000,
  }

  it('clean run -> 0 points, clear band', () => {
    const r = fogScore(clean, overclaimingKeyed, FOG_CONFIG)
    expect(r.points).toBe(0)
    expect(r.band).toBe('clear')
  })

  it('keyed overclaim terms each add a point', () => {
    const r = fogScore(
      { ...clean, selectedOverclaimIds: ['oc-09', 'oc-11', 'oc-01'] },
      overclaimingKeyed,
      FOG_CONFIG,
    )
    expect(r.breakdown.overclaiming).toBe(2)
  })

  it('consistency: affirmed claim + count at trigger adds a point', () => {
    const r = fogScore(
      {
        ...clean,
        consistency: [
          { claimAffirmed: true, counterCount: 2, triggerAtCount: 2 }, // point
          { claimAffirmed: true, counterCount: 0, triggerAtCount: 1 }, // no point
        ],
      },
      overclaimingKeyed,
      FOG_CONFIG,
    )
    expect(r.breakdown.consistency).toBe(1)
  })

  it('extremity: coreSum ≤4 -> 2, ≤8 -> 1', () => {
    expect(fogScore({ ...clean, coreSum: 4 }, overclaimingKeyed, FOG_CONFIG).breakdown.extremity).toBe(2)
    expect(fogScore({ ...clean, coreSum: 8 }, overclaimingKeyed, FOG_CONFIG).breakdown.extremity).toBe(1)
    expect(fogScore({ ...clean, coreSum: 9 }, overclaimingKeyed, FOG_CONFIG).breakdown.extremity).toBe(0)
  })

  it('time: under 4 minutes -> 2 points', () => {
    const r = fogScore({ ...clean, elapsedMs: 3 * 60 * 1000 }, overclaimingKeyed, FOG_CONFIG)
    expect(r.breakdown.time).toBe(2)
  })

  it('4+ points -> dense band (score hidden downstream)', () => {
    const r = fogScore(
      {
        selectedOverclaimIds: ['oc-09', 'oc-10'],
        consistency: [{ claimAffirmed: true, counterCount: 2, triggerAtCount: 2 }],
        coreSum: 45,
        elapsedMs: 3 * 60 * 1000,
      },
      overclaimingKeyed,
      FOG_CONFIG,
    )
    expect(r.points).toBeGreaterThanOrEqual(4)
    expect(r.band).toBe('dense')
  })
})
