import { describe, it, expect } from 'vitest'
import type { CoreItem } from './types'
import {
  validateContent,
  validateSymmetry,
  ContentValidationError,
} from './validation'
import { CORE_ITEMS } from './content'

describe('content validation', () => {
  it('shipped content passes every invariant', () => {
    expect(() => validateContent()).not.toThrow()
  })

  it('every dimension has equal pole sizes', () => {
    expect(() => validateSymmetry()).not.toThrow()
  })

  it('rejects an asymmetric dimension', () => {
    // drop one PLU-B item -> A(3) !== B(2)
    const broken = CORE_ITEMS.filter((i) => i.id !== 'PLU-B3') as CoreItem[]
    expect(() => validateSymmetry(broken)).toThrow(ContentValidationError)
  })

  it('accepts a valid larger symmetric pole (future 6/6)', () => {
    const extra: CoreItem[] = [
      ...CORE_ITEMS,
      ...(['A', 'B'] as const).flatMap((pole) =>
        [1, 2, 3].map((n) => ({
          kind: 'core' as const,
          id: `PLU-${pole}${n + 3}`,
          dimension: 'PLU' as const,
          pole,
          scored: true as const,
          text: `synthetic ${pole}${n + 3}`,
        })),
      ),
    ]
    expect(() => validateSymmetry(extra)).not.toThrow()
  })
})
