import { describe, it, expect } from 'vitest'
import { buildSequence, mulberry32 } from './sequence'
import {
  CORE_ITEMS,
  FILTER_ITEMS,
  CONSISTENCY_ITEMS,
  STRESS_ITEMS,
  OPEN_QUESTIONS,
  PLACEMENT_CONSTRAINTS,
} from './content'

const STATEMENT_COUNT = CORE_ITEMS.length + FILTER_ITEMS.length + CONSISTENCY_ITEMS.length
const TOTAL = STATEMENT_COUNT + STRESS_ITEMS.length + 1 /*REC*/ + 1 /*H1*/ + OPEN_QUESTIONS.length

const SEEDS = Array.from({ length: 60 }, (_, i) => i * 7919 + 1)

describe('mulberry32', () => {
  it('is deterministic for a seed', () => {
    const a = mulberry32(123)
    const b = mulberry32(123)
    expect([a(), a(), a()]).toEqual([b(), b(), b()])
  })
})

describe('buildSequence', () => {
  it('is deterministic for a seed', () => {
    expect(buildSequence(42)).toEqual(buildSequence(42))
  })

  it('has the expected length and every item exactly once', () => {
    const seq = buildSequence(42)
    expect(seq).toHaveLength(TOTAL)
    const ids = seq.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length) // no duplicates
    for (const i of CORE_ITEMS) expect(ids).toContain(i.id)
    for (const i of FILTER_ITEMS) expect(ids).toContain(i.id)
    for (const i of CONSISTENCY_ITEMS) expect(ids).toContain(i.id)
    for (const i of STRESS_ITEMS) expect(ids).toContain(i.id)
    for (const i of OPEN_QUESTIONS) expect(ids).toContain(i.id)
    expect(ids).toContain('REC')
    expect(ids).toContain('H1')
  })

  it('never places two same-dimension statements adjacently (across seeds)', () => {
    for (const seed of SEEDS) {
      const seq = buildSequence(seed)
      for (let i = 1; i < seq.length; i++) {
        const a = seq[i - 1]
        const b = seq[i]
        if (a.kind === 'statement' && b.kind === 'statement' && a.dimension && b.dimension) {
          expect(a.dimension).not.toBe(b.dimension)
        }
      }
    }
  })

  it('honours fixed placements: first-third vs last-third (across seeds)', () => {
    const firstIds = PLACEMENT_CONSTRAINTS.filter((c) => c.placement === 'first-third').map(
      (c) => c.itemId,
    )
    const lastIds = PLACEMENT_CONSTRAINTS.filter((c) => c.placement === 'last-third').map(
      (c) => c.itemId,
    )
    for (const seed of SEEDS) {
      const seq = buildSequence(seed)
      const statementIdx = seq.filter((s) => s.kind === 'statement').map((s) => s.id)
      const n = statementIdx.length
      const firstEnd = Math.floor(n / 3)
      const lastStart = Math.ceil((2 * n) / 3)
      for (const id of firstIds) {
        expect(statementIdx.indexOf(id)).toBeLessThan(firstEnd)
      }
      for (const id of lastIds) {
        expect(statementIdx.indexOf(id)).toBeGreaterThanOrEqual(lastStart)
      }
    }
  })

  it('keeps the trailing sections in order (stress → recovery → overclaim → open)', () => {
    const seq = buildSequence(42)
    const kinds = seq.map((s) => s.kind)
    const firstStress = kinds.indexOf('stress')
    const rec = kinds.indexOf('recovery')
    const h1 = kinds.indexOf('overclaim')
    const firstOpen = kinds.indexOf('open')
    expect(firstStress).toBeGreaterThan(kinds.lastIndexOf('statement'))
    expect(rec).toBeGreaterThan(kinds.lastIndexOf('stress'))
    expect(h1).toBeGreaterThan(rec)
    expect(firstOpen).toBeGreaterThan(h1)
  })
})
