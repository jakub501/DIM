// Persistence boundary. Whether results are ever stored is an open decision;
// the app must not presume either way. Everything that could ever leave the
// client passes through this single interface. The default implementation is a
// no-op — adding a real backend later means swapping this one implementation,
// not touching the app.
import type { Dimension, DimensionStress, RecoveryValue } from './types'
import type { FogResult, Regime, StressMagnitude, StressReading } from './scoring'
import type { AnswerValue } from './session'

// The complete result of one questionnaire run: the only object through which
// data would ever be sent. Kept serialisable (no functions, no class instances).
export type SessionResult = {
  itemsVersion: string
  startedAt: number // epoch ms
  completedAt: number // epoch ms
  durationMs: number
  // Raw answers keyed by item id. Frequency items -> 0..3; yes/no -> boolean;
  // stress -> lean; recovery -> RecoveryValue; open questions -> string;
  // overclaiming checklist -> string[].
  answers: Record<string, AnswerValue>
  scores: {
    dimensions: Record<
      Dimension,
      { a: number; b: number; f: number; lean: number; regime: Regime }
    >
    dim: number
    fog: FogResult
    stress: {
      perDimension: DimensionStress[] // lean + derived reversal per dimension
      magnitude: StressMagnitude
      recovery: RecoveryValue
      reading: StressReading
    }
  }
}

export interface PersistenceAdapter {
  save(result: SessionResult): Promise<void>
}

// Default: does nothing. No endpoint, no analytics, no storage.
export const noopPersistence: PersistenceAdapter = {
  async save() {
    // intentionally empty
  },
}

// Single active adapter. Swap here (or via DI later) to enable persistence.
export const persistence: PersistenceAdapter = noopPersistence
