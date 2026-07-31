import type { Placement } from '../types'
import { ITEMS_VERSION } from './version'
import { DIMENSIONS } from './dimensions'
import { CORE_ITEMS } from './core-items'
import { STRESS_ITEMS, STRESS_CONFIG } from './stress-items'
import { RECOVERY_ITEM } from './recovery-item'
import { OPEN_QUESTIONS } from './open-questions'
import { FILTER_ITEMS } from './filter-items'
import {
  OVERCLAIM_TERMS,
  OVERCLAIM_PROMPT,
  overclaimingKeyed,
  CONSISTENCY_ITEMS,
  CONSISTENCY_PAIRS,
  FOG_CONFIG,
} from './fog'

export * from './scale'
export * from './result-copy'
export {
  ITEMS_VERSION,
  DIMENSIONS,
  CORE_ITEMS,
  STRESS_ITEMS,
  STRESS_CONFIG,
  RECOVERY_ITEM,
  OPEN_QUESTIONS,
  FILTER_ITEMS,
  OVERCLAIM_TERMS,
  OVERCLAIM_PROMPT,
  overclaimingKeyed,
  CONSISTENCY_ITEMS,
  CONSISTENCY_PAIRS,
  FOG_CONFIG,
}

// Fixed placements for core items that must sit in a specific third (the
// randomizer honours these as exceptions). Consistency items carry their own
// `placement`; this covers core items reused as consistency counters — here,
// EXE-B1 as the counter for pair 2.
export const PLACEMENT_OVERRIDES: readonly { itemId: string; placement: Placement }[] = [
  { itemId: 'EXE-B1', placement: 'first-third' },
] as const

// All placement constraints the randomizer needs, in one list.
export const PLACEMENT_CONSTRAINTS: readonly { itemId: string; placement: Placement }[] =
  [
    ...CONSISTENCY_ITEMS.map((i) => ({ itemId: i.id, placement: i.placement })),
    ...PLACEMENT_OVERRIDES,
  ]
