// Aggregates raw answers into the result model. Pure: no React, no I/O.
// Turns one questionnaire run into per-dimension pole scores, functionality,
// lean, regime, the fog verdict, the stress reading, tensions and the second
// pass — everything the result screen needs, in one object.
import type {
  Dimension,
  DimensionStress,
  FrequencyValue,
  RecoveryValue,
  StressLean,
} from './types'
import {
  CORE_ITEMS,
  CONSISTENCY_PAIRS,
  DIMENSIONS,
  overclaimingKeyed,
  FOG_CONFIG,
} from './content'
import {
  poleScore,
  functionality,
  lean,
  dimIndex,
  regime,
  dimensionStress,
  stressMagnitude,
  stressReading,
  fogScore,
  type Regime,
  type FogResult,
  type StressMagnitude,
  type StressReading,
} from './scoring'
import type { Answers } from './session'
import type { SessionResult } from './persistence'
import { ITEMS_VERSION } from './content'

const DIMS: Dimension[] = ['PLU', 'EXE', 'OBC', 'MED', 'PRA']

export type ResultInput = {
  answers: Answers
  startedAt: number | null
  completedAt: number | null
}

export type ItemAnswer = { id: string; text: string; value: number; dimension: Dimension }

export type DimensionResult = {
  dimension: Dimension
  a: number // pole A score, 0-10
  b: number // pole B score, 0-10
  f: number // functionality, 0-10
  lean: number // N = A - B
  regime: Regime
  topA: ItemAnswer | null // strongest pole-A item (for tensions / detail)
  topB: ItemAnswer | null
}

export type Tension = { dimension: Dimension; a: ItemAnswer; b: ItemAnswer }

export type ResultModel = {
  dimensions: DimensionResult[]
  narrowest: Dimension // dimension with the lowest functionality
  dim: number // overall index, shown last and small
  fog: FogResult
  stress: {
    perDimension: DimensionStress[]
    magnitude: StressMagnitude
    recovery: RecoveryValue
    reading: StressReading
  }
  tensions: Tension[]
  secondPass: ItemAnswer[] // 3-4 highest-value own answers across dimensions
}

function num(answers: Answers, id: string): number {
  const v = answers[id]
  return typeof v === 'number' ? v : 0
}

function coreItemsFor(dim: Dimension, pole: 'A' | 'B') {
  return CORE_ITEMS.filter((i) => i.dimension === dim && i.pole === pole)
}

function strongestItem(
  answers: Answers,
  dim: Dimension,
  pole: 'A' | 'B',
): ItemAnswer | null {
  let best: ItemAnswer | null = null
  for (const item of coreItemsFor(dim, pole)) {
    const value = num(answers, item.id)
    if (!best || value > best.value) {
      best = { id: item.id, text: item.text, value, dimension: dim }
    }
  }
  return best
}

export function computeResult(input: ResultInput): ResultModel {
  const { answers } = input

  const dimensions: DimensionResult[] = DIMS.map((dim) => {
    const a = poleScore(coreItemsFor(dim, 'A').map((i) => num(answers, i.id) as FrequencyValue))
    const b = poleScore(coreItemsFor(dim, 'B').map((i) => num(answers, i.id) as FrequencyValue))
    return {
      dimension: dim,
      a,
      b,
      f: functionality(a, b),
      lean: lean(a, b),
      regime: regime(a, b),
      topA: strongestItem(answers, dim, 'A'),
      topB: strongestItem(answers, dim, 'B'),
    }
  })

  // Narrowest institution = lowest functionality (first on tie).
  const narrowest = dimensions.reduce((min, d) => (d.f < min.f ? d : min)).dimension

  // Stress: per-dimension lean + reversal, then profile magnitude and reading.
  const leans: StressLean[] = DIMS.map((dim) => {
    const v = answers[`${dim}-S`]
    return v === 'A' || v === 'B' ? v : 'none'
  })
  const perDimension = DIMS.map((dim, i) => {
    const dr = dimensions[i]!
    return dimensionStress(dim, dr.lean, leans[i]!)
  })
  const magnitude = stressMagnitude(leans)
  const recVal = answers['REC']
  const recovery: RecoveryValue =
    recVal === 'immediately' || recVal === 'days' || recVal === 'weeks' || recVal === 'never'
      ? recVal
      : 'days'
  const reading = stressReading(magnitude, recovery)

  // Fog.
  const coreSum = CORE_ITEMS.reduce((acc, i) => acc + num(answers, i.id), 0)
  const elapsedMs =
    input.startedAt !== null && input.completedAt !== null
      ? Math.max(0, input.completedAt - input.startedAt)
      : 0
  const selectedOverclaimIds = Array.isArray(answers['H1']) ? (answers['H1'] as string[]) : []
  const consistency = CONSISTENCY_PAIRS.map((p) => ({
    claimAffirmed: answers[p.claimItemId] === true,
    counterCount: Math.min(3, Math.max(0, num(answers, p.counterItemId))) as FrequencyValue,
    triggerAtCount: p.triggerAtCount,
  }))
  const fog = fogScore(
    { selectedOverclaimIds, consistency, coreSum, elapsedMs },
    overclaimingKeyed,
    FOG_CONFIG,
  )

  // Tensions: an unstable dimension (both poles active) surfaces its two
  // strongest opposing own-answers side by side.
  const tensions: Tension[] = dimensions.flatMap((d) =>
    d.regime === 'unstable' && d.topA && d.topB && d.topA.value > 0 && d.topB.value > 0
      ? [{ dimension: d.dimension, a: d.topA, b: d.topB }]
      : [],
  )

  // Second pass: highest-value own answers across all dimensions.
  const secondPass: ItemAnswer[] = CORE_ITEMS.map((i) => ({
    id: i.id,
    text: i.text,
    value: num(answers, i.id),
    dimension: i.dimension,
  }))
    .filter((x) => x.value > 0)
    .sort((x, y) => y.value - x.value)
    .slice(0, 4)

  const dim = dimIndex(dimensions.map((d) => d.f))

  return { dimensions, narrowest, dim, fog, stress: { perDimension, magnitude, recovery, reading }, tensions, secondPass }
}

// Build the single serialisable SessionResult — the only object through which
// data would ever be sent. Kept here so the persistence funnel gets a real shape.
export function buildSessionResult(input: ResultInput, model: ResultModel): SessionResult {
  const dimensions = {} as SessionResult['scores']['dimensions']
  for (const d of model.dimensions) {
    dimensions[d.dimension] = { a: d.a, b: d.b, f: d.f, lean: d.lean, regime: d.regime }
  }
  const startedAt = input.startedAt ?? 0
  const completedAt = input.completedAt ?? startedAt
  return {
    itemsVersion: ITEMS_VERSION,
    startedAt,
    completedAt,
    durationMs: Math.max(0, completedAt - startedAt),
    answers: input.answers,
    scores: {
      dimensions,
      dim: model.dim,
      fog: model.fog,
      stress: {
        perDimension: model.stress.perDimension,
        magnitude: model.stress.magnitude,
        recovery: model.stress.recovery,
        reading: model.stress.reading,
      },
    },
  }
}

// Re-export for consumers.
export type { FogResult, StressReading, StressMagnitude }
export { DIMENSIONS }
