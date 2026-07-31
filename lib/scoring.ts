// Pure scoring for DIM. No React, no I/O. Formulas are exactly as specified.
import type {
  Dimension,
  DimensionStress,
  FrequencyValue,
  RecoveryValue,
  StressLean,
  FogConfig,
} from './types'
import { MAX_PER_ITEM } from './content/scale'
import { STRESS_CONFIG } from './content/stress-items'

// --- Pole and functionality --------------------------------------------------

// Normalise a pole's frequency answers to 0–10. For the canonical 3-item pole
// this is exactly sum × 10/9; generalised by pole length so a future 6/6 set
// still scores correctly.
export function poleScore(answers: readonly FrequencyValue[]): number {
  if (answers.length === 0) return 0
  const sum = answers.reduce<number>((acc, v) => acc + v, 0)
  return (sum / (answers.length * MAX_PER_ITEM)) * 10
}

// Functionality of a dimension: 10 minus the RMS of its two poles. 0–10.
export function functionality(a: number, b: number): number {
  return 10 - Math.sqrt((a * a + b * b) / 2)
}

// Lean of a dimension: which pole dominates. -10..+10 (positive = pole A).
export function lean(a: number, b: number): number {
  return a - b
}

// --- Overall index -----------------------------------------------------------

// DIM = 0.6 × mean(F) + 0.4 × min(F). Weighs the weakest institution so a
// single collapsed dimension drags the whole index down.
export function dimIndex(fValues: readonly number[]): number {
  if (fValues.length === 0) return 0
  const mean = fValues.reduce((acc, v) => acc + v, 0) / fValues.length
  const min = Math.min(...fValues)
  return 0.6 * mean + 0.4 * min
}

// --- Per-dimension regime ----------------------------------------------------

export type Regime = 'functional' | 'weak-state' | 'authoritarian' | 'unstable'

// Provisional threshold of 3 (no population norms yet). Interpret ipsatively.
export const REGIME_THRESHOLD = 3

export function regime(a: number, b: number, threshold = REGIME_THRESHOLD): Regime {
  const aHigh = a >= threshold
  const bHigh = b >= threshold
  if (!aHigh && !bHigh) return 'functional'
  if (!aHigh && bHigh) return 'weak-state'
  if (aHigh && !bHigh) return 'authoritarian'
  return 'unstable'
}

// --- Stress reading ----------------------------------------------------------

// Number of dimensions whose stress lean is not 'none'.
export function countStressShifts(leans: readonly StressLean[]): number {
  return leans.filter((l) => l !== 'none').length
}

export type StressMagnitude = 'small' | 'large'

// Magnitude is a whole-profile property: how many dimensions shift under stress.
// Threshold comes from STRESS_CONFIG, not a literal here.
export function stressMagnitude(
  leans: readonly StressLean[],
  config: { largeShiftMinCount: number } = STRESS_CONFIG,
): StressMagnitude {
  return countStressShifts(leans) >= config.largeShiftMinCount ? 'large' : 'small'
}

// A dimension reverses when its stress direction points to the opposite pole
// from the calm lean. No reversal when there is no shift or no calm lean.
export function isReversal(leanValue: number, stressLean: StressLean): boolean {
  if (stressLean === 'none' || leanValue === 0) return false
  return (leanValue > 0 && stressLean === 'B') || (leanValue < 0 && stressLean === 'A')
}

// Build the derived per-dimension stress record (lean + reversal).
export function dimensionStress(
  dimension: Dimension,
  leanValue: number,
  stressLean: StressLean,
): DimensionStress {
  return { dimension, lean: stressLean, reversal: isReversal(leanValue, stressLean) }
}

export type StressReading = 'stable' | 'emergency' | 'permanent-exception'

// Combines shift magnitude with the recovery answer.
//   small shift, any REC                 -> stable
//   large shift, immediately / days      -> emergency
//   large shift, weeks / never           -> permanent-exception
// Note: the small/large cutoff itself is not specified numerically; callers
// pass an explicit magnitude so this stays a faithful lookup of the spec table.
export function stressReading(
  magnitude: StressMagnitude,
  rec: RecoveryValue,
): StressReading {
  if (magnitude === 'small') return 'stable'
  return rec === 'immediately' || rec === 'days' ? 'emergency' : 'permanent-exception'
}

// --- Fog index ---------------------------------------------------------------

export type FogBand = 'clear' | 'haze' | 'dense'

export type FogInput = {
  // H1: ids the user selected from the overclaiming checklist.
  selectedOverclaimIds: readonly string[]
  // H2: for each pair, whether the claim was affirmed, the counter's frequency
  // count, and that pair's trigger threshold.
  consistency: readonly {
    claimAffirmed: boolean
    counterCount: FrequencyValue
    triggerAtCount: number
  }[]
  // H3: sum of all 30 core items (0–90).
  coreSum: number
  // H4: elapsed time from start to submit, in ms.
  elapsedMs: number
}

export type FogResult = {
  points: number
  band: FogBand
  breakdown: { overclaiming: number; consistency: number; extremity: number; time: number }
}

export function fogScore(
  input: FogInput,
  keyed: ReadonlySet<string>,
  config: FogConfig,
): FogResult {
  // H1 — each selected keyed term is one point.
  const overclaiming = input.selectedOverclaimIds.filter((id) => keyed.has(id)).length

  // H2 — claim affirmed AND counter reached its trigger (impossible combo).
  const consistency = input.consistency.filter(
    (p) => p.claimAffirmed && p.counterCount >= p.triggerAtCount,
  ).length

  // H3 — extremity of profile.
  let extremity = 0
  if (input.coreSum <= config.extremity.twoPointsAtOrBelow) extremity = 2
  else if (input.coreSum <= config.extremity.onePointAtOrBelow) extremity = 1

  // H4 — implausibly fast completion.
  const time = input.elapsedMs < config.time.twoPointsBelowMs ? 2 : 0

  const points = overclaiming + consistency + extremity + time
  const band: FogBand =
    points <= config.bands.clearMax
      ? 'clear'
      : points <= config.bands.hazeMax
        ? 'haze'
        : 'dense'

  return { points, band, breakdown: { overclaiming, consistency, extremity, time } }
}
