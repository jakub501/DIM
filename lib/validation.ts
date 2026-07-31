// Content invariants. Run at startup (and in tests) so malformed data fails
// loudly instead of silently corrupting the lean N = A - B.
import type { CoreItem, Dimension } from './types'
import { CORE_ITEMS, CONSISTENCY_PAIRS, CONSISTENCY_ITEMS, FREQUENCY_SCALE } from './content'

const DIMENSIONS: Dimension[] = ['PLU', 'EXE', 'OBC', 'MED', 'PRA']

export class ContentValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ContentValidationError'
  }
}

// Pole symmetry: within EACH dimension, |A| === |B|. Not a hardcoded 3 — a
// future 6/6 set is equally valid. Symmetry is what makes N = A - B a lean and
// not a count of items.
export function validateSymmetry(items: readonly CoreItem[] = CORE_ITEMS): void {
  for (const dim of DIMENSIONS) {
    const a = items.filter((i) => i.dimension === dim && i.pole === 'A').length
    const b = items.filter((i) => i.dimension === dim && i.pole === 'B').length
    if (a === 0 || b === 0) {
      throw new ContentValidationError(
        `Dimension ${dim} is missing items (A=${a}, B=${b}); each pole needs at least one.`,
      )
    }
    if (a !== b) {
      throw new ContentValidationError(
        `Dimension ${dim} is asymmetric (A=${a}, B=${b}); N = A - B requires equal pole sizes.`,
      )
    }
  }
}

// Shared scale: all scored frequency items use the one frequency scale, and
// that scale is well-formed (values 0..3, ascending, unique).
export function validateScale(): void {
  const values = FREQUENCY_SCALE.map((o) => o.value)
  const expected = [0, 1, 2, 3]
  const ok =
    values.length === expected.length && values.every((v, i) => v === expected[i])
  if (!ok) {
    throw new ContentValidationError(
      `Frequency scale must be exactly [0,1,2,3], got [${values.join(',')}].`,
    )
  }
}

// Every consistency pair must reference items that actually exist (a claim
// consistency item and a counter that is either a consistency or a core item).
export function validateConsistencyRefs(): void {
  const consistencyIds = new Set(CONSISTENCY_ITEMS.map((i) => i.id))
  const coreIds = new Set(CORE_ITEMS.map((i) => i.id))
  for (const pair of CONSISTENCY_PAIRS) {
    if (!consistencyIds.has(pair.claimItemId)) {
      throw new ContentValidationError(
        `Consistency pair ${pair.id} claim '${pair.claimItemId}' not found.`,
      )
    }
    if (!consistencyIds.has(pair.counterItemId) && !coreIds.has(pair.counterItemId)) {
      throw new ContentValidationError(
        `Consistency pair ${pair.id} counter '${pair.counterItemId}' not found.`,
      )
    }
  }
}

// Run all content invariants. Call once at startup.
export function validateContent(): void {
  validateSymmetry()
  validateScale()
  validateConsistencyRefs()
}
